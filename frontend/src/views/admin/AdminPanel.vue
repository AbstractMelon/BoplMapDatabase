<template>
	<div class="admin-panel">
		<h1>Admin Panel</h1>

		<button @click="updateToLatest" class="btn-primary">
			Update to Latest
		</button>

		<UserList
			:users="users"
			@delete-user="deleteUser"
			@open-edit-modal="openEditModal"
		/>
		<MapList
			:maps="maps"
			@delete-map="deleteMap"
			@open-edit-modal="openEditModal"
		/>
		<UploadVersion />
		<Logs
			:logs="paginatedLogs"
			:current-page="currentPage"
			:total-pages="totalPages"
			@next-page="nextPage"
			@previous-page="previousPage"
		/>
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
import UploadVersion from './UploadVersion.vue';

export default {
	components: {
		UserList,
		MapList,
		Logs,
		EditModal,
		UploadVersion,
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
			return this.logs.sort(
				(a, b) => new Date(b.timestamp) - new Date(a.timestamp)
			);
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
			const response = await fetch('/api/admin/users', {
				credentials: 'include',
			});
			this.users = await response.json();
		},
		async fetchMaps() {
			const response = await fetch('/api/maps', {
				credentials: 'include',
			});
			this.maps = await response.json();
		},
		async fetchLogs() {
			const response = await fetch('/api/admin/logs', {
				credentials: 'include',
			});
			this.logs = await response.json();
		},
		async updateToLatest() {
			const response = await fetch('/api/admin/update', {
				credentials: 'include',
			});
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
					credentials: 'include',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify(this.selectedUser),
				});
				this.fetchUsers(); // Refresh user list
			} else if (this.editType === 'map') {
				await fetch(`/api/maps/${this.selectedMap.MapUUID}`, {
					method: 'PUT',
					credentials: 'include',
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
					credentials: 'include',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify(updatedUser),
				});
				this.fetchUsers(); // Refresh user list
			} catch (error) {
				console.error('Error updating user:', error);
			}
		},
		async updateMapFromJson() {
			try {
				const updatedMap = JSON.parse(this.rawMapJson);
				await fetch(`/api/maps/${updatedMap.MapUUID}`, {
					method: 'PUT',
					credentials: 'include',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify(updatedMap),
				});
				this.fetchMaps(); // Refresh map list
			} catch (error) {
				console.error('Error updating map:', error);
			}
		},
		async deleteUser(username) {
			if (confirm(`Are you sure you want to delete user ${username}?`)) {
				try {
					const response = await fetch(
						`/api/admin/users/${username}`,
						{
							method: 'DELETE',
							credentials: 'include',
						}
					);
					if (!response.ok) throw new Error('Failed to delete user');
					this.fetchUsers();
				} catch (error) {
					console.error('Failed to delete user:', error);
				}
			}
		},
		async deleteMap(mapUUID) {
			if (confirm(`Are you sure you want to delete map ${mapUUID}?`)) {
				try {
					const response = await fetch(`/api/maps/${mapUUID}`, {
						method: 'DELETE',
						credentials: 'include',
					});
					if (!response.ok) throw new Error('Failed to delete map');
					this.fetchMaps();
				} catch (error) {
					console.error('Failed to delete map:', error);
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

button {
	margin-right: 10px;
	background-color: #007bff;
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
h1 {
	text-align: center;
	color: #ffffff;
}

h2 {
	color: #ffffff;
	border-bottom: 2px solid #007bff;
	padding-bottom: 5px;
}
</style>
