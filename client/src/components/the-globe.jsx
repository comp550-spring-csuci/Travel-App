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
import { useNavigate } from 'react-router-dom';
import Globe from 'globe.gl';

// Create toggle styling
let toggleButton = document.getElementById('toggleView');

if (!toggleButton) {
  toggleButton = document.createElement("button")
  toggleButton.id = 'toggleView';
  toggleButton.innerText = 'View: All Posts';
  toggleButton.style.position = 'absolute';
  toggleButton.style.top = '150px';
  toggleButton.style.left = '0px';
  toggleButton.style.zIndex = '1000';
  toggleButton.style.padding = '0px';
  toggleButton.style.background = '#222';
  toggleButton.style.color = '#fff';
  toggleButton.style.border = 'none';
  toggleButton.style.cursor = 'pointer';
  document.body.appendChild(toggleButton);
}


const GlobeComponent = () => {
  const globeContainerRef = useRef(null);
  const [mode, setMode] = useState('light');
  const { token } = useContext(AppContext);
  // const [globeInstance, setGlobeInstance] = useState(null);
  const [hash, setHash] = useState(window.location.hash); // Track the current hash
  const [hoveredPoint, setHoveredPoint] = useState(null);

  // const navigate = useNavigate()

  const toggleMode = () => {
    setMode(prevMode => (prevMode === 'light' ? 'dark' : 'light'));
  }

  const lightModeImageUrl = '//unpkg.com/three-globe/example/img/earth-day.jpg';
  const darkModeImageUrl = '//unpkg.com/three-globe/example/img/earth-night.jpg';

  useEffect(() => {
    // Initialize current view
    let currentView = 'all'
    


    // if (!globeContainerRef.current) return;

    const globe = Globe()
      // .globeImageUrl(mode === 'light' ? lightModeImageUrl : darkModeImageUrl )
      // // .globeImageUrl('//unpkg.com/three-globe/example/img/earth-day.jpg')
      // .pointLat(d => d.latitude)
      // .pointLng(d => d.longitude)
      // .pointLabel(d => `${d.title}: ${d.content} ${d.image} `)
      // .pointColor(() => 'red')
      // .pointAltitude(.3)
      
    globe(globeContainerRef.current); // Render the globe
    // setGlobeInstance(globe);

    



    const fetchAndRenderPosts = async () => {

      try {

        const homeLocation = await fetch('http://localhost:3001/api/home-location', {
          headers: {
            'x-access-token' : token
          }
        });
        const homeData = await homeLocation.json();
        console.log("The state of home data is:", homeData)
        // get homeData
        const home = Array.isArray(homeData) ? homeData[0] : homeData
        const { latitude: homeLat, longitude: homeLng } = home;

        const validLatitude = !isNaN(homeLat) && homeLat >= -90 && homeLat <= 90;
        const validLongitude = !isNaN(homeLng) && homeLng >= -180 && homeLng <= 180;

        if (!validLatitude || !validLongitude) {
          console.error('Invalid home location data:', homeLat, homeLng);
          return; // Prevent further processing if the data is invalid
        }

        const endpoint = currentView === 'all'
          ? 'http://localhost:3001/api/get/all'
          : 'http://localhost:3001/api/blog-feed';

        const postRes = await fetch(endpoint, {
          headers: {
            'x-access-token' : token
          }
        });

        const posts = await postRes.json()
        console.log("The other posts data:", posts)

        const homeMarker = {
          latitude: homeLat,
          longitude: homeLng,
          title: 'Home',
          content: 'This is your home location',
          image: '',
          isHome: true
        }


        const arcs = posts.map(post => ({
          startLat: homeLat,
          startLng: homeLng,
          endLat: post.latitude, // e.g. London as destination
          endLng: post.longitude,

        }));

        
        const allPoints = [homeMarker, ...posts];
        console.log("All points:", allPoints)
        

        globe
        .pointsData(allPoints)
        .globeImageUrl(mode === 'light' ? lightModeImageUrl : darkModeImageUrl )
    // .globeImageUrl('//unpkg.com/three-globe/example/img/earth-day.jpg')
        .pointLat(d => d.latitude)
        .pointLng(d => d.longitude)
        // .pointLabel(d => `${d.title}: ${d.content} ${d.image} `)
        .pointColor(d => d.isHome ? 'blue': 'red')
        .pointAltitude(.3)
        .onPointHover((point) => {
          // When a point is hovered, update the state with the image URL
          if (point) {
            setHoveredPoint(point); // Update state with hovered point data
          } else {
            setHoveredPoint(null); // Reset when hover is removed
          }
        });
        // .onPointClick((point) => {
        //   // When a point is clicked, navigate to a new page with more information about the point
        //   if (point.isHome) {
        //     // Navigate to home location (or wherever you need to link)
        //     navigate(`/home`);
        //   } else {
        //     // Navigate to post details page using the post ID
        //     navigate(`/post/${point.id}`);
        //   }
        // });

        if (currentView !== 'all') {
          const arcs = posts.map(post => ({
            startLat: homeLat,
            startLng: homeLng,
            endLat: post.latitude, // e.g. London as destination
            endLng: post.longitude,
  
          }));
        globe.arcsData(arcs)
        .arcColor(() =>
          currentView === 'all' ? 'rgba(0, 255, 0, 0.8)' : 'rgba(255, 165, 0, 0.8)'
        )
        .arcsTransitionDuration(0)
        .arcDashLength(0.3)
        .arcDashGap(1)
        .arcDashAnimateTime(1000);
        } else {
          globe.arcsData([])
        }
      } catch (err) {
        console.error("There is an error in fetchAndRenderPosts", err.message);
      }
    }  

    document.getElementById('toggleView').addEventListener('click', () => {
      currentView = currentView === 'all' ? 'me' : 'all';
      toggleButton.innerText = `View: ${currentView === 'all' ? 'All Posts' : 'My Posts'}`;
      fetchAndRenderPosts();
    });

    fetchAndRenderPosts()

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
  
      {/* Conditionally render the hovered point's image */}
      {hoveredPoint && (
        <div 
          style={{
            position: 'fixed', // Use fixed positioning to overlay the image on the screen
            top: '50%', // Center the image vertically
            left: '50%', // Center the image horizontally
            transform: 'translate(-50%, -50%)', // Correct the image position to be perfectly centered
            backgroundColor: 'rgba(0, 0, 0, 0.7)', // Semi-transparent background
            padding: '20px',
            borderRadius: '10px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.5)',
            zIndex: 9999, // Make sure it's on top of the globe
            textAlign: 'center', // Center the title and image
          }}
        >
          <h3 style={{ color: 'white' }}>{hoveredPoint.title}</h3>
          <p style={{ color: 'white' }}>{hoveredPoint.content}</p>
          <img 
            src={hoveredPoint.image} 
            alt={hoveredPoint.title} 
            style={{ width: '50px', height: 'auto', borderRadius: '8px' }} // Make image size smaller
          />
        </div>
      )}
    </div>
  );
  ;
};


export default GlobeComponent;
