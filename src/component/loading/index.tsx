import React, { useEffect, useState } from 'react';

const LoadingAnimation: React.FC = () => {
  const [loadingHeight, setLoadingHeight] = useState(window.innerHeight);
  const [loadingWidth, setLoadingWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setLoadingHeight(window.innerHeight);
      setLoadingWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Call once to set initial dimensions

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const handleMouseMove = (e: React.MouseEvent) => {
    const originalMouse = document.querySelector('.original') as HTMLElement;
    if (originalMouse) {
      originalMouse.style.left = `${e.pageX - 16}px`;
      originalMouse.style.top = `${e.pageY - 16}px`;
    }
  };

  const handleClick = (e: React.MouseEvent) => {
    const originalMouse = document.querySelector('.original') as HTMLElement;
    if (originalMouse) {
      const newMouse = originalMouse.cloneNode(true) as HTMLElement;
      newMouse.classList.remove('original');
      newMouse.style.left = `${e.pageX - 16}px`;
      newMouse.style.top = `${e.pageY - 16}px`;
      document.body.appendChild(newMouse);
    }
  };

  return (
    <div
      className="loading bg-white fixed w-full"
      style={{ height: `${loadingHeight}px`, width: `${loadingWidth}px` }}
      onMouseMove={handleMouseMove}
      onClick={handleClick}
    >
      <img
        src="http://a.top4top.net/p_1990j031.gif"
        alt="Loading"
        className="block min-h-[209px] min-w-[200px] "
        style={{ paddingTop: (loadingHeight - 409) / 2, paddingLeft: (loadingWidth - 200) / 2 }}
      />
      <div className="mouse original rounded-full bg-[#fff782] absolute transition-all duration-500 ease-in-out"></div>
    </div>
  );
};

export default LoadingAnimation;
