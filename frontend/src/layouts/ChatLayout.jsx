import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { chatAPI } from '../services/api';

import ChatMain from '../pages/Chatbot';
import AdminPanel from '../pages/Admin';
import Sidebar from '../components/Sidebar';

export default function ChatLayout() {
  const { user, logout } = useAuth();
  const { page, navigate } = useApp();
  const [conversations, setConversations] = useState([]);
  const [activeConvId, setActiveConvId] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    if (user) {
      chatAPI.conversations()
        .then(r => setConversations(r.data))
        .catch(() => {});
    }
  }, [user]);

  const handleNewConv = () => {
    setActiveConvId(null);
    navigate('chatbot');
  };

  const handleSelectConv = (id) => {
    setActiveConvId(id);
    navigate('chatbot');
  };

  const handleConvCreated = (conv) => {
    setConversations(prev => [conv, ...prev.filter(c => c.id !== conv.id)]);
    setActiveConvId(conv.id);
  };

  const handleDeleteConv = async (id) => {
    try {
      await chatAPI.delete(id);
      setConversations(prev => prev.filter(c => c.id !== id));
      if (activeConvId === id) setActiveConvId(null);
    } catch {}
  };

  return (
    <div className="chat-layout">
      {/* Sidebar */}
      <Sidebar
        open={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
        user={user}
        conversations={conversations}
        activeConvId={activeConvId}
        onNewConv={handleNewConv}
        onSelectConv={handleSelectConv}
        onDeleteConv={handleDeleteConv}
        onNavigate={navigate}
        onLogout={logout}
        currentPage={page}
      />

      {/* Main content */}
      <div className={`chat-main-area ${sidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
        {user?.is_staff ? (
          <AdminPanel />
        ) : (
          <ChatMain
            activeConvId={activeConvId}
            onConvCreated={handleConvCreated}
          />
        )}
      </div>
    </div>
  );
}
