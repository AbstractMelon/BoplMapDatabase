<template>
    <div v-if="show" class="popup">
      <div class="popup-content">
        <span class="close" @click="close">&times;</span>
  
        <!-- Toggle Switch -->
        <div class="upload-type-toggle">
          <label>
            <input type="radio" value="map" v-model="uploadType" aria-label="Upload a New Map" />
            Upload a New Map
          </label>
          <label>
            <input type="radio" value="bundle" v-model="uploadType" aria-label="Upload a New Bundle" />
            Upload a New Bundle
          </label>
        </div>
  
        <h2 v-if="uploadType === 'map'">Upload a New Map</h2>
        <h2 v-else>Upload a New Bundle</h2>
  
        <!-- Map Upload Form -->
        <form v-if="uploadType === 'map'" @submit.prevent="uploadMap">
          <label>
            <input type="file" ref="fileInput" accept=".zip,.rar" required aria-label="Select Map File" />
            <span class="file-label">Choose a file</span>
          </label>
          <button type="submit">Upload Map</button>
        </form>
  
        <!-- Bundle Upload Form -->
        <form v-else @submit.prevent="uploadBundle">
          <div class="bundle-creator">
            <label for="bundleName">Bundle Name:</label>
            <input type="text" v-model="bundleName" placeholder="Enter Bundle Name" required />
  
            <fieldset>
              <legend>Select Maps for Bundle:</legend>
              <div v-for="map in availableMaps" :key="map.MapUUID" class="map-checkbox">
                <input type="checkbox" :value="map.MapUUID" v-model="selectedMaps" aria-label="Select Map" />
                <span>{{ map.MapName }}</span>
              </div>
            </fieldset>
          </div>
          <button type="submit">Create Bundle</button>
        </form>
  
        <div v-if="isLoading" class="loading-spinner">Loading...</div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    props: ['show', 'close'],
    data() {
      return {
        uploadType: 'map',
        bundleName: '',
        availableMaps: [],
        selectedMaps: [],
        isLoading: false,
      };
    },
    mounted() {
      this.fetchMaps();
    },
    methods: {
      async fetchMaps() {
        const response = await fetch('/api/maps');
        this.availableMaps = await response.json();
      },
      async uploadMap() {
        this.isLoading = true;
        const formData = new FormData();
        formData.append('map', this.$refs.fileInput.files[0]);
  
        const response = await fetch('/api/maps/upload', { method: 'POST', body: formData });
        const data = await response.json();
        alert(data.message);
        this.resetForm();
      },
      async uploadBundle() {
        if (this.selectedMaps.length === 0) {
          alert("Please select at least one map for the bundle.");
          return;
        }
        this.isLoading = true;
  
        const bundleData = {
          bundleName: this.bundleName,
          mapUUIDs: this.selectedMaps,
        };
  
        const response = await fetch('/api/bundles/create', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(bundleData),
        });
  
        const data = await response.json();
        alert(data.message);
        this.resetForm();
      },
      resetForm() {
        this.isLoading = false;
        this.uploadType = 'map';
        this.bundleName = '';
        this.selectedMaps = [];
        this.close();
      },
    },
  };
  </script>
  
  <style>
  .popup {
    position: fixed;
    z-index: 1;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.7);
    display: flex;
    justify-content: center;
    align-items: center;
  }
  
  .popup-content {
    background-color: var(--bgcol2);
    padding: 20px;
    border-radius: 10px;
    width: 90%;
    max-width: 400px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.5);
    animation: fadeIn 0.3s;
  }
  
  .popup-content h2 {
    margin-top: 0;
  }
  
  .popup-content input[type="file"],
.popup-content input[type="text"] {
    width: 80%;
    padding: 10px;
    margin: 10px 0;
    border: 1px solid #ccc;
    border-radius: 4px;
    background-color: var(--bgcol3);
    color: var(--textcol);
}
  
  .popup-content button {
    padding: 10px 20px;
    background-color: var(--accent);
    color: var(--textcol);
    border: none;
    border-radius: 5px;
    cursor: pointer;
    width: 100%;
    transition: background-color 0.3s;
  }
  
  .popup-content button:hover {
    background-color: #2f5dbb;
  }
  
  .popup-content .close {
    color: #aaa;
    float: right;
    font-size: 28px;
    font-weight: bold;
  }
  
  .popup-content .close:hover {
    color: white;
  }
  
  .loading-spinner {
    margin-top: 20px;
    font-size: 16px;
    color: var(--accent);
  }
  
  /* Add fade-in animation */
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  </style>
  