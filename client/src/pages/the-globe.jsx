import React from 'react';
import GlobeComponent from '../components/the-globe';

const GlobePage = () => {
  return (
    <div style={{ textAlign: 'center', marginTop: '20px' }}>
      <h1 style={{color: 'white'}}>Explore the Globe</h1>
      <p style={{color: 'white'}}>See the world as you do.</p>
      
      {/* GlobeComponent renders the interactive globe */}
      <GlobeComponent />

      {/* Optional: Add a back button to return to the home page */}
      <div style={{ marginTop: '20px' }}>
        <a href="#/">Back to Home</a>
      </div>
    </div>
  );
};

export default GlobePage;
