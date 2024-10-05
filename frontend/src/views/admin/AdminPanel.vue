<template>
    <div>
        <h1>Admin Panel</h1>
        <div v-if="users.length">
            <h2>User List</h2>
            <ul>
                <li v-for="user in users" :key="user.username">{{ user.username }}</li>
            </ul>
        </div>
        <div v-else>
            <p>No users found.</p>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            users: [],
        };
    },
    created() {
        this.fetchUsers();
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
    },
};
</script>