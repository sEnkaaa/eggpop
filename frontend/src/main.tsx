import React from 'react'
import ReactDOM from 'react-dom/client'
import './styles/global.scss'
import AppLayout from './components/Layout'
import Routes from './routes'
import AppProvider from './utils/contexts/AppContext'
import GameProvider from './utils/contexts/GameContext'
import { BrowserRouter as Router } from "react-router-dom"
import Notification from './components/UI/Notification'

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)

const App: React.FC = () => {
  return (
    <Router>
      <AppProvider>
        <GameProvider> 
          <AppLayout>
            <Routes />
          </AppLayout>
          <Notification />
        </GameProvider>
      </AppProvider>
    </Router>
  )
}

root.render(
  <App />
)
