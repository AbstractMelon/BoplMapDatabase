<template>
    <div class="map-card">
        <a :href="`/maps/${map.MapUUID}`">
            <h2>{{ map.MapName }}</h2>
            <p><strong>Developer:</strong> {{ map.MapDeveloper }}</p>
            <p><strong>Type:</strong> {{ map.MapType }}</p>
            <p><strong>Description:</strong> {{ map.MapDescription }}</p>
            <!-- <p><strong>Date Created:</strong> {{ map.DateCreated }}</p>-->
            <button @click.stop="downloadMap">Download</button>
        </a>
    </div>
</template>

<script>
export default {
    props: ['map'],
    methods: {
        downloadMap() {
            window.location.href = `/api/download/${this.map.MapUUID}`;
        }
    }
}
</script>
