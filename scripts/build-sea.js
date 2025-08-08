const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const mainScript = path.join(__dirname, '..', 'dist', 'cli', 'index.js');
const outputDir = path.join(__dirname, '..', 'dist-sea');
const seaConfigPath = path.join(__dirname, '..', 'sea-config.json');

function build(targetPlatform) {
    console.log(`\n--- Building for ${targetPlatform} ---`);

    const executableName = `ts2cpp-${targetPlatform}${targetPlatform.startsWith('win') ? '.exe' : ''}`;
    const executablePath = path.join(outputDir, executableName);

    // Determine path to node executable
    let nodePath;
    const localPlatform = `${process.platform}-${process.arch}`;
    // Use local node executable if we are on Termux and building for Termux,
    // or if the target platform is the local platform.
    if (targetPlatform === localPlatform || (targetPlatform === 'linux-arm64-termux' && localPlatform === 'linux-arm64')) {
        nodePath = process.execPath;
    } else {
        const nodeBinaryName = targetPlatform.startsWith('win') ? 'node.exe' : 'node';
        const platformNodePath = path.join(__dirname, '..', 'dist-bin', targetPlatform, nodeBinaryName);
        if (!fs.existsSync(platformNodePath)) {
            console.warn(`Node.js executable for ${targetPlatform} not found at ${platformNodePath}`);
            console.warn(`Skipping build for ${targetPlatform}.`);
            console.warn(`To build for other platforms locally, download the Node.js binary and place it at the path above.`);
            return;
        }
        nodePath = platformNodePath;
    }

    // Copy the node executable
    console.log('Copying node executable...');
    if (fs.existsSync(executablePath)) {
        fs.unlinkSync(executablePath);
    }
    fs.copyFileSync(nodePath, executablePath);
    fs.chmodSync(executablePath, '755');

    // Inject the blob into the copied executable
    console.log('Injecting blob into executable...');
    execSync(`npx postject ${executablePath} NODE_SEA_BLOB sea-prep.blob --sentinel-fuse NODE_SEA_FUSE_fce680ab2cc467b6e072b8b5df1996b2`, { stdio: 'inherit' });

    // On Linux, strip the binary to reduce size and fix potential execution issues.
    if (targetPlatform.startsWith('linux')) {
        console.log(`Stripping binary for ${targetPlatform}...`);
        try {
            execSync(`strip ${executablePath}`, { stdio: 'inherit' });
        } catch (error) {
            console.warn(`Could not strip executable. This is expected if 'strip' is not installed.`);
        }
    }

    // For linux-arm64-termux builds, patch the interpreter for Termux.
    if (targetPlatform === 'linux-arm64-termux') {
        try {
            console.log('Patching ARM64 binary for Termux...');
            const interpreter = '/data/data/com.termux/files/usr/lib/ld-linux-aarch64.so.1';
            execSync(`patchelf --set-interpreter ${interpreter} ${executablePath}`, { stdio: 'inherit' });
        } catch (error) {
            console.warn('Could not patch executable. This is expected if patchelf is not installed.');
        }
    }

    console.log(`\nSuccessfully created single executable at: ${executablePath}`);
}

// Main logic
(function main() {
    // 1. Create output directory if it doesn't exist
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }

    // 2. Create the SEA config file
    const seaConfig = {
        main: mainScript,
        output: 'sea-prep.blob',
    };
    fs.writeFileSync(seaConfigPath, JSON.stringify(seaConfig, null, 2));

    // 3. Generate the blob from the main script
    console.log('Generating SEA blob...');
    execSync(`node --experimental-sea-config ${seaConfigPath}`, { stdio: 'inherit' });
    
    // Determine which platforms to build for
    if (process.env.TARGET_PLATFORM) {
        // CI environment or single-platform build
        build(process.env.TARGET_PLATFORM);
    } else {
        // Local development `npm run package` - build for multiple platforms
        const localPlatform = `${process.platform}-${process.arch}`;
        const platformsToBuild = [
            localPlatform,
            'linux-x64',
            'linux-arm64-termux',
            'windows-x64',
        ];
        
        // When on Termux, the local build should be the termux-patched one.
        if (localPlatform === 'linux-arm64') {
            platformsToBuild[platformsToBuild.indexOf(localPlatform)] = 'linux-arm64-termux';
        }
        const uniquePlatforms = [...new Set(platformsToBuild)];

        for (const platform of uniquePlatforms) {
            build(platform);
        }
    }

    // Clean up temporary files
    console.log('\nCleaning up...');
    fs.unlinkSync(seaConfigPath);
    fs.unlinkSync('sea-prep.blob');
})();
