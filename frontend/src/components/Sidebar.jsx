import React, { useState } from 'react';

export default function Sidebar({
  open, onToggle, user, conversations, activeConvId,
  onNewConv, onSelectConv, onDeleteConv, onNavigate, onLogout, currentPage
}) {
  const [confirmDelete, setConfirmDelete] = useState(null);

  const handleDelete = (e, id) => {
    e.stopPropagation();
    if (confirmDelete === id) {
      onDeleteConv(id);
      setConfirmDelete(null);
    } else {
      setConfirmDelete(id);
      setTimeout(() => setConfirmDelete(null), 3000);
    }
  };

  return (
    <>
      {/* Toggle button always visible */}
      <button className="sidebar-toggle" onClick={onToggle} title={open ? 'Fermer' : 'Ouvrir'}>
        {open ? '◀' : '▶'}
      </button>

      <aside className={`sidebar ${open ? 'sidebar--open' : 'sidebar--closed'}`}>
        {/* Header */}
        <div className="sidebar-header">
          <div className="sidebar-brand">
            <span className="sidebar-brand-icon">🎓</span>
            <span className="sidebar-brand-name">OrientaGN</span>
          </div>
          <button className="new-chat-btn" onClick={onNewConv} title="Nouvelle conversation">
            <span>✏️</span>
          </button>
        </div>

        {/* User not logged in */}
        {!user && (
          <div className="sidebar-auth">
            <p className="sidebar-auth-msg">Connectez-vous pour sauvegarder vos conversations</p>
            <button className="btn-login-sidebar" onClick={() => onNavigate('login')}>
              Se connecter
            </button>
            <button className="btn-register-sidebar" onClick={() => onNavigate('register')}>
              Créer un compte
            </button>
          </div>
        )}

        {/* User logged in */}
        {user && (
          <>
            <div className="sidebar-user">
              <div className="sidebar-user-avatar">
                {(user.first_name || user.username || '?')[0].toUpperCase()}
              </div>
              <div className="sidebar-user-info">
                <div className="sidebar-user-name">{user.first_name || user.username}</div>
                <div className="sidebar-user-meta">
                  {user.is_staff ? 'Administrateur' : (
                    <>
                      {user.serie_bac ? `Bac ${user.serie_bac}` : 'Étudiant'}
                      {user.moyenne_bac ? ` · ${user.moyenne_bac}/20` : ''}
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Conversations - Masqué pour l'admin */}
            {!user.is_staff && (
              <>
                <div className="sidebar-section-title">Conversations</div>
                <div className="sidebar-convs">
                  {conversations.length === 0 && (
                    <div className="sidebar-empty">Aucune conversation encore</div>
                  )}
                  {conversations.map(conv => (
                    <div
                      key={conv.id}
                      className={`sidebar-conv-item ${activeConvId === conv.id ? 'active' : ''}`}
                      onClick={() => onSelectConv(conv.id)}
                    >
                      <span className="conv-icon">💬</span>
                      <span className="conv-title">{conv.titre}</span>
                      <button
                        className={`conv-delete ${confirmDelete === conv.id ? 'confirming' : ''}`}
                        onClick={(e) => handleDelete(e, conv.id)}
                        title={confirmDelete === conv.id ? 'Confirmer?' : 'Supprimer'}
                      >
                        {confirmDelete === conv.id ? '✓' : '🗑'}
                      </button>
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* Nav items */}
            <div className="sidebar-section-title">Outils</div>
            <div className="sidebar-nav">
              {!user.is_staff ? (
                <>
                  <button
                    className={`sidebar-nav-item ${currentPage === 'chatbot' || currentPage === 'home' ? 'active' : ''}`}
                    onClick={() => onNavigate('chatbot')}
                  >
                    <span>🤖</span> Chat IA
                  </button>
                  <button
                    className="sidebar-nav-item"
                    onClick={() => onNavigate('chatbot')}
                    data-topic="universites"
                  >
                    <span>🏫</span> Universités
                  </button>
                  <button
                    className="sidebar-nav-item"
                    onClick={() => onNavigate('chatbot')}
                    data-topic="filieres"
                  >
                    <span>📚</span> Filières
                  </button>
                  <button
                    className="sidebar-nav-item"
                    onClick={() => onNavigate('chatbot')}
                    data-topic="calendrier"
                  >
                    <span>📅</span> Calendrier
                  </button>
                  <button
                    className="sidebar-nav-item"
                    onClick={() => onNavigate('chatbot')}
                    data-topic="faq"
                  >
                    <span>❓</span> FAQ
                  </button>
                </>
              ) : (
                <button
                  className={`sidebar-nav-item ${currentPage === 'admin' ? 'active' : ''}`}
                  onClick={() => onNavigate('admin')}
                >
                  <span>⚙️</span> Administration
                </button>
              )}
            </div>

            {/* Logout */}
            <button className="sidebar-logout" onClick={onLogout}>
              <span>🚪</span> Déconnexion
            </button>
          </>
        )}
      </aside>
    </>
  );
}
