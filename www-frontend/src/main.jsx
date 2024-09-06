import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';  // Importa el archivo de estilos globales
import './App.css';    // Importa el archivo de estilos específicos de la aplicación

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
