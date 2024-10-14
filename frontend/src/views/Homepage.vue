<template>
    <div>
      <div class="search-bar">
        <input v-model="searchParams.name" placeholder="Search by Name..." @input="onSearch" />
        <input v-model="searchParams.developer" placeholder="Search by Developer..." @input="onSearch" />
        <input v-model="searchParams.type" placeholder="Search by Type..." @input="onSearch" />
        <input v-model="searchParams.date" type="date" @input="onSearch" />
        <button @click="clearFilters">Clear Filters</button>
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
        uploadPopupVisible: false,
      };
    },
    computed: {
      hasActiveSearch() {
        return Object.values(this.searchParams).some(param => param);
      }
    },
    methods: {
      async fetchMaps() {
        const response = await fetch('/api/maps');
        const maps = await response.json();
        this.filteredMaps = maps.filter(map => {
          return (!this.searchParams.name || map.MapName.includes(this.searchParams.name)) &&
                 (!this.searchParams.developer || map.MapDeveloper.includes(this.searchParams.developer)) &&
                 (!this.searchParams.type || map.MapType.includes(this.searchParams.type)) &&
                 (!this.searchParams.date || map.DateCreated.startsWith(this.searchParams.date));
        });
      },
    
      clearFilters() {
        this.searchParams = { name: '', developer: '', type: '', date: '' };
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
  