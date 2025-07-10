// src/pages/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { workoutAPI, exerciseAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import WorkoutDetails from '../components/WorkoutDetails';
import './Dashboard.css';

const Dashboard = () => {
  const [sessions, setSessions] = useState([]);
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedWorkout, setSelectedWorkout] = useState(null);
  const [stats, setStats] = useState({
    totalSessions: 0,
    totalExercises: 0,
    caloriesBurned: 0,
    thisWeekSessions: 0
  });

  const { user } = useAuth();
  const userId = user?.id || 1;

  useEffect(() => {
    fetchDashboardData();
  }, [userId]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Pobierz sesje użytkownika
      const sessionsResponse = await workoutAPI.getSessionsByUserId(userId);
      const userSessions = sessionsResponse.data;
      setSessions(userSessions);

      // Pobierz ćwiczenia użytkownika
      const exercisesResponse = await exerciseAPI.getExercisesByUserId(userId);
      const userExercises = exercisesResponse.data;
      setExercises(userExercises);

      // Oblicz statystyki
      const totalCalories = userSessions.reduce((sum, session) => 
        sum + (session.caloriesBurned || 0), 0);
      
      const thisWeek = getThisWeekSessions(userSessions);
      
      setStats({
        totalSessions: userSessions.length,
        totalExercises: userExercises.length,
        caloriesBurned: totalCalories,
        thisWeekSessions: thisWeek
      });

    } catch (error) {
      console.error('Błąd podczas pobierania danych:', error);
      setError('Nie można połączyć się z serwerem. Sprawdź czy backend jest uruchomiony.');
      
      // Ustaw przykładowe dane dla demonstracji
      const mockSessions = [
        {
          id: 1,
          startTime: "2025-07-10T10:00:00Z",
          endTime: "2025-07-10T11:30:00Z",
          caloriesBurned: 450
        },
        {
          id: 2,
          startTime: "2025-07-08T16:00:00Z",
          endTime: "2025-07-08T17:00:00Z",
          caloriesBurned: 320
        }
      ];
      
      const mockExercises = [
        { id: 1, exerciseName: "Pompki", sets: 3, reps: 15 },
        { id: 2, exerciseName: "Przysiady", sets: 4, reps: 12 },
        { id: 3, exerciseName: "Plank", sets: 3, reps: 0 }
      ];
      
      setSessions(mockSessions);
      setExercises(mockExercises);
      
      setStats({
        totalSessions: mockSessions.length,
        totalExercises: mockExercises.length,
        caloriesBurned: mockSessions.reduce((sum, s) => sum + s.caloriesBurned, 0),
        thisWeekSessions: mockSessions.length
      });
    } finally {
      setLoading(false);
    }
  };

  const getThisWeekSessions = (sessions) => {
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    
    return sessions.filter(session => 
      new Date(session.startTime) >= weekAgo
    ).length;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Brak daty';
    try {
      return new Date(dateString).toLocaleDateString('pl-PL', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      console.error('Error formatting date:', error, dateString);
      return 'Nieprawidłowa data';
    }
  };

  const formatDuration = (start, end) => {
    if (!start || !end) return 'Brak danych';
    
    const startTime = new Date(start);
    const endTime = new Date(end);
    const duration = Math.round((endTime - startTime) / (1000 * 60)); // minuty
    
    return `${duration} min`;
  };

  const openWorkoutDetails = (session) => {
    setSelectedWorkout(session);
  };

  const closeWorkoutDetails = () => {
    setSelectedWorkout(null);
  };

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="spinner">🏋️‍♂️</div>
        <p>Ładowanie Twojego dashboardu...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-error">
        <div className="error-message">
          <h2>❌ Błąd połączenia</h2>
          <p>{error}</p>
          <button onClick={fetchDashboardData} className="retry-button">
            🔄 Spróbuj ponownie
          </button>
          <div className="error-help">
            <p><strong>Możliwe rozwiązania:</strong></p>
            <ul>
              <li>Sprawdź czy backend jest uruchomiony na http://localhost:8080</li>
              <li>Sprawdź połączenie internetowe</li>
              <li>Sprawdź czy serwer API działa poprawnie</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Dashboard 📊</h1>
        <p>Witaj z powrotem {user?.firstName}! Oto Twoje postępy w FIT DZIK:</p>
      </div>

      {/* Statystyki */}
      <div className="stats-grid">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="stat-card"
        >
          <div className="stat-icon">🏋️‍♂️</div>
          <div className="stat-info">
            <h3>{stats.totalSessions}</h3>
            <p>Łączne treningi</p>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="stat-card"
        >
          <div className="stat-icon">💪</div>
          <div className="stat-info">
            <h3>{stats.totalExercises}</h3>
            <p>Wykonane ćwiczenia</p>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="stat-card"
        >
          <div className="stat-icon">🔥</div>
          <div className="stat-info">
            <h3>{stats.caloriesBurned}</h3>
            <p>Spalone kalorie</p>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="stat-card"
        >
          <div className="stat-icon">📅</div>
          <div className="stat-info">
            <h3>{stats.thisWeekSessions}</h3>
            <p>Treningi ten tydzień</p>
          </div>
        </motion.div>
      </div>

      {/* Ostatnie treningi */}
      <div className="recent-workouts">
        <h2>Ostatnie treningi 🏃‍♂️</h2>
        {sessions.length === 0 ? (
          <div className="no-data">
            <p>Jeszcze nie masz żadnych treningów! 😢</p>
            <p>Czas zacząć swoją przygodę z FIT DZIK!</p>
          </div>
        ) : (
          <div className="workouts-list">
            {sessions.slice(0, 5).map((session, index) => (
              <motion.div 
                key={session.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="workout-card"
              >
                <div className="workout-info">
                  <h3>Trening #{session.id}</h3>
                  <p className="workout-date">{formatDate(session.startTime)}</p>
                  <p className="workout-duration">
                    Czas: {formatDuration(session.startTime, session.endTime)}
                  </p>
                </div>
                <div className="workout-stats">
                  <div className="workout-stat">
                    <span className="stat-value">{session.caloriesBurned || 0}</span>
                    <span className="stat-label">kcal</span>
                  </div>
                </div>
                <div className="workout-actions">
                  <button 
                    onClick={() => openWorkoutDetails(session)}
                    className="view-details-btn"
                    title="Zobacz szczegóły treningu"
                  >
                    👁️ Szczegóły
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Motivational Quote */}
      <div className="motivation">
        <h2>💪 Motywacja dnia</h2>
        <p>"Jedynym złym treningiem jest ten, którego nie zrobiłeś!"</p>
        <p className="motivation-author">- FIT DZIK Team</p>
      </div>

      {/* Modal z szczegółami treningu */}
      {selectedWorkout && (
        <WorkoutDetails 
          session={selectedWorkout}
          onClose={closeWorkoutDetails}
        />
      )}
    </div>
  );
};

export default Dashboard;
