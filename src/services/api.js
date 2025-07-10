// src/services/api.js
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 5000, // 5 sekund timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// Dodaj interceptor dla lepszego obsługiwania błędów
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.message);
    if (error.code === 'ECONNABORTED') {
      console.error('Request timeout - sprawdź czy backend jest uruchomiony');
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (userData) => api.post('/api/users', userData), // Rejestracja przez endpoint users
  login: async (credentials) => {
    // Tymczasowa implementacja logowania - pobierz wszystkich użytkowników i sprawdź email/hasło
    const response = await api.get('/api/users');
    const users = response.data;
    const user = users.find(u => u.email === credentials.email && u.password === credentials.password);
    
    if (user) {
      return { data: { success: true, user } };
    } else {
      throw new Error('Invalid credentials');
    }
  },
};

// Users API
export const userAPI = {
  getAllUsers: () => api.get('/api/users'),
  getUserById: (id) => api.get(`/api/users/${id}`),
  getUserByEmail: (email) => api.get(`/api/users/email/${email}`),
  updateUser: (id, userData) => api.put(`/api/users/${id}`, userData),
  deleteUser: (id) => api.delete(`/api/users/${id}`),
};

// Workout Sessions API
export const workoutAPI = {
  getAllSessions: () => api.get('/api/sessions'),
  getSessionById: (id) => api.get(`/api/sessions/${id}`),
  getSessionsByUserId: (userId) => api.get(`/api/sessions/user/${userId}`),
  getSessionsByPeriod: (userId, from, to) => 
    api.get(`/api/sessions/user/${userId}/period`, { params: { from, to } }),
  createSession: (sessionData) => api.post('/api/sessions', sessionData),
  updateSession: (id, sessionData) => api.put(`/api/sessions/${id}`, sessionData),
  deleteSession: (id) => api.delete(`/api/sessions/${id}`),
};

// Exercise Entries API
export const exerciseAPI = {
  getAllExercises: () => api.get('/api/exercises'),
  getExerciseById: (id) => api.get(`/api/exercises/${id}`),
  getExercisesBySessionId: (sessionId) => api.get(`/api/exercises/session/${sessionId}`),
  getExercisesByUserId: (userId) => api.get(`/api/exercises/user/${userId}`),
  createExercise: (exerciseData) => api.post('/api/exercises', exerciseData),
  updateExercise: (id, exerciseData) => api.put(`/api/exercises/${id}`, exerciseData),
  deleteExercise: (id) => api.delete(`/api/exercises/${id}`),
};

export default api;
