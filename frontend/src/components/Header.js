// src/components/Header.js
import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import BurgerMenu from './BurgerMenu';

const Header = ({ isSidebarOpen, toggleSidebar }) => {
  const { logout } = useAuth0();

  const handleLogout = () => {
    logout({ returnTo: "https://sybergueapidev01-dhf9e2bgesfdb3hc.westeurope-01.azurewebsites.net" });
  };

  return (
    <header 
      style={{ 
        display: 'flex',
        alignItems: 'center',
        padding: '10px',
        backgroundColor: '#333',
        color: '#fff'
      }}
    >
      {/* Burger menu à gauche */}
      <BurgerMenu onClick={toggleSidebar} isOpen={isSidebarOpen} />

      {/* Espace flexible */}
      <div style={{ flex: 1 }} />

      {/* Bouton Se déconnecter */}
      <button
        className="big-button"
        style={{ 
          backgroundColor: '#555', 
          color: '#fff', 
          border: 'none', 
          borderRadius: '5px', 
          padding: '8px 16px' 
        }}
        onClick={handleLogout}
      >
        Se déconnecter
      </button>
    </header>
  );
};

export default Header;
