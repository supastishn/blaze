const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const mainScript = path.join(__dirname, '..', 'dist', 'cli', 'index.js');
const outputDir = path.join(__dirname, '..', 'dist-sea');
const targetPlatform = process.env.TARGET_PLATFORM || `${process.platform}-${process.arch}`;
const executableName = `ts2cpp-${targetPlatform}${targetPlatform.startsWith('win') ? '.exe' : ''}`;
const executablePath = path.join(outputDir, executableName);
const seaConfigPath = path.join(__dirname, '..', 'sea-config.json');

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

// 4. Copy the node executable
console.log('Copying node executable...');
const nodePath = process.execPath;
fs.copyFileSync(nodePath, executablePath);
fs.chmodSync(executablePath, '755');

// 5. Inject the blob into the copied executable
console.log('Injecting blob into executable...');
// The sentinel fuse is a hash that ensures the blob is not tampered with.
// This is a standard one provided in node docs.
execSync(`npx postject ${executablePath} NODE_SEA_BLOB sea-prep.blob --sentinel-fuse NODE_SEA_FUSE_fce680ab2cc4_67b6e072b8b5df1996b2`, { stdio: 'inherit' });

// On Linux, strip the binary to reduce size and fix potential execution issues.
if (targetPlatform.startsWith('linux')) {
    console.log(`Stripping binary for ${targetPlatform}...`);
    execSync(`strip ${executablePath}`, { stdio: 'inherit' });
}

// 6. Clean up temporary files
console.log('Cleaning up...');
fs.unlinkSync(seaConfigPath);
fs.unlinkSync('sea-prep.blob');

console.log(`\nSuccessfully created single executable at: ${executablePath}`);
