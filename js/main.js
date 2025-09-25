document.addEventListener('DOMContentLoaded', function() {
    const sketchList = document.getElementById('sketch-list');

    fetch('sketches.json')
        .then(response => response.json())
        .then(data => {
            const sketches = data.sketches;
            sketches.forEach(sketchName => {
                const listItem = document.createElement('li');
                const link = document.createElement('a');
                link.href = `sketch.html?sketch=${sketchName}`;
                link.textContent = sketchName.replace('.js', '').replace(/_/g, ' '); // Make the name more readable
                listItem.appendChild(link);
                sketchList.appendChild(listItem);
            });
        })
        .catch(error => console.error('Error loading sketches:', error));
});