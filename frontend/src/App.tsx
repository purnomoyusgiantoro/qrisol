import { Routes, Route, useLocation } from 'react-router-dom'
import Header from './components/Header'
import BottomNav from './components/BottomNav'
import Home from './pages/Home'
import Scanner from './pages/Scanner'
import Checkout from './pages/Checkout'
import Success from './pages/Success'
import Send from './pages/Send'
import Receive from './pages/Receive'

function App() {
  const location = useLocation()
  
  // Hide global chrome (Header/BottomNav) on transactional pages
  const hideChrome = ['/scan', '/checkout', '/success', '/send', '/receive'].includes(location.pathname)

  return (
    <div className="mobile-container">
      {!hideChrome && <Header />}
      
      <main className={`flex-1 flex flex-col overflow-hidden relative ${!hideChrome ? '' : 'h-full'}`}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/scan" element={<Scanner />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/success" element={<Success />} />
          <Route path="/send" element={<Send />} />
          <Route path="/receive" element={<Receive />} />
        </Routes>
      </main>

      {!hideChrome && <BottomNav />}
    </div>
  )
}

export default App
