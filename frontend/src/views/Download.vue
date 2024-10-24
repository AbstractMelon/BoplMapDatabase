<template>
    <div class="download-container">
        <div class="content-box">
            <h1 class="title">Download Bopl Battle Map Creator</h1>
            <transition name="fade">
                <div v-if="!downloaded">
                    <p class="description">
                        Select your operating system and version to download the
                        latest.
                        <!-- </p>
                    <div class="version-selection">
                        <select v-model="selectedVersion" @change="fetchFiles">
                            <option
                                v-for="version in versions"
                                :key="version.versionId"
                                :value="version.versionId"
                            >
                            </option>
                        </select>
                    </div> -->
                    </p>

                    <div class="os-selection">
                        <button @click="setOS('windows')" class="os-button">
                            Windows
                        </button>
                        <button @click="setOS('linux')" class="os-button">
                            Linux
                        </button>
                    </div>
                    <div v-if="os" class="file-selection">
                        <h3>Select a file to download:</h3>
                        <div v-if="os === 'windows'">
                            <button
                                v-for="file in windowsFiles"
                                :key="file"
                                @click="download(file)"
                                class="file-button"
                            >
                                {{ file }}
                            </button>
                        </div>
                        <div v-if="os === 'linux'">
                            <button
                                v-for="file in linuxFiles"
                                :key="file"
                                @click="download(file)"
                                class="file-button"
                            >
                                {{ file }}
                            </button>
                        </div>
                    </div>
                </div>
            </transition>
            <transition name="fade">
                <div v-if="downloaded" class="thank-you-message">
                    <h2>Thanks for Installing!</h2>
                    <p>Follow the instructions below to get started:</p>
                    <ul>
                        <li v-if="os === 'windows'">
                            For Windows: Run the downloaded installer and follow
                            the prompts.
                        </li>
                        <li v-if="os === 'linux'">
                            For Linux: Extract the downloaded package and run
                            the executable.
                        </li>
                    </ul>
                    <p>
                        For more information, visit our
                        <a href="/docs/installing/" target="_blank">Wiki</a>.
                    </p>
                </div>
            </transition>
        </div>
    </div>
</template>

<script>
import { version } from 'vue';

export default {
    name: 'DownloadPage',
    data() {
        return {
            downloaded: false,
            os: null,
            versions: [],
            selectedVersion: null,
            windowsFiles: [],
            linuxFiles: [],
        };
    },
    created() {
        this.fetchVersions();
    },
    methods: {
        fetchVersions() {
            fetch('/api/map-maker/')
                .then(response => {
                    if (!response.ok) {
                        throw new Error(
                            `HTTP error! Status: ${response.status}`,
                        );
                    }
                    return response.json();
                })
                .then(data => {
                    if (data.versions && Array.isArray(data.versions)) {
                        this.versions = data.versions;

                        // Find the version with the highest versionId
                        const latestVersion = this.versions.reduce(
                            (max, version) => {
                                return version.info.versionId >
                                    max.info.versionId
                                    ? version
                                    : max;
                            },
                        );

                        this.selectedVersion = latestVersion?.info.versionId;
                        this.fetchFiles();
                    } else {
                        throw new Error(
                            "Invalid data format: 'versions' is missing or not an array.",
                        );
                    }
                })
                .catch(error => {
                    console.error(
                        'Error occurred during fetchVersions:',
                        error,
                    );
                    alert('Failed to load versions. Please try again later.');
                });
        },

        fetchFiles() {
            console.log('Versions array before fetchFiles:', this.versions);
            try {
                // Check if a version is selected
                if (!this.selectedVersion) {
                    console.warn(
                        'No version selected. Exiting fetchFiles method.',
                    );
                    return;
                }

                // Attempt to find version info
                const versionInfo = this.versions.find(
                    v => v.info.versionId === this.selectedVersion, // Change here
                );

                if (!versionInfo) {
                    console.error(
                        `Version not found for selected versionId: ${this.selectedVersion}`,
                        this.versions,
                    );
                    return;
                }

                // Check if versionInfo has the required structure
                if (
                    !versionInfo.info ||
                    !Array.isArray(versionInfo.info.files)
                ) {
                    console.error(
                        'Version info is missing or files is not an array',
                        versionInfo,
                    );
                    return;
                }

                const files = versionInfo.info.files;

                // Log the files found
                console.log('Files found:', files);

                // Filter files for Windows and Linux
                this.windowsFiles = files.filter(file =>
                    file.includes('Windows'),
                );
                this.linuxFiles = files.filter(
                    file => file.includes('Linux') || file.includes('tar'),
                );

                console.log('Filtered Windows files:', this.windowsFiles);
                console.log('Filtered Linux files:', this.linuxFiles);
            } catch (error) {
                console.error(
                    'An unexpected error occurred in fetchFiles:',
                    error,
                );
            }
        },
        setOS(selectedOS) {
            this.os = selectedOS;
            this.downloaded = false; // Reset downloaded status for new OS selection
        },
        download(fileName) {
            console.log(`Downloading ${fileName} for ${this.os}...`);
            this.downloaded = true;
            setTimeout(() => {
                console.log(`Download completed for ${fileName}`);
                window.location.href = `/download/map-creator/${fileName}`;
            }, 1000);
        },
    },
};
</script>

<style scoped>
p {
    text-align: center;
}
.download-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 50px;
    color: var(--textcol);
    background: linear-gradient(135deg, #1f1f1f, #252525);
    border-radius: 25px;
    animation: fadeIn 1s ease-in-out;
    margin: auto;
}

.title {
    font-size: 3rem;
    font-weight: bold;
    color: #00c9ff;
}

.description {
    font-size: 1.5rem;
    margin: 20px 0;
    color: #ddd;
}

.os-selection {
    display: flex;
    justify-content: center;
    gap: 20px;
}

.os-button {
    padding: 15px 30px;
    font-size: 1.2rem;
    border: none;
    cursor: pointer;
    border-radius: 30px;
    background-color: #00c9ff;
    color: white;
    transition: all 0.3s ease;
}

.os-button:hover {
    transform: scale(1.05);
    box-shadow: 0 6px 25px rgba(0, 0, 0, 0.5);
}

.thank-you-message {
    margin-top: 30px;
    text-align: center;
}

.thank-you-message h2 {
    font-size: 2rem;
    color: #00c9ff;
}

.thank-you-message p {
    font-size: 1.2rem;
    color: #ddd;
}

.thank-you-message ul {
    list-style-type: none;
    padding: 0;
}

.thank-you-message a {
    color: #00c9ff;
}

.thank-you-message a:hover {
    text-decoration: underline;
}

/* Transition styles */
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active in <2.1.8 */ {
    opacity: 0;
}

@keyframes fadeIn {
    from {
        opacity: 0;
    }
    to {
        opacity: 1;
    }
}

.file-selection {
    margin-top: 20px;
    text-align: center;
}
.file-button {
    padding: 10px 20px;
    font-size: 1rem;
    border: none;
    cursor: pointer;
    border-radius: 15px;
    background-color: #00c9ff;
    color: white;
    margin: 5px;
    transition: all 0.3s ease;
}
.file-button:hover {
    transform: scale(1.05);
    box-shadow: 0 6px 25px rgba(0, 0, 0, 0.5);
}

.version-selection {
    margin-bottom: 20px;
    text-align: center;
}
.version-selection select {
    padding: 10px;
    font-size: 1rem;
    border-radius: 5px;
    border: 1px solid #ccc;
}
</style>
