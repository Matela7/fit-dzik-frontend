// src/pages/Login.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import './Auth.css';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
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

    try {
      const response = await authAPI.login(formData);
      console.log('Login successful:', response.data);
      
      // Symulujemy sukces logowania
      const userData = {
        id: response.data.id || 1,
        email: formData.email,
        firstName: response.data.firstName || 'Użytkownik',
        surname: response.data.surname || 'FitDzik'
      };
      
      const token = response.data.token || 'mock_jwt_token_12345';
      
      // Zaloguj użytkownika w kontekście
      login(userData, token);
      
      // Przekieruj do dashboard
      navigate('/dashboard');
      
    } catch (err) {
      console.error('Login error:', err);
      setError('Błędny email lub hasło. Spróbuj ponownie.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="auth-form"
      >
        <h1>Zaloguj się do FIT DZIK 🏋️‍♂️</h1>
        
        {error && (
          <div className="error-message">
            ❌ {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
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
              placeholder="Wprowadź hasło"
            />
          </div>

          <button 
            type="submit" 
            className="btn btn-primary full-width"
            disabled={loading}
          >
            {loading ? 'Logowanie...' : 'Zaloguj się 🚀'}
          </button>
        </form>

        <div className="auth-links">
          <p>
            Nie masz konta?{' '}
            <Link to="/register" className="auth-link">
              Zarejestruj się tutaj
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
