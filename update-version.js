const fs = require('fs');
const { execSync } = require('child_process');

try {
    const version = execSync('git rev-parse --short HEAD').toString().trim();
    const timestamp = execSync('git log -1 --format=%cd').toString().trim();

    const versionInfo = {
        version,
        timestamp,
    };

    fs.writeFileSync('version.json', JSON.stringify(versionInfo, null, 2));
    console.log('Version information updated successfully.');
} catch (error) {
    console.error('Error updating version information:', error);
}