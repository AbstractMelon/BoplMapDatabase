<template>
    <div class="map-card" v-if="map">
      <h2>{{ map.MapName }}</h2>
      <p><strong>Developer:</strong> {{ map.MapDeveloper }}</p>
      <p><strong>Type:</strong> {{ map.MapType }}</p>
      <p><strong>Description:</strong> {{ map.MapDescription }}</p>
      <button @click.stop="downloadMap">Download</button>
    </div>
    <div v-else>
      <p>Loading map details...</p>
    </div>
  </template>
  

<script>
export default {
    props: ['map'],
    methods: {
        downloadMap() {
            window.location.href = `/api/maps/download/${this.map.MapUUID}`; // /api/maps/download/:mapid
        }
    }
}
</script>

<style scoped>
.map-card {
    background-color: var(--bgcol2);
    padding: 15px;
    border-radius: 10px;
    width: 250px;
    height: 180px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    position: relative;
    transition: transform 0.2s;
}

.map-card:hover {
    transform: scale(1.05);
}

.map-card h2 {
    font-size: 18px;
    margin: 0;
    margin-bottom: 10px;
}

.map-card p {
    margin: 5px 0;
}

.map-card button {
    padding: 10px;
    background-color: var(--accent);
    color: var(--textcol2);
    border: none;
    border-radius: 5px;
    cursor: pointer;
    width: 90%;
    position: absolute;
    bottom: 15px;
    left: 0;
    right: 0;
    margin: auto;
}

.map-card button:hover {
    background-color: #2f5dbb;
}

.map-card button:hover {
    background-color: #2f5dbb;
}

.heart-icon {
    cursor: pointer;
    font-size: 24px;
    margin-left: 5px;
    transition: color 0.3s;
}

.heart-icon.liked {
    color: red;
}

.like-count {
    font-weight: bold;
}
</style>
