<template>
  <div class="search-bar">
    <input type="text" placeholder="Search Devlogs..." />
    <button>Search</button>
  </div>

  <div id="devlogs">
    <section class="devlog-section">
      <h2>Map Maker</h2>
      <div class="devlog-entry">
        <h3>Entry Title 1</h3>
        <p>Details about the map maker development progress...</p>
        <a href="#">Read More</a>
      </div>
      <div class="devlog-entry">
        <h3>Entry Title 2</h3>
        <p>Details about new features added to the map maker...</p>
        <a href="#">Read More</a>
      </div>
    </section>

    <section class="devlog-section">
      <h2>Map Loader</h2>
      <div class="devlog-entry">
        <h3>Entry Title 1</h3>
        <p>Updates on loading functionality and performance...</p>
        <a href="#">Read More</a>
      </div>
      <div class="devlog-entry">
        <h3>Entry Title 2</h3>
        <p>Improvements in file handling for map loading...</p>
        <a href="#">Read More</a>
      </div>
    </section>

    <section class="devlog-section">
      <h2>Map Database</h2>
      <div class="devlog-entry">
        <h3>Entry Title 1</h3>
        <p>New database schema changes for map storage...</p>
        <a href="#">Read More</a>
      </div>
      <div class="devlog-entry">
        <h3>Entry Title 2</h3>
        <p>Optimizations in querying the map database...</p>
        <a href="#">Read More</a>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  name: 'DevlogPage',
};
</script>

<style scoped>
#devlogs {
  padding: 20px;
}

.devlog-section {
  background-color: var(--bgcol3);
  border-radius: 10px;
  padding: 15px;
  margin: 20px 0;
}

.devlog-section h2 {
  border-bottom: 2px solid var(--accent);
  padding-bottom: 10px;
}

.devlog-entry {
  background-color: var(--bgcol4);
  border-radius: 8px;
  padding: 10px;
  margin-bottom: 15px;
}

.devlog-entry h3 {
  margin: 0 0 5px;
}

.devlog-entry p {
  margin: 5px 0;
}

.devlog-entry a {
  color: var(--accent);
  text-decoration: underline;
}

.devlog-entry a:hover {
  text-decoration: none;
}
</style>
