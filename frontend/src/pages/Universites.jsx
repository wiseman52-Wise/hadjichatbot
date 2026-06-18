import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authAPI, dataAPI, chatAPI } from '../services/api';
import { G, GOLD, DARK, BG, UNI_IMAGES, CSS, I, md, uniColor, uniBadge } from '../utils/constants';

function PageUniversites() {
  const navigate = useNavigate();
  const [unis, setUnis] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sel, setSel]   = useState(null);
  const [exp, setExp]   = useState({});
  const [modal, setModal] = useState(null);

  useEffect(() => {
    dataAPI.universites().then(r => { setUnis(r.data); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  if (loading) return <div className="full-spin"><div className="spinner"/></div>;

  return (
    <div className="page">
      <div style={{ paddingTop:'1.5rem',marginBottom:'2rem' }}>
        <div className="sec-eyebrow">ParcourSup Guinée 2025</div>
        <h1 className="sec-title">Universités & Filières</h1>
        <p className="sec-sub">Toutes les universités publiques guinéennes avec leurs facultés et conditions d'accès.</p>
      </div>
      <div className="filter-bar">
        <span className={`chip ${!sel?'active':''}`} onClick={() => setSel(null)}>Toutes</span>
        {unis.map(u => <span key={u.id} className={`chip ${sel===u.id?'active':''}`} onClick={() => setSel(u.id)}>{u.sigle}</span>)}
      </div>

      {unis.filter(u => !sel || u.id===sel).map(u => (
        <div key={u.id} className="uni-section">
          {/* Bandeau avec image */}
          <div className="uni-bar" style={{ background:`linear-gradient(135deg,${uniColor(u.sigle)},${uniColor(u.sigle)}cc)` }}>
            {UNI_IMAGES[u.sigle.toLowerCase()] && (
              <img src={UNI_IMAGES[u.sigle.toLowerCase()]} alt={u.sigle} className="uni-bar-img" onError={e => e.target.style.display='none'} />
            )}
            <div style={{ flex:1 }}>
              <div style={{ display:'flex',alignItems:'center',gap:'.6rem',flexWrap:'wrap',marginBottom:'.4rem' }}>
                <h2 style={{ fontFamily:'Sora,sans-serif',fontSize:'1.2rem',fontWeight:800,color:'#fff',margin:0 }}>{u.nom}</h2>
                <span style={{ background:'rgba(255,255,255,.2)',borderRadius:6,padding:'.2rem .6rem',fontSize:'.78rem',color:'#fff',fontWeight:600 }}>{u.sigle}</span>
                <span style={{ background:'rgba(255,255,255,.2)',borderRadius:6,padding:'.2rem .6rem',fontSize:'.78rem',color:'#fff',fontWeight:600 }}>{u.ville}</span>
                <span style={{ background:'rgba(255,255,255,.2)',borderRadius:6,padding:'.2rem .6rem',fontSize:'.78rem',color:'#fff',fontWeight:600 }}>{(u.capacite||0).toLocaleString()} places</span>
              </div>
              <p style={{ color:'rgba(255,255,255,.8)',fontSize:'.83rem',lineHeight:1.5 }}>{(u.description||'').slice(0,120)}...</p>
            </div>
          </div>

          <div className="fac-block">
            <div className="fac-head" onClick={() => setExp(p => ({ ...p, [u.id]: !p[u.id] }))}>
              <div style={{ flex:1 }}>
                <div style={{ display:'flex',alignItems:'center',gap:'.5rem',flexWrap:'wrap' }}>
                  <span style={{ fontWeight:700,fontSize:'.9rem',color:DARK }}>Toutes les filières de {u.sigle}</span>
                </div>
              </div>
              <div style={{ display:'flex',alignItems:'center',gap:'.4rem',flexShrink:0 }}>
                <span className="badge bg-gray">{(u.filieres||[]).length} filière{(u.filieres||[]).length>1?'s':''}</span>
                <I n={exp[u.id]?'chevD':'chevR'} s={15} c="#64748b"/>
              </div>
            </div>
            {exp[u.id] && (
              <div style={{ padding:'1rem 1.25rem',borderTop:'1px solid #f1f5f9',background:'#fafafa' }}>
                <div className="fgrid">
                  {(u.filieres||[]).map((f,i) => (
                    <div key={i} className="fc" onClick={() => setModal({ ...f, _uni:u })}>
                      <div style={{ display:'flex',justifyContent:'space-between',marginBottom:'.45rem' }}>
                        <span style={{ fontWeight:700,fontSize:'.86rem',color:DARK }}>{f.nom}</span>
                        {f.cas_special && <span className="badge bg-gold" style={{ fontSize:'.66rem' }}>⭐</span>}
                        {f.concours    && <span className="badge bg-red"  style={{ fontSize:'.66rem' }}>⚠️</span>}
                      </div>
                      <p style={{ fontSize:'.77rem',color:'#64748b',lineHeight:1.4,marginBottom:'.5rem' }}>{(f.debouches||'').slice(0,70)}...</p>
                      <div style={{ display:'flex',justifyContent:'space-between',alignItems:'center' }}>
                        <span style={{ fontSize:'.73rem',color:'#94a3b8' }}>{f.duree}</span>
                        <span className="badge bg-green" style={{ fontSize:'.69rem' }}>≥{f.moyenne_requise}/20</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      ))}

      {/* Modal filière détail */}
      {modal && (
        <div className="modal-ov" onClick={() => setModal(null)}>
          <div className="modal-box" style={{ maxWidth:520 }} onClick={e => e.stopPropagation()}>
            <div className="modal-head" style={{ background:`linear-gradient(135deg,${DARK},${uniColor(modal._uni.sigle)})` }}>
              <div>
                <h3 style={{ color:'#fff',fontWeight:700,fontSize:'1rem' }}>{modal.nom}</h3>
                <p style={{ color:'rgba(255,255,255,.7)',fontSize:'.82rem' }}>{modal._uni.nom}</p>
              </div>
              <button className="modal-close" onClick={() => setModal(null)}>✕</button>
            </div>
            <div className="modal-body" style={{ maxHeight:'65vh',overflowY:'auto' }}>
              <div style={{ display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'.65rem',marginBottom:'1.1rem' }}>
                {[['📅',modal.duree],['🎓',modal.diplome||'—'],['📊',`${modal.moyenne_requise}/20`]].map(([ic,v]) => (
                  <div key={ic} style={{ background:'#f8fafc',borderRadius:9,padding:'.65rem',textAlign:'center' }}>
                    <div style={{ fontSize:'.7rem',color:'#64748b',marginBottom:'.2rem' }}>{ic}</div>
                    <div style={{ fontWeight:700,fontSize:'.78rem',color:DARK }}>{v}</div>
                  </div>
                ))}
              </div>
              <div style={{ marginBottom:'.9rem' }}>
                <div className="sec-lbl">Description</div>
                <p style={{ fontSize:'.86rem',color:'#475569',lineHeight:1.6 }}>{modal.description}</p>
              </div>
              <div style={{ marginBottom:'.9rem' }}>
                <div className="sec-lbl">Débouchés</div>
                <ul style={{ listStyle:'none',display:'flex',flexDirection:'column',gap:'.35rem' }}>
                  {(typeof modal.debouches === 'string' ? modal.debouches.split(',') : modal.debouches || []).map((d,i) => (
                    <li key={i} style={{ display:'flex',gap:'.5rem',fontSize:'.85rem',color:'#374151' }}>
                      <span style={{ color:G,flexShrink:0 }}>✓</span>{typeof d === 'string' ? d.trim() : d}
                    </li>
                  ))}
                </ul>
              </div>
              {modal.cas_special && <div className="alert alert-ok"><I n="star" s={15} c="#166534"/><span><strong>Emploi quasi-garanti</strong> : WCRG, SMB Winning, Simandou.</span></div>}
              {modal.concours    && <div className="alert alert-warn"><I n="warn" s={15} c="#92400e"/><span><strong>Concours + Mention obligatoire.</strong> ~200 places.</span></div>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PageUniversites;
