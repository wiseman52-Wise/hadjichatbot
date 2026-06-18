import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';
import { G, DARK, GOLD, I } from '../utils/constants';

function PageProfil({ user, onUpdate }) {
  const navigate = useNavigate();
  const [fd, setFd] = useState({
    first_name: user?.first_name || '',
    last_name: user?.last_name || '',
    serie_bac: user?.serie_bac || 'SS',
    moyenne_bac: user?.moyenne_bac || ''
  });
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState({ text: '', type: '' });

  if (!user) {
    return (
      <div className="page" style={{ textAlign: 'center', paddingTop: '4rem' }}>
        <h2>Veuillez vous connecter pour voir votre profil.</h2>
        <button className="btn btn-gold" style={{ marginTop: '1rem' }} onClick={() => navigate('/connexion')}>
          Connexion
        </button>
      </div>
    );
  }

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg({ text: '', type: '' });
    try {
      const { data } = await authAPI.updateProfil(fd);
      onUpdate(data);
      setMsg({ text: 'Profil mis à jour avec succès.', type: 'ok' });
    } catch (err) {
      setMsg({ text: 'Erreur lors de la mise à jour.', type: 'err' });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await authAPI.deconnexion();
      onUpdate(null);
      navigate('/connexion');
    } catch (err) {
      console.error(err);
      onUpdate(null);
      navigate('/connexion');
    }
  };

  return (
    <div className="page" style={{ minHeight: '80vh', padding: '3rem 1rem' }}>
      <div className="profil-card">
        <div className="profil-av">
          {user.first_name ? user.first_name[0] : user.username[0].toUpperCase()}
        </div>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: DARK }}>
            {user.first_name} {user.last_name}
          </h2>
          <p style={{ color: '#64748b' }}>@{user.username}</p>
        </div>

        {msg.text && (
          <div className={`alert alert-${msg.type}`}>
            <I n={msg.type === 'ok' ? 'check' : 'warn'} s={18} />
            {msg.text}
          </div>
        )}

        <form onSubmit={submit}>
          <div className="frow">
            <div className="fg">
              <label className="fl">Prénom</label>
              <input type="text" className="fi" value={fd.first_name} onChange={e => setFd({ ...fd, first_name: e.target.value })} />
            </div>
            <div className="fg">
              <label className="fl">Nom</label>
              <input type="text" className="fi" value={fd.last_name} onChange={e => setFd({ ...fd, last_name: e.target.value })} />
            </div>
          </div>
          <div className="frow">
            <div className="fg">
              <label className="fl">Série du Bac</label>
              <select className="fsel" value={fd.serie_bac} onChange={e => setFd({ ...fd, serie_bac: e.target.value })}>
                <option value="SS">Sciences Sociales</option>
                <option value="SM">Sciences Mathématiques</option>
                <option value="SE">Sciences Expérimentales</option>
                <option value="TS">Toutes Séries</option>
              </select>
            </div>
            <div className="fg">
              <label className="fl">Moyenne (sur 20)</label>
              <input type="number" step="0.01" className="fi" value={fd.moyenne_bac} onChange={e => setFd({ ...fd, moyenne_bac: e.target.value })} />
            </div>
          </div>
          <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
            <button type="submit" className="btn btn-gold" style={{ flex: 1, justifyContent: 'center' }} disabled={loading}>
              <I n="check" s={16} /> {loading ? 'Enregistrement...' : 'Sauvegarder'}
            </button>
            <button type="button" className="btn btn-outline" style={{ flex: 1, justifyContent: 'center' }} onClick={handleLogout}>
              <I n="out" s={16} /> Se déconnecter
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default PageProfil;
