<template>
    <header>
      <div class="header-title"><a href="/">Bopl Map Database</a></div>
      <div class="header-buttons">
        <button @click="$emit('toggle-upload-popup')">Upload Map</button>
        <button @click="handleAuthButton">{{ isLoggedIn ? username : 'Signup/Login' }}</button>
      </div>
    </header>
  </template>
  
  <script>
  import authUtils from '../../utils/auth'; 
  import userUtils from '../../utils/user'; 
  
  export default {
    data() {
      return {  
        isLoggedIn: false,
        username: null,
      };
    },  
    methods: {
      async handleAuthButton() {
        if (this.isLoggedIn) {
          window.location.href = "/dashboard";
        } else {
          window.location.href = "/signup";
        }
      },
      async checkLoginStatus() {
        this.isLoggedIn = await authUtils.isLoggedIn();
        if (this.isLoggedIn) {
          const userData = await userUtils.fetchUserData();
          this.username = userUtils.getUsername(userData);
        }
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
  