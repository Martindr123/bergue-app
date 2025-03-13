// src/pages/LoginPage.js
import React, { useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';

function LoginPage() {
  const { isAuthenticated, isLoading, loginWithRedirect } = useAuth0();
  const navigate = useNavigate();

  useEffect(() => {
    // On attend la fin du chargement
    if (isLoading) return;

    if (isAuthenticated) {
      // Connecté => direction /home
      navigate('/home');
    } else {
      // Non connecté => on lance Auth0
      loginWithRedirect();
    }
  }, [isAuthenticated, isLoading, loginWithRedirect, navigate]);

  return (
    <Layout>
      <div className="container">
        <h2>Redirection en cours...</h2>
      </div>
    </Layout>
  );
}

export default LoginPage;
