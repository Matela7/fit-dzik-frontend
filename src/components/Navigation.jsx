// src/components/Navigation.jsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navigation.css';

const Navigation = () => {
  const location = useLocation();
  const { user, logout, isAuthenticated } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <nav className="navigation">
      <div className="nav-container">
        <Link to="/" className="nav-logo">
          🏋️‍♂️ FIT DZIK
        </Link>
        
        <div className="nav-links">
          <Link 
            to="/" 
            className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
          >
            Strona główna
          </Link>
          
          {isAuthenticated() ? (
            <>
              <Link 
                to="/dashboard" 
                className={`nav-link ${location.pathname === '/dashboard' ? 'active' : ''}`}
              >
                Dashboard
              </Link>
              <Link 
                to="/create-workout" 
                className={`nav-link ${location.pathname === '/create-workout' ? 'active' : ''}`}
              >
                Nowy trening
              </Link>
              <Link 
                to="/exercise-library" 
                className={`nav-link ${location.pathname === '/exercise-library' ? 'active' : ''}`}
              >
                Biblioteka ćwiczeń
              </Link>
              <Link 
                to="/ai-trainer" 
                className={`nav-link ${location.pathname === '/ai-trainer' ? 'active' : ''}`}
              >
                AI Trener
              </Link>
              <div className="user-info">
                <span className="user-name">
                  👋 {user?.firstName} {user?.surname}
                </span>
                <button onClick={handleLogout} className="logout-btn">
                  Wyloguj 🚪
                </button>
              </div>
            </>
          ) : (
            <div className="auth-links">
              <Link 
                to="/login" 
                className={`auth-link login ${location.pathname === '/login' ? 'active' : ''}`}
              >
                Zaloguj się
              </Link>
              <Link 
                to="/register" 
                className={`auth-link register ${location.pathname === '/register' ? 'active' : ''}`}
              >
                Rejestracja
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;