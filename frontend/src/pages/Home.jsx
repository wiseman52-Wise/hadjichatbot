import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { dataAPI } from '../services/api';
import { GOLD, DARK, I } from '../utils/constants';

function PageHome({ user }) {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [query, setQuery] = useState('');

  useEffect(() => {
    dataAPI.stats().then(r => setStats(r.data)).catch(() => {});
  }, []);

  const handleSearch = () => {
    navigate(user ? '/chatbot' : '/inscription');
  };

  const SUGGESTIONS = [
    "Quelles sont les meilleures filières en Informatique ?",
    "Comment entrer à la faculté de Médecine ?",
    "Filières accessibles avec un Bac SE et 13/20",
    "Présente-moi l'Université de Sonfonia"
  ];

  return (
    <>
      <section style={{ minHeight:'85vh', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'2rem 1rem', background:`linear-gradient(to bottom, #f8fafc, #ffffff)` }}>
        <div style={{ textAlign:'center', marginBottom:'2.5rem', maxWidth:'800px' }}>
          <div style={{ display:'inline-block', padding:'.4rem 1rem', background:`${GOLD}20`, color:GOLD, borderRadius:50, fontSize:'.85rem', fontWeight:700, marginBottom:'1rem' }}>
            ✦ IA d'Orientation · ParcourSup Guinée
          </div>
          <h1 style={{ fontSize:'clamp(2.2rem, 5vw, 3.5rem)', fontWeight:800, color:DARK, lineHeight:1.2, marginBottom:'1rem' }}>
            Comment puis-je t'aider pour ton <em style={{ color:GOLD, fontStyle:'normal' }}>orientation</em> ?
          </h1>
          <p style={{ fontSize:'1.1rem', color:'#64748b' }}>
            Pose ta question à <strong>OrientaBot</strong> pour découvrir les filières et universités faites pour toi.
          </p>
        </div>

        {/* CHAT INPUT FAKE */}
        <div style={{ width:'100%', maxWidth:'760px', background:'#fff', borderRadius:'24px', boxShadow:'0 8px 30px rgba(0,0,0,0.08)', border:'1px solid #e2e8f0', padding:'.5rem .5rem .5rem 1.5rem', display:'flex', alignItems:'center', gap:'1rem', transition:'all 0.3s' }}>
          <I n="chat" s={22} c="#94a3b8" />
          <input 
            type="text" 
            placeholder="Ex: Quelles universités proposent le Droit des affaires ?" 
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSearch()}
            style={{ flex:1, border:'none', outline:'none', fontSize:'1.1rem', background:'transparent', color:DARK, padding:'1rem 0' }}
          />
          <button className="btn btn-gold" onClick={handleSearch} style={{ borderRadius:'20px', padding:'1rem 1.5rem', fontSize:'1rem' }}>
            Demander
          </button>
        </div>

        {/* SUGGESTIONS */}
        <div style={{ display:'flex', gap:'.75rem', flexWrap:'wrap', justifyContent:'center', marginTop:'2rem', maxWidth:'800px' }}>
          {SUGGESTIONS.map((s, i) => (
            <div key={i} onClick={() => { setQuery(s); setTimeout(handleSearch, 300); }} style={{ background:'#fff', border:'1px solid #e2e8f0', padding:'.7rem 1.2rem', borderRadius:50, fontSize:'.85rem', color:'#475569', cursor:'pointer', transition:'all 0.2s', boxShadow:'0 2px 5px rgba(0,0,0,0.02)' }} className="chip-hover">
              {s}
            </div>
          ))}
        </div>

        {/* STATS DISCRETES */}
        {stats && (
          <div style={{ display:'flex', gap:'2rem', marginTop:'4rem', opacity:0.6 }}>
            <div style={{ textAlign:'center' }}><span style={{ fontWeight:700, color:DARK }}>{stats.nb_universites}</span> universités publiques</div>
            <div style={{ textAlign:'center' }}><span style={{ fontWeight:700, color:DARK }}>{stats.nb_filieres}+</span> filières</div>
            <div style={{ textAlign:'center' }}><span style={{ fontWeight:700, color:DARK }}>{(stats.total_places/1000).toFixed(1)}k</span> places</div>
          </div>
        )}
      </section>
      
      <style>{`.chip-hover:hover { border-color: #d4af37 !important; color: #d4af37 !important; transform: translateY(-2px); }`}</style>
    </>
  );
}

export default PageHome;
