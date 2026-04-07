<template>
    <div v-if="show" class="popup">
        <div class="popup-content">
            <div class="popup-header">
                <h2>{{ isMapUpload ? 'Upload a New Map' : 'Create a Bundle' }}</h2>
                <p>
                    {{
                        isMapUpload
                            ? 'Preview the archive before you upload it.'
                            : 'Bundle maps together from the current library.'
                    }}
                </p>
            </div>

            <div class="upload-type-toggle">
                <button
                    :class="{ active: isMapUpload }"
                    @click="isMapUpload = true"
                    aria-label="Upload a New Map"
                >
                    Upload a New Map
                </button>
                <button
                    :class="{ active: !isMapUpload }"
                    @click="isMapUpload = false"
                    aria-label="Create a Bundle"
                >
                    Create a Bundle
                </button>
            </div>

            <!-- Map Upload Form -->
            <form v-if="isMapUpload" @submit.prevent="uploadMap">
                <label class="file-label">
                    <input
                        type="file"
                        ref="fileInput"
                        accept=".zip,.rar"
                        required
                        aria-label="Select Map File"
                        @change="handleFileChange"
                    />
                </label>

                <div class="preview-card" v-if="filePreview || selectedFileName">
                    <MapCard :item="previewCardItem" previewMode />
                </div>

                <div class="form-actions">
                    <button type="submit" class="primary-action">Upload Map</button>
                    <button type="button" class="secondary-action" @click="close">
                        Close
                    </button>
                </div>
            </form>

            <!-- Bundle Upload Form -->
            <form v-else @submit.prevent="uploadBundle">
                <div class="bundle-creator">
                    <label for="bundleName">Bundle Name:</label>
                    <input
                        type="text"
                        v-model="bundleName"
                        placeholder="Enter Bundle Name"
                        required
                    />

                    <label for="mapSearch">Search Maps:</label>
                    <input
                        type="text"
                        v-model="mapSearch"
                        placeholder="Search..."
                        @input="filterMaps"
                    />

                    <fieldset>
                        <legend>Select Maps for Bundle:</legend>
                        <div
                            v-for="map in paginatedMaps"
                            :key="map.MapUUID"
                            class="map-checkbox"
                        >
                            <input
                                type="checkbox"
                                :value="map.MapUUID"
                                v-model="selectedMaps"
                                aria-label="Select Map"
                            />
                            <span>{{ map.MapName }}</span>
                        </div>
                    </fieldset>

                    <div class="pagination">
                        <button
                            type="button"
                            @click="prevPage"
                            :disabled="currentPage === 1"
                        >
                            Previous
                        </button>
                        <p>Page {{ currentPage }} of {{ totalPages }}</p>
                        <button
                            type="button"
                            @click="nextPage"
                            :disabled="currentPage === totalPages"
                        >
                            Next
                        </button>
                    </div>
                </div>
                <div class="form-actions">
                    <button type="submit" class="primary-action">Create Bundle</button>
                    <button type="button" class="secondary-action" @click="close">
                        Close
                    </button>
                </div>
            </form>

            <div v-if="isLoading" class="loading-spinner">Loading...</div>
        </div>
    </div>
</template>

<script>
import JSZip from 'jszip';
import MapCard from './gallery/MapCard.vue';

export default {
    components: { MapCard },
    emits: ['upload-success'],
    props: ['show', 'close'],
    data() {
        return {
            isMapUpload: true,
            bundleName: '',
            availableMaps: [],
            filteredMaps: [],
            selectedMaps: [],
            isLoading: false,
            mapSearch: '',
            currentPage: 1,
            itemsPerPage: 10,
            selectedFileName: '',
            selectedFileSize: '',
            filePreview: '',
            previewStatus: 'Select a zip file to preview its image.',
            previewObjectUrl: '',
        };
    },
    computed: {
        totalPages() {
            return Math.ceil(this.filteredMaps.length / this.itemsPerPage);
        },
        paginatedMaps() {
            const start = (this.currentPage - 1) * this.itemsPerPage;
            const end = start + this.itemsPerPage;
            return this.filteredMaps.slice(start, end);
        },
        previewCardItem() {
            return {
                MapUUID: 'upload-preview',
                MapName: this.selectedFileName || 'Selected file',
                MapDeveloper: 'Upload Preview',
                MapType: 'Archive',
                MapDescription: this.previewStatus,
                downloadCount: 0,
                LuaMap: false,
                Icon: this.filePreview || '/api/maps/assets/mods/placeholder',
            };
        },
    },
    mounted() {
        this.fetchMaps();
    },
    beforeUnmount() {
        this.revokePreviewUrl();
    },
    methods: {
        revokePreviewUrl() {
            if (this.previewObjectUrl) {
                URL.revokeObjectURL(this.previewObjectUrl);
                this.previewObjectUrl = '';
            }
        },
        formatFileSize(bytes) {
            if (!bytes && bytes !== 0) return '';
            const units = ['B', 'KB', 'MB', 'GB'];
            let size = bytes;
            let index = 0;

            while (size >= 1024 && index < units.length - 1) {
                size /= 1024;
                index++;
            }

            return `${size.toFixed(size >= 10 || index === 0 ? 0 : 1)} ${units[index]}`;
        },
        async handleFileChange(event) {
            const file = event.target.files && event.target.files[0];

            this.revokePreviewUrl();
            this.filePreview = '';
            this.previewStatus = 'Select a zip file to preview its image.';

            if (!file) {
                this.selectedFileName = '';
                this.selectedFileSize = '';
                return;
            }

            this.selectedFileName = file.name;
            this.selectedFileSize = this.formatFileSize(file.size);

            const fileName = file.name.toLowerCase();
            if (!fileName.endsWith('.zip')) {
                this.previewStatus = 'Preview is available for zip uploads.';
                return;
            }

            try {
                const zip = await JSZip.loadAsync(file);
                const imageEntry = Object.values(zip.files).find(zipFile => {
                    const lowerName = zipFile.name.toLowerCase();
                    return (
                        !zipFile.dir &&
                        (lowerName.endsWith('.png') ||
                            lowerName.endsWith('.jpg') ||
                            lowerName.endsWith('.jpeg') ||
                            lowerName.endsWith('.webp'))
                    );
                });

                if (!imageEntry) {
                    this.previewStatus = 'No preview image found in this archive.';
                    return;
                }

                const blob = await imageEntry.async('blob');
                this.previewObjectUrl = URL.createObjectURL(blob);
                this.filePreview = this.previewObjectUrl;
                this.previewStatus = `Previewing ${imageEntry.name.split('/').pop()}`;
            } catch (error) {
                console.error('Error creating upload preview:', error);
                this.previewStatus = 'Could not generate a preview for this file.';
            }
        },
        async fetchMaps() {
            try {
                const response = await fetch('/api/maps');
                if (!response.ok) {
                    throw new Error(`Error fetching maps: ${response.status}`);
                }
                this.availableMaps = await response.json();
                this.filteredMaps = this.availableMaps;
            } catch (error) {
                console.error('Error fetching maps:', error);
                this.availableMaps = [];
                this.filteredMaps = [];
            }
        },
        filterMaps() {
            const search = this.mapSearch.toLowerCase();
            this.filteredMaps = this.availableMaps.filter(map =>
                map.MapName.toLowerCase().includes(search),
            );
            this.currentPage = 1; // Reset to the first page on search
        },
        async uploadMap() {
            this.isLoading = true;
            const formData = new FormData();
            formData.append('map', this.$refs.fileInput.files[0]);

            try {
                const response = await fetch('/api/maps/upload', {
                    method: 'POST',
                    body: formData,
                });
                const responseText = await response.text();
                const data = responseText ? JSON.parse(responseText) : {};

                if (!response.ok) {
                    throw new Error(data.message || 'Map upload failed');
                }

                alert(data.message || 'Map uploaded successfully');
                this.$emit('upload-success');
            } catch (error) {
                console.error('Error uploading map:', error);
                alert(error.message || 'Failed to upload map.');
            } finally {
                this.resetForm();
            }
        },
        async uploadBundle() {
            if (this.selectedMaps.length === 0) {
                alert('Please select at least one map for the bundle.');
                return;
            }
            this.isLoading = true;

            const bundleData = {
                bundleName: this.bundleName,
                mapUUIDs: this.selectedMaps,
            };

            try {
                const response = await fetch('/api/bundles/create', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(bundleData),
                });
                const responseText = await response.text();
                const data = responseText ? JSON.parse(responseText) : {};

                if (!response.ok) {
                    throw new Error(data.message || 'Bundle creation failed');
                }

                alert(data.message || 'Bundle created successfully');
                this.$emit('upload-success');
            } catch (error) {
                console.error('Error creating bundle:', error);
                alert(error.message || 'Failed to create bundle.');
            } finally {
                this.resetForm();
            }
        },
        resetForm() {
            this.isLoading = false;
            this.isMapUpload = true;
            this.bundleName = '';
            this.selectedMaps = [];
            this.mapSearch = '';
            this.filteredMaps = this.availableMaps;
            this.currentPage = 1;
            this.selectedFileName = '';
            this.selectedFileSize = '';
            this.filePreview = '';
            this.previewStatus = 'Select a zip file to preview its image.';
            this.revokePreviewUrl();
            this.close();
        },
        nextPage() {
            if (this.currentPage < this.totalPages) {
                this.currentPage++;
            }
        },
        prevPage() {
            if (this.currentPage > 1) {
                this.currentPage--;
            }
        },
    },
};
</script>

<style scoped>
.popup {
    position: fixed;
    z-index: 1;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.7);
    display: flex;
    justify-content: center;
    align-items: center;
}

.popup-content {
    position: relative;
    background-color: var(--bgcol2);
    border: 1px solid rgba(255, 255, 255, 0.08);
    padding: 20px;
    border-radius: 10px;
    width: 90%;
    max-width: 560px;
    box-shadow: 0 12px 28px rgba(0, 0, 0, 0.35);
    animation: fadeIn 0.2s ease;
}

.popup-header {
    margin-bottom: 14px;
}

.popup-header h2 {
    margin: 0;
    padding-bottom: 8px;
    border-bottom: 2px solid var(--accent);
}

.popup-header p {
    margin: 8px 0 0;
    color: var(--textcol);
    font-size: 0.95rem;
}

input[type='text'],
input[type='file'] {
    padding: 10px 12px;
    width: 100%;
    margin: 10px 0;
    border: 1px solid rgba(255, 255, 255, 0.18);
    border-radius: 8px;
    background-color: var(--bgcol3);
    color: var(--textcol);
}

.popup-content button {
    padding: 10px 20px;
    background-color: var(--accent);
    color: var(--textcol);
    border: none;
    border-radius: 8px;
    cursor: pointer;
    width: 100%;
    transition: background-color 0.3s;
}

.popup-content button:hover {
    background-color: #2f5dbb;
}

.loading-spinner {
    margin-top: 20px;
    font-size: 16px;
    color: var(--accent);
}

/* Toggle Button Styles */
.upload-type-toggle {
    display: flex;
    justify-content: space-between;
    margin-bottom: 16px;
    gap: 10px;
}

.upload-type-toggle button {
    flex: 1;
    padding: 10px;
    margin: 0;
    background-color: var(--bgcol3);
    border: 1px solid rgba(255, 255, 255, 0.12);
    border-radius: 8px;
    cursor: pointer;
    transition: background-color 0.3s;
}

.upload-type-toggle button.active {
    background-color: var(--accent);
    color: var(--textcol2);
    border-color: transparent;
}

/* Pagination Styles */
.pagination {
    display: flex;
    justify-content: space-between;
    margin: 20px 0;
}

.pagination button {
    width: 40%;
}

.file-label {
    display: block;
    margin-bottom: 14px;
}

.preview-card {
    margin-bottom: 14px;
}

.form-actions {
    display: flex;
    gap: 12px;
    margin-top: 10px;
}

.secondary-action,
.primary-action {
    width: 50%;
    min-height: 44px;
    border-radius: 8px;
}

.secondary-action {
    background-color: #666;
    color: #f1f1f1;
}

.secondary-action:hover {
    background-color: #555;
}

.primary-action {
    background-color: var(--accent);
    color: var(--textcol2);
}

@media (max-width: 560px) {
    .popup-content {
        padding: 18px;
    }

    .form-actions {
        flex-direction: column;
    }

    .secondary-action,
    .primary-action {
        width: 100%;
    }

    .upload-type-toggle {
        flex-direction: column;
    }
}

.popup-content input[type='file'] {
    display: block;
    padding: 12px;
    line-height: 1.4;
    width: 100%;
}

.popup-content input[type='file']::file-selector-button {
    margin-right: 12px;
    padding: 10px 14px;
    border: none;
    border-radius: 8px;
    background-color: var(--accent);
    color: var(--textcol2);
    cursor: pointer;
    transition: background-color 0.3s;
}

.popup-content input[type='file']::file-selector-button:hover {
    background-color: #2f5dbb;
}

@keyframes fadeIn {
    from {
        opacity: 0;
    }
    to {
        opacity: 1;
    }
}
</style>
