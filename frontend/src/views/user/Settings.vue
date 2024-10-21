<template>
  <div class="settings-container">
    <header>
      <h1>User Settings</h1>
      <button @click="logout">Logout</button>
    </header>
    <div class="form-section">
      <h2>Change Theme</h2>
      <select v-model="selectedTheme" @change="changeTheme">
        <option v-for="theme in themes" :key="theme" :value="theme">
          {{ theme }}
        </option>
      </select>
    </div>

    <div class="form-section">
      <h2>Change Username</h2>
      <input type="text" v-model="newUsername" placeholder="New Username" />
      <button @click="updateUsername">Update Username</button>
    </div>

    <div class="form-section">
      <h2>Change Password</h2>
      <input type="password" v-model="newPassword" placeholder="New Password" />
      <button @click="updatePassword">Update Password</button>
    </div>

    <div class="form-section">
      <h2>Logout of All Accounts</h2>
      <button @click="logoutAll">Logout from All</button>
    </div>
  </div>
</template>

<script>
//import authUtils from "../utils/auth";

export default {
  data() {
    return {
      selectedTheme: 'Dark',
      themes: ['Dark', 'Light'],
      newUsername: '',
      newPassword: '',
    };
  },
  methods: {
    async changeTheme() {
      if (this.selectedTheme === 'Dark') {
        document.body.classList.add('dark-theme');
      } else {
        document.body.classList.remove('dark-theme');
      }
    },
    async updateUsername() {
      try {
        await this.$http.put(`/api/admin/users/${this.$store.state.username}`, {
          username: this.newUsername,
        });
        alert('Username updated successfully!');
      } catch (error) {
        console.error(error);
        alert('Failed to update username.');
      }
    },
    async updatePassword() {
      try {
        await this.$http.put(`/api/admin/users/${this.$store.state.username}`, {
          password: this.newPassword,
        });
        alert('Password updated successfully!');
      } catch (error) {
        console.error(error);
        alert('Failed to update password.');
      }
    },
    async logout() {
      await this.$http.post('/api/logout');
      this.$router.push('/login');
    },
    async logoutAll() {
      await this.$http.post('/api/logout/all');
      this.$router.push('/login');
    },
  },
  mounted() {
    this.changeTheme();
  },
};
</script>

<style scoped>
.settings-container {
  padding: 20px;
  background-color: var(--bgcol);
  color: var(--textcol);
}

header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.form-section {
  margin: 20px 0;
}

button {
  padding: 10px;
  background-color: var(--accent);
  color: var(--textcol);
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

button:hover {
  background-color: #2f5dbb;
}
</style>
