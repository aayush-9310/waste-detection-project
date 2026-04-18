import { createRoot } from 'react-dom/client'
import {AppProvider} from './context/AppContext.tsx'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <AppProvider>
    <App />
  </AppProvider>
    
  
)
