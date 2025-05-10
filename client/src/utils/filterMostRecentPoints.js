// utils/filterMostRecentPoints.js

export const filterMostRecentPoints = (posts) => {
    const locationMap = new Map();
  
    posts.forEach(post => {
      const key = `${post.location}`; // Create a unique key based on latitude and longitude
  
      if (!locationMap.has(key) || post.createdAt > locationMap.get(key).createdAt) {
        locationMap.set(key, post); // Keep the most recent post for each unique location
      }
    });
  
    return Array.from(locationMap.values());
  };
  