const fs = require('fs');
const { execSync } = require('child_process');

try {
    const version = execSync('git rev-parse --short HEAD').toString().trim();
    const rawTimestamp = execSync('git log -1 --format=%cd').toString().trim();
    const date = new Date(rawTimestamp);

    const formattedTimestamp = new Intl.DateTimeFormat('en-US', {
        timeZone: 'America/Los_Angeles',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        hour12: true,
    }).format(date);

    const versionInfo = {
        version,
        timestamp: formattedTimestamp,
    };

    fs.writeFileSync('version.json', JSON.stringify(versionInfo, null, 2));
    console.log('Version information updated successfully.');
} catch (error) {
    console.error('Error updating version information:', error);
}