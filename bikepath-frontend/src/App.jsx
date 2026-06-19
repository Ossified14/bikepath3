import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom'
import { Menu, X, Bike, User } from 'lucide-react'
import './App.css'
import Login from './components/Login'
import Register from './components/Register'
import MapPage from './pages/MapPage'
import ActivityPage from './pages/ActivityPage'
import ProfilePage from './pages/ProfilePage'
import CommunityPage from './pages/CommunityPage'
import FriendsPage from './pages/FriendsPage'
import { getProfile } from './services/bikepathService'

function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [userData, setUserData] = useState(null);
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (token) {
      loadNavbarData();
    }
  }, [token]);

  const loadNavbarData = async () => {
    try {
      const res = await getProfile();
      if (res.data.status && res.data.data) {
        setUserData(res.data.data);
      }
    } catch (err) {
      const savedUser = localStorage.getItem('user');
      if (savedUser) setUserData(JSON.parse(savedUser));
    }
  };

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/map" className="nav-logo" onClick={closeMenu}>
          <Bike size={32} color="var(--z-blue)" />
          <span>BIKE<span>PATH</span></span>
        </Link>

        {/* Hamburger Icon - Only for Mobile via CSS */}
        <div className="menu-icon" onClick={toggleMenu}>
          {isOpen ? <X size={32} /> : <Menu size={32} />}
        </div>

        {/* Nav Menu */}
        <ul className={isOpen ? 'nav-menu active' : 'nav-menu'}>
          {!token ? (
            <>
              <li className="nav-item">
                <Link to="/" className="nav-links" onClick={closeMenu}>LOGIN</Link>
              </li>
              <li className="nav-item">
                <Link to="/register" className="nav-links" onClick={closeMenu}>SIGN UP</Link>
              </li>
            </>
          ) : (
            <>
              <li className="nav-item">
                <Link to="/map" className="nav-links" onClick={closeMenu}>MAP</Link>
              </li>
              <li className="nav-item">
                <Link to="/activity" className="nav-links" onClick={closeMenu}>ACTIVITY</Link>
              </li>
              <li className="nav-item">
                <Link to="/community" className="nav-links" onClick={closeMenu}>COMMUNITY</Link>
              </li>
              <li className="nav-item">
                <Link to="/friends" className="nav-links" onClick={closeMenu}>FRIENDS</Link>
              </li>

              <li className="nav-item">
                <Link to="/profile" className="nav-links profile-trigger" onClick={closeMenu}>
                  <div className="profile-avatar">
                    {userData?.avatar ? (
                      <img src={userData.avatar} alt="avatar" />
                    ) : (
                      <User size={20} color="#fff" />
                    )}
                  </div>
                  <span className="username-text" style={{ display: 'none' }}>{userData?.username || 'Rider'}</span>
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
}

function App() {
  return (
    <Router>
      <Navigation />
      <div className="main-content">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/map" element={<MapPage />} />
          <Route path="/activity" element={<ActivityPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/community" element={<CommunityPage />} />
          <Route path="/friends" element={<FriendsPage />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App


