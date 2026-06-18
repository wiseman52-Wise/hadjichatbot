import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';

export default function Register() {
  const { register } = useAuth();
  const { navigate } = useApp();
  const [formData, setFormData] = useState({
    username: '', password: '', email: '',
    first_name: '', last_name: '',
    serie_bac: 'SE', moyenne_bac: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleRegister = async () => {
    if (!formData.username || !formData.password || !formData.first_name || !formData.last_name || !formData.email) {
      setError('Veuillez remplir tous les champs obligatoires.');
      return;
    }
    try {
      setLoading(true); setError('');
      const payload = { ...formData };
      payload.mot_de_passe = payload.password;
      delete payload.password;
      if (payload.moyenne_bac) {
        payload.moyenne_bac = parseFloat(String(payload.moyenne_bac).replace(',', '.'));
      } else {
        delete payload.moyenne_bac;
      }
      const user = await register(payload);
      navigate('chatbot', user);
    } catch (err) {
      if (err.response?.data) {
        const data = err.response.data;
        if (typeof data === 'string') { setError(data); return; }
        const msgs = Object.entries(data)
          .map(([k, v]) => `${k}: ${Array.isArray(v) ? v.join(', ') : v}`)
          .join(' | ');
        setError(msgs);
      } else {
        setError("Erreur lors de l'inscription. Essayez un autre pseudo.");
      }
    } finally { setLoading(false); }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">
          <span className="emoji">🎓</span>
          <h1>Créer un compte</h1>
          <p>Rejoignez OrientaGN pour personnaliser votre orientation</p>
        </div>
        {error && <div className="error-box">{error}</div>}
        <div className="form-grid">
          <div className="form-group">
            <label>Prénom(s)</label>
            <input type="text" name="first_name" value={formData.first_name} onChange={handleChange} placeholder="Mamadou" disabled={loading} />
          </div>
          <div className="form-group">
            <label>Nom de famille</label>
            <input type="text" name="last_name" value={formData.last_name} onChange={handleChange} placeholder="Diallo" disabled={loading} />
          </div>
          <div className="form-group full-col">
            <label>Email</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="votre@email.com" disabled={loading} />
          </div>
          <div className="form-group">
            <label>Nom d'utilisateur</label>
            <input type="text" name="username" value={formData.username} onChange={handleChange} placeholder="pseudo unique" disabled={loading} />
          </div>
          <div className="form-group">
            <label>Mot de passe</label>
            <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="••••••" disabled={loading} />
          </div>
          <div className="form-group">
            <label>Série BAC</label>
            <select name="serie_bac" value={formData.serie_bac} onChange={handleChange} disabled={loading}>
              <option value="SE">SE — Sciences Exactes</option>
              <option value="SS">SS — Sciences Sociales</option>
              <option value="SM">SM — Sciences Mathématiques</option>
              <option value="SE-FA">SE-FA — Franco-Arabe Exactes</option>
              <option value="SS-FA">SS-FA — Franco-Arabe Sociales</option>
            </select>
          </div>
          <div className="form-group">
            <label>Moyenne BAC (/20)</label>
            <input type="number" name="moyenne_bac" value={formData.moyenne_bac} onChange={handleChange} placeholder="Ex: 13.5" min="0" max="20" step="0.25" disabled={loading} />
          </div>
        </div>
        <button className="btn-submit" onClick={handleRegister} disabled={loading}>
          {loading ? '⏳ Création...' : 'Créer mon compte →'}
        </button>
        <div className="auth-footer">
          Déjà un compte ? <a onClick={() => navigate('login')}>Se connecter</a>
        </div>
      </div>
    </div>
  );
}
