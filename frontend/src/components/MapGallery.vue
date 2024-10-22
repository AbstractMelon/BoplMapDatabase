<template>
    <div id="map-gallery">
        <div class="top-container" :class="{ hidden: showSections }">
            <div class="motw-container">
                <h2>Map of the Week</h2>
                <MapCard :item="motw" class="motw-card" />
            </div>
            <div class="side-container">
                <div class="handpicked">
                    <h2>Handpicked Maps</h2>
                    <div class="side-row">
                        <MapCard
                            v-for="item in handpickedMaps"
                            :key="item.MapUUID || item.BundleUUID"
                            :item="item"
                        />
                    </div>
                </div>
                <div class="featured">
                    <h2>Featured Maps</h2>
                    <div class="side-row">
                        <MapCard
                            v-for="item in featuredMaps"
                            :key="item.MapUUID || item.BundleUUID"
                            :item="item"
                        />
                    </div>
                </div>
            </div>
        </div>

        <transition name="slide">
            <div class="main-map-list">
                <h2>
                    Main List of
                    {{ currentView === 'maps' ? 'Maps' : 'Bundles' }}
                </h2>
                <div class="map-grid">
                    <MapCard
                        v-for="item in paginatedItems"
                        :key="item.MapUUID || item.BundleUUID"
                        :item="item"
                    />
                </div>

                <div class="pagination">
                    <button @click="prevPage" :disabled="currentPage === 1">
                        &#8592;
                    </button>
                    <span>Page {{ currentPage }} of {{ totalPages }}</span>
                    <button
                        @click="nextPage"
                        :disabled="currentPage === totalPages"
                    >
                        &#8594;
                    </button>
                </div>
            </div>
        </transition>
    </div>
</template>

<script>
import MapCard from './gallery/MapCard.vue';

export default {
    components: { MapCard },
    props: ['items', 'showSections', 'currentView'],
    data() {
        return {
            currentPage: 1,
            itemsPerRow: 5,
            rowsPerPage: 5,
        };
    },
    computed: {
        motw() {
            const motwItem = this.items.find(item => item.isMotw);
            if (!motwItem) {
                console.warn('Map of the Week not found');
            }
            return motwItem;
        },
        handpickedMaps() {
            const handpicked = this.filterMaps(item => item.isHandpicked);
            console.log('Handpicked Maps:', handpicked);
            return handpicked;
        },
        featuredMaps() {
            const featured = this.filterMaps(item => item.isFeatured);
            console.log('Featured Maps:', featured);
            return featured;
        },
        totalPages() {
            const totalItems = this.mainItems.length;
            return Math.ceil(
                totalItems / (this.itemsPerRow * this.rowsPerPage),
            );
        },
        mainItems() {
            const tempitems = this.items;
            JSON.stringify(tempitems);
            tempitems.forEach(item => {
                console.log(item);
            });
            console.log('Items in Items: ' + tempitems.length);
            return this.items;
        },
        paginatedItems() {
            const start =
                (this.currentPage - 1) * (this.itemsPerRow * this.rowsPerPage);
            return this.mainItems.slice(
                start,
                start + this.itemsPerRow * this.rowsPerPage,
            );
        },
    },
    methods: {
        nextPage() {
            if (this.currentPage < this.totalPages) {
                this.currentPage++;
                console.log(`Navigated to page ${this.currentPage}`);
            } else {
                console.warn('Already on the last page');
            }
        },
        prevPage() {
            if (this.currentPage > 1) {
                this.currentPage--;
                console.log(`Navigated to page ${this.currentPage}`);
            } else {
                console.warn('Already on the first page');
            }
        },
        filterMaps(predicate) {
            try {
                return this.items.filter(predicate);
            } catch (error) {
                console.error('Error filtering maps:', error);
                return [];
            }
        },
    },
};
</script>

<style scoped>
#map-gallery {
    display: flex;
    flex-direction: column;
    gap: 20px;
    padding: 20px;
}

.top-container {
    display: grid;
    grid-template-columns: 1fr;
    gap: 20px;
    overflow-x: scroll;
}

@media (min-width: 600px) {
    .top-container {
        grid-template-columns: 2fr 3fr;
    }
}

.motw-container {
    background-color: var(--bgcol3);
    padding: 15px;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    display: flex;
    flex-direction: column;
    justify-content: stretch;
    width: 600px;
}

.motw-container .motw-card {
    flex-grow: 1;
    width: 90%;
}

.side-container {
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.handpicked,
.featured {
    background-color: var(--bgcol3);
    padding: 15px;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.side-row {
    display: flex;
    overflow-x: auto;
    padding: 10px 0;
    gap: 20px;
}

.main-map-list {
    background-color: var(--bgcol3);
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.main-map-list .map-card {
    flex-grow: 0.2;
}

.map-grid {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    gap: 20px;
}

h2 {
    margin-bottom: 15px;
    color: var(--textcol);
}

.top-container.hidden {
    display: none;
}

.slide-enter-active,
.slide-leave-active {
    transition: all 0.5s ease;
}

.slide-enter,
.slide-leave-to {
    transform: translateY(-20px);
    opacity: 1;
}

.pagination {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 20px;
}

.pagination button {
    margin: 0 10px;
    padding: 5px 10px;
    cursor: pointer;
}

.pagination button:disabled {
    cursor: not-allowed;
    opacity: 0.5;
}
</style>
