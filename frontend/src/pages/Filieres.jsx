import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authAPI, dataAPI, chatAPI } from '../services/api';
import { G, GOLD, DARK, BG, UNI_IMAGES, CSS, I, md, uniColor, uniBadge } from '../utils/constants';

function PageFilieres() {
  const navigate = useNavigate();
  const [unis, setUnis]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [uniF, setUniF]   = useState('');
  const [search, setSearch] = useState('');
  const [modal, setModal]   = useState(null);

  useEffect(() => {
    dataAPI.universites().then(r => { setUnis(r.data); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const all = unis.flatMap(u => (u.filieres||[]).map(f => ({ ...f, _uni:u, _moy:f.moyenne_requise })));
  const filtered = all.filter(f => {
    if (uniF && f._uni.id !== uniF) return false;
    if (search) { const q = search.toLowerCase(); return f.nom.toLowerCase().includes(q)||f._uni.sigle.toLowerCase().includes(q)||(f.debouches||'').toLowerCase().includes(q); }
    return true;
  });

  if (loading) return <div className="full-spin"><div className="spinner"/></div>;

  return (
    <div className="page">
      <div style={{ paddingTop:'1.5rem',marginBottom:'2rem' }}>
        <div className="sec-eyebrow">60+ formations</div>
        <h1 className="sec-title">Toutes les filières</h1>
        <p className="sec-sub">Filtre et recherche parmi toutes les filières des universités guinéennes.</p>
      </div>
      <div style={{ display:'flex',gap:'1rem',marginBottom:'1.25rem',flexWrap:'wrap',alignItems:'center' }}>
        <input className="fi" placeholder="🔍 Rechercher une filière, un débouché..." value={search} onChange={e => setSearch(e.target.value)} style={{ flex:1,minWidth:200 }}/>
        <div className="filter-bar" style={{ margin:0,flex:'none' }}>
          <span className={`chip ${!uniF?'active':''}`} onClick={() => setUniF('')}>Toutes</span>
          {unis.map(u => <span key={u.id} className={`chip ${uniF===u.id?'active':''}`} onClick={() => setUniF(u.id)}>{u.sigle}</span>)}
        </div>
      </div>
      <div style={{ color:'#64748b',fontSize:'.83rem',marginBottom:'.9rem' }}>{filtered.length} filière{filtered.length>1?'s':''} trouvée{filtered.length>1?'s':''}</div>
      <div className="fgrid">
        {filtered.map((f,i) => (
          <div key={i} className="fc" onClick={() => setModal(f)}>
            <div style={{ display:'flex',justifyContent:'space-between',marginBottom:'.5rem' }}>
              <span className={`badge ${uniBadge(f._uni.sigle)}`}>{f._uni.sigle}</span>
              <div style={{ display:'flex',gap:'.25rem' }}>
                {f.cas_special && <span className="badge bg-gold">⭐</span>}
                {f.concours    && <span className="badge bg-red">⚠️</span>}
              </div>
            </div>
            <h3 style={{ fontWeight:700,fontSize:'.9rem',color:DARK,marginBottom:'.35rem' }}>{f.nom}</h3>
            <p style={{ fontSize:'.78rem',color:'#64748b',lineHeight:1.4,marginBottom:'.6rem' }}>{(f.debouches||'').slice(0,80)}...</p>
            <div style={{ display:'flex',justifyContent:'space-between',alignItems:'center',marginTop:'auto' }}>
              <span style={{ fontSize:'.73rem',color:'#94a3b8' }}>{f.duree}</span>
              <span className="badge bg-green" style={{ fontSize:'.69rem' }}>≥{f._moy}/20</span>
            </div>
          </div>
        ))}
      </div>
      {modal && (
        <div className="modal-ov" onClick={() => setModal(null)}>
          <div className="modal-box" style={{ maxWidth:500 }} onClick={e => e.stopPropagation()}>
            <div className="modal-head" style={{ background:`linear-gradient(135deg,${DARK},${uniColor(modal._uni.id)})` }}>
              <h3 style={{ color:'#fff',fontWeight:700,fontSize:'1rem' }}>{modal.nom_complet||modal.nom}</h3>
              <button className="modal-close" onClick={() => setModal(null)}>✕</button>
            </div>
            <div className="modal-body" style={{ maxHeight:'60vh',overflowY:'auto' }}>
              <p style={{ fontSize:'.86rem',color:'#475569',lineHeight:1.6,marginBottom:'1rem' }}>{modal.description}</p>
              <div className="sec-lbl">Débouchés</div>
              <ul style={{ listStyle:'none',display:'flex',flexDirection:'column',gap:'.35rem',marginBottom:'1rem' }}>
                {(modal.debouches||[]).map((d,i) => <li key={i} style={{ display:'flex',gap:'.5rem',fontSize:'.84rem',color:'#374151' }}><span style={{ color:G }}>✓</span>{d}</li>)}
              </ul>
              {modal.cas_special && <div className="alert alert-ok"><I n="star" s={14} c="#166534"/><span><strong>Emploi garanti</strong> chez WCRG, SMB, Simandou.</span></div>}
              {modal.concours    && <div className="alert alert-warn"><I n="warn" s={14} c="#92400e"/><span><strong>Concours + Mention obligatoire.</strong></span></div>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PageFilieres;
