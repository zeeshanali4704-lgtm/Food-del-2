import React, { useState, useContext } from 'react';
import './Navbar.css';
import { assets } from '../../assets/assets';
import { Link, useNavigate } from 'react-router-dom';
import { StoreContext } from '../context/shopContext';

function Navbar({ setShowLogin }) {
  const [menu, setMenu] = useState('home');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { cartItems, token, setToken } = useContext(StoreContext);
  const navigate = useNavigate();

  const getTotalCartQuantity = () => {
    let total = 0;
    for (const item in cartItems) {
      total += cartItems[item];
    }
    return total;
  };

  const totalQuantity = getTotalCartQuantity();

  const handleLogout = () => {
    setToken(null);
    localStorage.removeItem('token');
    setDropdownOpen(false);
    navigate('/');
  };

  return (
    <div className="navbar">
      <Link to="/">
        <img className="logo" src={assets.logo} alt="Logo" />
      </Link>

      <ul className="navbar-menu">
        <Link
          to="/"
          onClick={() => setMenu('home')}
          className={menu === 'home' ? 'active' : ''}
        >
          Home
        </Link>
        <a
          href="#explore-menu"
          onClick={() => setMenu('menu')}
          className={menu === 'menu' ? 'active' : ''}
        >
          Menu
        </a>
        <a
          href="#app-download"
          onClick={() => setMenu('mobile-app')}
          className={menu === 'mobile-app' ? 'active' : ''}
        >
          Mobile App
        </a>
        <a
          href="#footer"
          onClick={() => setMenu('contact-us')}
          className={menu === 'contact-us' ? 'active' : ''}
        >
          Contact Us
        </a>
      </ul>

      <div className="navbar-right">
        <img src={assets.search_icon} alt="Search" />

        <div className="navbar-search-icon">
          <Link to="/cart">
            <img src={assets.basket_icon} alt="Basket" />
          </Link>
          {totalQuantity > 0 && <div className="dot">{totalQuantity}</div>}
        </div>

        {!token ? (
          <button onClick={() => setShowLogin(true)}>Sign In</button>
        ) : (
          <div className="navbar-profile">
            <img
              src={assets.profile_icon}
              alt="Profile"
              onClick={() => setDropdownOpen(!dropdownOpen)}
            />
            {dropdownOpen && (
              <ul className="nav-profile-dropdown">
                <li onClick={() => { setDropdownOpen(false); navigate('/myorders'); }}>
                  <img src={assets.bag_icon} alt="Orders" />
                  <p>Orders</p>
                </li>
                <hr />
                <li onClick={handleLogout}>
                  <img src={assets.logout_icon} alt="Logout" />
                  <p>Logout</p>
                </li>
              </ul>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Navbar;