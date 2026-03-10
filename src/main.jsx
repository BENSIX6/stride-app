import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'

// Clé API Anthropic injectée depuis les variables d'environnement Vite
// Sur Netlify : ajouter VITE_ANTHROPIC_KEY dans les env vars du projet
window.ANTHROPIC_KEY = import.meta.env.VITE_ANTHROPIC_KEY || ""

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
