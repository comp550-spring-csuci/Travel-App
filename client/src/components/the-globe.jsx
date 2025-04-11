// // src/GlobeComponent.js
import React, { useRef, useEffect, useState } from 'react';
import Globe from 'globe.gl';

const GlobeComponent = () => {
  const globeContainerRef = useRef(null);
  const [hash, setHash] = useState(window.location.hash); // Track the current hash

  useEffect(() => {
    const globe = Globe()
      .globeImageUrl('//unpkg.com/three-globe/example/img/earth-day.jpg')
        


    globe(globeContainerRef.current); // Render the globe

    // Update globe position based on hash (e.g., '#location=London')
    if (hash.includes('location')) {
      const location = hash.split('=')[1]; // Simple example: #location=London
      if (location === 'London') {
        globe.cameraPosition({ lat: 51.5074, lng: -0.1278, altitude: 3 });
      }
    }

    return () => {
      if (globeContainerRef.current) {
        globeContainerRef.current.innerHTML = '';
      }
    };
  }, [hash]); // Re-run effect when the hash changes

  return <div ref={globeContainerRef} style={{ width: '100%', height: '500px' }}></div>;
};

export default GlobeComponent;
