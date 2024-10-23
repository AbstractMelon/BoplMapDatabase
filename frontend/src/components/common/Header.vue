<template>
    <header>
        <div class="header-title"><a href="/">Bopl Map Database</a></div>
        <div class="header-buttons">
            <button @click="$emit('toggle-upload-popup')">Upload Map</button>
            <button @click="handleAuthButton">
                {{ isLoggedIn ? username : 'Signup/Login' }}
            </button>
        </div>
        <div class="hamburger" @click="toggleDropdown">
            &#9776;
            <!-- Hamburger icon -->
        </div>
        <div v-if="dropdownVisible" class="dropdown">
            <button @click="$emit('toggle-upload-popup')">Upload Map</button>
            <button @click="handleAuthButton">
                {{ isLoggedIn ? username : 'Signup/Login' }}
            </button>
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
            dropdownVisible: false,
        };
    },
    methods: {
        async handleAuthButton() {
            if (this.isLoggedIn) {
                window.location.href = `/profile/${this.username}`;
            } else {
                window.location.href = '/signup';
            }
        },
        toggleDropdown() {
            this.dropdownVisible = !this.dropdownVisible;
        },
        async checkLoginStatus() {
            this.isLoggedIn = await authUtils.isLoggedIn();
            if (this.isLoggedIn) {
                const userData = await userUtils.fetchUserData();
                this.username = userUtils.getUsername(userData);
            }
        },
    },
    created() {
        this.checkLoginStatus();
    },
};
</script>

<style scoped>
header {
    background-color: #3975e5;
    padding: 15px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: relative; /* To position the dropdown */
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

.hamburger {
    display: none; /* Hidden by default */
    font-size: 24px;
    cursor: pointer;
}

.dropdown {
    position: absolute;
    top: 60px; /* Adjust based on header height */
    right: 15px; /* Align dropdown to the right */
    background-color: white;
    border: 1px solid #ddd;
    border-radius: 5px;
    z-index: 1;
    display: flex;
    flex-direction: column;
    gap: 5px;
}

.dropdown button {
    width: 100%; /* Full width for dropdown buttons */
}

@media (max-width: 768px) {
    .header-buttons {
        display: none; /* Hide regular buttons on mobile */
    }

    .hamburger {
        display: block; /* Show hamburger on mobile */
    }
}
</style>
