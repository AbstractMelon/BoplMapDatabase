<template>
  <transition name="fade">
    <div class="edit-modal">
      <h2>Edit {{ editType }}</h2>
      <div v-if="editType === 'user'">
        <label>
          <input type="checkbox" v-model="selectedUser.isAdmin" />
          Admin
        </label>
        <textarea
          :value="rawUserJson"
          rows="5"
          @input="$emit('update:rawUserJson', $event.target.value)"
          @blur="$emit('update-user-from-json')"
          class="modal-textarea"
        >
        </textarea>
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
        <textarea
          :value="rawMapJson"
          rows="5"
          @input="$emit('update:rawMapJson', $event.target.value)"
          @blur="$emit('update-map-from-json')"
          class="modal-textarea"
        >
        </textarea>
      </div>
      <div class="modal-buttons">
        <button @click="$emit('save')" class="btn-primary">Save Changes</button>
        <button @click="$emit('close')" class="btn-secondary">Close</button>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  props: {
    editType: String,
    selectedUser: Object,
    selectedMap: Object,
    rawUserJson: String,
    rawMapJson: String,
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
  border-bottom: 2px solid #007bff;
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

.btn-primary {
  background-color: #007bff;
  color: white;
}

.btn-secondary {
  background-color: #007bff;
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
  background-color: #007bff;
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
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
