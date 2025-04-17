// // src/GlobeComponent.js
// import React, { useRef, useEffect, useState } from 'react';
// import Globe from 'globe.gl';

// const GlobeComponent = () => {
//   const globeContainerRef = useRef(null);
//   const [hash, setHash] = useState(window.location.hash); // Track the current hash

//   useEffect(() => {
//     const globe = Globe()
//       .globeImageUrl('//unpkg.com/three-globe/example/img/earth-day.jpg')
        


//     globe(globeContainerRef.current); // Render the globe

//     // Update globe position based on hash (e.g., '#location=London')
//     if (hash.includes('location')) {
//       const location = hash.split('=')[1]; // Simple example: #location=London
//       if (location === 'London') {
//         globe.cameraPosition({ lat: 51.5074, lng: -0.1278, altitude: 3 });
//       }
//     }

//     return () => {
//       if (globeContainerRef.current) {
//         globeContainerRef.current.innerHTML = '';
//       }
//     };
//   }, [hash]); // Re-run effect when the hash changes

//   return <div ref={globeContainerRef} style={{ width: '100%', height: '500px' }}></div>;
// };

// export default GlobeComponent;

// src/GlobeComponent.js
import React, { useRef, useEffect, useState } from 'react';
import Globe from 'globe.gl';

const GlobeComponent = () => {
  const globeContainerRef = useRef(null);
  const [mode, setMode] = useState('light');
  // const [globeInstance, setGlobeInstance] = useState(null);
  const [hash, setHash] = useState(window.location.hash); // Track the current hash

  const toggleMode = () => {
    setMode(prevMode => (prevMode === 'light' ? 'dark' : 'light'));
  }

  const lightModeImageUrl = '//unpkg.com/three-globe/example/img/earth-day.jpg';
  const darkModeImageUrl = '//unpkg.com/three-globe/example/img/earth-night.jpg';

  useEffect(() => {

    

    // if (!globeContainerRef.current) return;

    const globe = Globe()
      .globeImageUrl(mode === 'light' ? lightModeImageUrl : darkModeImageUrl )
      // .globeImageUrl('//unpkg.com/three-globe/example/img/earth-day.jpg')
      .pointLat(d => d.latitude)
      .pointLng(d => d.longitude)
      .pointLabel(d => `${d.title}: ${d.content}`)
      .pointColor(() => 'red')
      .pointAltitude(.3)
      

    globe(globeContainerRef.current); // Render the globe
    // setGlobeInstance(globe);

    // Fetch blog data
    fetch('http://localhost:3001/api/get/all')
      .then(res => res.json())
      .then(data => {
        const validPoints = data.filter(blog =>
          typeof blog.latitude === 'number' && typeof blog.longitude === 'number',
        );
        globe.pointsData(validPoints);
        // globe.arcsData(validPoints);
        // globe.arcsStartLng(validPoints);
        // globe.arcsStartLat(validPoints);
        // globe.arcEndLat(validPoints);
        // globe.arcEndLng(validPoints);
      
      })
      .catch(err => console.error('Failed to fetch blog data:', err));

    // Camera position based on hash
    if (hash.includes('location')) {
      const location = hash.split('=')[1]; // e.g. #location=London
      if (location === 'London') {
        globe.cameraPosition({ lat: 51.5074, lng: -0.1278, altitude: 3 });
      }
      // You can expand with more locations as needed
    }

    // Cleanup
    return () => {
      
    };
  }, [mode]); 
  return (
    <div>
      <button onClick={toggleMode}>
        Switch to {mode === 'light' ? 'Dark' : 'Light'} Mode
      </button>
      <div
        ref={globeContainerRef}
        style={{ width: '100%', height: '600px', borderRadius: '8px' }}
      ></div>
    </div>
  );
};

export default GlobeComponent;
