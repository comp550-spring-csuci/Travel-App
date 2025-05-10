// src/GlobeComponent.js
import React, { useRef, useEffect, useState, useContext } from 'react';
import { AppContext } from '../lib';
import { useNavigate } from 'react-router-dom';
import { filterMostRecentPoints } from '../utils/filterMostRecentPoints';
import Globe from 'globe.gl';

// Create toggle styling
// let toggleButton = document.getElementById('toggleView');

// if (!toggleButton) {
//   toggleButton = document.createElement("button")
//   toggleButton.id = 'toggleView';
//   toggleButton.innerText = 'View: All Posts';
//   toggleButton.style.position = 'absolute';
//   toggleButton.style.top = '150px';
//   toggleButton.style.left = '0px';
//   toggleButton.style.zIndex = '1000';
//   toggleButton.style.padding = '0px';
//   toggleButton.style.background = '#222';
//   toggleButton.style.color = '#fff';
//   toggleButton.style.border = 'none';
//   toggleButton.style.cursor = 'pointer';
//   document.body.appendChild(toggleButton);
// }

const haversineDistance = (lat1, lon1, lat2, lon2) => {
  const toRadians = angle => angle * (Math.PI / 180);
  const R = 3958.8; // Earth radius in miles

  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);
  const a = Math.sin(dLat / 2) ** 2 +
            Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
            Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
};



const GlobeComponent = () => {
  const globeContainerRef = useRef(null);
  // const globeEl = useRef();
  const [pointsData, setPointsData] = useState([]);
  const [mode, setMode] = useState('light');
  const { token } = useContext(AppContext);
  // const [globeInstance, setGlobeInstance] = useState(null);
  const [hash, setHash] = useState(window.location.hash); // Track the current hash
  const [hoveredPoint, setHoveredPoint] = useState(null);
  // const navigate = useNavigate();

  // const navigate = useNavigate()

  const toggleMode = () => {
    setMode(prevMode => (prevMode === 'light' ? 'dark' : 'light'));
  }

  const lightModeImageUrl = '//unpkg.com/three-globe/example/img/earth-day.jpg';
  const darkModeImageUrl = '//unpkg.com/three-globe/example/img/earth-night.jpg';

  



useEffect(() => {
  // Only create button if on the globe page

    if (window.location.hash !== '#the-globe') return;

  let toggleButton = document.getElementById('toggleView');
  if (!toggleButton) {
    toggleButton = document.createElement("button");
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

  // Clean up on unmount
  // return () => {
  //   toggleButton?.remove();
  // };


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
        // const separatedPoints = spreadOverlappingPoints([homeMarker, ...posts]);
        // setPointsData(separatedPoints);
        const filteredPoints = filterMostRecentPoints(allPoints);
        globe.pointsData(filteredPoints);
        console.log("All points:", allPoints)
        // globe
        // .pointsData(allPoints)
        globe
        .globeImageUrl(mode === 'light' ? lightModeImageUrl : darkModeImageUrl )
    // .globeImageUrl('//unpkg.com/three-globe/example/img/earth-day.jpg')
        .pointLat(d => d.latitude)
        .pointLng(d => d.longitude)
        // .pointLabel(d => `${d.title}: ${d.content} ${d.image} `)
        .pointColor(d => d.isHome ? 'blue': 'red')
        .pointAltitude(d => d.isHome ? 0.3 : 0.2)
         // Thicker/taller point for 'home'
        .pointRadius(d => d.isHome ? 0.5 : 0.3)   // width (thickness)
        let clickTimeout = null;

        globe.onPointClick(async (point) => {
          // Check if the point has city or location info
          if (point.location) {
            try {
              // Fetch the posts for that city (or location) from your API
              const encodedLocation = encodeURIComponent(point.location);
              const response = await fetch(`http://localhost:3001/api/blogs/city/${encodedLocation}`, {
                headers: {
                  'x-access-token': token,  // x-access-token format
                },
              });

              const posts = await response.json();
        
              if (posts.length === 1) {
                // If there's only one post for this city, navigate to the individual post page
                const postId = posts[0]._id; // Assuming each post has a unique _id
                window.location.hash = `#blog/${postId}`;
              } else if (posts.length > 1) {
                // If there are multiple posts for this city, navigate to the city blogs page
                window.location.hash = `#city/${encodedLocation}`;
              } else {
                console.warn('No posts found for this city');
              }
            } catch (err) {
              console.error('Error fetching posts for the city', err);
            }
          } else {
            console.warn('No city found for point', point);
          }
        })
        
        // .pointAltitude(.3)
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
          const arcs = posts.map(post => {
            const distance = haversineDistance(homeLat, homeLng, post.latitude, post.longitude);
            return {
              startLat: homeLat,
              startLng: homeLng,
              endLat: post.latitude,
              endLng: post.longitude,
              distance: distance.toFixed(2), // optional: format to 2 decimal places
              title: post.title
            };
          });
          
        globe.arcsData(arcs)
        .arcColor(() =>
          currentView === 'all' ? 'rgba(0, 255, 0, 0.8)' : 'rgba(255, 165, 0, 0.8)'
        )
        .arcsTransitionDuration(0)
        .arcLabel(d => `To ${d.title}<br/>${d.distance} miles`)
        .arcDashLength(0.3)
        .arcDashGap(.1)
        .arcStroke(2)
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
      if (toggleButton) {
        document.body.removeChild(toggleButton);
      }
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
            right: '50%', // Center the image horizontally
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
          {/* <p style={{ color: 'white' }}>{hoveredPoint.content}</p> */}
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
