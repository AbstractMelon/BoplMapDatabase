<template>
    <div class="auth-form">
      <h2>Login</h2>
      <form @submit.prevent="login">
        <input v-model="username" placeholder="Username" required />
        <input type="password" v-model="password" placeholder="Password" required />
        <button type="submit">Login</button>
      </form>
      <p v-if="errorMessage">{{ errorMessage }}</p>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        username: '',
        password: '',
        errorMessage: ''
      };
    },
    methods: {
      async login() {
        try {
          const response = await fetch('/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: this.username, password: this.password })
          });
          const data = await response.json();
          if (response.ok) {
            this.$router.push('/');
          } else {
            this.errorMessage = data.message;
          }
        } catch (error) {
          this.errorMessage = 'Login failed. Please try again.';
        }
      }
    }
  }
  </script>
  