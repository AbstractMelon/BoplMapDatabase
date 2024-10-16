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
            <MapCard v-for="map in mainMaps" :key="map.MapUUID" :map="map" />
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
  }
  
  .motw-container .motw-card {
    width: 100%;
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
  </style>
  