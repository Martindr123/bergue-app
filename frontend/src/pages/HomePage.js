// src/pages/HomePage.js
import React from 'react';
import Layout from '../components/Layout';
import { useNavigate } from 'react-router-dom';

function HomePage() {
  const navigate = useNavigate();

  return (
    <Layout>
      <div className="container">
        <h1>Bergue Avocat</h1>
        <h2>Applications favorites</h2>
        <button
          className="big-button"
          onClick={() => navigate('/mission')}
        >
          <span className="icon">✉</span>
          Lettre de Mission
        </button>
      </div>
    </Layout>
  );
}

export default HomePage;
