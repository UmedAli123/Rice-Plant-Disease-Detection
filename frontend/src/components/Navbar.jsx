import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Leaf, Home, ScanSearch, Camera, Info, Menu, X, LogOut, User } from 'lucide-react';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const { user, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location]);

  const isActive = (path) => location.pathname === path ? 'active' : '';

  if (!user) return null;

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="container">
        <Link to="/" className="navbar-brand">
          <Leaf size={24} className="brand-icon" />
          <span className="brand-text">RiceGuard AI</span>
        </Link>

        <button
          className="mobile-toggle"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle navigation"
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>

        <ul className={`nav-links ${mobileOpen ? 'open' : ''}`}>
          <li>
            <Link to="/" className={isActive('/')}>
              <Home size={16} /> Home
            </Link>
          </li>
          <li>
            <Link to="/detect" className={isActive('/detect')}>
              <ScanSearch size={16} /> Detect
            </Link>
          </li>
          <li>
            <Link to="/webcam" className={isActive('/webcam')}>
              <Camera size={16} /> Live Camera
            </Link>
          </li>
          <li>
            <Link to="/about" className={isActive('/about')}>
              <Info size={16} /> About
            </Link>
          </li>
          <li className="nav-divider" />
          <li className="nav-user">
            <User size={14} />
            <span className="nav-user-name">{user.name}</span>
          </li>
          <li>
            <button className="nav-logout" onClick={logout}>
              <LogOut size={15} />
              <span>Logout</span>
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
}
