// src/pages/Register.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import './Auth.css';

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    surname: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Sprawdź czy hasła się zgadzają
    if (formData.password !== formData.confirmPassword) {
      setError('Hasła nie są identyczne!');
      setLoading(false);
      return;
    }

    // Sprawdź długość hasła
    if (formData.password.length < 6) {
      setError('Hasło musi mieć przynajmniej 6 znaków!');
      setLoading(false);
      return;
    }

    try {
      const userData = {
        firstName: formData.firstName,
        surname: formData.surname,
        email: formData.email,
        password: formData.password
      };

      const response = await authAPI.register(userData);
      console.log('Registration successful:', response.data);
      
      // Automatycznie zaloguj użytkownika po rejestracji
      const newUser = {
        id: response.data.id,
        email: response.data.email,
        firstName: response.data.firstName,
        surname: response.data.surname
      };
      
      const token = 'mock_jwt_token_' + Date.now();
      
      login(newUser, token);
      
      // Przekieruj do dashboard
      navigate('/dashboard');
      
    } catch (err) {
      console.error('Registration error:', err);
      if (err.response?.status === 409) {
        setError('Użytkownik z tym emailem już istnieje!');
      } else {
        setError('Wystąpił błąd podczas rejestracji. Spróbuj ponownie.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="auth-container">
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="success-message"
        >
          <h1>🎉 Rejestracja udana!</h1>
          <p>Twoje konto zostało utworzone pomyślnie!</p>
          <p>Możesz teraz się zalogować i zacząć treningi z FIT DZIK! 💪</p>
          <Link to="/login" className="btn btn-primary">
            Przejdź do logowania 🚀
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="auth-container">
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="auth-form"
      >
        <h1>Dołącz do FIT DZIK! 🏋️‍♂️</h1>
        <p>Stwórz konto i zacznij swoją przygodę z treningiem!</p>
        
        {error && (
          <div className="error-message">
            ❌ {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="firstName">Imię:</label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              required
              placeholder="np. Jan"
            />
          </div>

          <div className="form-group">
            <label htmlFor="surname">Nazwisko:</label>
            <input
              type="text"
              id="surname"
              name="surname"
              value={formData.surname}
              onChange={handleChange}
              required
              placeholder="np. Kowalski"
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="twoj.email@gmail.com"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Hasło:</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Minimum 6 znaków"
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Potwierdź hasło:</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              placeholder="Powtórz hasło"
            />
          </div>

          <button 
            type="submit" 
            className="btn btn-primary full-width"
            disabled={loading}
          >
            {loading ? 'Tworzenie konta...' : 'Stwórz konto 🚀'}
          </button>
        </form>

        <div className="auth-links">
          <p>
            Masz już konto?{' '}
            <Link to="/login" className="auth-link">
              Zaloguj się tutaj
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;
