import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import { LAMPORTS_PER_SOL } from '@solana/web3.js'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function BalanceCard() {
  const navigate = useNavigate()
  const { connection } = useConnection()
  const { publicKey, connected } = useWallet()
  const [balance, setBalance] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)

  // Real-time fallback (matches other pages)
  const SOL_TO_IDR = 2450000

  useEffect(() => {
    if (!publicKey || !connected) {
      setBalance(null)
      return
    }

    const fetchBalance = async () => {
      setLoading(true)
      try {
        const bal = await connection.getBalance(publicKey)
        setBalance(bal / LAMPORTS_PER_SOL)
      } catch (err) {
        console.error('Failed to fetch balance:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchBalance()
    const subId = connection.onAccountChange(publicKey, (account) => {
      setBalance(account.lamports / LAMPORTS_PER_SOL)
    })

    return () => {
      connection.removeAccountChangeListener(subId)
    }
  }, [publicKey, connected, connection])

  const idrBalance = balance !== null 
    ? Math.floor(balance * SOL_TO_IDR).toLocaleString('id-ID') 
    : '0'

  return (
    <section className="mb-6">
      <div className="solana-gradient rounded-xl p-4 shadow-lg relative overflow-hidden group">
        {/* Subtle Glow */}
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-3xl"></div>
        
        <div className="relative z-10">
          <p className="text-white/70 text-[10px] font-bold uppercase tracking-widest mb-0.5">Total Balance</p>
          <h1 className="text-white text-[22px] font-bold mb-1 leading-tight tracking-tight">
            {loading ? '...' : `Rp ${idrBalance}`}
          </h1>
          <div className="flex items-center gap-1.5 opacity-90">
            <img 
              alt="Solana Logo" 
              className="w-3.5 h-3.5 brightness-0 invert" 
              src="https://cryptologos.cc/logos/solana-sol-logo.png?v=024" 
            />
            <span className="text-white/80 text-[11px] font-medium">
              ≈ {balance !== null ? balance.toFixed(4) : '0.0000'} SOL
            </span>
          </div>
        </div>


        {/* Quick Action Bar */}
        <div className="mt-6 flex justify-between gap-2">
          <button 
            onClick={() => navigate('/receive')}
            className="flex-1 bg-white/20 hover:bg-white/30 backdrop-blur-md py-2 px-1.5 rounded-lg flex flex-col items-center justify-center gap-1 transition-all border border-white/10 active:scale-95"
          >
            <span className="material-symbols-outlined text-white text-[18px]">south_west</span>
            <span className="text-white text-[10px] font-bold">Receive</span>
          </button>
          <button 
            onClick={() => navigate('/send')}
            className="flex-1 bg-white/20 hover:bg-white/30 backdrop-blur-md py-2 px-1.5 rounded-lg flex flex-col items-center justify-center gap-1 transition-all border border-white/10 active:scale-95"
          >
            <span className="material-symbols-outlined text-white text-[18px]">north_east</span>
            <span className="text-white text-[10px] font-bold">Send</span>
          </button>
          <button className="flex-1 bg-white/20 hover:bg-white/30 backdrop-blur-md py-2 px-1.5 rounded-lg flex flex-col items-center justify-center gap-1 transition-all border border-white/10 active:scale-95">
            <span className="material-symbols-outlined text-white text-[18px]">grid_view</span>
            <span className="text-white text-[10px] font-bold">More</span>
          </button>
        </div>
      </div>
    </section>
  )
}
