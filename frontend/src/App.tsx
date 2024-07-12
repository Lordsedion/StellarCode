import React, { createContext, useEffect, useState } from 'react';
import './App.css';
// import Nav from './components/nav/Nav';
// import Sidenav from './components/nav/sidenav/Sidenav';
// import Comb from './components/chat/Comb';
import { Outlet } from 'react-router-dom';
// import { GoogleOAuthProvider } from '@react-oauth/google';


interface globalTypes {
    theme: string
    setTheme: (value:any)=>void
    close: boolean
    setClose: (value:any)=>void

    accessToken: string
    setAccessToken: (value:any)=>void
    
    username: string
    setUserName: (value:any)=>void
    
    apiKey: string
    setApiKey: (value:any)=>void
    
    refreshToken: string
    setRefreshToken: (value:any)=>void
    
    knowActive: string
    setKnowActive: (value:any)=>void

    profilePic: any
    setProfilePic: (value:any)=>void
    
    id_: any
    setId: (value:any)=>void
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
  if (localStorage.getItem("theme") !== null) {
    localStorage.getItem("theme")
  }  
  else {
    localStorage.setItem("theme", "dark")
  }
  
  const [theme, setTheme] = useState(localStorage.getItem("theme"))
  const [close, setClose] = useState(false)
  const [id_, setId] = useState("new")
  const [username, setUserName] = useState("")
  const [apiKey, setApiKey] = useState("")
  const [accessToken, setAccessToken] = useState<string | null>(localStorage.getItem("access"))
  const [refreshToken, setRefreshToken] = useState<string | null>(localStorage.getItem("refresh"))
  const [knowActive, setKnowActive] = useState("")
  const [profilePic, setProfilePic] = useState(localStorage.getItem("pp"))

//   async function refresh (token:string) {
//     const options = {
//         method: 'POST',
//         headers: {
//         'Content-Type': 'application/json',
//         'X-CSRFToken': getCookie('csrftoken')
//         },
//         body: JSON.stringify({"access_token": token})
//     };

//     const url = "http://localhost:8000/api/token/refresh"
//     fetch(url, options)
//     .then(response=> {
//         if (!response.ok) {
//             throw new Error("Response is not okay " + response.statusText)
//         }
//         else {
//             return response.json()
//         }
//     })
//     .then(data => {
//         console.log(data)
//         setAccessToken(data["access"])
//         localStorage.setItem("refresh", data["access"])
//       })
//       .catch(error => {
//         console.error('Error:', error); // Handle any errors that occur
//         window.location.assign("http://localhost:8000/login/")
//       });       

// }
  
  async function verifyAccess (token:string) {
    const options = {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': getCookie('csrftoken')
        },
        body: JSON.stringify({
          "access_token": token,
          "refresh_token": refreshToken
        })
    };

    const url_ = "http://localhost:8000/api/token_verify"
    fetch(url_, options)
    .then(response=> {
        if (!response.ok) {
            throw new Error("Response is not okay " + response.statusText)
        }
        else {
            return response.json()
        }
    })
    .then(data => {
        console.log(data)
        if (data["message"] === true ) {
          console.log("Boss boss")
          setUserName(data["username"])
          setApiKey(data["apiKey"])
          // setAccessToken(data["token"])
          // localStorage.setItem("access", data["token"])
        }
        else if (data["message"] === "reset") {
          setUserName(data["username"])
          setApiKey(data["apiKey"])
          setAccessToken(data["token"])
          localStorage.setItem("access", data["token"])
        }
        else {
          window.location.assign("http://localhost:8000/login/")
        }
        
      })
      .catch(error => {
        console.error('Error:', error); // Handle any errors that occur
      });       

}
  
  useEffect(()=> {
    document.body?.setAttribute('data-theme', theme)
    setCookie("theme", theme, 180)

    console.log(accessToken, refreshToken)
    verifyAccess(accessToken)
  }, [[theme, accessToken, apiKey]])

  return (
    <GlobalContext.Provider value={{
      theme, setTheme, 
      close, setClose,
      accessToken, setAccessToken,
      profilePic, setProfilePic,
      refreshToken, setRefreshToken,
      knowActive, setKnowActive,
      username, setUserName,
      apiKey, setApiKey,
      id_, setId,
      }}>
        <div className="app">
        <Outlet/>
      </div>      
    </GlobalContext.Provider>
    
  );
}

export default App;
