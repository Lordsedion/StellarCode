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

    accessToken: string
    setAccessToken: (value:any)=>void

    profilePic: any
    setProfilePic: (value:any)=>void
}

export const GlobalContext = createContext<globalTypes | undefined>(undefined)

export function setCookie(name:string, value:any, daysToLive:number) {
  let cookie = `${encodeURIComponent(name)}=${encodeURIComponent(value)}`;
  
  if (daysToLive) {
      const expirationDate = new Date();
      expirationDate.setDate(expirationDate.getDate() + daysToLive);
      cookie += `; expires=${expirationDate.toUTCString()}`;
  }
  
  document.cookie = cookie;
}


export function getCookie(name:string) {
  const cookieName = `${encodeURIComponent(name)}=`;
  const cookies = document.cookie.split(';');
  
  for (let cookie of cookies) {
      while (cookie.charAt(0) === ' ') {
          cookie = cookie.substring(1);
      }
      if (cookie.indexOf(cookieName) === 0) {
          return decodeURIComponent(cookie.substring(cookieName.length, cookie.length));
      }
  }
  return null;
}


function App() {
  let themeValue = "light";
  let access = getCookie("access");

  if (getCookie("theme") !== null) {
    themeValue = getCookie("theme")
  }  
  else {
    setCookie("theme", "dark", 180)
  }
  
  const [theme, setTheme] = useState(themeValue)
  const [close, setClose] = useState(false)

  const [accessToken, setAccessToken] = useState<string | null>(getCookie("access"))
  const [profilePic, setProfilePic] = useState(localStorage.getItem("pp"))

  
  useEffect(()=> {
    document.body?.setAttribute('data-theme', theme)
    setCookie("theme", theme, 180)
  }, [[theme]])

  return (
    <GlobalContext.Provider value={{
      theme, setTheme, 
      close, setClose,
      accessToken, setAccessToken,
      profilePic, setProfilePic
      }}>
        <div className="app">
        <Outlet/>
      </div>      
    </GlobalContext.Provider>
    
  );
}

export default App;
