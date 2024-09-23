<template>
    <header>
      <div class="header-title"><a href="/">Bopl Map Database</a></div>
      <button @click="$emit('toggle-upload-popup')">Upload Map</button>
    </header>
  </template>
  
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
  button {
    padding: 10px 20px;
    background-color: #ffffff;
    color: #3975e5;
    border: none;
    border-radius: 5px;
    cursor: pointer;
  }
  </style>
  