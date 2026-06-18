import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authAPI, dataAPI, chatAPI } from '../services/api';
import { G, GOLD, DARK, BG, UNI_IMAGES, CSS, I, md, uniColor, uniBadge } from '../utils/constants';

function PageInscription({ setPage, onLogin }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({ first_name:'',last_name:'',username:'',email:'',serie_bac:'',moyenne_bac:'',numero_pv:'',mot_de_passe:'' });
  const [err, setErr]   = useState('');
  const [loading, setLoading] = useState(false);
  const set = (k,v) => setForm(p => ({ ...p,[k]:v }));

  const submit = async () => {
    if (!form.first_name||!form.last_name||!form.username||!form.mot_de_passe||!form.serie_bac) {
      setErr('Remplissez tous les champs obligatoires (*)'); return;
    }
    if (form.mot_de_passe.length < 6) { setErr('Le mot de passe doit faire au moins 6 caractères'); return; }
    setErr(''); setLoading(true);
    try {
      const payload = { ...form };
      if (!payload.moyenne_bac) delete payload.moyenne_bac;
      const { data } = await authAPI.inscription(payload);
      localStorage.setItem('access_token', data.access);
      localStorage.setItem('refresh_token', data.refresh);
      onLogin(data.user); navigate("/");
    } catch (e) {
      const errs = e.response?.data;
      if (errs) setErr(Object.values(errs).flat().join(' · '));
      else setErr('Erreur lors de l\'inscription. Vérifiez la connexion au serveur.');
    }
    setLoading(false);
  };

  return (
    <div className="page" style={{ paddingTop:'2.5rem',paddingBottom:'3rem' }}>
      <div className="form-wrap">
        <div style={{ textAlign:'center',marginBottom:'1.75rem' }}>
          <div style={{ width:54,height:54,borderRadius:'50%',background:`${G}15`,display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto .9rem' }}>
            <I n="user" s={22} c={G}/>
          </div>
          <h1 className="form-title">Créer mon compte</h1>
          <p className="form-sub">Rejoins OrientaGN pour des recommandations personnalisées</p>
        </div>
        {err && <div className="alert alert-err"><I n="x" s={15}/>  {err}</div>}

        <div className="sec-lbl">Informations personnelles</div>
        <div className="frow">
          <div className="fg"><label className="fl">Prénom <span>*</span></label><input className="fi" placeholder="Hadjiratou" value={form.first_name} onChange={e => set('first_name',e.target.value)}/></div>
          <div className="fg"><label className="fl">Nom <span>*</span></label><input className="fi" placeholder="Diallo" value={form.last_name} onChange={e => set('last_name',e.target.value)}/></div>
        </div>
        <div className="frow">
          <div className="fg"><label className="fl">Nom d'utilisateur <span>*</span></label><input className="fi" placeholder="diallo_hadji" value={form.username} onChange={e => set('username',e.target.value)}/></div>
          <div className="fg"><label className="fl">E-mail</label><input className="fi" type="email" placeholder="email@exemple.com" value={form.email} onChange={e => set('email',e.target.value)}/></div>
        </div>

        <div className="sec-lbl" style={{ marginTop:'.25rem' }}>Informations BAC</div>
        <div className="frow">
          <div className="fg">
            <label className="fl">Série BAC <span>*</span></label>
            <select className="fsel" value={form.serie_bac} onChange={e => set('serie_bac',e.target.value)}>
              <option value="">Choisir...</option>
              <option value="SM">SM — Sciences Mathématiques</option>
              <option value="SE">SE — Sciences Expérimentales</option>
              <option value="SE-FA">SE-FA — Sciences Expérimentales FA</option>
              <option value="SS">SS — Sciences Sociales</option>
              <option value="SS-FA">SS-FA — Sciences Sociales FA</option>
            </select>
          </div>
          <div className="fg"><label className="fl">Moyenne BAC</label><input className="fi" type="number" placeholder="13.5" min="0" max="20" step="0.5" value={form.moyenne_bac} onChange={e => set('moyenne_bac',e.target.value)}/></div>
        </div>
        <div className="fg">
          <label className="fl">Numéro PV du BAC</label>
          <input className="fi" placeholder="Ex: 0012345" value={form.numero_pv} onChange={e => set('numero_pv',e.target.value)}/>
          <span style={{ fontSize:'.75rem',color:'#94a3b8',display:'block',marginTop:'.25rem' }}>Le numéro figurant sur votre procès-verbal</span>
        </div>

        <div className="sec-lbl" style={{ marginTop:'.25rem' }}>Sécurité</div>
        <div className="fg">
          <label className="fl">Mot de passe <span>*</span></label>
          <input className="fi" type="password" placeholder="Minimum 6 caractères" value={form.mot_de_passe} onChange={e => set('mot_de_passe',e.target.value)} onKeyDown={e => e.key==='Enter'&&submit()}/>
        </div>

        <div className="alert alert-info" style={{ marginBottom:'1.1rem' }}>
          <I n="info" s={14} c="#1e40af"/>
          <span style={{ fontSize:'.82rem' }}>Ton profil (série BAC + moyenne) permet au chatbot de te proposer des recommandations personnalisées.</span>
        </div>

        <button className="btn btn-primary" style={{ width:'100%' }} onClick={submit} disabled={loading}>
          {loading ? 'Création...' : <><I n="check" s={15}/> Créer mon compte</>}
        </button>
        <div className="divider"><span>Déjà inscrit ?</span></div>
        <button className="btn btn-outline" style={{ width:'100%' }} onClick={() => navigate("/connexion")}>Se connecter</button>
      </div>
    </div>
  );
}

export default PageInscription;
