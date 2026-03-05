import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { AuthProvider } from './context/AuthContext'
import { DataProvider } from './context/DataContext' // Asegúrate de que la ruta sea correcta

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* Primero la Autenticación, luego los Datos Globales */}
    <AuthProvider>
      <DataProvider>
        <App />
      </DataProvider>
    </AuthProvider>
  </React.StrictMode>,
)