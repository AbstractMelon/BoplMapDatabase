<template>
    <div id="map-gallery">
      <div class="top-container" :class="{ hidden: showSections }">
        <div class="motw-container">
          <h2>Map of the Week</h2>
          <MapCard :map="motw" class="motw-card" />
        </div>
        <div class="side-container">
          <div class="handpicked">
            <h2>Handpicked Maps</h2>
            <div class="side-row">
              <MapCard
                v-for="map in handpickedMaps"
                :key="map.MapUUID"
                :map="map"
              />
            </div>
          </div>
          <div class="featured">
            <h2>Featured Maps</h2>
            <div class="side-row">
              <MapCard
                v-for="map in featuredMaps"
                :key="map.MapUUID"
                :map="map"
              />
            </div>
          </div>
        </div>
      </div>
  
      <transition name="slide">
        <div class="main-map-list">
          <h2>Main List of Maps</h2>
          <div class="map-grid">
            <MapCard v-for="map in paginatedMaps" :key="map.MapUUID" :map="map" />
          </div>
  
          <div class="pagination">
                <button @click="prevPage" :disabled="currentPage === 1">
                    &#8592;  <!-- Left arrow -->
                </button>
            <span>Page {{ currentPage }} of {{ totalPages }}</span>
                <button @click="nextPage" :disabled="currentPage === totalPages">
                    &#8594;  <!-- Right arrow -->
                </button>
            </div>
        </div>
      </transition>
    </div>
  </template>
  
  
  <script>
  import MapCard from './gallery/MapCard.vue';
  
  export default {
    components: { MapCard },
    props: ['maps', 'showSections'],
    data() {
      return {
        currentPage: 1,
        itemsPerRow: 5, // Number of columns
        rowsPerPage: 5,  // Number of rows to display
      };
    },
    computed: {
      motw() {
        return this.maps.find(map => map.isMotw);
      },
      handpickedMaps() {
        return this.maps.filter(map => map.isHandpicked);
      },
      featuredMaps() {
        return this.maps.filter(map => map.isFeatured);
      },
      mainMaps() {
        return this.maps;
      },
      mainMapsSearchable() {
        return this.maps.filter(map => !map.isMotw && !map.isHandpicked && !map.isFeatured);
      },
      totalPages() {
        const totalItems = this.mainMaps.length;
        return Math.ceil(totalItems / (this.itemsPerRow * this.rowsPerPage));
      },
      paginatedMaps() {
        const start = (this.currentPage - 1) * (this.itemsPerRow * this.rowsPerPage);
        return this.mainMaps.slice(start, start + (this.itemsPerRow * this.rowsPerPage));
      }
    },
    methods: {
      nextPage() {
        if (this.currentPage < this.totalPages) {
          this.currentPage++;
        }
      },
      prevPage() {
        if (this.currentPage > 1) {
          this.currentPage--;
        }
      }
    }
  }
  </script>
  
  <style scoped>
  #map-gallery {
    display: flex;
    flex-direction: column;
    gap: 20px;
    padding: 20px;
  }
  
  .top-container {
    display: grid;
    grid-template-columns: 1fr; /* Default to a single column on small screens */
    gap: 20px;
  } 
  
  @media (min-width: 600px) {
    .top-container {
      grid-template-columns: 2fr 3fr; /* MOTW takes 2/5 of the width, side container 3/5 */
    }
  }
  
  .motw-container {
    background-color: var(--bgcol3);
    padding: 15px;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    display: flex;
    flex-direction: column;
    justify-content: stretch; 
    width: 600px; 
  }
  
  .motw-container .motw-card {
    flex-grow: 1;
    width: 90%;
  }
  
  .side-container {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }
  
  .handpicked, .featured {
    background-color: var(--bgcol3);
    padding: 15px;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  }
  
  .side-row {
    display: flex;
    overflow-x: auto; /* Enables horizontal scrolling */
    padding: 10px 0;
    gap: 20px;
  }
  
  .main-map-list {
    background-color: var(--bgcol3);
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  }
  
  .map-grid {
    display: flex;
    flex-wrap: wrap;
    justify-content: left;
    gap: 20px;
  }
  
  h2 {
    margin-bottom: 15px;
    color: var(--textcol);
  }
  
  .top-container.hidden {
    display: none; 
  }
  
  .slide-enter-active, .slide-leave-active {
    transition: all 0.5s ease; 
  }
  .slide-enter, .slide-leave-to {
    transform: translateY(-20px); 
    opacity: 1; 
  }

  .pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
}

.pagination button {
  margin: 0 10px;
  padding: 5px 10px;
  cursor: pointer;
}

.pagination button:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}
  </style>
  