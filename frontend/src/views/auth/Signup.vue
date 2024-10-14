<template>
  <div class="auth-container">
    <div class="auth-form">
      <h2>Sign Up</h2>
      <div v-if="errorMessage" class="alert-box">
        <span class="close-btn" @click="closeAlert">&times;</span>
        {{ errorMessage }}
      </div>
      <form @submit.prevent="signup">
        <input v-model="username" placeholder="Username" required />
        <input type="password" v-model="password" placeholder="Password" required />
        <button type="submit">Sign Up</button>
      </form>
      <p class="info-message">Not logged in? <router-link to="/login">Go to Login</router-link></p>
    </div>
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
            // Collect error messages
            this.errorMessage = data.errors.map(error => `${error.msg}`).join(' ');
        }
        } catch (error) {
        this.errorMessage = 'Signup failed. Please try again.';
        }
    },
    closeAlert() {
        this.errorMessage = '';
    }
  }
}
</script>

<style scoped>
.auth-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 90vh;
  color: rgb(255, 255, 255);
}

.auth-form {
  background: rgb(35, 35, 35);
  padding: 1rem 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  width: 300px;
}

h2 {
  margin-bottom: 1.5rem;
  text-align: center;
}

input {
  width: 92.5%;
  padding: 10px;
  margin: 0.5rem 0;
  border: 1px solid #ccc;
  border-radius: 4px;
  transition: border-color 0.3s;
}

input:focus {
  border-color: #007bff;
  outline: none;
}

button {
  width: 100%;
  padding: 10px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

button:hover {
  background-color: #0056b3;
}

.alert-box {
  background-color: #ff4c4c;
  color: white;
  border: 2px solid #c62828;
  border-radius: 5px;
  padding: 1rem;
  margin-bottom: 1rem;
  position: relative;
  text-align: center;
}

.close-btn {
  position: absolute;
  top: 5px;
  right: 10px;
  cursor: pointer;
  font-size: 1.2rem;
}
.info-message {
  text-align: center;
  margin-top: 1rem;
  color: white;
}
</style>
