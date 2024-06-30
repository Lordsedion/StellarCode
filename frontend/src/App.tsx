import React, { createContext, useEffect, useState } from 'react';
import './App.css';
import Nav from './components/nav/Nav';
import Sidenav from './components/nav/sidenav/Sidenav';
import Comb from './components/chat/Comb';
import { Outlet } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';


interface globalTypes {
    theme: string
    setTheme: (value:any)=>void
    close: boolean
    setClose: (value:any)=>void
}

export const GlobalContext = createContext<globalTypes | undefined>(undefined)


function App() {
  
  const [theme, setTheme] = useState("light")
  const [close, setClose] = useState(false)

  
  useEffect(()=> {
    document.body?.setAttribute('data-theme', theme)
  }, [[theme]])

  return (
    <GlobalContext.Provider value={{theme, setTheme, close, setClose}}>
      <GoogleOAuthProvider clientId="46297420444-dvh3phisj6krntc8rf46ko1p9r3pl0ce.apps.googleusercontent.com">
        <div className="app">
        <Outlet/>
      </div>
        </GoogleOAuthProvider>
      
    </GlobalContext.Provider>
    
  );
}

export default App;
