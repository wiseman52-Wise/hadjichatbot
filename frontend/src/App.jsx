import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { authAPI } from './services/api';
import { CSS } from './utils/constants';

import Navbar from './components/Navbar';
import PageHome from './pages/Home';
import PageUniversites from './pages/Universites';
import PageFilieres from './pages/Filieres';
import PageChatbot from './pages/Chatbot';
import PageConnexion from './pages/Connexion';
import PageInscription from './pages/Inscription';
import PageProfil from './pages/Profil';
import PageAdmin from './pages/Admin';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      try {
        const { data } = await authAPI.profil();
        setUser(data);
      } catch (err) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    initAuth();
    
    if (!document.getElementById('orientagn-styles')) {
      const style = document.createElement('style');
      style.id = 'orientagn-styles';
      style.innerHTML = CSS;
      document.head.appendChild(style);
    }
  }, []);

  if (loading) return <div className="full-spin"><div className="spinner" /></div>;

  const handleLogout = () => {
    localStorage.clear();
    setUser(null);
    window.location.href = '/';
  };

  return (
    <BrowserRouter>
      <div className="app">
        <Navbar user={user} onLogout={handleLogout} />
        <Routes>
          <Route path="/" element={user?.is_staff ? <Navigate to="/admin" /> : <PageHome user={user} />} />
          <Route path="/universites" element={<PageUniversites />} />
          <Route path="/filieres" element={<PageFilieres />} />
          <Route path="/chatbot" element={<PageChatbot user={user} />} />
          <Route path="/connexion" element={user ? <Navigate to="/" /> : <PageConnexion onLogin={setUser} />} />
          <Route path="/inscription" element={user ? <Navigate to="/" /> : <PageInscription />} />
          <Route path="/profil" element={user ? <PageProfil user={user} onUpdate={setUser} /> : <Navigate to="/connexion" />} />
          <Route path="/admin" element={user?.is_staff ? <PageAdmin user={user} /> : <Navigate to="/" />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
