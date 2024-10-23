<template>
    <div class="profile">
        <div v-if="isOwnProfile" class="settings-container">
            <p class="settings-message">
                This is your page! Click the settings button to edit it
            </p>
            <div class="settings-gear">
                <router-link to="/dashboard/settings">
                    <font-awesome-icon icon="cog" />
                </router-link>
            </div>
        </div>

        <header class="profile-header">
            <h1>{{ user.username }}</h1>
            <p class="join-date">Joined on: {{ formattedJoinDate }}</p>
        </header>

        <section class="user-info">
            <h2>User Info</h2>
            <div class="bio">
                <p>This section is coming soon</p>
            </div>
        </section>

        <br />

        <section class="uploads-section">
            <h2>Uploaded Maps:</h2>
            <div class="map-list">
                <div v-if="uploadedMaps.length">
                    <MapCard
                        v-for="map in uploadedMaps"
                        :key="map.MapUUID"
                        :map="map"
                    />
                </div>
                <p v-else>No uploaded maps found.</p>
            </div>
        </section>

        <section class="maps-section">
            <h2>Liked Maps:</h2>
            <div class="map-list">
                <div v-if="likedMaps.length">
                    <div
                        v-for="map in likedMaps"
                        :key="map.MapUUID"
                        class="map-card"
                    >
                        <h3>{{ map.MapName }}</h3>
                        <p>Developer: {{ map.MapDeveloper }}</p>
                        <button @click="downloadMap(map.MapUUID)">
                            Download
                        </button>
                    </div>
                </div>
                <p v-else>No liked maps found.</p>
            </div>
        </section>
    </div>
</template>

<script>
import userUtils from '../utils/user';
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
    computed: {
        formattedJoinDate() {
            const date = new Date(this.user.accountCreationDate);
            return date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
            });
        },
    },
    methods: {
        async fetchUserProfile(username) {
            console.log(`Fetching user profile for username: ${username}`);

            try {
                const response = await fetch(`/api/user/${username}`);

                if (!response.ok) {
                    console.error(
                        `HTTP error! Status: ${response.status}, Status Text: ${response.statusText}`,
                    );
                    throw new Error(
                        `Failed to fetch user profile. HTTP status: ${response.status}`,
                    );
                }

                const userData = await response.json();
                this.user = userData || {};

                await this.fetchAllMaps();
                this.likedMaps = this.getMapsByUUIDs(this.user.likedMaps || []);
                this.uploadedMaps = this.getMapsByUUIDs(
                    this.user.uploadedMapUUIDs || [],
                );
            } catch (error) {
                console.error('Error fetching user profile:', error.message);
            }
        },
        async fetchAllMaps() {
            try {
                const response = await fetch('/api/maps');
                if (!response.ok) {
                    throw new Error(
                        `Failed to fetch maps. HTTP status: ${response.status}`,
                    );
                }
                const maps = await response.json();
                this.allMaps = maps.reduce((acc, map) => {
                    acc[map.MapUUID] = map;
                    return acc;
                }, {});
            } catch (error) {
                console.error('Error fetching all maps:', error.message);
            }
        },
        async fetchLikedMaps(likedMapUUIDs) {
            const mapPromises = likedMapUUIDs.map(async mapUUID => {
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
                const response = await userUtils.fetchUserData();
                const currentUser = response.user;

                if (currentUser && currentUser.username) {
                    this.isOwnProfile = currentUser.username === username;
                } else {
                    this.isOwnProfile = false;
                }
            } catch (error) {
                console.error('Error checking if own profile:', error);
                this.isOwnProfile = false;
            }
        },
    },
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

.settings-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-radius: 5px;
    background-color: var(--bgcol4);
    padding: 10px 10px;
    margin-bottom: 20px;
}

.settings-message {
    font-size: 16px;
    color: var(--text-color);
}

.profile-header {
    text-align: center;
    margin-bottom: 10px;
    border-radius: 20px;
}

.join-date {
    color: #ffffff;
}

.settings-gear {
    text-align: right; /* Aligns the gear to the right */
}

.maps-section,
.uploads-section {
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
    flex-direction: row;
}

.settings-gear i {
    font-size: 48px;
    cursor: pointer;
    color: var(--accent);
    transition: transform 0.2s;
}

.settings-gear i:hover {
    transform: rotate(90deg);
}
</style>
