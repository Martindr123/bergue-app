// src/components/Layout.js
import React, { useState } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import Footer from './Footer';

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div style={{ minHeight: '100vh', position: 'relative', paddingBottom: '40px' }}>
      {/* Header */}
      <Header isSidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} />

      {/* Contenu principal */}
      <div
        style={{
          transition: 'margin-left 0.3s',
          marginLeft: sidebarOpen ? '200px' : '0'
        }}
      >
        {children}
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Layout;
