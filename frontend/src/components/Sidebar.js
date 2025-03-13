// src/components/Sidebar.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';

const Sidebar = ({ isOpen }) => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth0();

  return (
    <div className={`sidebar ${isOpen ? 'open' : ''}`}>
      {/* Accueil */}
      <button className="sidebar-btn" onClick={() => navigate('/home')}>
        <span className="icon">🏠</span>
        Accueil
      </button>

      {/* Lettre de Mission, si logué */}
      {isAuthenticated && (
        <button className="sidebar-btn" onClick={() => navigate('/mission')}>
          <span className="icon">✉</span>
          Lettre de Mission
        </button>
      )}

    </div>
  );
};

export default Sidebar;
