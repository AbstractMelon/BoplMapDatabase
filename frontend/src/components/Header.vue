<template>
    <header>
      <div class="header-title"><a href="/">Bopl Map Database</a></div>
      <div class="header-buttons">
        <button @click="$emit('toggle-upload-popup')">Upload Map</button>
        <button @click="handleAuthButton">{{ isLoggedIn ? 'Dashboard' : 'Signup/Login' }}</button>
      </div>
    </header>
  </template>
  
  <script>
  export default {
    data() {
      return {
        isLoggedIn: false, 
      };
    },
    methods: {
      handleAuthButton() {
        if (this.isLoggedIn) {
          window.location.href = "/dashboard";
        } else {
          window.location.href = "/signup";
        }
      },
      checkLoginStatus() {
        const token = document.cookie
          .split('; ')
          .find(row => row.startsWith('token='));
        this.isLoggedIn = !!token;
      }
    },
    created() {
      this.checkLoginStatus(); 
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
  