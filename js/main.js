document.addEventListener('DOMContentLoaded', function() {
    const sketchList = document.getElementById('sketch-list');

    // In the future, we can fetch this list from the server.
    // For now, we'll hardcode it.
    const sketches = [
        'test_sketch.js'
    ];

    sketches.forEach(sketchName => {
        const listItem = document.createElement('li');
        const link = document.createElement('a');
        link.href = `sketch.html?sketch=${sketchName}`;
        link.textContent = sketchName.replace('.js', '').replace(/_/g, ' '); // Make the name more readable
        listItem.appendChild(link);
        sketchList.appendChild(listItem);
    });
});