import React, { createContext, useContext, useState } from 'react';

const AppContext = createContext(null);
const PROTECTED_PAGES = ['admin'];

export function AppProvider({ children }) {
  const [page, setPage] = useState('chatbot');
  const [_user, setUser] = useState(null);

  const navigate = (name, user = _user) => {
    if (!user && PROTECTED_PAGES.includes(name)) {
      setPage('login');
      window.scrollTo(0, 0);
      return;
    }
    setPage(name);
    window.scrollTo(0, 0);
  };

  return (
    <AppContext.Provider value={{ page, navigate, setUser }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  return useContext(AppContext);
}
