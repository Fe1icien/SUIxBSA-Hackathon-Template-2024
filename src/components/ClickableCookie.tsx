import React from 'react';

const ClickableCookie: React.FC<{ setMintAmount: React.Dispatch<React.SetStateAction<number>> }> = ({ setMintAmount }) => {
  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    setMintAmount(prev => prev + 1); // Increase mintAmount by 1
    createParticles(event.clientX, event.clientY);
    showPlusOne(event.clientX, event.clientY);
  };

  const createParticles = (x: number, y: number) => {
    const particleContainer = document.createElement('div');
    particleContainer.style.position = 'absolute';
    particleContainer.style.left = `${x}px`;
    particleContainer.style.top = `${y}px`;
    document.body.appendChild(particleContainer);

    for (let i = 0; i < 10; i++) {
      const particle = document.createElement('div');
      particle.className = 'particle';
      const angle = Math.random() * 2 * Math.PI;
      const distance = Math.random() * 20;
      particle.style.setProperty('--x', `${Math.cos(angle) * distance}px`);
      particle.style.setProperty('--y', `${Math.sin(angle) * distance}px`);
      particle.style.left = `${Math.random() * 20 - 10}px`;
      particle.style.top = `${Math.random() * 20 - 10}px`;
      particle.style.backgroundColor = Math.random() > 0.5 ? '#8B4513' : '#000'; // Randomly choose brown or black
      particleContainer.appendChild(particle);
    }

    setTimeout(() => {
      document.body.removeChild(particleContainer);
    }, 500);
  };

  const showPlusOne = (x: number, y: number) => {
    const plusOne = document.createElement('div');
    plusOne.className = 'plus-one';
    plusOne.style.left = `${x}px`;
    plusOne.style.top = `${y - 20}px`; // Adjust the position to be higher
    plusOne.innerHTML = '<span>+1</span>'; // Use innerHTML to create an element
    document.body.appendChild(plusOne);

    setTimeout(() => {
      document.body.removeChild(plusOne);
    }, 1000);
  };

  return (
    <div onClick={handleClick} style={{ position: 'relative' }}>
      <img 
        src="Cookie.png" 
        alt="Cookie" 
        className="clickable-cookie"
        style={{ maxWidth: '300px', maxHeight: '300px' }}
      />
    </div>
  );
};

export default ClickableCookie;
