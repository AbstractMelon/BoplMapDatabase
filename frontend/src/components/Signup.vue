<template>
    <div class="auth-form">
      <h2>Sign Up</h2>
      <form @submit.prevent="signup">
        <input v-model="username" placeholder="Username" required />
        <input type="password" v-model="password" placeholder="Password" required />
        <button type="submit">Sign Up</button>
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
      async signup() {
        try {
          const response = await fetch('/api/signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: this.username, password: this.password })
          });
          const data = await response.json();
          if (response.ok) {
            this.$router.push('/login');
          } else {
            this.errorMessage = data.message;
          }
        } catch (error) {
          this.errorMessage = 'Signup failed. Please try again.';
        }
      }
    }
  }
  </script>
  