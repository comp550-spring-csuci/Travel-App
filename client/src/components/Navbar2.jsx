import React, {useState, useContext} from 'react';
import './navbar.css';
import { AppContext } from '../lib';
import { Link } from 'react-router-dom';
import TheGlobePage from '../pages/the-globe';

function Navbar() {
  // State to store the search query
  const [searchQuery, setSearchQuery] = useState('');
  const {user, handleSignOut} = useContext(AppContext);

  // Handle input change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // We can implement search functionality here, such as filtering a list of items
  // For now, we'll just log the search query when it's updated
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const req = {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify({ searchString: searchQuery })
    };
    fetch(`/api/post/search`, req)
        .then(async res => {
        const result = await res.json();
        if (!res.ok) throw new Error(res.status);})
        .catch(err => {
        console.error("Auth error:", err);
        });
    
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
                {!user ? (
                  <>
                    <li><a className='nav-link nav-link-line' href="#sign-in">Log In</a></li>
                    <li><a className='nav-link nav-link-line' href='#sign-up'>Register</a></li>
                  </>
                ) : (
                  <>
                    <li><a className='nav-link nav-link-line' href="#blog-feed-all">All Posts</a></li>
                    <li><a className='nav-link nav-link-line' href="#blog-feed">My Blog</a></li>
                    <li><a className='nav-link nav-link-line' href='#the-globe'>The Globe</a></li>

                    <li className='nav-text'>Hi, {user.username}</li>
                    <li>
                      <button
                        className='btn btn-link nav-link-line'
                        onClick={handleSignOut}
                        style={{ padding: 0 }}
                      >
                        Sign Out
                      </button>
                    </li>
                  </>
                )}
              </ul>
          </nav>
      </div>
  </>
  )
}

export default Navbar;
