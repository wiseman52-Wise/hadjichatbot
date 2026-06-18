import os
import re

src_dir = r'c:\Users\Dell\Desktop\orientagn_react_django (4)\orientagn_react_django (3)\orientagn2\frontend\src'
app_path = os.path.join(src_dir, 'App.jsx')

with open(app_path, 'r', encoding='utf-8') as f:
    content = f.read()

def extract_function(name):
    pattern = f'function {name}\s*\([^\)]*\)\s*{{'
    match = re.search(pattern, content)
    if not match: return None
    start = match.start()
    
    brace_count = 0
    in_str = False
    escape = False
    str_char = ''
    i = start
    first_brace = False
    while i < len(content):
        c = content[i]
        if not escape and c in ("'", '"', '`'):
            if not in_str:
                in_str = True
                str_char = c
            elif c == str_char:
                in_str = False
        elif c == '\\':
            escape = not escape
            i += 1
            continue
            
        escape = False
        if not in_str:
            if c == '{':
                brace_count += 1
                first_brace = True
            elif c == '}':
                brace_count -= 1
                if first_brace and brace_count == 0:
                    return content[start:i+1]
        i += 1
    return None

comps = ['Navbar', 'PageHome', 'PageUniversites', 'PageFilieres', 'PageChatbot', 'PageConnexion', 'PageInscription', 'PageProfil', 'PageAdmin']

nav_match = re.search(r'function Navbar', content)
if not nav_match:
    print("Navbar not found")
    exit(1)

nav_start = nav_match.start()
constants_str = content[:nav_start]
constants_str = re.sub(r'import .*?;\n', '', constants_str)

os.makedirs(os.path.join(src_dir, 'utils'), exist_ok=True)
os.makedirs(os.path.join(src_dir, 'components'), exist_ok=True)
os.makedirs(os.path.join(src_dir, 'pages'), exist_ok=True)

with open(os.path.join(src_dir, 'utils', 'constants.js'), 'w', encoding='utf-8') as f:
    f.write('import React from \'react\';\n')
    f.write(constants_str.replace('const G', 'export const G')
            .replace('const GOLD', 'export const GOLD')
            .replace('const DARK', 'export const DARK')
            .replace('const BG', 'export const BG')
            .replace('const UNI_IMAGES', 'export const UNI_IMAGES')
            .replace('const CSS', 'export const CSS')
            .replace('function I', 'export function I')
            .replace('function md', 'export function md')
            .replace('const uniColor', 'export const uniColor')
            .replace('const uniBadge', 'export const uniBadge'))

common_imports = """import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authAPI, dataAPI, chatAPI } from '../services/api';
import { G, GOLD, DARK, BG, UNI_IMAGES, CSS, I, md, uniColor, uniBadge } from '../utils/constants';

"""

for comp in comps:
    func_str = extract_function(comp)
    if func_str:
        # Remplace `setPage('home')` -> `navigate('/')`
        func_str = re.sub(r"setPage\(\s*['\"`]home['\"`]\s*\)", 'navigate("/")', func_str)
        func_str = re.sub(r"setPage\(\s*['\"`]?([a-zA-Z0-9_]+)['\"`]?\s*\)", r'navigate("/\1")', func_str)
        func_str = re.sub(r"setPage\s*=>\s*setPage", 'setPage', func_str)
        
        # if the function doesn't receive navigate, inject it
        func_str = re.sub(r'(function \w+\(.*?\)\s*{)', r'\1\n  const navigate = useNavigate();', func_str)
        
        # fix ternary e.g., setPage(user ? 'chatbot' : 'inscription') -> navigate(user ? '/chatbot' : '/inscription')
        # Simple string replace for common ones
        func_str = func_str.replace("navigate(\"/user ? 'chatbot' : 'inscription'\")", "navigate(user ? '/chatbot' : '/inscription')")

        folder = 'components' if comp == 'Navbar' else 'pages'
        filename = comp.replace('Page', '') + '.jsx'
        with open(os.path.join(src_dir, folder, filename), 'w', encoding='utf-8') as f:
            f.write(common_imports + func_str + f'\n\nexport default {comp};\n')

app_jsx = """import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { authAPI } from './services/api';
import { CSS } from './utils/constants';

import Navbar from './components/Navbar';
import PageHome from './pages/Home';
import PageUniversites from './pages/Universites';
import PageFilieres from './pages/Filieres';
import PageChatbot from './pages/Chatbot';
import PageConnexion from './pages/Connexion';
import PageInscription from './pages/Inscription';
import PageProfil from './pages/Profil';
import PageAdmin from './pages/Admin';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      try {
        const { data } = await authAPI.profil();
        setUser(data);
      } catch (err) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    initAuth();
    
    if (!document.getElementById('orientagn-styles')) {
      const style = document.createElement('style');
      style.id = 'orientagn-styles';
      style.innerHTML = CSS;
      document.head.appendChild(style);
    }
  }, []);

  if (loading) return <div className="full-spin"><div className="spinner" /></div>;

  const handleLogout = () => {
    localStorage.clear();
    setUser(null);
    window.location.href = '/';
  };

  return (
    <BrowserRouter>
      <div className="app">
        <Navbar user={user} onLogout={handleLogout} />
        <Routes>
          <Route path="/" element={<PageHome user={user} />} />
          <Route path="/universites" element={<PageUniversites />} />
          <Route path="/filieres" element={<PageFilieres />} />
          <Route path="/chatbot" element={<PageChatbot user={user} />} />
          <Route path="/connexion" element={user ? <Navigate to="/" /> : <PageConnexion setAuthUser={setUser} />} />
          <Route path="/inscription" element={user ? <Navigate to="/" /> : <PageInscription />} />
          <Route path="/profil" element={user ? <PageProfil user={user} onLogout={handleLogout} /> : <Navigate to="/connexion" />} />
          <Route path="/admin" element={user?.is_staff ? <PageAdmin /> : <Navigate to="/" />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
"""

with open(app_path, 'w', encoding='utf-8') as f:
    f.write(app_jsx)

print('Split successful!')
