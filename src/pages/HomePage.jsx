// src/pages/HomePage.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const HomePage = () => {
  return (
    <div className="homepage">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="hero-text"
          >
            <h1 className="hero-title">
              🏋️‍♂️ <span className="brand">FIT DZIK</span> 🏋️‍♂️
            </h1>
            <p className="hero-subtitle">
              Twoja SUPER aplikacja do treningu! 💪
            </p>
            <p className="hero-description">
              Śledź swoje treningi, monitoruj postępy i osiągaj swoje cele fitness 
              z najlepszą aplikacją treningową w Polsce!
            </p>
            <div className="hero-buttons">
              <Link to="/register" className="btn btn-primary">
                Zacznij trenować! 🚀
              </Link>
              <Link to="/dashboard" className="btn btn-secondary">
                Mam już konto
              </Link>
            </div>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="hero-image"
          >
            <div className="fitness-icon">🏃‍♂️</div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <div className="container">
          <h2 className="section-title">Dlaczego FIT DZIK jest SUPER? 🔥</h2>
          <div className="features-grid">
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="feature-card"
            >
              <div className="feature-icon">📊</div>
              <h3>Śledź postępy</h3>
              <p>Monitoruj swoje treningi, kalorie i rozwój w czasie rzeczywistym</p>
            </motion.div>
            
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="feature-card"
            >
              <div className="feature-icon">🎯</div>
              <h3>Osiągaj cele</h3>
              <p>Ustal cele treningowe i śledź swoje osiągnięcia każdego dnia</p>
            </motion.div>
            
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="feature-card"
            >
              <div className="feature-icon">💪</div>
              <h3>Różnorodne ćwiczenia</h3>
              <p>Bogata baza ćwiczeń dla wszystkich grup mięśniowych</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta">
        <div className="container">
          <h2>Gotowy na zmianę? 🌟</h2>
          <p>Dołącz do tysięcy zadowolonych użytkowników FIT DZIK!</p>
          <Link to="/register" className="btn btn-primary btn-large">
            Rozpocznij przygodę! 🚀
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
