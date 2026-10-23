import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import "./styles/theme.css";
import "./styles/sidebar.css";
import "./styles/dashboard.css";
import "./styles/table.css";
import "./styles/forms.css";
import "./styles/animations.css";
import "./styles/dark-theme.css";
import "./styles/enterprise.css";
import "./styles/mobile.css";
import { Toaster } from "react-hot-toast";
import {
 ThemeProvider
}
from "./context/ThemeContext";
import {
 AuthProvider
}
from "./context/AuthContext";



createRoot(document.getElementById('root')).render(
  
  <ThemeProvider>
   <AuthProvider>
      <App/>
      <Toaster position="top-right" />
   </AuthProvider>
</ThemeProvider>
)
