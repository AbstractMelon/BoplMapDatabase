<template>
    <div>
      <div class="search-container">
        <div class="search-bar">
          <input v-model="searchParams.name" placeholder="Search by Name..." @input="onSearch" />
          <input v-model="searchParams.developer" placeholder="Search by Developer..." @input="onSearch" />
          <input v-model="searchParams.type" placeholder="Search by Type..." @input="onSearch" />
          <!-- <input v-model="searchParams.date" type="date" @input="onSearch" /> -->
          
          <label for="sort" class="sort-label">Sort by:</label>
          <select v-model="sortBy" @change="onSearch" class="sort-dropdown">
            <option value="mostRecent">Most Recent</option>
            <option value="mostDownloaded">Most Downloaded</option>
            <option value="oldest">Oldest</option>
          </select>
  
          <button @click="clearFilters">Clear Filters</button>
        </div>
      </div>
      <MapGallery :maps="filteredMaps" :showSections="hasActiveSearch" />
    </div>
  </template>
  
  
  <script>
  import MapGallery from '../components/MapGallery.vue';
  
  export default {
    components: { MapGallery },
    data() {
      return {
        maps: [],
        filteredMaps: [],
        searchParams: {
          name: '',
          developer: '',
          type: '',
          date: ''
        },
        sortBy: 'mostRecent',
        uploadPopupVisible: false,
      };
    },
    computed: {
        hasActiveSearch() {
            return Object.values(this.searchParams).some(param => param) || this.sortBy !== 'mostRecent';
        }
    },
    methods: {
        async fetchMaps() {
            const response = await fetch('/api/maps');
            const maps = await response.json();
            
            // Add relevance scoring instead of filtering
            this.filteredMaps = maps.map(map => {
            let score = 0;

            // Score by name
            if (this.searchParams.name) {
                if (map.MapName.toLowerCase().includes(this.searchParams.name.toLowerCase())) {
                score += map.MapName.toLowerCase() === this.searchParams.name.toLowerCase() ? 2 : 1;
                }
            }

            // Score by developer
            if (this.searchParams.developer) {
                if (map.MapDeveloper.toLowerCase().includes(this.searchParams.developer.toLowerCase())) {
                score += map.MapDeveloper.toLowerCase() === this.searchParams.developer.toLowerCase() ? 2 : 1;
                }
            }

            // Score by type
            if (this.searchParams.type) {
                if (map.MapType.toLowerCase().includes(this.searchParams.type.toLowerCase())) {
                score += map.MapType.toLowerCase() === this.searchParams.type.toLowerCase() ? 2 : 1;
                }
            }

            // Score by date
            if (this.searchParams.date && map.DateCreated.startsWith(this.searchParams.date)) {
                score += 2;
            }

            return { ...map, relevanceScore: score };
            })
            // Sort maps by relevance score in descending order
            .sort((a, b) => b.relevanceScore - a.relevanceScore)

            
            .sort((a, b) => {
                switch (this.sortBy) {
                    case 'mostRecent':
                    return new Date(b.DateCreated) - new Date(a.DateCreated);
                    case 'mostDownloaded':
                    return b.downloadCount - a.downloadCount;
                    case 'oldest':
                    return new Date(a.DateCreated) - new Date(b.DateCreated);
                    default:
                    return 0;
                }
            });
        },
        
        clearFilters() {
            this.searchParams = { name: '', developer: '', type: '', date: '' };
            his.sortBy = 'mostRecent'
            this.fetchMaps();
        },
        
        onSearch() {
            this.fetchMaps();
        },
      showUploadPopup() {
        console.log('Upload popup triggered');
        this.uploadPopupVisible = true;
      },
      closeUploadPopup() {
        this.uploadPopupVisible = false;
      }
    },
    mounted() {
      this.fetchMaps();
    }
  }
  </script>
  
  <style scoped>
.search-container {
  background-color: var(--bgcol3);
  padding: 5px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  max-width: 97%;
  margin: auto;
  margin-top: 20px;
  align-content: top;
}

.search-bar {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  margin: 10px;
}

.search-bar input,
.search-bar button,
.search-bar select {
  padding: 10px;
  font-size: 1em;
  border: 1px solid var(--textcol);
  border-radius: 5px;
  background-color: var(--bgcol2);
  color: var(--textcol);
  width: 100%;
  max-width: 300px;
}

.search-bar input::placeholder,
.search-bar button {
  color: #999;
}

.sort-label {
  margin-bottom: 5px; /* Adjusts space above the dropdown */
}

.sort-dropdown {
  padding: 10px;
  font-size: 1em;
  border: 1px solid var(--textcol);
  border-radius: 5px;
  background-color: var(--bgcol2);
  color: var(--textcol);
  width: 100%;
  max-width: 300px;
}

@media (min-width: 768px) {
  .search-bar {
    flex-direction: row;
  }

  .search-bar input,
  .search-bar button,
  .search-bar select {
    max-width: initial;
  }
}
</style>
