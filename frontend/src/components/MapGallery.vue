<template>
    <div id="map-gallery">
      <div class="top-container">
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
  
      <div class="main-map-list">
        <h2>Main List of Maps</h2>
        <div class="map-grid">
          <MapCard v-for="map in mainMaps" :key="map.MapUUID" :map="map" />
        </div>
      </div>
    </div>
  </template>  
  
  <script>
  import MapCard from './gallery/MapCard.vue';
  
  export default {
    components: { MapCard },
    props: ['maps'],
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
    margin-top: 15px;
  display: grid;
  grid-template-columns: 2fr 3fr; /* MOTW takes 2/5 of the width, side container 3/5 */
  gap: 20px;
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
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.side-row {
  display: flex;
  overflow-x: auto; /* Enables horizontal scrolling */
  padding: 10px 0;
  gap: 20px;
}

.side-row::-webkit-scrollbar {
  height: 8px; /* Customize scrollbar height */
}

.side-row::-webkit-scrollbar-thumb {
  background: var(--scrollbar-color); /* Customize scrollbar color */
  border-radius: 10px;
}

.main-map-list {
  background-color: var(--bgcol3);
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  margin-top: 40px;
}

.map-grid {
  display: flex;
  flex-wrap: wrap;
  justify-content: left;
  gap: 20px;
  margin-top: 20px;
}

h2 {
  margin-bottom: 15px;
  color: var(--textcol);
}
</style>
