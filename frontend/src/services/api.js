import axios from 'axios';

const api = axios.create({ 
  baseURL: 'http://localhost:8000/api',
  withCredentials: true 
});

api.interceptors.response.use(r => r, async err => {
  const originalRequest = err.config;
  const isAuthRequest = originalRequest.url && (originalRequest.url.includes('/auth/connexion') || originalRequest.url.includes('/auth/inscription'));
  
  if (err.response?.status === 401 && !originalRequest._retry && !isAuthRequest) {
    originalRequest._retry = true;
    try {
      // Le refresh cookie sera automatiquement envoyé
      await axios.post('http://localhost:8000/api/auth/token/refresh/', {}, { withCredentials: true });
      return api(originalRequest);
    } catch (refreshErr) {
      if (window.location.pathname !== '/connexion' && window.location.pathname !== '/inscription' && window.location.pathname !== '/') {
        window.location.href = '/connexion';
      }
      return Promise.reject(refreshErr);
    }
  }
  return Promise.reject(err);
});

export const authAPI = {
  inscription:  d => api.post('/auth/inscription/', d),
  connexion:    d => api.post('/auth/connexion/', d),
  deconnexion:  () => api.post('/auth/deconnexion/'),
  profil:       () => api.get('/auth/profil/'),
  updateProfil: d => api.put('/auth/profil/', d),
};

export const dataAPI = {
  universites:  () => api.get('/universites/'),
  universite:   id => api.get(`/universites/${id}/`),
  createUniv:   d  => api.post('/universites/', d),
  updateUniv:   (id, d) => api.patch(`/universites/${id}/`, d),
  deleteUniv:   id => api.delete(`/universites/${id}/`),

  filieres:     () => api.get('/filieres/'),
  createFiliere: d => api.post('/filieres/', d),
  updateFiliere: (id, d) => api.patch(`/filieres/${id}/`, d),
  deleteFiliere: id => api.delete(`/filieres/${id}/`),

  faq:          () => api.get('/faq/'),
  createFaq:    d  => api.post('/faq/', d),
  updateFaq:    (id, d) => api.patch(`/faq/${id}/`, d),
  deleteFaq:    id => api.delete(`/faq/${id}/`),

  calendrier:   () => api.get('/calendrier/'),
  createEvent:  d  => api.post('/calendrier/', d),
  updateEvent:  (id, d) => api.patch(`/calendrier/${id}/`, d),
  deleteEvent:  id => api.delete(`/calendrier/${id}/`),

  stats:        () => api.get('/stats/'),
};

export const chatAPI = {
  conversations: () => api.get('/conversations/'),
  create:        () => api.post('/conversations/'),
  detail:        id => api.get(`/conversations/${id}/`),
  delete:        id => api.delete(`/conversations/${id}/`),
  send:          d  => api.post('/conversations/message/', d),
  sendForm:      fd => api.post('/conversations/message/', fd, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  feedback:      (msgId, data) => api.post(`/messages/${msgId}/feedback/`, data),
};

export default api;
