import React from 'react';
import './navbar.css';

function Navbar() {
  return (
  <>
      <div className='navigation'>
           <a href="/" className='logo'>
               <img src="images/globe-icon2.png" alt="logo" />
           </a>
          <nav className='navigation-menu'>
              <ul>
                <li><a className='nav-link nav-link-line' href="#about">About</a></li>
                <li><a className='nav-link nav-link-line' href="#destination">Destination</a></li>
                <li><a className='nav-link nav-link-line' href="#newsletter">Newsletter</a></li>
              </ul>
          </nav>
      </div>
  </>
  )
}

export default Navbar
