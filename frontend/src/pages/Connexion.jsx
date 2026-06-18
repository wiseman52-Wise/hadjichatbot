import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authAPI, dataAPI, chatAPI } from '../services/api';
import { G, GOLD, DARK, BG, UNI_IMAGES, CSS, I, md, uniColor, uniBadge } from '../utils/constants';

function PageConnexion({ setPage, onLogin }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username:'',password:'' });
  const [err, setErr]   = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (!form.username||!form.password) { setErr('Remplissez tous les champs.'); return; }
    setErr(''); setLoading(true);
    try {
      const { data } = await authAPI.connexion(form);
      localStorage.setItem('access_token', data.access);
      localStorage.setItem('refresh_token', data.refresh);
      onLogin(data.user);
      // Rediriger l'admin vers son tableau de bord, les étudiants vers l'accueil
      navigate(data.user?.is_staff ? "/admin" : "/");
    } catch (e) {
      setErr(e.response?.data?.detail || "Nom d'utilisateur ou mot de passe incorrect.");
    }
    setLoading(false);
  };

  return (
    <div className="page" style={{ paddingTop:'4rem',paddingBottom:'4rem' }}>
      <div className="form-wrap" style={{ maxWidth:420 }}>
        <div style={{ textAlign:'center',marginBottom:'1.75rem' }}>
          <div style={{ fontSize:'2.5rem',marginBottom:'.75rem' }}>🎓</div>
          <h1 className="form-title">Bon retour !</h1>
          <p className="form-sub">Connecte-toi pour accéder à ton espace personnalisé</p>
        </div>
        {err && <div className="alert alert-err"><I n="x" s={14}/> {err}</div>}
        <div className="fg"><label className="fl">Nom d'utilisateur</label><input className="fi" placeholder="ton_username" value={form.username} onChange={e => setForm(p=>({...p,username:e.target.value}))} onKeyDown={e=>e.key==='Enter'&&submit()}/></div>
        <div className="fg"><label className="fl">Mot de passe</label><input className="fi" type="password" placeholder="••••••••" value={form.password} onChange={e => setForm(p=>({...p,password:e.target.value}))} onKeyDown={e=>e.key==='Enter'&&submit()}/></div>
        <button className="btn btn-primary" style={{ width:'100%',marginTop:'.5rem' }} onClick={submit} disabled={loading}>
          {loading ? 'Connexion...' : 'Se connecter'}
        </button>
        <div className="divider"><span>Pas encore de compte ?</span></div>
        <button className="btn btn-outline" style={{ width:'100%' }} onClick={() => navigate("/inscription")}><I n="user" s={15}/> Créer mon compte</button>
      </div>
    </div>
  );
}

export default PageConnexion;
