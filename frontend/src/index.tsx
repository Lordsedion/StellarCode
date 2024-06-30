import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { Route, BrowserRouter as Router , Routes} from 'react-router-dom';
import Comb from './components/chat/Comb';
import Login from './components/login/Login';
import Signup from './components/login/Signup';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <Router>
    <Routes>
      <Route path='' element={<App/>}>
      <Route path='' element={<Comb/>}/>
      <Route path='login' element={<Login/>}/>
      <Route path='signup' element={<Signup/>}/>
      </Route>
    </Routes>
  </Router>
);
