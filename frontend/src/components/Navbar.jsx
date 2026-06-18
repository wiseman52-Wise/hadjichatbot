import React from 'react';
import { useNavigate } from 'react-router-dom';
import { G, GOLD, DARK, I } from '../utils/constants';

function Navbar({ user, onLogout }) {
  const navigate = useNavigate();
  return (
    <div className="nav">
      <div className="nav-inner">
        <div className="nav-logo" onClick={() => navigate("/")}>
          <span className="nav-dot" /><span>Orienta<span style={{ color: GOLD }}>GN</span></span>
        </div>
        <div className="nav-links">
          {/* Les admins ne voient pas OrientaBot, seulement les pages informatives */}
          {!user?.is_staff && (
            <button className={`nb ${window.location.pathname==='/'?'active':''}`} onClick={() => navigate('/')}>
              <I n="chat" s={13}/> OrientaBot
            </button>
          )}
          {[['/universites','Universités','build'],['/filieres','Filières','grid']].map(([path,label,ic]) => (
            <button key={path} className={`nb ${window.location.pathname===path?'active':''}`} onClick={() => navigate(path)}>
              <I n={ic} s={13}/> {label}
            </button>
          ))}
        </div>
        <div className="nav-right">
          {user ? (
            <>
              {user.is_staff && (
                <button className={`nb ${window.location.pathname==='/admin'?'active':''}`} onClick={() => navigate("/admin")}>
                  <I n="lock" s={13}/> Admin
                </button>
              )}
              <div className="nav-avatar" onClick={() => navigate("/profil")}>
                {user.first_name?.[0] || user.username[0].toUpperCase()}
              </div>
              <button className="btn btn-ghost btn-sm" onClick={onLogout}>
                <I n="close" s={14}/>
              </button>
            </>
          ) : (
            <>
              <button className="btn btn-ghost btn-sm" onClick={() => navigate("/connexion")}>Connexion</button>
              <button className="btn btn-gold btn-sm" onClick={() => navigate("/inscription")}>S'inscrire</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Navbar;
