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
      <div className="dashboard">
        <div className="dashboard-container">
          <div className="dashboard-loading">
            <div className="loading-spinner"></div>
            <p className="loading-text">Ładowanie Twojego dashboardu...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard">
        <div className="dashboard-container">
          <div className="dashboard-error">
            <div className="error-message">
              <h3>❌ Błąd połączenia</h3>
              <p>{error}</p>
              <button onClick={fetchDashboardData} className="retry-button">
                🔄 Spróbuj ponownie
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="dashboard-container">
        <div className="dashboard-header">
          <h1>📊 Dashboard</h1>
          <p>Witaj z powrotem {user?.firstName}! Oto Twoje postępy w FIT DZIK</p>
        </div>

        {/* Statystyki */}
        <div className="stats-section">
          <h2 className="section-title">📈 Twoje statystyki</h2>
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
        </div>

        {/* Ostatnie treningi */}
        <div className="recent-workouts">
          <div className="workouts-header">
            <h2 className="section-title">🏃‍♂️ Ostatnie treningi</h2>
            <a href="/create-workout" className="new-workout-btn">
              ➕ Nowy trening
            </a>
          </div>
          {sessions.length === 0 ? (
            <div className="no-workouts">
              <div className="no-workouts-icon">🏋️‍♂️</div>
              <h3>Jeszcze nie masz żadnych treningów!</h3>
              <p>Czas zacząć swoją przygodę z FIT DZIK i stać się prawdziwym dzikiem fitness!</p>
              <a href="/create-workout" className="btn btn-primary">
                🚀 Rozpocznij pierwszy trening
              </a>
            </div>
          ) : (
            <div className="workouts-grid">
              {sessions.slice(0, 6).map((session, index) => (
                <motion.div 
                  key={session.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="workout-card"
                  onClick={() => openWorkoutDetails(session)}
                >
                  <div className="workout-card-header">
                    <h3>Trening #{session.id}</h3>
                    <p>{formatDate(session.startTime)}</p>
                  </div>
                  <div className="workout-card-body">
                    <div className="workout-meta">
                      <div className="workout-duration">
                        ⏱️ {formatDuration(session.startTime, session.endTime)}
                      </div>
                      <div className="workout-date">
                        📅 {new Date(session.startTime).toLocaleDateString('pl-PL')}
                      </div>
                    </div>
                    <div className="workout-exercises">
                      <strong>Ćwiczenia:</strong> {exercises.filter(ex => ex.sessionId === session.id).length || 'Brak danych'}
                    </div>
                    <div className="workout-calories">
                      🔥 {session.caloriesBurned || 0} kcal
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Modal z szczegółami treningu */}
        {selectedWorkout && (
          <WorkoutDetails 
            session={selectedWorkout}
            onClose={closeWorkoutDetails}
          />
        )}
      </div>
    </div>
  );
};

export default Dashboard;
