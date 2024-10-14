<template>
    <div class="admin-panel">
        <h1>Admin Panel</h1>
        
        <button @click="updateToLatest">Update to Latest</button>

        <section class="section">
            <h2>User List</h2>
            <div class="card-container">
                <div v-if="!users.length" class="empty-message">No users found.</div>
                <div v-for="user in users" :key="user.username" class="card user-card">
                    <div class="card-content">
                        <h3>{{ user.username }}</h3>
                        <button @click="openEditModal('user', user)">Edit</button>
                        <button @click="deleteUser(user.username)">Delete</button>
                    </div>
                </div>
            </div>
        </section>

        <section class="section">
            <h2>Map List</h2>
            <div class="card-container">
                <div v-if="!maps.length" class="empty-message">No maps found.</div>
                <div v-for="map in maps" :key="map.MapUUID" class="card map-card">
                    <div class="card-content">
                        <h3>{{ map.MapName }}</h3>
                        <p>{{ map.MapUUID }}</p>
                        <button @click="openEditModal('map', map)">Edit</button>
                        <button @click="deleteMap(map.MapUUID)">Delete</button>
                    </div>
                </div>
            </div>
        </section>

        <!-- Edit Modal -->
        <div v-if="isEditModalOpen" class="edit-modal">
            <h2>Edit {{ editType }}</h2>
            <div v-if="editType === 'user'">
                <label>
                    <input type="checkbox" v-model="selectedUser.isAdmin" />
                    Admin
                </label>
                <textarea v-model="rawUserJson" rows="5" @blur="updateUserFromJson"></textarea>
            </div>
            <div v-if="editType === 'map'">
                <label>
                    <input type="checkbox" v-model="selectedMap.isMotw" />
                    Map of the Week
                </label>
                <label>
                    <input type="checkbox" v-model="selectedMap.isFeatured" />
                    Featured
                </label>
                <label>
                    <input type="checkbox" v-model="selectedMap.isHandpicked" />
                    Handpicked
                </label>
                <textarea v-model="rawMapJson" rows="5" @blur="updateMapFromJson"></textarea>
            </div>
            <button @click="saveChanges">Save Changes</button>
            <button @click="closeEditModal">Close</button>
        </div>

        <section class="section">
            <h2>Logs</h2>
            <div class="log-viewer">
                <div v-if="!logs.length" class="empty-message">No logs available.</div>
                <div v-for="log in logs" :key="log.timestamp" class="log-entry">
                    <strong>{{ log.action }}</strong> - <em>{{ log.timestamp }}</em>
                    <pre>{{ JSON.stringify(log.data, null, 2) }}</pre>
                </div>
            </div>
        </section>
    </div>
</template>

<script>
export default {
    data() {
        return {
            users: [],
            maps: [],
            logs: [],
            isEditModalOpen: false,
            editType: '',
            selectedUser: null,
            selectedMap: null,
            rawUserJson: '',
            rawMapJson: '',
        };
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
    max-width: 200px;
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

.edit-modal {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: var(--bgcol2);
    padding: 20px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    z-index: 1000;
    border-radius: 20px;
}
</style>
