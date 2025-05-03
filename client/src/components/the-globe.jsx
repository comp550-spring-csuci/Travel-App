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
import React, { useRef, useEffect, useState, useContext } from 'react';
import { AppContext } from '../lib';
import Globe from 'globe.gl';

const GlobeComponent = () => {
  const globeContainerRef = useRef(null);
  const [mode, setMode] = useState('light');
  const { token } = useContext(AppContext);
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
    fetch('http://localhost:3001/api/get/all', {
      headers: {
        'x-access-token': token
      }
    })
  .then(res => res.json())  // Parse the JSON response
  .then(data => {
    console.log("Fetched data:", data);  // Log to see the structure of the response

    // If the response has a property `data` containing the array
    const blogData = data.data || data;  // Access the array from `data` or use the response itself if it's directly an array

    // Ensure it's an array before applying .filter()
    if (!Array.isArray(blogData)) {
      throw new Error("Expected array, got: " + JSON.stringify(blogData));
    }

    // Filter the posts to only include those with valid latitude and longitude
    const validPoints = blogData.filter(blog =>
      typeof blog.latitude === 'number' && typeof blog.longitude === 'number'
    );

    // Pass the valid points to the globe
    globe.pointsData(validPoints);

    // Optional: You can use arcsData, arcsStartLng, etc., based on your need
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
