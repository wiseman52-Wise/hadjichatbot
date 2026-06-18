import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authAPI, dataAPI, chatAPI } from '../services/api';
import { G, GOLD, DARK, BG, UNI_IMAGES, CSS, I, md, uniColor, uniBadge } from '../utils/constants';

function PageChatbot({ user }) {
  const navigate = useNavigate();
  const [convs, setConvs]     = useState([]);
  const [curConv, setCurConv] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput]     = useState('');
  const [sending, setSending] = useState(false);
  const [guided, setGuided]   = useState(false);
  const [gStep, setGStep]     = useState(1);
  const [gData, setGData]     = useState({});
  const [recording, setRecording] = useState(false);
  const [dragOver, setDragOver]   = useState(false);
  const [uploadFile, setUploadFile] = useState(null);
  const bodyRef = useRef(null);
  const taRef   = useRef(null);
  const mediaRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    chatAPI.conversations().then(r => setConvs(r.data)).catch(() => {});
  }, []);

  useEffect(() => {
    if (bodyRef.current) bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
  }, [messages, sending]);

  const loadConv = async id => {
    const { data } = await chatAPI.detail(id);
    setCurConv(data);
    setMessages(data.messages || []);
  };

  const newConv = async () => {
    const { data } = await chatAPI.create();
    setCurConv(data); setMessages([]);
    setConvs(p => [data, ...p]);
  };

  const delConv = async (id, e) => {
    e.stopPropagation();
    if (!window.confirm('Supprimer ?')) return;
    await chatAPI.delete(id);
    setConvs(p => p.filter(c => c.id !== id));
    if (curConv?.id === id) { setCurConv(null); setMessages([]); }
  };

  const send = async (text, file) => {
    const msg = text || input.trim();
    if (!msg && !file && !uploadFile) return;
    if (sending) return;
    setInput(''); setUploadFile(null);
    if (taRef.current) taRef.current.style.height = 'auto';
    setSending(true);

    const displayMsg = msg || (file ? `📎 Fichier : ${file.name}` : uploadFile ? `📎 Fichier : ${uploadFile.name}` : '');
    setMessages(p => [...p, { role:'user', contenu:displayMsg }]);

    try {
      const fd = new FormData();
      if (msg) fd.append('message', msg);
      if (curConv?.id) fd.append('conversation_id', curConv.id);
      const f = file || uploadFile;
      if (f) fd.append('fichier', f);

      const { data } = await chatAPI.sendForm(fd);
      setMessages(p => [...p, { role:'assistant', contenu:data.response }]);
      setCurConv({ id:data.conversation_id, titre:data.conversation_titre });
      setConvs(p => {
        const ex = p.find(c => c.id===data.conversation_id);
        if (ex) return p.map(c => c.id===data.conversation_id ? {...c,titre:data.conversation_titre}:c);
        return [{ id:data.conversation_id, titre:data.conversation_titre },...p];
      });
    } catch {
      setMessages(p => [...p, { role:'assistant', contenu:'❌ Erreur de connexion. Vérifiez que le serveur Django est démarré.' }]);
    }
    setSending(false);
  };

  /* Vocal */
  const toggleVocal = async () => {
    if (recording) {
      mediaRef.current?.stop();
      setRecording(false);
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mr = new MediaRecorder(stream);
      const chunks = [];
      mr.ondataavailable = e => chunks.push(e.data);
      mr.onstop = () => {
        const blob = new Blob(chunks, { type:'audio/webm' });
        // Speech-to-text simple via Web Speech API si dispo
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
          const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
          const rec = new SR();
          rec.lang = 'fr-FR';
          rec.onresult = e => { setInput(e.results[0][0].transcript); };
          rec.start();
        } else {
          setInput(p => p + ' [Message vocal enregistré — transcription non disponible dans ce navigateur]');
        }
        stream.getTracks().forEach(t => t.stop());
      };
      mr.start();
      mediaRef.current = mr;
      setRecording(true);
      setTimeout(() => { if (mediaRef.current?.state==='recording') { mediaRef.current.stop(); setRecording(false); } }, 30000);
    } catch { alert('Accès au microphone refusé.'); }
  };

  /* Drag & Drop */
  const handleDrop = e => {
    e.preventDefault(); setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) setUploadFile(file);
  };

  const handleGuided = (key, val) => {
    const next = { ...gData, [key]: val };
    setGData(next);
    if (key==='bac') { setGStep(2); return; }
    if (key==='moy') { setGStep(3); return; }
    setGuided(false); setGStep(1); setGData({});
    send(`Orientation personnalisée. Mon bac : ${next.bac}. Ma moyenne : ${next.moy}/20. Domaine : ${val}. Quelles filières recommandes-tu dans les universités guinéennes ?`);
  };

  const init = `${user.first_name[0]}${user.last_name[0]}`.toUpperCase();
  const QUICK = [
    ['🎯 Mon profil', `Quelles filières pour bac ${user.serie_bac||'SE'} avec ${user.moyenne_bac||'13'}/20 ?`],
    ['🚂 Ferroviaire', "Institut de Chemin de Fer — emploi garanti ?"],
    ['💻 Informatique', "Filières informatiques disponibles ?"],
    ['🏥 Santé', "Comment accéder à la FSTS (Médecine) ?"],
    ['⛏️ Mines', "Institut des Mines et Géologie de Boké ?"],
    ['🌿 Environnement', "Filières environnement à N'Zérékoré ?"],
  ];

  return (
    <div className="chat-layout">
      {/* SIDEBAR */}
      <div className="chat-sb">
        <div className="chat-sb-top">
          <button className="btn btn-primary" style={{ width:'100%' }} onClick={newConv}>
            <I n="plus" s={15}/> Nouvelle conversation
          </button>
        </div>
        <div className="chat-list">
          {convs.length===0 && <p style={{ textAlign:'center',color:'#94a3b8',fontSize:'.8rem',marginTop:'2rem' }}>Aucune conversation</p>}
          {convs.map(c => (
            <div key={c.id} className={`ci ${curConv?.id===c.id?'active':''}`} onClick={() => loadConv(c.id)}>
              <div className="ci-title">{c.titre}</div>
              <button className="ci-del" onClick={e => delConv(c.id,e)}><I n="trash" s={12}/></button>
            </div>
          ))}
        </div>
        <div style={{ padding:'.9rem',borderTop:'1px solid #f1f5f9' }}>
          <div style={{ display:'flex',alignItems:'center',gap:'.55rem' }}>
            <div style={{ width:32,height:32,borderRadius:'50%',background:G,display:'flex',alignItems:'center',justifyContent:'center',color:'#fff',fontSize:'.72rem',fontWeight:700,flexShrink:0 }}>{init}</div>
            <div style={{ minWidth:0 }}>
              <div style={{ fontSize:'.81rem',fontWeight:600,color:DARK,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap' }}>{user.first_name} {user.last_name}</div>
              <div style={{ fontSize:'.7rem',color:'#94a3b8' }}>{user.serie_bac||'—'} · {user.moyenne_bac||'?'}/20</div>
            </div>
          </div>
        </div>
      </div>

      {/* MAIN CHAT */}
      <div className="chat-main">
        <div className="chat-top">
          <div style={{ width:36,height:36,borderRadius:'50%',background:G,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0 }}>
            <I n="robot" s={17} c="#fff"/>
          </div>
          <div>
            <div style={{ fontWeight:700,color:DARK,fontSize:'.92rem',display:'flex',alignItems:'center',gap:'.5rem' }}>
              OrientaBot <span style={{ background:'#22c55e',color:'#fff',fontSize:'.63rem',padding:'.15rem .5rem',borderRadius:50,fontWeight:700 }}>En ligne</span>
            </div>
            <div style={{ fontSize:'.75rem',color:'#64748b' }}>IA · 5 universités guinéennes</div>
          </div>
          <div style={{ marginLeft:'auto',display:'flex',gap:'.4rem' }}>
            <button className="btn btn-outline btn-sm" onClick={() => { setGuided(true); setGStep(1); setGData({}); }}>
              <I n="grid" s={13}/> Mode guidé
            </button>
          </div>
        </div>

        <div className="chat-body" ref={bodyRef}>
          {messages.length===0 && (
            <div className="mr">
              <div className="mav bot"><I n="robot" s={13} c="#fff"/></div>
              <div className="bub bot">
                Bonjour <strong>{user.first_name}</strong> ! 👋 Je suis <strong>OrientaBot</strong>, ton conseiller d'orientation académique pour les universités guinéennes.<br/><br/>
                {user.serie_bac && user.moyenne_bac ? (
                  <>J'ai ton profil : <strong>Bac {user.serie_bac}</strong>, moyenne <strong>{user.moyenne_bac}/20</strong>.<br/>Envoie-moi un message et je te donne tes recommandations personnalisées ! 🎯</>
                ) : user.serie_bac ? (
                  <>Je vois ton <strong>Bac {user.serie_bac}</strong>. Pour te conseiller précisément, quelle est ta <strong>moyenne au baccalauréat</strong> (sur 20) ?</>
                ) : (
                  <>Pour commencer, es-tu <strong>bachelier(ère)</strong> ?<br/><br/>
                  Si oui, dis-moi ta <strong>série de bac</strong> (SE, SE-FA, SM, SS, SS-FA) et ta <strong>moyenne</strong> — je te listerai toutes les filières accessibles dans les universités guinéennes. 🎓</>
                )}
              </div>
            </div>
          )}
          {messages.map((m,i) => (
            <div key={i} className={`mr ${m.role==='user'?'u':''}`}>
              <div className={`mav ${m.role==='user'?'usr':'bot'}`}>{m.role==='user'?init:<I n="robot" s={13} c="#fff"/>}</div>
              <div className={`bub ${m.role==='user'?'usr':'bot'}`} dangerouslySetInnerHTML={{ __html:md(m.contenu) }}/>
            </div>
          ))}
          {sending && (
            <div className="mr">
              <div className="mav bot"><I n="robot" s={13} c="#fff"/></div>
              <div className="typing"><div className="dot"/><div className="dot"/><div className="dot"/></div>
            </div>
          )}
        </div>

        <div className="chat-foot">
          {/* Fichier sélectionné */}
          {uploadFile && (
            <div style={{ display:'flex',alignItems:'center',gap:'.6rem',background:'#f0fdf4',border:'1px solid #bbf7d0',borderRadius:9,padding:'.5rem .85rem',marginBottom:'.6rem' }}>
              <I n="file" s={15} c={G}/>
              <span style={{ fontSize:'.82rem',color:'#166534',flex:1 }}>{uploadFile.name}</span>
              <button style={{ background:'none',border:'none',cursor:'pointer',color:'#94a3b8' }} onClick={() => setUploadFile(null)}>✕</button>
            </div>
          )}

          {/* Zone drag & drop */}
          <div
            className={`upload-zone ${dragOver?'drag':''}`}
            onDragOver={e => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <input ref={fileInputRef} type="file" accept=".txt,.pdf,.doc,.docx,.csv,.json" onChange={e => setUploadFile(e.target.files[0])} />
            <I n="upload" s={18} c="#94a3b8"/>
            <p style={{ fontSize:'.78rem',color:'#94a3b8',marginTop:'.3rem' }}>
              Glisse un fichier ici ou clique pour importer · Relevé de notes, CV, lettre...
            </p>
          </div>

          {/* Questions rapides */}
          <div className="qchips">
            {QUICK.map(([l,q]) => <button key={l} className="qc" onClick={() => send(q)}>{l}</button>)}
          </div>

          {/* Zone saisie */}
          <div className="input-row">
            <button
              className={`vocal-btn ${recording?'recording':''}`}
              onClick={toggleVocal}
              title={recording?'Arrêter':'Parler'}
            >
              <I n="mic" s={16} c={recording?'#fff':G}/>
            </button>
            <textarea
              ref={taRef}
              className="chat-ta"
              rows={1}
              placeholder={recording ? '🎤 Enregistrement en cours...' : 'Écris ta question... (Entrée pour envoyer)'}
              value={input}
              onChange={e => { setInput(e.target.value); e.target.style.height='auto'; e.target.style.height=Math.min(e.target.scrollHeight,110)+'px'; }}
              onKeyDown={e => { if (e.key==='Enter'&&!e.shiftKey) { e.preventDefault(); send(); } }}
              disabled={recording}
            />
            <button className="send-btn" disabled={sending||(!input.trim()&&!uploadFile)} onClick={() => send()}>
              <I n="send" s={15} c="#fff"/>
            </button>
          </div>
          {recording && <p style={{ textAlign:'center',fontSize:'.75rem',color:'#ef4444',marginTop:'.4rem' }}>🔴 Enregistrement... Cliquez sur le micro pour arrêter</p>}
        </div>
      </div>

      {/* Modal guidé */}
      {guided && (
        <div className="modal-ov" onClick={() => setGuided(false)}>
          <div className="modal-box" onClick={e => e.stopPropagation()}>
            <div className="modal-head">
              <div>
                <h3 style={{ color:'#fff',fontWeight:700 }}>🧭 Orientation guidée</h3>
                <p style={{ color:'rgba(255,255,255,.7)',fontSize:'.82rem' }}>Étape {gStep}/3</p>
              </div>
              <button className="modal-close" onClick={() => setGuided(false)}>✕</button>
            </div>
            <div className="modal-body">
              <div className="progress-bar"><div className="progress-fill" style={{ width:`${(gStep/3)*100}%` }}/></div>
              {gStep===1 && <>
                <p style={{ fontWeight:700,color:DARK,marginBottom:'1rem',fontSize:'.9rem' }}>1. Quel est ton type de bac ?</p>
                {[['🔬','SE','Sciences Expérimentales'],['🔬','SE-FA','SE-FA'],['📐','SM','Sciences Mathématiques'],['📚','SS','Sciences Sociales'],['📚','SS-FA','SS-FA']].map(([ic,v,l]) => (
                  <button key={v} className="go" onClick={() => handleGuided('bac',v)}><span style={{ fontSize:'1.1rem' }}>{ic}</span>{v} — {l}</button>
                ))}
              </>}
              {gStep===2 && <>
                <p style={{ fontWeight:700,color:DARK,marginBottom:'1rem',fontSize:'.9rem' }}>2. Ta moyenne au bac ?</p>
                {['10 – 11/20','12 – 13/20','14 – 15/20','16/20 et plus 🌟'].map(v => (
                  <button key={v} className="go" onClick={() => handleGuided('moy',v)}><span style={{ fontSize:'1.1rem' }}>📊</span>{v}</button>
                ))}
              </>}
              {gStep===3 && <>
                <p style={{ fontWeight:700,color:DARK,marginBottom:'1rem',fontSize:'.9rem' }}>3. Quel domaine t'intéresse ?</p>
                {[['💻','Informatique & Numérique'],['⚙️','Génie & Ingénierie'],['🚂','Ferroviaire (emploi garanti !)'],['⛏️','Mines & Géologie'],['🌿','Environnement & Nature'],['🏥','Santé & Médecine'],['📚','Lettres & Sciences Sociales'],['💰','Économie & Gestion']].map(([ic,v]) => (
                  <button key={v} className="go" onClick={() => handleGuided('dom',v)}><span style={{ fontSize:'1.1rem' }}>{ic}</span>{v}</button>
                ))}
              </>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PageChatbot;
