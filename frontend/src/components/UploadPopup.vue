<template>
  <div v-if="show" class="popup">
    <div class="popup-content">
      <span class="close" @click="close">&times;</span>
      <h2>Upload a New Map</h2>
      <form @submit.prevent="uploadMap">
        <input type="file" ref="fileInput" accept=".zip,.rar" required />
        <button type="submit">Upload</button>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  props: ['show', 'close'],
  methods: {
    async uploadMap() {
      const formData = new FormData();
      formData.append('map', this.$refs.fileInput.files[0]);
      const response = await fetch('/api/upload', { method: 'POST', body: formData });
      const data = await response.json();
      alert(data.message);
      this.$emit('upload-success');
      window.location.href = "/"
      this.close();
    }
  }
}
</script>
