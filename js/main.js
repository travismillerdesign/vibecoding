document.addEventListener('DOMContentLoaded', function() {
    const sketchGrid = document.getElementById('sketch-grid');

    fetch('sketches.json')
        .then(response => response.json())
        .then(data => {
            const sketches = data.sketches;
            sketches.forEach(sketchName => {
                const card = document.createElement('div');
                card.className = 'sketch-card';

                const link = document.createElement('a');
                link.href = `sketch.html?sketch=${sketchName}`;
                link.target = '_blank';
                link.rel = 'noopener noreferrer';

                const thumbnail = document.createElement('img');
                thumbnail.src = `sketches/${sketchName}/thumbnail.jpg`;
                thumbnail.alt = `Thumbnail for ${sketchName}`;
                thumbnail.onerror = function() {
                    this.style.display = 'none';
                };

                const title = document.createElement('div');
                title.className = 'title';
                title.textContent = sketchName.replace(/_/g, ' ');

                link.appendChild(thumbnail);
                link.appendChild(title);
                card.appendChild(link);
                sketchGrid.appendChild(card);
            });
        })
        .catch(error => console.error('Error loading sketches:', error));
});