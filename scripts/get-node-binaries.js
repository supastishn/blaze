const https = require('https');
const fs = require('fs');
const path = require('path');
const { execSync, exec } = require('child_process');

function commandExists(command) {
    return new Promise((resolve) => {
        exec(`command -v ${command}`, (error) => {
            resolve(!error);
        });
    });
}

const NODE_VERSION = 'v22.5.1'; // A recent Node.js v22 release, matching the CI environment
const DIST_BIN_DIR = path.join(__dirname, '..', 'dist-bin');

const PLATFORMS = [
    { name: 'linux-x64', archiveType: 'tar.gz', extractCmd: 'tar', binaryPathInArchive: `node-${NODE_VERSION}-linux-x64/bin/node` },
    { name: 'windows-x64', archiveType: 'zip', extractCmd: 'unzip', binaryPathInArchive: `node-${NODE_VERSION}-windows-x64/node.exe` }
];

if (!fs.existsSync(DIST_BIN_DIR)) {
    fs.mkdirSync(DIST_BIN_DIR, { recursive: true });
}

function download(url, dest) {
    console.log(`Downloading ${url}...`);
    return new Promise((resolve, reject) => {
        const request = https.get(url, (response) => {
            // The 'https' module follows redirects automatically.
            if (response.statusCode !== 200) {
                reject(new Error(`Failed to download file: ${response.statusCode} ${response.statusMessage}`));
                return;
            }
            const file = fs.createWriteStream(dest);
            response.pipe(file);
            file.on('finish', () => file.close(resolve));
        });
        request.on('error', reject);
    });
}

async function main() {
    console.log("Checking for dependencies ('tar', 'unzip')...");
    if (!await commandExists('tar') || !await commandExists('unzip')) {
        console.error("Please install 'tar' and 'unzip' to run this script. On Debian/Ubuntu/Termux: apt install tar unzip");
        process.exit(1);
    }
    console.log("Dependencies found.");

    for (const platform of PLATFORMS) {
        const platformDir = path.join(DIST_BIN_DIR, platform.name);
        const nodeBinaryName = platform.name.startsWith('win') ? 'node.exe' : 'node';
        const finalNodePath = path.join(platformDir, nodeBinaryName);

        if (fs.existsSync(finalNodePath)) {
            console.log(`Node.js binary for ${platform.name} already exists. Skipping.`);
            continue;
        }

        const fileNameBase = `node-${NODE_VERSION}-${platform.name}`;
        const archiveName = `${fileNameBase}.${platform.archiveType}`;
        const url = `https://nodejs.org/dist/${NODE_VERSION}/${archiveName}`;
        const archivePath = path.join(DIST_BIN_DIR, archiveName);

        if (!fs.existsSync(archivePath)) {
            await download(url, archivePath);
        }

        if (!fs.existsSync(platformDir)) {
            fs.mkdirSync(platformDir);
        }

        console.log(`Extracting ${nodeBinaryName} for ${platform.name}...`);
        
        try {
            if (platform.archiveType === 'zip') {
                execSync(`unzip -o -j ${archivePath} ${platform.binaryPathInArchive} -d ${platformDir}`);
            } else { // tar.gz
                execSync(`tar -xzf ${archivePath} -C ${platformDir} --strip-components=2 ${platform.binaryPathInArchive}`);
            }

            fs.chmodSync(finalNodePath, '755');
            fs.unlinkSync(archivePath); // clean up archive
            console.log(`Successfully extracted Node.js for ${platform.name}.`);
        } catch (error) {
            console.error(`Failed to extract ${archiveName}.`);
            console.error(error.message);
            console.log("Please ensure 'tar' and 'unzip' are installed and working correctly.");
        }
    }
}

main().catch(err => {
    console.error(err);
    process.exit(1);
});
