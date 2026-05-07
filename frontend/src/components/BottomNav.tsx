import { useNavigate, useLocation } from 'react-router-dom'

export default function BottomNav() {
  const navigate = useNavigate()
  const location = useLocation()

  const isActive = (path: string) => location.pathname === path

  return (
    <nav className="absolute bottom-0 w-full z-50 flex justify-around items-center px-6 py-2 bg-white border-t border-outline-variant rounded-t-2xl shadow-[0_-4px_12px_rgba(0,0,0,0.08)]">
      {/* Home: Left Tab */}
      <button 
        onClick={() => navigate('/')}
        className={`flex flex-col items-center justify-center transition-all duration-200 ${
          isActive('/') 
            ? 'text-primary scale-105' 
            : 'text-on-surface-variant hover:text-primary'
        }`}
      >
        <span className={`material-symbols-outlined !text-[24px] ${isActive('/') ? 'fill-icon' : ''}`}>home</span>
        <span className="text-[10px] font-bold">Home</span>
      </button>

      {/* SCAN FAB: Center Tab */}
      <div className="relative -top-4">
        <button 
          onClick={() => navigate('/partner-select')}
          className="w-16 h-16 bg-primary text-white rounded-2xl flex flex-col items-center justify-center shadow-[0px_8px_20px_rgba(0,62,199,0.3)] active:scale-90 transition-transform gap-0.5"
        >
          <span className="material-symbols-outlined !text-[28px]">qr_code_scanner</span>
          <span className="text-[10px] font-extrabold tracking-tight">SCAN</span>
        </button>
      </div>

      {/* History: Right Tab */}
      <button 
        className={`flex flex-col items-center justify-center transition-all duration-200 ${
          isActive('/history') 
            ? 'text-primary scale-105' 
            : 'text-on-surface-variant hover:text-primary'
        }`}
      >
        <span className="material-symbols-outlined !text-[24px]">history</span>
        <span className="text-[10px] font-bold">History</span>
      </button>
    </nav>
  )
}
