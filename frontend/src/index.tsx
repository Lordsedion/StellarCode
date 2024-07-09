import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { Route, BrowserRouter as Router , Routes} from 'react-router-dom';
import Comb from './components/chat/Comb';
import Login from './components/login/Login';
import Signup from './components/login/Signup';
import { GoogleOAuthProvider } from '@react-oauth/google';
import Chat from './components/chat/Chat';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <GoogleOAuthProvider clientId="46297420444-dvh3phisj6krntc8rf46ko1p9r3pl0ce.apps.googleusercontent.com">
    <Router>
    <Routes>
      <Route path='' element={<App/>}>
      <Route path='' element={<Comb/>}>
          <Route path='chat/:id' element={<Chat/>}/>

      </Route>
      <Route path='login' element={<Login/>}/>
      <Route path='signup' element={<Signup/>}/>
      </Route>
    </Routes>
  </Router>
  </GoogleOAuthProvider>
  
);
