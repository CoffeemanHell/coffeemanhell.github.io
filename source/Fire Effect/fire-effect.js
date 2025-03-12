document.addEventListener('DOMContentLoaded', () => {
    const fireContainer = document.getElementById('fire-container') || (() => {
      const container = document.createElement('div');
      container.id = 'fire-container';
      document.body.appendChild(container);
      return container;
    })();
  
    const fireParticles = [];
    let isBurning = false;
    const fireIntervalDelay = 50;
    const summerMonths = [6, 7, 8];
  
    const isSummerMonth = () => summerMonths.includes(new Date().getMonth() + 1);
  
    const createFireParticle = () => {
      if (!document.hasFocus()) return;
  
      const particle = document.createElement('div');
      particle.className = 'fire-particle';
  
      const size = Math.random() * 5 + 3;
      const opacity = Math.random() * 0.5 + 0.4;
      const hue = Math.random() * 60 + 10;
      const saturation = Math.random() * 20 + 80;
      const lightness = Math.random() * 20 + 50;
      const animationDuration = Math.random() * 1.1 + 1.5;
      const animationType = Math.floor(Math.random() * 4);
  
      Object.assign(particle.style, {
        width: `${size}px`,
        height: `${size}px`,
        left: `${Math.random() * 100}%`,
        bottom: '0',
        opacity: `${opacity}`,
        backgroundColor: `hsl(${hue}, ${saturation}%, ${lightness}%)`,
        boxShadow: `0 0 ${size * 2}px hsl(${hue}, ${saturation}%, ${lightness}%)`,
        animation: `rise-${animationType} ${animationDuration}s ease-out forwards, flicker ${Math.random() * 0.5 + 0.5}s infinite alternate`
      });
  
      particle.addEventListener('animationend', () => {
        particle.remove();
        const index = fireParticles.indexOf(particle);
        if (index > -1) fireParticles.splice(index, 1);
      });
  
      fireParticles.push(particle);
      fireContainer.appendChild(particle);
    };
  
    const startFireEffect = () => {
      if (!isBurning) {
        isBurning = true;
        fireInterval = setInterval(createFireParticle, fireIntervalDelay);
      }
    };
  
    const stopFireEffect = () => {
      if (isBurning) {
        isBurning = false;
        clearInterval(fireInterval);
        fireParticles.forEach(particle => particle.remove());
        fireParticles.length = 0;
      }
    };
  
    const checkSeason = () => isSummerMonth() ? startFireEffect() : stopFireEffect();
  
    setInterval(checkSeason, 3600000);
    checkSeason();
  });