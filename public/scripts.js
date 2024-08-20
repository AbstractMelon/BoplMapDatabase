document.addEventListener('DOMContentLoaded', () => {
    const mapGallery = document.getElementById('map-gallery');
    const uploadButton = document.getElementById('upload-button');
    const uploadPopup = document.getElementById('upload-popup');
    const closePopup = document.querySelector('.popup-content .close');
    const searchBar = document.getElementById('search-bar');

    // Get and display maps
    function displayMaps(maps) {
        mapGallery.innerHTML = ''; // Clear the gallery first
        maps.forEach(map => {
            const mapCard = document.createElement('div');
            mapCard.className = 'map-card';
            mapCard.innerHTML = `
                <h2 class="mapName">Something went wrong!</h2>
                <p><strong>Developer:</strong><span class="mapDeveloper">Something went wrong!</span></p>
                <p><strong>Type:</strong><span class="mapType">Something went wrong!</span></p>
                <p><strong>Description:</strong><span class="mapDescription">Something went wrong!</span></p>
                <p><strong>Date Created:</strong><span class="mapDate">Something went wrong!</span></p>
                <button class="mapDownload">Download</button>
            `;
            mapCard.querySelector(".mapDeveloper").textContent = map.MapName
            mapCard.querySelector(".mapDeveloper").textContent = map.MapDeveloper
            mapCard.querySelector(".mapType").textContent = map.MapType
            mapCard.querySelector(".mapDescription").textContent = map.MapDescription
            mapCard.querySelector(".mapDate").textContent = map.DateCreated
            mapCard.querySelector(".mapDownload").addEventListener("click", ()=>{
                downloadMap(map.MapUUID)
            })

            mapGallery.appendChild(mapCard);
        });
    }

    function fetchMaps(searchQuery = '') {
        const endpoint = searchQuery ? `/api/search?q=${encodeURIComponent(searchQuery)}` : '/api/maps';
        fetch(endpoint)
            .then(response => response.json())
            .then(maps => displayMaps(maps));
    }

    // Fetch Maps
    fetchMaps();

    // Map upload
    document.getElementById('upload-form').addEventListener('submit', function (e) {
        e.preventDefault();

        const formData = new FormData();
        const fileInput = document.getElementById('map-file');
        const mapNameInput = document.getElementById('map-name');

        formData.append('map', fileInput.files[0]);
        formData.append('name', mapNameInput.value);

        fetch('/api/upload', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            alert(data.message);
            fetchMaps();  // Reload maps after successful upload
            uploadPopup.style.display = 'none'; // Close the popup after upload
        });
    });

    // Handle search
    searchBar.addEventListener('input', function () {
        const searchQuery = this.value.trim();
        fetchMaps(searchQuery);
    });

    // Open upload popup
    uploadButton.addEventListener('click', () => {
        uploadPopup.style.display = 'block';
    });

    // Close popup
    closePopup.addEventListener('click', () => {
        uploadPopup.style.display = 'none';
    });

    // Close popup when clicking outside of it
    window.addEventListener('click', (event) => {
        if (event.target === uploadPopup) {
            uploadPopup.style.display = 'none';
        }
    });
});

function downloadMap(uuid) {
    window.location.href = `/api/download/${uuid}`;
}
