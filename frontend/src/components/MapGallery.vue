<template>
  <div id="map-gallery">
    <MapCard v-for="map in maps" :key="map.MapUUID" :map="map" />
  </div>
</template>

<script>
import MapCard from './gallery/MapCard.vue';

export default {
  components: { MapCard },
  props: ['maps']
}
</script>
