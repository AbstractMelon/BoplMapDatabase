<template>
    <div class="map-card" v-if="item">
        <img
            :src="imageUrl"
            alt="Item Image"
            class="map-image"
            @error="setFallbackImage"
        />
        <h2>{{ truncatedTitle }}</h2>
        <p v-if="getDeveloper">
            <strong>Developer: </strong>
            <a :href="`/profile/${getDeveloper}`" class="developer-link">{{
                getDeveloper
            }}</a>
        </p>
        <p v-if="item.Type || item.MapType">
            <strong>Type:</strong> {{ item.Type || item.MapType }}
        </p>
        <p v-if="truncatedDescription">
            <strong>Description:</strong> {{ truncatedDescription }}
        </p>
        <p v-if="getDownloadCount">
            <strong>Downloads:</strong> {{ getDownloadCount }}
        </p>
        <button @click.stop="downloadItem">
            {{
                getItemType() === 'Bundle' ? 'Download Bundle' : 'Download Map'
            }}
        </button>

        <!-- Display items from MapList -->
        <div v-if="Array.isArray(item.MapList) && item.MapList.length">
            <h3>Maps Included:</h3>
            <ul>
                <li v-for="mapId in item.MapList" :key="mapId">
                    {{ mapId }}
                    <!-- Display map ID -->
                </li>
            </ul>
        </div>
    </div>
    <div v-else>
        <p>Loading item details...</p>
    </div>
</template>

<script>
export default {
    props: ['item'],
    data() {
        return {
            fallbackImage: '/api/maps/assets/mods/placeholder',
            currentImage: '',
        };
    },
    computed: {
        truncatedTitle() {
            return (
                this.item.BundleName ||
                (this.item.MapName.length > 20
                    ? this.item.MapName.slice(0, 20) + '...'
                    : this.item.MapName)
            );
        },
        truncatedDescription() {
            if (!this.item) return '';
            const description =
                this.item.Description || this.item.MapDescription || '';
            return description.length > 75
                ? description.slice(0, 75) + '...'
                : description;
        },
        imageUrl() {
            return (
                this.currentImage ||
                this.item.Icon ||
                `/api/maps/assets/mods/${this.item.MapUUID}`
            );
        },
        getDeveloper() {
            return (
                this.item.Developer ||
                this.item.MapDeveloper ||
                'Unknown Developer'
            );
        },
        getDownloadCount() {
            return this.item.DownloadCount || this.item.downloadCount || 0;
        },
    },
    methods: {
        downloadItem() {
            const url = this.item.isBundle
                ? `/api/bundles/download/${this.item.BundleUUID}`
                : `/api/maps/download/${this.item.MapUUID}`;
            this.item.downloadCount = (this.item.downloadCount || 0) + 1; // Increment download count
            window.location.href = url;
        },
        setFallbackImage() {
            this.currentImage = this.fallbackImage;
        },
        getItemType() {
            return this.item.BundleName
                ? 'Bundle'
                : this.item.MapName
                ? 'Map'
                : 'Unknown';
        },
    },
    mounted() {
        this.currentImage = this.item?.Icon || this.fallbackImage;
    },
};
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
    width: 100%;
    height: auto;
    border-radius: 10px 10px 0 0;
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

.download-count {
    margin-top: 5px;
    font-weight: bold;
    color: var(--accent);
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
