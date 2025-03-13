// src/components/BurgerMenu.js
import React from 'react';

const BurgerMenu = ({ onClick, isOpen }) => {
  return (
    <div 
      className={`hamburger-menu ${isOpen ? 'open' : ''}`}
      onClick={onClick}
    >
      <div className="hamburger-lines"></div>
      <div className="hamburger-lines"></div>
      <div className="hamburger-lines"></div>
    </div>
  );
};

export default BurgerMenu;
