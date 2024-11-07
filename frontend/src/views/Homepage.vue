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

                console.log('Current View:', this.currentView);
                console.log('Source items before filtering:', source);

                // Validate source
                if (!Array.isArray(source)) {
                    console.error('Source is not an array:', source);
                    throw new Error('Invalid source type');
                }

                // Check if there are search parameters
                if (Object.keys(this.searchParams).length === 0) {
                    console.log('test');
                    this.filteredItems.sort((a, b) => {
                                switch (this.sortBy) {
                                    case 'mostRecent':
                                        const dateBRecent = new Date(b.DateCreated).getTime();
                                        const dateARecent = new Date(a.DateCreated).getTime();
                                        if (isNaN(dateBRecent) || isNaN(dateARecent)) {
                                            console.warn(
                                                'Invalid Date in sorting',
                                                { b, a },
                                            );
                                            return 0; // Return zero if invalid date
                                        }
                                        return dateBRecent - dateARecent;

                                    case 'mostDownloaded':
                                        // Sorting by download count (descending order)
                                        return b.downloadCount - a.downloadCount;

                                    case 'oldest':
                                        const dateBOldest = new Date(
                                            b.DateCreated,
                                        ).getTime();
                                        const dateAOldest = new Date(
                                            a.DateCreated,
                                        ).getTime();
                                        if (
                                            isNaN(dateBOldest) ||
                                            isNaN(dateAOldest)
                                        ) {
                                            console.warn(
                                                'Invalid Date in sorting',
                                                { b, a },
                                            );
                                            return 0; // Return zero if invalid date
                                        }
                                        return dateAOldest - dateBOldest;

                                    default:
                                        console.warn(
                                            'Unknown sort criteria:',
                                            this.sortBy,
                                        );
                                        return 0; // Default case (no sorting)
                                }
                            });
                } else {
                    this.filteredItems = source
                        .map(item => {
                            try {
                                const relevanceScore = [
                                    'name',
                                    'developer',
                                    'type',
                                    'date',
                                ].reduce((score, key) => {
                                    if (this.searchParams[key]) {
                                        const value =
                                            item[
                                                `Map${
                                                    key
                                                        .charAt(0)
                                                        .toUpperCase() +
                                                    key.slice(1)
                                                }`
                                            ]?.toLowerCase() || '';
                                        const param =
                                            this.searchParams[
                                                key
                                            ].toLowerCase();
                                        if (value.includes(param)) {
                                            score += value === param ? 2 : 1;
                                        }
                                    }
                                    return score;
                                }, 0);

                                return { ...item, relevanceScore };
                            } catch (itemError) {
                                console.error(
                                    'Error processing item:',
                                    item,
                                    itemError,
                                );
                                return { ...item, relevanceScore: 0 }; // Return item with zero relevance on error
                            }
                        })
                        .filter(item => item.relevanceScore > 0); // Filter items with relevanceScore > 0

                    // Check if no items were filtered
                    if (this.filteredItems.length === 0) {
                        console.log(
                            'No items matched the search parameters. Returning all items.',
                        );
                        this.filteredItems.sort((a, b) => {
                                switch (this.sortBy) {
                                    case 'mostRecent':
                                        const dateBRecent = new Date(b.DateCreated).getTime();
                                        const dateARecent = new Date(a.DateCreated).getTime();
                                        if (isNaN(dateBRecent) || isNaN(dateARecent)) {
                                            console.warn(
                                                'Invalid Date in sorting',
                                                { b, a },
                                            );
                                            return 0; // Return zero if invalid date
                                        }
                                        return dateBRecent - dateARecent;

                                    case 'mostDownloaded':
                                        // Sorting by download count (descending order)
                                        return b.downloadCount - a.downloadCount;

                                    case 'oldest':
                                        const dateBOldest = new Date(
                                            b.DateCreated,
                                        ).getTime();
                                        const dateAOldest = new Date(
                                            a.DateCreated,
                                        ).getTime();
                                        if (
                                            isNaN(dateBOldest) ||
                                            isNaN(dateAOldest)
                                        ) {
                                            console.warn(
                                                'Invalid Date in sorting',
                                                { b, a },
                                            );
                                            return 0; // Return zero if invalid date
                                        }
                                        return dateAOldest - dateBOldest;

                                    default:
                                        console.warn(
                                            'Unknown sort criteria:',
                                            this.sortBy,
                                        );
                                        return 0; // Default case (no sorting)
                                }
                            });
                    } else {
                        // Sort the filtered items
                        this.filteredItems.sort((a, b) => {
                            try {
                                // First sort by relevance score
                                const scoreDifference =
                                    b.relevanceScore - a.relevanceScore;
                                if (scoreDifference !== 0)
                                    return scoreDifference;

                                // If scores are equal, sort by the selected criteria
                                switch (this.sortBy) {
                                    case 'mostRecent':
                                        const dateBRecent = new Date(
                                            b.DateCreated,
                                        ).getTime();
                                        const dateARecent = new Date(
                                            a.DateCreated,
                                        ).getTime();
                                        if (
                                            isNaN(dateBRecent) ||
                                            isNaN(dateARecent)
                                        ) {
                                            console.warn(
                                                'Invalid Date in sorting',
                                                { b, a },
                                            );
                                            return 0; // Return zero if invalid date
                                        }
                                        return dateBRecent - dateARecent;

                                    case 'mostDownloaded':
                                        // Sorting by download count (descending order)
                                        return (
                                            b.downloadCount - a.downloadCount
                                        );

                                    case 'oldest':
                                        const dateBOldest = new Date(
                                            b.DateCreated,
                                        ).getTime();
                                        const dateAOldest = new Date(
                                            a.DateCreated,
                                        ).getTime();
                                        if (
                                            isNaN(dateBOldest) ||
                                            isNaN(dateAOldest)
                                        ) {
                                            console.warn(
                                                'Invalid Date in sorting',
                                                { b, a },
                                            );
                                            return 0; // Return zero if invalid date
                                        }
                                        return dateAOldest - dateBOldest;

                                    default:
                                        console.warn(
                                            'Unknown sort criteria:',
                                            this.sortBy,
                                        );
                                        return 0; // Default case (no sorting)
                                }
                            } catch (sortError) {
                                console.error(
                                    'Error during sorting:',
                                    sortError,
                                );
                                return 0; // Return zero if sorting fails
                            }
                        });
                    }
                }

                console.log('Filtered items:', this.filteredItems);
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
.error-message {
    color: red;
    text-align: center;
    margin-top: 10px;
}
</style>
