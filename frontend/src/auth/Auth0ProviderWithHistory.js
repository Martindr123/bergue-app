import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Auth0Provider } from '@auth0/auth0-react';

const Auth0ProviderWithHistory = ({ children }) => {
  const navigate = useNavigate();

  const onRedirectCallback = (appState) => {
    // Redirection après login
    navigate(navigate('/home'));
  };

  return (
    <Auth0Provider
        domain="dev-mrtgzj2vrustiuo1.us.auth0.com"
        clientId="ezdULfIO9ZlJHpWMeYWAlg9uKPO1zemD"
        redirectUri={window.location.origin}
        audience="bergue-api" 
        onRedirectCallback={onRedirectCallback}
    >
      {children}
    </Auth0Provider>
  );
};

export default Auth0ProviderWithHistory;
