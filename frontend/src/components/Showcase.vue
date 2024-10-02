<template>
    <div class="showcase-container">
        <div class="top-section">
            <div class="content-box">
                <h1 class="title">Bopl Battle Map Creator</h1>
                <p class="description">Create dynamic, custom battle maps for your Bopl adventures. Design, strategize, and conquer with ease.</p>
                <div class="action-button-container">
                <button class="action-button">Get Started</button>
                <button class="secondary-button">Learn More</button>
                </div>
            </div>
        
            <div class="map-preview">
                <img src="../assets/map.webp" alt="Map Preview" class="map-image" />
                <div class="floating-battles">
                <div class="battle battle-1"></div>
                <div class="battle battle-2"></div>
                <div class="battle battle-3"></div>
                </div>
            </div>
        </div>
  
        <div class="extra-content">
            <section class="devlog-section">
                <h2 class="section-title">Devlog</h2>
                <p class="section-content">
                Follow the development of Bopl Battle Map Creator through our devlog. Stay up-to-date on the latest features, fixes, and improvements.
                </p>
                <button class="section-button">View Devlog</button>
            </section>
        
            <section class="download-section">
                <h2 class="section-title">Download</h2>
                <p class="section-content">
                Ready to get started? Download the latest version of Bopl Battle Map Creator and jump into building your battle maps.
                </p>
                <button class="section-button">Download Now</button>
            </section>
        
            <section class="wiki-section">
                <h2 class="section-title">Wiki</h2>
                <p class="section-content">
                Need help? Check out the official wiki for tutorials, tips, and detailed documentation on how to use Bopl Battle Map Creator.
                </p>
                <button class="section-button">Visit Wiki</button>
            </section>
        
            <section class="map-loader-info-section">
                <h2 class="section-title">Map Loader Info</h2>
                <p class="section-content">
                Learn how to load, manage, and customize maps using our powerful map loader. Discover advanced tips for handling your maps.
                </p>
                <button class="section-button">Learn More</button>
            </section>
        
            <section class="thunderstore-section">
                <h2 class="section-title">Thunderstore</h2>
                <p class="section-content">
                Find community-created maps and mods for Bopl Battle Map Creator on Thunderstore. Share your own creations with the community.
                </p>
                <button class="section-button">Visit Thunderstore</button>
            </section>
        </div>
    </div>
  </template>
  
  
  <script>
  export default {
    name: "BoplBattleMapShowcase",
  };
  </script>
  
  <style scoped>
    .showcase-container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 50px;
    margin: 50px 50px;
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
    max-width: 1200px; 
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
    color: #00c9ff;
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
    background-color: #00c9ff;
    color: white;
  }
  
  .secondary-button {
    background-color: transparent;
    color: white;
    border: 2px solid #00c9ff;
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
    width: 50px;
    height: 50px;
    background-color: #ff4c4c;
    border-radius: 50%;
    animation: float 4s ease-in-out infinite;
    box-shadow: 0 4px 15px rgba(255, 76, 76, 0.6);
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
    0%, 100% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(-15px);
    }
  }
  
  /* Responsive adjustments */
  @media (max-width: 768px) {
    .showcase-container {
      flex-direction: column;
      padding: 20px;
    }
  
    .content-box {
      margin-bottom: 50px;
    }
  }

  .extra-content {
  display: flex;
  flex-direction: row;
  width: 100%;
  max-width: 600px;
  flex-wrap: wrap;
}

.section-title {
  font-size: 2rem;
  margin-bottom: 10px;
  color: #00c9ff;
}

.section-content {
  font-size: 1.2rem;
  margin-bottom: 15px;
  color: #ddd;
}

.section-button {
  padding: 10px 20px;
  font-size: 1.2rem;
  background-color: #00c9ff;
  color: white;
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
  .extra-content {
    width: 100%;
  }
}
  </style>
  