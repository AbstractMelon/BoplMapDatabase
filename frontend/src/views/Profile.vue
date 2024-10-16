<template>
    <div class="profile">
        <header class="profile-header">
            <h1>{{ user.username }}</h1>
            <p class="join-date">Joined on: {{ user.accountCreationDate }}</p>
            <div v-if="isOwnProfile" class="settings-gear">
                <router-link to="/dashboard/settings">
                    <font-awesome-icon icon="cog" />
                </router-link>
            </div>
        </header>
        
        <section class="user-info">
            <h2>User Info</h2>
            <div class="bio">
                <p>This section is coming soon</p>
            </div>
        </section>

        <br>

        <section class="uploads-section">
            <h2>Uploaded Maps:</h2>
            <div class="map-list">
                <div v-if="uploadedMaps.length">
                    <MapCard v-for="map in uploadedMaps" :key="map.MapUUID" :map="map" />
                </div>
                <p v-else>No uploaded maps found.</p>
            </div>
        </section>

        <section class="maps-section">
            <h2>Liked Maps:</h2>
            <div class="map-list">
                <div v-if="likedMaps.length">
                    <div v-for="map in likedMaps" :key="map.MapUUID" class="map-card">
                        <h3>{{ map.MapName }}</h3>
                        <p>Developer: {{ map.MapDeveloper }}</p>
                        <button @click="downloadMap(map.MapUUID)">Download</button>
                    </div>
                </div>
                <p v-else>No liked maps found.</p>
            </div>
        </section>
    </div>
</template>


<script>
import userUtils from "../utils/user"; 
import MapCard from '../components/gallery/MapCard.vue';

export default {
    components: { MapCard },
    data() {
        return {
            user: {},
            likedMaps: [],
            uploadedMaps: [],
            allMaps: {},
            isOwnProfile: false,
        };
    },
    created() {
        const username = this.$route.params.username;
        this.fetchUserProfile(username);
        this.checkIfOwnProfile(username); 
    },
    methods: {
        async fetchUserProfile(username) {
            console.log(`Fetching user profile for username: ${username}`);

            try {
                const response = await fetch(`/api/user/${username}`);

                if (!response.ok) {
                    console.error(`HTTP error! Status: ${response.status}, Status Text: ${response.statusText}`);
                    throw new Error(`Failed to fetch user profile. HTTP status: ${response.status}`);
                }

                const userData = await response.json();
                this.user = userData || {};

                await this.fetchAllMaps();
                this.likedMaps = this.getMapsByUUIDs(this.user.likedMaps || []);
                this.uploadedMaps = this.getMapsByUUIDs(this.user.uploadedMapUUIDs || []);
                
            } catch (error) {
                console.error("Error fetching user profile:", error.message);
            }
        },
        async fetchAllMaps() {
            try {
                const response = await fetch('/api/maps');
                if (!response.ok) {
                    throw new Error(`Failed to fetch maps. HTTP status: ${response.status}`);
                }
                const maps = await response.json();
                this.allMaps = maps.reduce((acc, map) => {
                    acc[map.MapUUID] = map;
                    return acc;
                }, {});
            } catch (error) {
                console.error("Error fetching all maps:", error.message);
            }
        },
        async fetchLikedMaps(likedMapUUIDs) {
            const mapPromises = likedMapUUIDs.map(async (mapUUID) => {
                const response = await fetch(`/api/maps/${mapUUID}`);
                return await response.json();
            });
            return Promise.all(mapPromises);
        },
        getMapsByUUIDs(mapUUIDs) {
            return mapUUIDs.map(uuid => this.allMaps[uuid]).filter(map => map);
        },
        downloadMap(mapUUID) {
            window.location.href = `/api/maps/download/${mapUUID}`;
        },
        async checkIfOwnProfile(username) {
            try {
                // Await the promise to get the current user data
                const response = await userUtils.fetchUserData(); 
                const currentUser = response.user; // Access the user object

                // Log the current user and the username being checked
                console.log('Current user:', currentUser);
                console.log('Checking profile for username:', username);
                
                if (currentUser && currentUser.username) {
                    this.isOwnProfile = currentUser.username === username;
                    console.log('Is own profile:', this.isOwnProfile);
                } else {
                    console.warn('No current user found. Cannot determine if this is the own profile.');
                    this.isOwnProfile = false; 
                }
            } catch (error) {
                console.error('Error checking if own profile:', error);
                this.isOwnProfile = false;
            }
        }
    }
};
</script>


<style scoped>
.profile {
    padding: 20px;
    max-width: 1200px;
    margin: auto;
    background-color: var(--bgcol3);
    border-radius: 20px;
    width: 60%;
    margin-top: 40px;
    margin-bottom: 40px;
}

.profile-header {
    text-align: center;
    margin-bottom: 30px;
    border-radius: 20px;
}

.join-date {
    color: #ffffff;
}

.maps-section, .uploads-section {
    margin-bottom: 30px;
}

h2 {
    border-bottom: 2px solid var(--accent);
    padding-bottom: 5px;
    margin-bottom: 20px;
}

.map-list {
    display: flex;
    flex-wrap: wrap;
    gap: 15px;
}

.map-card {
    background-color: var(--bgcol2);
    padding: 15px;
    border-radius: 10px;
    width: 250px;
    height: 180px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    position: relative;
    transition: transform 0.2s;
}

.map-card:hover {
    transform: scale(1.05);
}

.map-card h3 {
    font-size: 18px;
    margin: 0 0 10px 0;
}

.map-card p {
    margin: 5px 0;
}

.map-card button {
    padding: 10px;
    background-color: var(--accent);
    color: var(--textcol);
    border: none;
    border-radius: 5px;
    cursor: pointer;
    width: 100%;
    position: absolute;
    bottom: 15px;
    left: 0;
    right: 0;
    margin: auto;
}

.map-card button:hover {
    background-color: #2f5dbb;
}

.settings-gear {
    position: absolute;
    top: 10px;
    right: 20px;
}

.settings-gear i {
    font-size: 24px;
    cursor: pointer;
    color: var(--accent);
    transition: transform 0.2s;
}

.settings-gear i:hover {
    transform: rotate(90deg);
}

</style>
