import React, {useState} from 'react';
import './navbar.css';
import { Link } from 'react-router-dom';
import TheGlobePage from '../pages/the-globe';

function Navbar() {
  // State to store the search query
  const [searchQuery, setSearchQuery] = useState('');

  // Handle input change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // We can implement search functionality here, such as filtering a list of items
  // For now, we'll just log the search query when it's updated
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    console.log('Searching for:', searchQuery);
  };  

  return (
  <>
      <div className='navigation'>
           <a href="/" className='logo'>
               <img src="images/globe-icon2.png" alt="logo" />
           </a>
        {/* adding the search filter inside the navbar */}
        <form onSubmit={handleSearchSubmit} className="search-form">
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="search-input"
          />
          <button type="submit" className="search-button">Search</button>
        </form>

          <nav className='navigation-menu'>
              <ul>
                <li><a className='nav-link nav-link-line' href="#about">About</a></li>
                <li><a className='nav-link nav-link-line' href="#blog-feed">Blog Posts</a></li>
                <li><a className='nav-link nav-link-line' href="#newsletter">Newsletter</a></li>
                <li><a className='nav-link nav-link-line' href="#sign-up">Log In</a></li>
                <li><a className='nav-link nav-link-line' href="#add-blog">Add Blog</a></li>
                <li>
                  <a className='nav-link nav-link-line' href='#the-globe'>The Globe</a> 
                  </li>
              </ul>
          </nav>
      </div>
  </>
  )
}

export default Navbar;
