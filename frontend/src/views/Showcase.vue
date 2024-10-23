<template>
    <div class="showcase-container">
        <div class="top-section">
            <div class="content-box">
                <h1 class="title">Bopl Battle Map Creator</h1>
                <p class="description">
                    Create dynamic, custom battle maps for your Bopl adventures.
                    Design, strategize, and conquer with ease.
                </p>
                <div class="action-button-container">
                    <a class="action-button" href="/download">Download</a>
                    <a class="secondary-button" href="#">Learn More</a>
                </div>
            </div>

            <div class="map-preview">
                <img
                    src="/map-maker-art.png"
                    alt="Map Preview"
                    class="map-image"
                />
                <div class="floating-battles">
                    <img
                        src="/icon1.png"
                        alt="Tool Icon 1"
                        class="battle battle-1"
                    />
                    <img
                        src="/icon2.png"
                        alt="Tool Icon 2"
                        class="battle battle-2"
                    />
                    <!-- <img src="/icon3.png" alt="Tool Icon 3" class="battle battle-3" /> -->
                </div>
            </div>
        </div>

        <div class="extra-content">
            <section class="download-section">
                <h2 class="section-title">Download</h2>
                <p class="section-content">
                    Ready to get started? Download the latest version of Bopl
                    Battle Map Creator and jump into building your battle maps.
                </p>
                <a class="section-button" href="/download">Download Now</a>
            </section>

            <section class="wiki-section">
                <h2 class="section-title">Wiki</h2>
                <p class="section-content">
                    Need help? Check out the official wiki for tutorials, tips,
                    and detailed documentation on how to use Bopl Battle Map
                    Creator.
                </p>
                <a class="section-button" href="/docs/">Visit Wiki</a>
            </section>

            <section class="devlog-section">
                <h2 class="section-title">Devlog</h2>
                <p class="section-content">
                    Follow the development of Bopl Battle Map Creator through
                    our devlog. Stay up-to-date on the latest features, fixes,
                    and improvements.
                </p>
                <a class="section-button" href="/devlog">View Devlog</a>
            </section>

            <section class="map-loader-info-section">
                <h2 class="section-title">Map Loader</h2>
                <p class="section-content">
                    Learn how to load, manage, and customize maps using our
                    powerful map loader. Discover advanced tips for handling
                    your maps.
                </p>
                <a class="section-button" href="/docs/map-loader/"
                    >Learn More</a
                >
            </section>

            <section class="thunderstore-section">
                <h2 class="section-title">Thunderstore</h2>
                <p class="section-content">
                    Find community-created maps and tools for Bopl Battle Map
                    Creator on Thunderstore. Share your own creations with the
                    community.
                </p>
                <a
                    class="section-button"
                    href="https://thunderstore.io/c/bopl-battle/"
                    >Visit Thunderstore</a
                >
            </section>
        </div>
    </div>
</template>

<script>
export default {
    name: 'BoplBattleMapShowcase',
};
</script>

<style scoped>
.showcase-container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 50px;
    margin: 50px;
    color: white;
    background: linear-gradient(135deg, #1f1f1f, #252525);
    animation: fadeIn 1s ease-in-out;
    border-radius: 25px;
}

@keyframes fadeIn {
    from {
        opacity: 0;
    }
    to {
        opacity: 1;
    }
}

.top-section {
    display: flex;
    justify-content: space-between;
    width: 100%;
    max-width: 1400px;
}

.content-box {
    max-width: 600px;
    text-align: center;
    margin-bottom: 30px;
    margin-right: 100px;
}

.title {
    font-size: 4rem;
    font-weight: bold;
    text-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
    animation: slideInLeft 1s ease-in-out;
    color: var(--cyan);
    letter-spacing: 2px;
}

@keyframes slideInLeft {
    from {
        transform: translateX(-100%);
    }
    to {
        transform: translateX(0);
    }
}

.description {
    font-size: 1.5rem;
    margin: 20px 0;
    animation: fadeIn 2s ease-in-out;
    color: #ddd;
}

.action-button-container {
    margin-top: 30px;
}

.action-button,
.secondary-button {
    padding: 15px 30px;
    margin-right: 10px;
    font-size: 1.2rem;
    border: none;
    cursor: pointer;
    transition: all 0.3s ease;
    border-radius: 30px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
}

.action-button {
    background-color: var(--cyan);
    color: #000000;
}

.secondary-button {
    background-color: transparent;
    color: white;
    border: 2px solid var(--cyan);
}

.action-button:hover,
.secondary-button:hover {
    transform: scale(1.05);
    box-shadow: 0 6px 25px rgba(0, 0, 0, 0.5);
}

.map-preview {
    position: relative;
    width: 600px;
    height: 400px;
    animation: fadeIn 3s ease-in-out;
}

.map-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 15px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
    transition: transform 0.3s ease;
}

.map-image:hover {
    transform: scale(1.05);
}

.floating-battles {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
}

.battle {
    position: absolute;
    width: 50px; /* Adjust size based on your icon */
    height: 50px; /* Adjust size based on your icon */
    animation: float 4s ease-in-out infinite;
}

.battle-1 {
    top: 15%;
    left: 25%;
}
.battle-2 {
    top: 60%;
    left: 70%;
}
.battle-3 {
    top: 80%;
    left: 50%;
}

@keyframes float {
    0%,
    100% {
        transform: translateY(0);
    }
    50% {
        transform: translateY(-15px);
    }
}

.extra-content {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    width: 100%;
    max-width: 1600px;
}

.extra-content section {
    flex: 1 1 calc(33.333% - 20px);
    margin: 10px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
    padding: 20px;
    border-radius: 10px;
    background: rgba(0, 35, 92, 0.005);
}

.section-title {
    font-size: 2rem;
    margin-bottom: 10px;
    color: rgb(99, 215, 247);
}

.section-content {
    font-size: 1.2rem;
    margin-bottom: 15px;
    color: #ddd;
}

.section-button {
    padding: 10px 20px;
    font-size: 1.2rem;
    background-color: var(--cyan);
    color: #000000;
    border: none;
    cursor: pointer;
    border-radius: 30px;
    transition: all 0.3s ease;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
    margin-bottom: 30px;
}

.section-button:hover {
    transform: scale(1.05);
    box-shadow: 0 6px 25px rgba(0, 0, 0, 0.5);
}

/* Responsive adjustments */
@media (max-width: 768px) {
    .showcase-container {
        padding: 20px;
        margin: 20px;
    }

    .top-section {
        flex-direction: column;
        align-items: center;
    }

    .content-box {
        margin: 0;
        margin-bottom: 30px;
        max-width: 100%;
    }

    .map-preview {
        width: 100%;
        height: auto;
    }

    .extra-content section {
        flex: 1 1 calc(50% - 20px); /* 2 items per row on smaller screens */
        margin: 10px 0;
    }
}

@media (max-width: 480px) {
    .title {
        font-size: 2.5rem;
    }

    .description {
        font-size: 1rem;
    }

    .extra-content section {
        flex: 1 1 100%; /* 1 item per row on very small screens */
    }

    .section-title {
        font-size: 1.5rem;
    }

    .section-content {
        font-size: 1rem;
    }

    .action-button,
    .secondary-button {
        font-size: 1rem;
        padding: 10px 20px;
    }
}
</style>
