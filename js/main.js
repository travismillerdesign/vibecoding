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

                const thumbnail = document.createElement('img');
                const thumbnailName = sketchName.replace('.js', '.png');
                thumbnail.src = `thumbnails/${thumbnailName}`;
                thumbnail.alt = `Thumbnail for ${sketchName}`;

                const title = document.createElement('div');
                title.className = 'title';
                title.textContent = sketchName.replace('.js', '').replace(/_/g, ' ');

                link.appendChild(thumbnail);
                link.appendChild(title);
                card.appendChild(link);
                sketchGrid.appendChild(card);
            });
        })
        .catch(error => console.error('Error loading sketches:', error));
});