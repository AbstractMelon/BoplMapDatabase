<template>
    <div class="not-found">
        <h1>404</h1>
        <h2>Oops! Page not found</h2>
        <p>It looks like the page you're looking for doesn't exist.</p>
        <router-link to="/">Go back to Home</router-link>
    </div>
</template>

<script>
export default {
    name: 'NotFound',
};
</script>

<style scoped>
.not-found {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 90vh;
    text-align: center;
    color: white;
}

h1 {
    font-size: 6rem;
    margin: 0;
}

h2 {
    font-size: 2rem;
    margin: 0.5rem 0;
}

p {
    margin: 1rem 0;
}

router-link {
    color: #feb47b;
    text-decoration: none;
    border: 2px solid #feb47b;
    padding: 0.5rem 1rem;
    border-radius: 5px;
    transition: background-color 0.3s, color 0.3s;
}

router-link:hover {
    background-color: #feb47b;
    color: #ff7e5f;
}
</style>
