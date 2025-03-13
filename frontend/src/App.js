// src/App.js
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';

import HomePage from './pages/HomePage';
import MissionPage from './pages/MissionPage';
import LoginPage from './pages/LoginPage';

function App() {
  const { isAuthenticated } = useAuth0();

  return (
    <Routes>
      {/* Page de base: login */}
      <Route path="/" element={<LoginPage />} />

      {/* Si pas loggé => redirect to / */}
      <Route 
        path="/home" 
        element={isAuthenticated ? <HomePage /> : <Navigate to="/" replace />} 
      />
      
      <Route 
        path="/mission" 
        element={isAuthenticated ? <MissionPage /> : <Navigate to="/" replace />} 
      />
    </Routes>
  );
}

export default App;
