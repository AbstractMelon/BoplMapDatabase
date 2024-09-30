<template>
  <header>
    <div class="header-title"><a href="/">Bopl Map Database</a></div>
    <div class="header-buttons">
      <button @click="$emit('toggle-upload-popup')">Upload Map</button>
      <button @click="loginSignup">Login/Signup</button>
    </div>
  </header>
</template>

<script>
export default {
  methods: {
    loginSignup() {
      window.location.href = "/signup"
      alert('Login/Signup button clicked');
    }
  }
}
</script>

<style scoped>
header {
  background-color: #3975e5;
  padding: 15px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-title {
  font-size: 24px;
  font-weight: bold;
}

.header-buttons {
  display: flex;
  gap: 10px;
}

button {
  padding: 10px 20px;
  background-color: #ffffff;
  color: #3975e5;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

button:hover {
  background-color: #f0f0f0; 
}
</style>
