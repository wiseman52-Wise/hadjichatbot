import React, { useState, useEffect, useMemo } from 'react';
import { G, DARK, I, uniColor } from '../utils/constants';
import api from '../services/api';

const INPUT_STYLE = {
  border:'1px solid #e2e8f0', borderRadius:8, padding:'.5rem .85rem',
  fontSize:'.88rem', outline:'none', background:'#fff', color:DARK, width:'100%'
};
const SELECT_STYLE = { ...INPUT_STYLE, cursor:'pointer', maxWidth:180 };

function PageAdmin({ user }) {
  const [data, setData]   = useState(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab]     = useState('overview');
  const [conseilExpanded, setConseilExpanded] = useState(null);

  // Filtres filières
  const [filSearch, setFilSearch]   = useState('');
  const [filUni, setFilUni]         = useState('');
  const [filProfil, setFilProfil]   = useState('');
  // Filtres conseils
  const [convSearch, setConvSearch] = useState('');
  const [convEtud, setConvEtud]     = useState('');

  useEffect(() => {
    api.get('/stats/').then(r => { setData(r.data); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  // ⚠️ Tous les useMemo AVANT les early returns — règle des hooks React
  const allFilieres  = useMemo(() => data?.filiere_stats || [], [data]);
  const allConseils  = useMemo(() => data?.derniers_conseils || [], [data]);

  const unis    = useMemo(() => [...new Set(allFilieres.map(f => f.universite))].sort(), [allFilieres]);
  const profils = useMemo(() => [...new Set(allFilieres.flatMap(f => (f.profils_acceptes||'').split(',').map(p=>p.trim()).filter(Boolean)))].sort(), [allFilieres]);
  const etudiants = useMemo(() => [...new Set(allConseils.map(c => `${c['conversation__etudiant__first_name']} ${c['conversation__etudiant__last_name']}`.trim()))].filter(Boolean).sort(), [allConseils]);

  const filteredFilieres = useMemo(() => allFilieres.filter(f => {
    const q = filSearch.toLowerCase();
    const matchSearch = !q || f.nom.toLowerCase().includes(q) || (f.debouches||'').toLowerCase().includes(q);
    const matchUni    = !filUni    || f.universite === filUni;
    const matchProfil = !filProfil || (f.profils_acceptes||'').includes(filProfil);
    return matchSearch && matchUni && matchProfil;
  }), [allFilieres, filSearch, filUni, filProfil]);

  const filteredConseils = useMemo(() => allConseils.filter(c => {
    const q   = convSearch.toLowerCase();
    const nom = `${c['conversation__etudiant__first_name']} ${c['conversation__etudiant__last_name']}`.toLowerCase();
    const matchSearch = !q || nom.includes(q) || (c.contenu||'').toLowerCase().includes(q) || (c['conversation__titre']||'').toLowerCase().includes(q);
    const matchEtud   = !convEtud || nom.includes(convEtud.toLowerCase());
    return matchSearch && matchEtud;
  }), [allConseils, convSearch, convEtud]);

  const maxElig = useMemo(() => Math.max(...filteredFilieres.map(f=>f.nb_etudiants_eligibles), 1), [filteredFilieres]);
  const maxMsg  = useMemo(() => Math.max(...(data?.msgs_par_jour||[]).map(d=>d.count), 1), [data]);
  const maxBar  = useMemo(() => Math.max(...(data?.bac_stats||[]).map(b=>b.count), 1), [data]);

  // ── Early returns après tous les hooks ──
  if (!user?.is_staff) return (
    <div className="page" style={{ textAlign:'center',paddingTop:'5rem' }}>
      <div style={{ fontSize:'3rem',marginBottom:'1rem' }}>🔒</div>
      <h2 style={{ color:DARK }}>Accès réservé aux administrateurs</h2>
    </div>
  );
  if (loading) return <div className="full-spin"><div className="spinner"/></div>;
  if (!data)   return <div className="page"><div className="alert alert-err">Erreur de chargement des données admin.</div></div>;

  const TABS = [
    ['overview', '📊 Vue globale'],
    ['filieres', '📚 Filières & Inscrits'],
    ['conseils', '💬 Conseils Chatbot'],
    ['users', '👥 Étudiants'],
  ];

  return (
    <div className="page" style={{ paddingTop:'2rem' }}>
      {/* Header */}
      <div style={{ display:'flex',alignItems:'flex-start',justifyContent:'space-between',marginBottom:'2rem',flexWrap:'wrap',gap:'1rem' }}>
        <div>
          <div className="sec-eyebrow">Tableau de bord</div>
          <h1 className="sec-title">Administration OrientaGN</h1>
          <p style={{ color:'#64748b',marginTop:'.25rem',fontSize:'.92rem' }}>
            Bienvenue, <strong>{user.first_name || user.username}</strong> · Accès administrateur
          </p>
        </div>
        <div style={{ display:'flex',gap:'.5rem',flexWrap:'wrap' }}>
          {TABS.map(([k,l]) => (
            <button key={k} className={`btn ${tab===k?'btn-primary':'btn-outline'} btn-sm`} onClick={() => setTab(k)}>{l}</button>
          ))}
        </div>
      </div>

      {/* === VUE GLOBALE === */}
      {tab==='overview' && <>
        <div className="dash-grid">
          {[
            ['👥', data.total_users, 'Étudiants inscrits'],
            ['💬', data.total_convs, 'Conversations'],
            ['📨', data.total_msgs, 'Messages échangés'],
            ['🏛️', data.nb_universites, 'Universités'],
            ['📚', data.nb_filieres, 'Filières'],
          ].map(([ic,v,l]) => (
            <div key={l} className="kpi">
              <div className="kpi-icon">{ic}</div>
              <div className="kpi-val">{v ?? '—'}</div>
              <div className="kpi-lbl">{l}</div>
            </div>
          ))}
        </div>

        <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:'1.5rem',marginBottom:'1.5rem' }}>
          <div className="table-wrap">
            <div className="tw-head">📈 Messages par jour (7 derniers jours)</div>
            <div style={{ padding:'1rem 1.25rem' }}>
              <div className="msg-chart">
                {(data.msgs_par_jour||[]).map((d,i) => (
                  <div key={i} className="msg-bar" style={{ height:`${Math.max((d.count/maxMsg)*100,4)}%` }} title={`${d.count} messages`}>
                    <span className="msg-bar-lbl">{d.date}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="table-wrap">
            <div className="tw-head">🎓 Répartition Séries BAC</div>
            <div className="bar-chart">
              {(data.bac_stats||[]).length===0 && <p style={{ color:'#94a3b8',fontSize:'.85rem',padding:'1rem' }}>Aucune donnée BAC</p>}
              {(data.bac_stats||[]).map(b => (
                <div key={b.serie_bac} className="bar-row">
                  <span className="bar-lbl">{b.serie_bac}</span>
                  <div className="bar-track"><div className="bar-fill" style={{ width:`${(b.count/maxBar)*100}%` }}/></div>
                  <span className="bar-val">{b.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="table-wrap">
          <div className="tw-head">🕐 Dernières inscriptions</div>
          <div style={{ overflowX:'auto' }}>
            <table>
              <thead><tr><th>Étudiant</th><th>Username</th><th>Série BAC</th><th>Moyenne</th><th>Inscrit le</th></tr></thead>
              <tbody>
                {(data.recent_users||[]).map(u => (
                  <tr key={u.id}>
                    <td style={{ fontWeight:600 }}>{u.first_name} {u.last_name}</td>
                    <td style={{ color:'#64748b' }}>@{u.username}</td>
                    <td>{u.serie_bac ? <span className="badge bg-blue">{u.serie_bac}</span> : '—'}</td>
                    <td>{u.moyenne_bac ? <span className="badge bg-green">{u.moyenne_bac}/20</span> : '—'}</td>
                    <td style={{ color:'#64748b',fontSize:'.8rem' }}>{new Date(u.date_inscription).toLocaleDateString('fr-FR')}</td>
                  </tr>
                ))}
                {(data.recent_users||[]).length===0 && <tr><td colSpan={5} style={{ textAlign:'center',color:'#94a3b8',padding:'2rem' }}>Aucun utilisateur</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
      </>}

      {/* === FILIÈRES & INSCRITS === */}
      {tab==='filieres' && (
        <div>
          <div style={{ display:'flex',gap:'.75rem',flexWrap:'wrap',marginBottom:'1.25rem',alignItems:'center' }}>
            <div style={{ flex:'1 1 220px',position:'relative' }}>
              <span style={{ position:'absolute',left:10,top:'50%',transform:'translateY(-50%)',color:'#94a3b8',pointerEvents:'none' }}>🔍</span>
              <input style={{ ...INPUT_STYLE, paddingLeft:'2rem' }} placeholder="Rechercher une filière ou un débouché..." value={filSearch} onChange={e => setFilSearch(e.target.value)} />
            </div>
            <select style={SELECT_STYLE} value={filUni} onChange={e => setFilUni(e.target.value)}>
              <option value="">Toutes les universités</option>
              {unis.map(u => <option key={u} value={u}>{u}</option>)}
            </select>
            <select style={SELECT_STYLE} value={filProfil} onChange={e => setFilProfil(e.target.value)}>
              <option value="">Tous les profils</option>
              {profils.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
            {(filSearch||filUni||filProfil) && (
              <button className="btn btn-ghost btn-sm" onClick={() => { setFilSearch(''); setFilUni(''); setFilProfil(''); }}>✕ Réinitialiser</button>
            )}
            <span style={{ color:'#94a3b8',fontSize:'.83rem',whiteSpace:'nowrap' }}>{filteredFilieres.length} / {allFilieres.length} filières</span>
          </div>

          <div className="table-wrap">
            <div className="tw-head">📚 Filières par popularité</div>
            <div style={{ overflowX:'auto' }}>
              <table>
                <thead>
                  <tr><th>#</th><th>Filière</th><th>Université</th><th>Profils</th><th>Moy. requise</th><th>Étudiants éligibles</th><th>Débouchés</th></tr>
                </thead>
                <tbody>
                  {filteredFilieres.map((f,i) => (
                    <tr key={f.id}>
                      <td style={{ color:'#94a3b8',fontWeight:600 }}>#{i+1}</td>
                      <td style={{ fontWeight:600 }}>{f.nom}</td>
                      <td><span className="badge" style={{ background:uniColor(f.universite),color:'#fff' }}>{f.universite}</span></td>
                      <td style={{ fontSize:'.8rem',color:'#64748b' }}>{f.profils_acceptes || 'Tous'}</td>
                      <td><span className="badge bg-blue">≥ {f.moyenne_requise}/20</span></td>
                      <td>
                        <div style={{ display:'flex',alignItems:'center',gap:'.5rem' }}>
                          <div style={{ background:'#e2e8f0',borderRadius:6,height:8,width:80,overflow:'hidden' }}>
                            <div style={{ height:'100%',background:G,width:`${maxElig>0?(f.nb_etudiants_eligibles/maxElig)*100:0}%`,transition:'width .3s' }}/>
                          </div>
                          <strong style={{ color:f.nb_etudiants_eligibles>0?G:'#94a3b8' }}>{f.nb_etudiants_eligibles}</strong>
                        </div>
                      </td>
                      <td style={{ fontSize:'.78rem',color:'#64748b',maxWidth:200,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap' }} title={f.debouches||''}>{f.debouches||'—'}</td>
                    </tr>
                  ))}
                  {filteredFilieres.length===0 && <tr><td colSpan={7} style={{ textAlign:'center',color:'#94a3b8',padding:'2rem' }}>Aucune filière trouvée</td></tr>}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* === CONSEILS CHATBOT === */}
      {tab==='conseils' && (
        <div>
          <div style={{ display:'flex',gap:'.75rem',flexWrap:'wrap',marginBottom:'1.25rem',alignItems:'center' }}>
            <div style={{ flex:'1 1 220px',position:'relative' }}>
              <span style={{ position:'absolute',left:10,top:'50%',transform:'translateY(-50%)',color:'#94a3b8',pointerEvents:'none' }}>🔍</span>
              <input style={{ ...INPUT_STYLE, paddingLeft:'2rem' }} placeholder="Rechercher dans les conseils, titres..." value={convSearch} onChange={e => setConvSearch(e.target.value)} />
            </div>
            <select style={SELECT_STYLE} value={convEtud} onChange={e => setConvEtud(e.target.value)}>
              <option value="">Tous les étudiants</option>
              {etudiants.map(e => <option key={e} value={e}>{e}</option>)}
            </select>
            {(convSearch||convEtud) && (
              <button className="btn btn-ghost btn-sm" onClick={() => { setConvSearch(''); setConvEtud(''); }}>✕ Réinitialiser</button>
            )}
            <span style={{ color:'#94a3b8',fontSize:'.83rem',whiteSpace:'nowrap' }}>{filteredConseils.length} / {allConseils.length} conseils</span>
          </div>

          <div style={{ display:'flex',flexDirection:'column',gap:'1rem' }}>
            {filteredConseils.length===0 && (
              <div className="alert alert-info"><I n="info" s={15} c="#1e40af"/> Aucun conseil trouvé.</div>
            )}
            {filteredConseils.map(c => {
              const isExpanded = conseilExpanded === c.id;
              const hasMore = (c.contenu?.length || 0) > 200;
              return (
                <div key={c.id} className="table-wrap" style={{ padding:'1rem 1.25rem' }}>
                  <div style={{ display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:'.5rem',gap:'1rem' }}>
                    <div style={{ display:'flex',gap:'.75rem',alignItems:'center' }}>
                      <div style={{ width:36,height:36,borderRadius:'50%',background:G,display:'flex',alignItems:'center',justifyContent:'center',color:'#fff',fontWeight:700,fontSize:'.9rem',flexShrink:0 }}>
                        {c['conversation__etudiant__first_name']?.[0] || '?'}
                      </div>
                      <div>
                        <div style={{ fontWeight:600,fontSize:'.9rem' }}>
                          {c['conversation__etudiant__first_name']} {c['conversation__etudiant__last_name']}
                          {c['conversation__etudiant__serie_bac'] && <span className="badge bg-blue" style={{ marginLeft:6 }}>{c['conversation__etudiant__serie_bac']}</span>}
                        </div>
                        <div style={{ color:'#94a3b8',fontSize:'.78rem' }}>{c['conversation__titre'] || 'Conversation'}</div>
                      </div>
                    </div>
                    <div style={{ color:'#94a3b8',fontSize:'.78rem',whiteSpace:'nowrap',flexShrink:0 }}>
                      {new Date(c.created_at).toLocaleDateString('fr-FR', { day:'2-digit',month:'2-digit',year:'numeric',hour:'2-digit',minute:'2-digit' })}
                    </div>
                  </div>
                  <div style={{ background:'#f8fafc',borderRadius:8,padding:'.75rem 1rem',fontSize:'.88rem',color:'#334155',lineHeight:1.6,borderLeft:`3px solid ${G}` }}>
                    <p style={{ margin:0,whiteSpace:'pre-wrap' }}>
                      {isExpanded ? c.contenu : c.contenu?.slice(0,200)}{!isExpanded && hasMore ? '…' : ''}
                    </p>
                    {hasMore && (
                      <button onClick={() => setConseilExpanded(isExpanded ? null : c.id)}
                        style={{ marginTop:'.5rem',background:'none',border:'none',color:G,cursor:'pointer',fontWeight:600,fontSize:'.82rem',padding:0 }}>
                        {isExpanded ? '▲ Voir moins' : '▼ Voir tout le conseil'}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* === ÉTUDIANTS === */}
      {tab==='users' && (
        <div className="table-wrap">
          <div className="tw-head">👥 Étudiants inscrits ({data.total_users})</div>
          <div style={{ overflowX:'auto' }}>
            <table>
              <thead><tr><th>Nom</th><th>Username</th><th>Série BAC</th><th>Moyenne</th><th>Inscrit le</th></tr></thead>
              <tbody>
                {(data.recent_users||[]).map(u => (
                  <tr key={u.id}>
                    <td style={{ fontWeight:600 }}>{u.first_name} {u.last_name}</td>
                    <td style={{ color:'#64748b' }}>@{u.username}</td>
                    <td>{u.serie_bac?<span className="badge bg-blue">{u.serie_bac}</span>:'—'}</td>
                    <td>{u.moyenne_bac?<span className="badge bg-green">{u.moyenne_bac}/20</span>:'—'}</td>
                    <td style={{ color:'#64748b',fontSize:'.8rem' }}>{new Date(u.date_inscription).toLocaleDateString('fr-FR')}</td>
                  </tr>
                ))}
                {(data.recent_users||[]).length===0 && <tr><td colSpan={5} style={{ textAlign:'center',color:'#94a3b8',padding:'2rem' }}>Aucun étudiant</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default PageAdmin;
