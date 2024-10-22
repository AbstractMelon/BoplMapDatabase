<template>
    <div class="upload-section">
        <h2>Upload New Map Maker Version</h2>
        <form @submit.prevent="uploadVersion" class="upload-form">
            <div class="form-row">
                <div class="form-group">
                    <label for="zipFile1">Windows Zip File:</label>
                    <input
                        type="file"
                        id="zipFile1"
                        ref="zipFile1"
                        accept=".zip"
                        required
                    />
                </div>
                <div class="form-group">
                    <label for="zipFile2">Linux Zip File:</label>
                    <input
                        type="file"
                        id="zipFile2"
                        ref="zipFile2"
                        accept=".zip"
                        required
                    />
                </div>
                <div class="form-group">
                    <label for="exeFile">Windows Executable:</label>
                    <input
                        type="file"
                        id="exeFile"
                        ref="exeFile"
                        accept=".exe"
                        required
                    />
                </div>
                <div class="form-group">
                    <label for="tarFile">Tar File:</label>
                    <input
                        type="file"
                        id="tarFile"
                        ref="tarFile"
                        accept=".tar.xz"
                        required
                    />
                </div>
                <div class="form-group">
                    <label for="versionId">Version ID:</label>
                    <input type="text" v-model="versionId" required />
                </div>
            </div>
            <div class="form-group">
                <label for="changelog">Changelog:</label>
                <textarea v-model="changelog" required></textarea>
            </div>
            <button type="submit" class="btn-primary">Upload Version</button>
        </form>
    </div>
</template>

<script>
export default {
    data() {
        return {
            versionId: '',
            changelog: '',
        };
    },
    methods: {
        async uploadVersion() {
            const formData = new FormData();
            formData.append('zipFile1', this.$refs.zipFile1.files[0]);
            formData.append('zipFile2', this.$refs.zipFile2.files[0]);
            formData.append('exeFile', this.$refs.exeFile.files[0]);
            formData.append('tarFile', this.$refs.tarFile.files[0]);
            formData.append('versionId', this.versionId);
            formData.append('changelog', this.changelog);

            try {
                const response = await fetch('/api/map-maker/upload', {
                    method: 'POST',
                    credentials: 'include',
                    body: formData,
                });

                if (response.ok) {
                    const result = await response.json();
                    alert('Version uploaded successfully!');
                    this.resetForm();
                } else {
                    alert('Error uploading version.');
                }
            } catch (error) {
                console.error('Upload failed:', error);
                alert('Upload failed, please try again.');
            }
        },
        resetForm() {
            this.versionId = '';
            this.changelog = '';
            this.$refs.zipFile1.value = '';
            this.$refs.zipFile2.value = '';
            this.$refs.exeFile.value = '';
            this.$refs.tarFile.value = '';
        },
    },
};
</script>

<style scoped>
.upload-section {
    margin: 20px 0;
    background-color: var(--bgcol3);
    border-radius: 10px;
    padding: 30px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

.upload-form {
    display: flex;
    flex-direction: column;
}

.form-row {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
}

.form-group {
    margin: 10px;
    flex: 1 1;
    flex-grow: 1;
}

.upload-section label {
    color: #ffffff;
    font-weight: bold;
    margin-bottom: 5px;
    display: block;
}

.upload-section input[type='file'],
.upload-section input[type='text'],
.upload-section textarea {
    padding: 12px;
    border-radius: 5px;
    border: 1px solid #ddd;
    background-color: var(--bgcol4);
    color: #ffffff;
}

.upload-section textarea {
    min-height: 100px;
}

.btn-primary {
    margin-top: 20px;
    padding: 10px 15px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s, transform 0.2s;
}

.btn-primary:hover {
    background-color: #0056b3;
    transform: translateY(-1px);
}

h2 {
    color: #ffffff;
    border-bottom: 2px solid #007bff;
    padding-bottom: 10px;
    margin-bottom: 20px;
}
</style>
