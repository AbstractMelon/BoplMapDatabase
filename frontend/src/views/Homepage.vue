<template>
    <div>
        <div class="toggle-wrapper">
            <div class="toggle-container">
                <button
                    @click="toggleView('maps')"
                    :class="{ active: currentView === 'maps' }"
                >
                    Maps
                </button>
                <button
                    @click="toggleView('bundles')"
                    :class="{ active: currentView === 'bundles' }"
                >
                    Bundles
                </button>
            </div>
        </div>

        <div class="search-container">
            <div class="search-bar">
                <input
                    v-model="searchParams.name"
                    placeholder="Search by Name..."
                    @input="onSearch"
                />
                <input
                    v-model="searchParams.developer"
                    placeholder="Search by Developer..."
                    @input="onSearch"
                />
                <input
                    v-model="searchParams.type"
                    placeholder="Search by Type..."
                    @input="onSearch"
                />
                <!-- <input v-model="searchParams.date" type="date" @input="onSearch" /> -->

                <label for="sort" class="sort-label">Sort by:</label>
                <select
                    v-model="sortBy"
                    @change="onSearch"
                    class="sort-dropdown"
                >
                    <option value="mostRecent">Most Recent</option>
                    <option value="mostDownloaded">Most Downloaded</option>
                    <option value="oldest">Oldest</option>
                </select>

                <button @click="clearFilters">Clear Filters</button>
            </div>
        </div>

        <MapGallery
            :items="filteredItems"
            :showSections="hasActiveSearch"
            :currentView="currentView"
        />
    </div>
</template>

<script>
import MapGallery from '../components/MapGallery.vue';

export default {
    components: { MapGallery },
    data() {
        return {
            maps: [],
            bundles: [], // New data property for bundles
            filteredItems: [],
            currentView: 'maps', // Default view
            searchParams: {
                name: '',
                developer: '',
                type: '',
                date: '',
            },
            sortBy: 'mostRecent',
            uploadPopupVisible: false,
        };
    },
    computed: {
        hasActiveSearch() {
            return (
                Object.values(this.searchParams).some(param => param) ||
                this.sortBy !== 'mostRecent' ||
                this.currentView != 'maps'
            );
        },
    },
    methods: {
        async fetchMaps() {
            const response = await fetch('/api/maps');
            this.maps = await response.json();
            this.updateFilteredItems();
        },
        async fetchBundles() {
            const response = await fetch('/api/bundles');
            this.bundles = await response.json();
            this.updateFilteredItems();
        },
        updateFilteredItems() {
            const source =
                this.currentView === 'maps' ? this.maps : this.bundles;
            this.filteredItems = source
                .map(item => {
                    let score = 0;

                    // Scoring logic for maps and bundles
                    if (
                        this.searchParams.name &&
                        item.MapName.toLowerCase().includes(
                            this.searchParams.name.toLowerCase(),
                        )
                    ) {
                        score +=
                            item.MapName.toLowerCase() ===
                            this.searchParams.name.toLowerCase()
                                ? 2
                                : 1;
                    }
                    if (
                        this.searchParams.developer &&
                        item.MapDeveloper.toLowerCase().includes(
                            this.searchParams.developer.toLowerCase(),
                        )
                    ) {
                        score +=
                            item.MapDeveloper.toLowerCase() ===
                            this.searchParams.developer.toLowerCase()
                                ? 2
                                : 1;
                    }
                    if (
                        this.searchParams.type &&
                        item.MapType.toLowerCase().includes(
                            this.searchParams.type.toLowerCase(),
                        )
                    ) {
                        score +=
                            item.MapType.toLowerCase() ===
                            this.searchParams.type.toLowerCase()
                                ? 2
                                : 1;
                    }
                    if (
                        this.searchParams.date &&
                        item.DateCreated.startsWith(this.searchParams.date)
                    ) {
                        score += 2;
                    }

                    return { ...item, relevanceScore: score };
                })
                .sort((a, b) => b.relevanceScore - a.relevanceScore)

                .sort((a, b) => {
                    switch (this.sortBy) {
                        case 'mostRecent':
                            return (
                                new Date(b.DateCreated) -
                                new Date(a.DateCreated)
                            );
                        case 'mostDownloaded':
                            return b.downloadCount - a.downloadCount;
                        case 'oldest':
                            return (
                                new Date(a.DateCreated) -
                                new Date(b.DateCreated)
                            );
                        default:
                            return 0;
                    }
                });
        },
        clearFilters() {
            this.searchParams = { name: '', developer: '', type: '', date: '' };
            this.updateFilteredItems();
        },
        onSearch() {
            this.updateFilteredItems();
        },
        toggleView(view) {
            this.currentView = view;
            this.updateFilteredItems();
        },
        showUploadPopup() {
            console.log('Upload popup triggered');
            this.uploadPopupVisible = true;
        },
        closeUploadPopup() {
            this.uploadPopupVisible = false;
        },
    },
    mounted() {
        this.fetchMaps();
        this.fetchBundles();
    },
};
</script>

<style scoped>
.toggle-wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
    height: fit-content;
    max-width: 95%;
    margin: auto;
    padding: 20px;
    background-color: var(--bgcol3);
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
    margin-bottom: 20px;
    border-radius: 10px;
    margin-top: 20px;
}

.toggle-container {
    display: flex;
    justify-content: center;
    width: 90%;
}

.toggle-container button {
    margin: 0 10px;
    padding: 12px 20px;
    border: none;
    border-radius: 20px;
    background-color: var(--inactiveColor);
    color: white;
    font-weight: bold;
    font-size: 24px;
    cursor: pointer;
    transition: background-color 0.3s, transform 0.2s;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.15);
}

.toggle-container button:hover {
    transform: scale(1.05);
}

.toggle-container button.active {
    background: linear-gradient(
        90deg,
        var(--activeColor),
        var(--activeColorDark)
    );
    color: white;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
}

.search-container {
    background-color: var(--bgcol3);
    padding: 5px;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    max-width: 97%;
    margin: auto;
    margin-top: 20px;
    align-content: top;
}

.search-bar {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
    margin: 10px;
}

.search-bar input,
.search-bar button,
.search-bar select {
    padding: 10px;
    font-size: 1em;
    border: 1px solid var(--textcol);
    border-radius: 5px;
    background-color: var(--bgcol2);
    color: var(--textcol);
    width: 100%;
    max-width: 300px;
}

.search-bar input::placeholder,
.search-bar button {
    color: #999;
}

.sort-label {
    margin-bottom: 5px; /* Adjusts space above the dropdown */
}

.sort-dropdown {
    padding: 10px;
    font-size: 1em;
    border: 1px solid var(--textcol);
    border-radius: 5px;
    background-color: var(--bgcol2);
    color: var(--textcol);
    width: 100%;
    max-width: 300px;
}

@media (min-width: 768px) {
    .search-bar {
        flex-direction: row;
    }

    .search-bar input,
    .search-bar button,
    .search-bar select {
        max-width: initial;
    }
}
</style>
