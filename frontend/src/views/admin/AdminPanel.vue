<template>
    <div class="admin-panel">
        <h1>Admin Panel</h1>
        
        <button @click="updateToLatest" class="btn-primary">Update to Latest</button>

        <UserList :users="users" @delete-user="deleteUser" @open-edit-modal="openEditModal" />
        <MapList :maps="maps" @delete-map="deleteMap" @open-edit-modal="openEditModal" />
        <Logs :logs="paginatedLogs" :current-page="currentPage" :total-pages="totalPages" 
              @next-page="nextPage" @previous-page="previousPage" />
              <EditModal 
                v-if="isEditModalOpen" 
                :edit-type="editType" 
                :selected-user="selectedUser" 
                :selected-map="selectedMap" 
                :raw-user-json.sync="rawUserJson" 
                :raw-map-json.sync="rawMapJson" 
                @close="closeEditModal" 
                @save="saveChanges" 
                @update-user-from-json="updateUserFromJson" 
                @update-map-from-json="updateMapFromJson" 
            />

    </div>
</template>

<script>
import UserList from './UserList.vue';
import MapList from './MapList.vue';
import Logs from './Logs.vue';
import EditModal from './EditModal.vue';

export default {
    components: {
        UserList,
        MapList,
        Logs,
        EditModal,
    },
    data() {
        return {
            users: [],
            maps: [],
            logs: [],
            logsPerPage: 10,
            isEditModalOpen: false,
            editType: '',
            selectedUser: null,
            selectedMap: null,
            rawUserJson: '',
            rawMapJson: '',
        };
    },
    computed: {
        paginatedLogs() {
            const start = (this.currentPage - 1) * this.logsPerPage;
            const end = start + this.logsPerPage;
            return this.sortedLogs.slice(start, end);
        },
        sortedLogs() {
            return this.logs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        },
        totalPages() {
            return Math.ceil(this.logs.length / this.logsPerPage);
        },
    },
    created() {
        this.fetchUsers();
        this.fetchMaps();
        this.fetchLogs();
    },
    methods: {
        async fetchUsers() {
            const response = await fetch("/api/admin/users", { credentials: "include" });
            this.users = await response.json();
        },
        async fetchMaps() {
            const response = await fetch("/api/maps", { credentials: "include" });
            this.maps = await response.json();
        },
        async fetchLogs() {
            const response = await fetch("/api/admin/logs", { credentials: "include" });
            this.logs = await response.json();
        },
        async updateToLatest() {
            const response = await fetch("/api/admin/update", { credentials: "include" });
            this.logs = await response.json();
        },
        openEditModal(type, item) {
            this.editType = type;
            if (type === 'user') {
                this.selectedUser = { ...item };
                this.rawUserJson = JSON.stringify(this.selectedUser, null, 2);
            } else if (type === 'map') {
                this.selectedMap = { ...item };
                this.rawMapJson = JSON.stringify(this.selectedMap, null, 2);
            }
            this.isEditModalOpen = true;
        },
        closeEditModal() {
            this.isEditModalOpen = false;
            this.selectedUser = null;
            this.selectedMap = null;
        },
        async saveChanges() {
            if (this.editType === 'user') {
                await fetch(`/api/admin/users/${this.selectedUser.username}`, {
                    method: 'PUT',
                    credentials: "include",
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(this.selectedUser),
                });
                this.fetchUsers(); // Refresh user list
            } else if (this.editType === 'map') {
                await fetch(`/api/maps/${this.selectedMap.MapUUID}`, {
                    method: 'PUT',
                    credentials: "include",
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(this.selectedMap),
                });
                this.fetchMaps(); // Refresh map list
            }
            this.closeEditModal();
        },
        async updateUserFromJson() {
            try {
                const updatedUser = JSON.parse(this.rawUserJson);
                await fetch(`/api/admin/users/${updatedUser.username}`, {
                    method: 'PUT',
                    credentials: "include",
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(updatedUser),
                });
                this.fetchUsers(); // Refresh user list
            } catch (error) {
                console.error("Error updating user:", error);
            }
        },
        async updateMapFromJson() {
            try {
                const updatedMap = JSON.parse(this.rawMapJson);
                await fetch(`/api/maps/${updatedMap.MapUUID}`, {
                    method: 'PUT',
                    credentials: "include",
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(updatedMap),
                });
                this.fetchMaps(); // Refresh map list
            } catch (error) {
                console.error("Error updating map:", error);
            }
        },
        async deleteUser(username) {
            if (confirm(`Are you sure you want to delete user ${username}?`)) {
                try {
                    const response = await fetch(`/api/admin/users/${username}`, {
                        method: 'DELETE',
                        credentials: "include",
                    });
                    if (!response.ok) throw new Error("Failed to delete user");
                    this.fetchUsers();
                } catch (error) {
                    console.error("Failed to delete user:", error);
                }
            }
        },
        async deleteMap(mapUUID) {
            if (confirm(`Are you sure you want to delete map ${mapUUID}?`)) {
                try {
                    const response = await fetch(`/api/maps/${mapUUID}`, {
                        method: 'DELETE',
                        credentials: "include",
                    });
                    if (!response.ok) throw new Error("Failed to delete map");
                    this.fetchMaps();
                } catch (error) {
                    console.error("Failed to delete map:", error);
                }
            }
        },
        formatTimestamp(timestamp) {
            const date = new Date(timestamp);
            return date.toLocaleString(); 
        },
        nextPage() {
            if (this.currentPage < this.totalPages) {
                this.currentPage++;
            }
        },
        previousPage() {
            if (this.currentPage > 1) {
                this.currentPage--;
            }
        },
    },
};
</script>

<style scoped>
.admin-panel {
    margin: 0 auto;
    padding: 20px;
    font-family: Arial, sans-serif;
    margin-right: 50px;
    margin-left: 50px;
}

.section {
    margin-bottom: 40px;
}

h1 {
    text-align: center;
    color: #ffffff;
}

h2 {
    color: #ffffff;
    border-bottom: 2px solid #007BFF;
    padding-bottom: 5px;
}

.card-container {
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
    justify-content: center;
}

.card {
    flex: 1 1 200px;
    border: 1px solid #ddd;
    border-radius: 5px;
    background-color: var(--bgcol3);
    transition: box-shadow 0.3s;
    max-width: fit-content;
    max-height: fit-content;
}

.card:hover {
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.card-content {
    padding: 15px;
}

.button-group {
    margin-top: 10px;
}

button {
    margin-right: 10px;
    background-color: #007BFF;
    color: white;
    border: none;
    padding: 8px 12px;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s;
}

button:hover {
    background-color: #0056b3;
}

.btn-primary {
    background-color: #007BFF;
    color: white;
}

.btn-secondary {
    background-color: #007BFF;
    color: white;
}

.btn-danger {
    background-color: #ff384c;
    color: white;
}

.empty-message {
    color: #777;
    text-align: center;
}

.log-viewer {
    background-color: var(--bgcol3);
    border: 1px solid #ddd;
    padding: 15px;
    border-radius: 5px;
}

.log-entry {
    margin-bottom: 10px;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
    background-color: var(--bgcol3);
}

.log-entry pre {
    margin: 5px 0 0 0;
    font-size: 12px;
    white-space: pre-wrap;
    word-wrap: break-word;
}

.pagination {
    display: flex;
    justify-content: center;
    margin-top: 15px;
}

.pagination button {
    margin: 0 5px;
    padding: 5px 10px;
    background-color: #007BFF;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
}

.pagination button:disabled {
    background-color: #ccc;
    cursor: not-allowed;
}

.log-timestamp {
    display: block;
    font-size: 0.9em;
    color: #888;
    margin-top: 5px;
}


.edit-modal {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: var(--bgcol2); 
    padding: 20px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.7);
    z-index: 1000;
    border-radius: 10px;
    max-width: 400px;
    width: 90%;
}

.modal-textarea {
    width: 100%;
    margin-top: 10px;
    padding: 10px;
    border-radius: 5px;
    border: 1px solid #ddd;
    background-color: var(--bgcol2);
    color: white;
}

.modal-buttons {
    display: flex;
    justify-content: space-between;
    margin-top: 15px;
}

/* Fade transition for modal */
.fade-enter-active, .fade-leave-active {
    transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to {
    opacity: 0;
}
</style>
