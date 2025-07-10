// src/pages/CreateWorkout.jsx
import React, { useState } from 'react';
import { workoutAPI, exerciseAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import './CreateWorkout.css';

const CreateWorkout = () => {
  const { user } = useAuth();
  const [workoutData, setWorkoutData] = useState({
    startTime: '',
    endTime: '',
    caloriesBurned: '',
    user: { id: user?.id || 1 }
  });

  const [exercises, setExercises] = useState([]);
  const [currentExercise, setCurrentExercise] = useState({
    exerciseName: '',
    sets: '',
    reps: '',
    weight: '',
    duration: ''
  });

  const [isCreating, setIsCreating] = useState(false);
  const [success, setSuccess] = useState(false);

  const popularExercises = [
    'Pompki', 'Przysiady', 'Martwy ciąg', 'Wyciskanie sztangi', 
    'Podciąganie', 'Plank', 'Brzuszki', 'Wykroki', 'Burpees', 'Biceps'
  ];

  const handleWorkoutChange = (e) => {
    const { name, value } = e.target;
    setWorkoutData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleExerciseChange = (e) => {
    const { name, value } = e.target;
    setCurrentExercise(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const addExercise = () => {
    if (!currentExercise.exerciseName) {
      alert('Nazwa ćwiczenia jest wymagana!');
      return;
    }

    setExercises(prev => [...prev, { ...currentExercise, id: Date.now() }]);
    setCurrentExercise({
      exerciseName: '',
      sets: '',
      reps: '',
      weight: '',
      duration: ''
    });
  };

  const removeExercise = (id) => {
    setExercises(prev => prev.filter(ex => ex.id !== id));
  };

  const createWorkout = async () => {
    try {
      setIsCreating(true);

      // Sprawdź czy wszystkie wymagane pola są wypełnione
      if (!workoutData.startTime || exercises.length === 0) {
        alert('Wypełnij czas rozpoczęcia i dodaj przynajmniej jedno ćwiczenie!');
        return;
      }

      // Utwórz sesję treningową
      const sessionData = {
        startTime: new Date(workoutData.startTime).toISOString(),
        endTime: workoutData.endTime ? new Date(workoutData.endTime).toISOString() : null,
        caloriesBurned: parseInt(workoutData.caloriesBurned) || 0,
        user: { id: user?.id || 1 }
      };
      
      console.log('Creating session:', sessionData);
      const sessionResponse = await workoutAPI.createSession(sessionData);
      const sessionId = sessionResponse.data.id;
      console.log('Session created with ID:', sessionId);

      // Dodaj ćwiczenia do sesji
      for (const exercise of exercises) {
        const exerciseData = {
          exerciseName: exercise.exerciseName,
          sets: parseInt(exercise.sets) || 0,
          reps: parseInt(exercise.reps) || 0,
          weight: parseFloat(exercise.weight) || 0,
          duration: exercise.duration || '',
          session: { id: sessionId }
        };
        
        console.log('Creating exercise:', exerciseData);
        await exerciseAPI.createExercise(exerciseData);
      }

      setSuccess(true);
      
      // Reset formularza po 3 sekundach
      setTimeout(() => {
        setWorkoutData({
          startTime: '',
          endTime: '',
          caloriesBurned: '',
          user: { id: 1 }
        });
        setExercises([]);
        setSuccess(false);
      }, 3000);

    } catch (error) {
      console.error('Błąd podczas tworzenia treningu:', error);
      alert('Wystąpił błąd podczas tworzenia treningu. Sprawdź konsolę lub spróbuj ponownie.');
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="create-workout">
      <h1>Stwórz nowy trening 🏋️‍♂️</h1>
      
      {success ? (
        <div className="success-message">
          <h2>✅ Trening został utworzony!</h2>
          <p>Świetna robota! Twój trening został zapisany.</p>
        </div>
      ) : (
        <div className="workout-form">
          <div className="form-section">
            <h2>Informacje o treningu</h2>
            <div className="form-group">
              <label>Czas rozpoczęcia:</label>
              <input
                type="datetime-local"
                name="startTime"
                value={workoutData.startTime}
                onChange={handleWorkoutChange}
              />
            </div>
            <div className="form-group">
              <label>Czas zakończenia:</label>
              <input
                type="datetime-local"
                name="endTime"
                value={workoutData.endTime}
                onChange={handleWorkoutChange}
              />
            </div>
            <div className="form-group">
              <label>Spalone kalorie (opcjonalne):</label>
              <input
                type="number"
                name="caloriesBurned"
                value={workoutData.caloriesBurned}
                onChange={handleWorkoutChange}
                placeholder="np. 350"
              />
            </div>
          </div>

          <div className="form-section">
            <h2>Dodaj ćwiczenie</h2>
            <div className="popular-exercises">
              <p>Popularne ćwiczenia:</p>
              {popularExercises.map(exercise => (
                <button
                  key={exercise}
                  type="button"
                  className="exercise-btn"
                  onClick={() => setCurrentExercise(prev => ({...prev, exerciseName: exercise}))}
                >
                  {exercise}
                </button>
              ))}
            </div>
            
            <div className="form-group">
              <label>Nazwa ćwiczenia:</label>
              <input
                type="text"
                name="exerciseName"
                value={currentExercise.exerciseName}
                onChange={handleExerciseChange}
                placeholder="Wpisz nazwę ćwiczenia"
              />
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label>Serie:</label>
                <input
                  type="number"
                  name="sets"
                  value={currentExercise.sets}
                  onChange={handleExerciseChange}
                  placeholder="np. 3"
                />
              </div>
              <div className="form-group">
                <label>Powtórzenia:</label>
                <input
                  type="number"
                  name="reps"
                  value={currentExercise.reps}
                  onChange={handleExerciseChange}
                  placeholder="np. 12"
                />
              </div>
              <div className="form-group">
                <label>Ciężar (kg):</label>
                <input
                  type="number"
                  name="weight"
                  value={currentExercise.weight}
                  onChange={handleExerciseChange}
                  placeholder="np. 20"
                />
              </div>
            </div>
            
            <button type="button" onClick={addExercise} className="add-exercise-btn">
              Dodaj ćwiczenie ➕
            </button>
          </div>

          {exercises.length > 0 && (
            <div className="exercises-list">
              <h3>Lista ćwiczeń:</h3>
              {exercises.map(exercise => (
                <div key={exercise.id} className="exercise-item">
                  <span>{exercise.exerciseName}</span>
                  <span>{exercise.sets} x {exercise.reps}</span>
                  {exercise.weight && <span>{exercise.weight}kg</span>}
                  <button onClick={() => removeExercise(exercise.id)}>🗑️</button>
                </div>
              ))}
            </div>
          )}

          <button 
            className="create-btn"
            disabled={isCreating}
            onClick={createWorkout}
          >
            {isCreating ? 'Tworzenie...' : 'Utwórz trening 🚀'}
          </button>
        </div>
      )}
    </div>
  );
};

export default CreateWorkout;
