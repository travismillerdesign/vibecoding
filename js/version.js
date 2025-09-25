document.addEventListener('DOMContentLoaded', function() {
    const versionInfo = document.getElementById('version-info');

    fetch('version.json')
        .then(response => response.json())
        .then(data => {
            const version = data.version;
            const timestamp = data.timestamp;
            versionInfo.innerHTML = `${timestamp}<br>${version}`;
        })
        .catch(error => {
            console.error('Error loading version information:', error);
            versionInfo.textContent = 'Could not load version info.';
        });
});