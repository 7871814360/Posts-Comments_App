// index.js (React entry point)

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './login.js';

// import './authenticate.js';
 const root = ReactDOM.createRoot(document.getElementById('login-container'));
 root.render(
  <React.StrictMode><App/></React.StrictMode>
 );