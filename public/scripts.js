document.addEventListener('DOMContentLoaded', () => {
    const mapGallery = document.getElementById('map-gallery');
    const uploadButton = document.getElementById('upload-button');
    const uploadPopup = document.getElementById('upload-popup');
    const closePopup = document.querySelector('.popup-content .close');
    const searchBarName = document.getElementById('search-name');
    const searchBarDeveloper = document.getElementById('search-developer');
    const searchBarType = document.getElementById('search-type');
    const searchBarDate = document.getElementById('search-date');
    const clearFiltersButton = document.getElementById('clear-filters');

    // Get and display maps
    function displayMaps(maps) {
        mapGallery.innerHTML = ''; // Clear the gallery first
        maps.forEach(map => {
            const mapCard = document.createElement('div');
            mapCard.className = 'map-card';
            mapCard.innerHTML = `
                <h2 class="mapName">${map.MapName}</h2>
                <p><strong>Developer:</strong><span class="mapDeveloper">Something went wrong!</span></p>
                <p><strong>Type:</strong><span class="mapType">Something went wrong!</span></p>
                <p><strong>Description:</strong><span class="mapDescription">Something went wrong!</span></p>
                <p><strong>Date Created:</strong><span class="mapDate">Something went wrong!</span></p>
                <button class="mapDownload">Download</button>
            `;
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

    function fetchMaps(queryParams = {}) {
        let queryString = Object.keys(queryParams).map(key => `${key}=${encodeURIComponent(queryParams[key])}`).join('&');
        const endpoint = queryString ? `/api/search?${queryString}` : '/api/maps';
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
        // formData.append('name', mapNameInput.value);

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
    [searchBarName, searchBarDeveloper, searchBarType, searchBarDate].forEach(input => {
        input.addEventListener('input', function () {
            const queryParams = {
                name: searchBarName.value.trim(),
                developer: searchBarDeveloper.value.trim(),
                type: searchBarType.value.trim(),
                date: searchBarDate.value
            };
            fetchMaps(queryParams);
        });
    });

    // Clear filters
    clearFiltersButton.addEventListener('click', () => {
        searchBarName.value = '';
        searchBarDeveloper.value = '';
        searchBarType.value = '';
        searchBarDate.value = '';
        fetchMaps();
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
