import React from 'react';
import logo from '../../assets/NavLogo.svg';
import Button from '../../assets/useButton.svg';
import './Navbar.css';

function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <img src={logo} alt="Logo" />
      </div>
      <div className="navbar-links">
        <a href="#">How it works</a>
        <a href="#">Docs</a>
        <a href="#">About</a>
        <a href="/dashboard">
          <img src={Button} alt="Button" style={{ marginLeft: 'auto' }} />
        </a>
      </div>
    </nav>
  );
}

export default Navbar;
