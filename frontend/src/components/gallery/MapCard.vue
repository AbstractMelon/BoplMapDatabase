<template>
    <div class="map-card" v-if="map">
        <img 
            :src="imageUrl" 
            alt="Map Image" 
            class="map-image" 
            @error="setFallbackImage"
        />
        <h2>{{ truncatedTitle }}</h2>
        <p>
            <strong>Developer: </strong>
            <a :href="`/profile/${map.MapDeveloper}`" class="developer-link">{{ map.MapDeveloper }}</a>
        </p>
        <p><strong>Type:</strong> {{ map.MapType }}</p>
        <p><strong>Description:</strong> {{ truncatedDescription }}</p>
        <button @click.stop="downloadMap">Download</button>
    </div>
    <div v-else>
        <p>Loading map details...</p>
    </div>
</template>

<script>
export default {
    props: ['map'],
    data() {
        return {
            fallbackImage: '/api/assets/mods/placeholder', 
            currentImage: ''
        };
    },
    computed: {
        truncatedTitle() {
            return this.map.MapName.length > 20 
                ? this.map.MapName.slice(0, 20) + '...' 
                : this.map.MapName;
        },
        truncatedDescription() {
            return this.map.MapDescription.length > 75 
                ? this.map.MapDescription.slice(0, 75) + '...' 
                : this.map.MapDescription;
        },
        imageUrl() {
            return this.currentImage || `/api/assets/mods/${this.map.MapUUID}`;
        }
    },
    methods: {
        downloadMap() {
            window.location.href = `/api/maps/download/${this.map.MapUUID}`;
        },
        setFallbackImage() {
            this.currentImage = this.fallbackImage;
        }
    },
    mounted() {
    if (this.map) {
        this.currentImage = `/api/assets/mods/${this.map.MapUUID}`;
    } else {
        this.currentImage = this.fallbackImage; 
    }
}
}
</script>

<style scoped>
.map-card {
    background-color: var(--bgcol2);
    padding: 15px;
    border-radius: 10px;
    width: 250px;
    height: auto; 
    padding-bottom: 75px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    position: relative;
    transition: transform 0.2s;
}

.map-image {
    width: 100%; /* Makes image responsive */
    height: auto; /* Keeps aspect ratio */
    border-radius: 10px 10px 0 0; /* Rounds top corners */
    margin-bottom: 10px;
}

.map-card:hover {
    transform: scale(1.05);
}

.map-card h2 {
    font-size: 18px;
    margin: 0;
    margin-bottom: 10px;
}

.map-card p {
    margin: 5px 0;
}

.map-card button {
    padding: 10px;
    background-color: var(--accent);
    color: var(--textcol2);
    border: none;
    border-radius: 5px;
    cursor: pointer;
    width: 90%;
    position: absolute;
    bottom: 15px;
    left: 0;
    right: 0;
    margin: auto;
}

.map-card button:hover {
    background-color: #2f5dbb;
}

.developer-link {
    color: var(--link-color); 
    text-decoration: none;
}

.developer-link:hover {
    text-decoration: underline; 
}
</style>
