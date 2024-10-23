<template>
    <div class="download-container">
        <div class="content-box">
            <h1 class="title">Download Bopl Battle Map Creator</h1>
            <transition name="fade">
                <div v-if="!downloaded">
                    <p class="description">
                        Select your operating system and version to download the
                        latest.
                    </p>
                    <div class="version-selection">
                        <select v-model="selectedVersion" @change="fetchFiles">
                            <option
                                v-for="version in versions"
                                :key="version.versionId"
                                :value="version.versionId"
                            >
                                {{ version.versionId }}
                                <!-- Display the version ID -->
                            </option>
                        </select>
                    </div>
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
                .then(response => response.json())
                .then(data => {
                    this.versions = data.versions;
                    this.selectedVersion = this.versions[0]?.versionId; // Select the first version by default
                    this.fetchFiles();
                });
        },
        fetchFiles() {
            if (this.selectedVersion) {
                const versionInfo = this.versions.find(
                    version => version.versionId === this.selectedVersion,
                );
                if (versionInfo) {
                    const files = versionInfo.info.files;
                    this.windowsFiles = files.filter(file =>
                        file.includes('Windows'),
                    );
                    this.linuxFiles = files.filter(file =>
                        file.includes('Linux'),
                    );
                }
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
