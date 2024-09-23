<template>
  <div>
    <Header @toggle-upload-popup="showUploadPopup" />
    <div class="search-bar">
      <input v-model="searchParams.name" placeholder="Search by Name..." @input="fetchMaps" />
      <input v-model="searchParams.developer" placeholder="Search by Developer..." @input="fetchMaps" />
      <input v-model="searchParams.type" placeholder="Search by Type..." @input="fetchMaps" />
      <input v-model="searchParams.date" type="date" @input="fetchMaps" />
      <button @click="clearFilters">Clear Filters</button>
    </div>
    <MapGallery :maps="filteredMaps" />
    <UploadPopup :show="uploadPopupVisible" :close="closeUploadPopup" @upload-success="fetchMaps" />
  </div>
</template>

<script>
import Header from './components/Header.vue';
import MapGallery from './components/MapGallery.vue';
import UploadPopup from './components/UploadPopup.vue';

export default {
  components: { Header, MapGallery, UploadPopup },
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
      uploadPopupVisible: false
    };
  },
  methods: {
    async fetchMaps() {
      const response = await fetch('/api/maps');
      const maps = await response.json();
      this.filteredMaps = maps.filter(map => {
        return (!this.searchParams.name || map.name.includes(this.searchParams.name)) &&
              (!this.searchParams.developer || map.developer.includes(this.searchParams.developer)) &&
              (!this.searchParams.type || map.type.includes(this.searchParams.type)) &&
              (!this.searchParams.date || map.date === this.searchParams.date);
      });
    },

    clearFilters() {
      this.searchParams = { name: '', developer: '', type: '', date: '' };
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

<style src="./styles.css"></style>
