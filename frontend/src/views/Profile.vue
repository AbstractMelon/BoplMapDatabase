<template>
    <div class="profile">
        <header class="profile-header">
            <h1>{{ user.username }}</h1>
            <p class="join-date">Joined on: {{ user.accountCreationDate }}</p>
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
                    <div v-for="map in uploadedMaps" :key="map.MapUUID" class="map-card">
                        <h3>{{ map.MapName }}</h3>
                        <p>Developer: {{ map.MapDeveloper }}</p>
                        <button @click="downloadMap(map.MapUUID)">Download</button>
                    </div>
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
export default {
    data() {
        return {
            user: {},
            likedMaps: [],
            uploadedMaps: [],
            allMaps: {}
        };
    },
    created() {
        const username = this.$route.params.username; // Change userId to username
        this.fetchUserProfile(username);
    },
    methods: {
        async fetchUserProfile(username) {
            console.log(`Fetching user profile for username: ${username}`);

            try {
                const response = await fetch(`/api/users/${username}`); // Adjust the API endpoint

                if (!response.ok) {
                    console.error(`HTTP error! Status: ${response.status}, Status Text: ${response.statusText}`);
                    throw new Error(`Failed to fetch user profile. HTTP status: ${response.status}`);
                }

                const userData = await response.json();
                this.user = userData || {};

                // Fetch all maps first
                await this.fetchAllMaps();

                // Filter liked and uploaded maps using fetched maps
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
                    acc[map.MapUUID] = map; // Create a map of UUIDs to map objects
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
</style>
