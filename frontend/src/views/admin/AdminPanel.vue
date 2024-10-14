<template>
    <div class="admin-panel">
        <h1>Admin Panel</h1>

        <section class="section">
            <h2>User List</h2>
            <div class="card-container">
                <div v-if="!users.length" class="empty-message">No users found.</div>
                <div v-for="user in users" :key="user.username" class="card user-card">
                    <div class="card-content">
                        <h3>{{ user.username }}</h3>
                        <div class="button-group">
                            <button @click="viewUser(user.username)">View</button>
                            <button @click="deleteUser(user.username)">Delete</button>
                        </div>
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
                        <div class="button-group">
                            <button @click="viewMap(map.MapUUID)">View</button>
                            <button @click="deleteMap(map.MapUUID)">Delete</button>
                        </div>
                    </div>
                </div>
            </div>
        </section>

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
        };
    },
    created() {
        this.fetchUsers();
        this.fetchMaps();
        this.fetchLogs();
    },
    methods: {
        async fetchUsers() {
            try {
                const response = await fetch("/api/admin/users", {
                    credentials: "include",
                });
                if (!response.ok) throw new Error("Not authorized");
                this.users = await response.json();
            } catch (error) {
                console.error("Failed to fetch users:", error);
            }
        },
        async fetchMaps() {
            try {
                const response = await fetch("/api/maps", {
                    credentials: "include",
                });
                if (!response.ok) throw new Error("Failed to fetch maps");
                this.maps = await response.json();
            } catch (error) {
                console.error("Failed to fetch maps:", error);
            }
        },
        async fetchLogs() {
            try {
                const response = await fetch("/api/admin/logs", {
                    credentials: "include",
                });
                if (!response.ok) throw new Error("Failed to fetch logs");
                this.logs = await response.json();
            } catch (error) {
                console.error("Failed to fetch logs:", error);
            }
        },
        async viewUser(username) {
            try {
                const response = await fetch(`/api/admin/users/${username}`, {
                    credentials: "include",
                });
                const user = await response.json();
                console.log(user);
            } catch (error) {
                console.error("Failed to view user:", error);
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
        async viewMap(mapUUID) {
            try {
                const response = await fetch(`/api/maps/${mapUUID}`, {
                    credentials: "include",
                });
                const map = await response.json();
                console.log(map);
            } catch (error) {
                console.error("Failed to view map:", error);
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
</style>
