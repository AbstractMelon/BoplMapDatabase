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

        <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>
    </div>
</template>

<script>
import MapGallery from '../components/MapGallery.vue';
export default {
    components: { MapGallery },
    data() {
        return {
            maps: [],
            bundles: [],
            filteredItems: [],
            currentView: 'maps',
            searchParams: { name: '', developer: '', type: '', date: '' },
            sortBy: 'mostRecent',
            uploadPopupVisible: false,
            errorMessage: null,
        };
    },
    computed: {
        hasActiveSearch() {
            return (
                Object.values(this.searchParams).some(param => param) ||
                this.sortBy !== 'mostRecent' ||
                this.currentView !== 'maps'
            );
        },
    },
    methods: {
        toText(value) {
            return (value ?? '').toString().toLowerCase();
        },
        getItemDate(item) {
            return (
                item.DateCreated ||
                item.MapDateCreated ||
                item.CreatedAt ||
                item.createdAt ||
                ''
            );
        },
        getItemDownloadCount(item) {
            return Number(
                item.downloadCount ||
                    item.DownloadCount ||
                    item.BundleDownloadCount ||
                    0,
            );
        },
        async fetchData(endpoint, key) {
            try {
                const response = await fetch(endpoint);
                if (!response.ok)
                    throw new Error(
                        `Error fetching ${key}: ${response.statusText}`,
                    );
                const data = await response.json();
                console.log(
                    `${key.charAt(0).toUpperCase() + key.slice(1)} data:`,
                    data,
                );
                this[key] = data;
                this.updateFilteredItems();
                console.log(
                    `${
                        key.charAt(0).toUpperCase() + key.slice(1)
                    } fetched successfully`,
                    this[key],
                );
            } catch (error) {
                this.errorMessage = error.message;
                console.error(`Fetch ${key} error:`, error);
            }
        },
        async fetchMaps() {
            await this.fetchData('/api/maps', 'maps');
        },
        async fetchBundles() {
            await this.fetchData('/api/bundles', 'bundles');
        },
        updateFilteredItems() {
            try {
                const source =
                    this.currentView === 'maps' ? this.maps : this.bundles;

                if (!Array.isArray(source)) {
                    console.error('Source is not an array:', source);
                    throw new Error('Invalid source type');
                }

                const params = {
                    name: this.toText(this.searchParams.name).trim(),
                    developer: this.toText(this.searchParams.developer).trim(),
                    type: this.toText(this.searchParams.type).trim(),
                    date: this.toText(this.searchParams.date).trim(),
                };

                const hasSearch = Object.values(params).some(Boolean);

                const filtered = hasSearch
                    ? source.filter(item => {
                          const name = this.toText(
                              item.MapName || item.BundleName || item.Name,
                          );
                          const developer = this.toText(
                              item.MapDeveloper || item.Developer || item.Author,
                          );
                          const type = this.toText(
                              item.MapType || item.Type || item.BundleType,
                          );
                          const date = this.toText(this.getItemDate(item));

                          return (
                              (!params.name || name.includes(params.name)) &&
                              (!params.developer ||
                                  developer.includes(params.developer)) &&
                              (!params.type || type.includes(params.type)) &&
                              (!params.date || date.includes(params.date))
                          );
                      })
                    : [...source];

                filtered.sort((a, b) => {
                    const dateA = new Date(this.getItemDate(a)).getTime() || 0;
                    const dateB = new Date(this.getItemDate(b)).getTime() || 0;
                    const downloadsA = this.getItemDownloadCount(a);
                    const downloadsB = this.getItemDownloadCount(b);

                    switch (this.sortBy) {
                        case 'mostDownloaded':
                            return downloadsB - downloadsA || dateB - dateA;
                        case 'oldest':
                            return dateA - dateB;
                        case 'mostRecent':
                        default:
                            return dateB - dateA;
                    }
                });

                this.filteredItems = filtered;
            } catch (error) {
                console.error('Error updating filtered items:', error);
                this.filteredItems = []; // Set filteredItems to empty on failure
            }
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
    max-width: 100%;
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
    max-width: 100%;
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
.error-message {
    color: red;
    text-align: center;
    margin-top: 10px;
}
</style>