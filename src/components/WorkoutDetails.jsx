// src/components/WorkoutDetails.jsx
import React, { useState, useEffect } from 'react';
import { exerciseAPI } from '../services/api';
import { motion } from 'framer-motion';
import './WorkoutDetails.css';

const WorkoutDetails = ({ session, onClose }) => {
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchWorkoutExercises();
  }, [session.id]);

  const fetchWorkoutExercises = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Pobierz ćwiczenia dla tej sesji
      const response = await exerciseAPI.getExercisesBySessionId(session.id);
      const sessionExercises = response.data || [];
      setExercises(sessionExercises);
      
    } catch (err) {
      console.error('Error fetching exercises:', err);
      setError('Nie można załadować ćwiczeń dla tego treningu');
      
      // Mock data dla demonstracji
      setExercises([
        {
          id: 1,
          exerciseName: "Pompki",
          sets: 3,
          reps: 15,
          weight: 0,
          duration: ""
        },
        {
          id: 2,
          exerciseName: "Przysiady",
          sets: 4,
          reps: 12,
          weight: 20,
          duration: ""
        },
        {
          id: 3,
          exerciseName: "Plank",
          sets: 3,
          reps: 0,
          weight: 0,
          duration: "60 sekund"
        }
      ]);
    } finally {
      setLoading(false);
    }
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
      return 'Nieprawidłowa data';
    }
  };

  const formatDuration = (start, end) => {
    if (!start || !end) return 'Brak danych';
    
    const startTime = new Date(start);
    const endTime = new Date(end);
    const duration = Math.round((endTime - startTime) / (1000 * 60));
    
    return `${duration} min`;
  };

  const getTotalSets = () => {
    return exercises.reduce((total, exercise) => total + (exercise.sets || 0), 0);
  };

  const getTotalReps = () => {
    return exercises.reduce((total, exercise) => total + (exercise.reps || 0), 0);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="workout-details-overlay"
      onClick={onClose}
    >
      <motion.div 
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        className="workout-details-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="workout-details-header">
          <div className="header-content">
            <h2>🏋️‍♂️ Szczegóły treningu #{session.id}</h2>
            <button onClick={onClose} className="close-button">✕</button>
          </div>
          
          <div className="workout-summary">
            <div className="summary-item">
              <span className="summary-label">Data:</span>
              <span className="summary-value">{formatDate(session.startTime)}</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Czas trwania:</span>
              <span className="summary-value">{formatDuration(session.startTime, session.endTime)}</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Spalone kalorie:</span>
              <span className="summary-value">{session.caloriesBurned || 0} kcal</span>
            </div>
          </div>
        </div>

        <div className="workout-details-content">
          {loading ? (
            <div className="loading-section">
              <div className="spinner">💪</div>
              <p>Ładowanie ćwiczeń...</p>
            </div>
          ) : error ? (
            <div className="error-section">
              <p>❌ {error}</p>
              <p>Pokazuję przykładowe ćwiczenia dla demonstracji.</p>
            </div>
          ) : null}

          {exercises.length === 0 && !loading ? (
            <div className="no-exercises">
              <p>Brak ćwiczeń w tym treningu 🤔</p>
            </div>
          ) : (
            <div className="exercises-section">
              <div className="section-header">
                <h3>💪 Wykonane ćwiczenia ({exercises.length})</h3>
                <div className="quick-stats">
                  <span className="quick-stat">
                    📊 {getTotalSets()} serii
                  </span>
                  <span className="quick-stat">
                    🔢 {getTotalReps()} powtórzeń
                  </span>
                </div>
              </div>
              
              <div className="exercises-list">
                {exercises.map((exercise, index) => (
                  <motion.div 
                    key={exercise.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="exercise-card"
                  >
                    <div className="exercise-info">
                      <h4 className="exercise-name">{exercise.exerciseName}</h4>
                      <div className="exercise-details">
                        {exercise.sets > 0 && (
                          <span className="detail-item">
                            📊 {exercise.sets} serii
                          </span>
                        )}
                        {exercise.reps > 0 && (
                          <span className="detail-item">
                            🔢 {exercise.reps} powtórzeń
                          </span>
                        )}
                        {exercise.weight > 0 && (
                          <span className="detail-item">
                            🏋️ {exercise.weight} kg
                          </span>
                        )}
                        {exercise.duration && (
                          <span className="detail-item">
                            ⏱️ {exercise.duration}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="exercise-icon">
                      {exercise.exerciseName.toLowerCase().includes('pompki') ? '🤲' :
                       exercise.exerciseName.toLowerCase().includes('przysiad') ? '🦵' :
                       exercise.exerciseName.toLowerCase().includes('plank') ? '🏃‍♂️' :
                       exercise.exerciseName.toLowerCase().includes('biceps') ? '💪' :
                       '🏋️‍♂️'}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="workout-details-footer">
          <button onClick={onClose} className="close-footer-button">
            Zamknij podgląd
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default WorkoutDetails;
