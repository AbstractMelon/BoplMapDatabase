<template>
  <div v-if="show" class="popup">
    <div class="popup-content">
      <span class="close" @click="close" aria-label="Close Popup">&times;</span>

      <div class="upload-type-toggle">
        <button
          :class="{ active: isMapUpload }"
          @click="isMapUpload = true"
          aria-label="Upload a New Map"
        >
          Upload a New Map
        </button>
        <button
          :class="{ active: !isMapUpload }"
          @click="isMapUpload = false"
          aria-label="Create a Bundle"
        >
          Create a Bundle
        </button>
      </div>

      <h2>{{ isMapUpload ? 'Upload a New Map' : 'Create a Bundle' }}</h2>

      <!-- Map Upload Form -->
      <form v-if="isMapUpload" @submit.prevent="uploadMap">
        <label class="file-label">
          <input
            type="file"
            ref="fileInput"
            accept=".zip,.rar"
            required
            aria-label="Select Map File"
          />
        </label>
        <button type="submit">Upload Map</button>
      </form>

      <!-- Bundle Upload Form -->
      <form v-else @submit.prevent="uploadBundle">
        <div class="bundle-creator">
          <label for="bundleName">Bundle Name:</label>
          <input
            type="text"
            v-model="bundleName"
            placeholder="Enter Bundle Name"
            required
          />

          <label for="mapSearch">Search Maps:</label>
          <input
            type="text"
            v-model="mapSearch"
            placeholder="Search..."
            @input="filterMaps"
          />

          <fieldset>
            <legend>Select Maps for Bundle:</legend>
            <div
              v-for="map in paginatedMaps"
              :key="map.MapUUID"
              class="map-checkbox"
            >
              <input
                type="checkbox"
                :value="map.MapUUID"
                v-model="selectedMaps"
                aria-label="Select Map"
              />
              <span>{{ map.MapName }}</span>
            </div>
          </fieldset>

          <div class="pagination">
            <button
              type="button"
              @click="prevPage"
              :disabled="currentPage === 1"
            >
              Previous
            </button>
            <p>Page {{ currentPage }} of {{ totalPages }}</p>
            <button
              type="button"
              @click="nextPage"
              :disabled="currentPage === totalPages"
            >
              Next
            </button>
          </div>
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
      isMapUpload: true,
      bundleName: '',
      availableMaps: [],
      filteredMaps: [],
      selectedMaps: [],
      isLoading: false,
      mapSearch: '',
      currentPage: 1,
      itemsPerPage: 10,
    };
  },
  computed: {
    totalPages() {
      return Math.ceil(this.filteredMaps.length / this.itemsPerPage);
    },
    paginatedMaps() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.filteredMaps.slice(start, end);
    },
  },
  mounted() {
    this.fetchMaps();
  },
  methods: {
    async fetchMaps() {
      try {
        const response = await fetch('/api/maps');
        this.availableMaps = await response.json();
        this.filteredMaps = this.availableMaps;
      } catch (error) {
        console.error('Error fetching maps:', error);
      }
    },
    filterMaps() {
      const search = this.mapSearch.toLowerCase();
      this.filteredMaps = this.availableMaps.filter(map =>
        map.MapName.toLowerCase().includes(search),
      );
      this.currentPage = 1; // Reset to the first page on search
    },
    async uploadMap() {
      this.isLoading = true;
      const formData = new FormData();
      formData.append('map', this.$refs.fileInput.files[0]);

      try {
        const response = await fetch('/api/maps/upload', {
          method: 'POST',
          body: formData,
        });
        const data = await response.json();
        alert(data.message);
      } catch (error) {
        console.error('Error uploading map:', error);
      } finally {
        this.resetForm();
      }
    },
    async uploadBundle() {
      if (this.selectedMaps.length === 0) {
        alert('Please select at least one map for the bundle.');
        return;
      }
      this.isLoading = true;

      const bundleData = {
        bundleName: this.bundleName,
        mapUUIDs: this.selectedMaps,
      };

      try {
        const response = await fetch('/api/bundles/create', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(bundleData),
        });
        const data = await response.json();
        alert(data.message);
      } catch (error) {
        console.error('Error creating bundle:', error);
      } finally {
        this.resetForm();
      }
    },
    resetForm() {
      this.isLoading = false;
      this.isMapUpload = true;
      this.bundleName = '';
      this.selectedMaps = [];
      this.mapSearch = '';
      this.filteredMaps = this.availableMaps;
      this.currentPage = 1;
      this.close();
    },
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++;
      }
    },
    prevPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
      }
    },
  },
};
</script>

<style scoped>
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
  max-width: 500px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.5);
  animation: fadeIn 0.3s;
}

.popup-content h2 {
  margin-top: 0;
}

input[type='text'],
input[type='file'] {
  padding: 10px 20px;
  width: 91.7%;
  margin: 10px 0;
  border: 1px solid #ccc;
  border-radius: 4px;
  background-color: var(--bgcol3);
  color: var(--textcol);
}

button {
  padding: 10px 20px;
  background-color: var(--accent);
  color: var(--textcol);
  border: none;
  border-radius: 5px;
  cursor: pointer;
  width: 100%;
  transition: background-color 0.3s;
}

button:hover {
  background-color: #2f5dbb;
}

.close {
  color: #aaa;
  float: right;
  font-size: 28px;
  font-weight: bold;
}

.close:hover {
  color: white;
}

.loading-spinner {
  margin-top: 20px;
  font-size: 16px;
  color: var(--accent);
}

/* Toggle Button Styles */
.upload-type-toggle {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}

.upload-type-toggle button {
  flex: 1;
  padding: 10px;
  margin: 0 5px;
  background-color: #ccc;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.upload-type-toggle button.active {
  background-color: var(--accent);
  color: white;
}

/* Pagination Styles */
.pagination {
  display: flex;
  justify-content: space-between;
  margin: 20px 0;
}

.pagination button {
  width: 40%;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
</style>
