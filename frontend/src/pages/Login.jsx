import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';

export default function Login() {
  const { login } = useAuth();
  const { navigate } = useApp();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!username || !password) { setError('Veuillez remplir tous les champs.'); return; }
    try {
      setLoading(true);
      setError('');
      const user = await login(username, password);
      navigate('chatbot', user);
    } catch (err) {
      const data = err.response?.data;
      if (data?.detail) setError(data.detail);
      else setError('Identifiants incorrects. Vérifiez votre username et mot de passe.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">
          <span className="emoji">🎓</span>
          <h1>Bon retour 👋</h1>
          <p>Connectez-vous à votre espace OrientaGN</p>
        </div>
        {error && <div className="error-box">{error}</div>}
        <div className="form-group">
          <label>Nom d'utilisateur</label>
          <input
            type="text" value={username} autoComplete="username"
            onChange={e => setUsername(e.target.value)}
            placeholder="Votre username" disabled={loading}
            onKeyDown={e => e.key === 'Enter' && handleLogin()}
          />
        </div>
        <div className="form-group">
          <label>Mot de passe</label>
          <input
            type="password" value={password} autoComplete="current-password"
            onChange={e => setPassword(e.target.value)}
            placeholder="••••••••" disabled={loading}
            onKeyDown={e => e.key === 'Enter' && handleLogin()}
          />
        </div>
        <button className="btn-submit" onClick={handleLogin} disabled={loading}>
          {loading ? '⏳ Connexion...' : 'Se connecter →'}
        </button>
        <div className="auth-footer">
          Pas encore de compte ? <a onClick={() => navigate('register')}>Créer un compte</a>
        </div>
        <div className="auth-footer" style={{ marginTop: '8px' }}>
          <a onClick={() => navigate('chatbot')}>Continuer sans compte →</a>
        </div>
      </div>
    </div>
  );
}
