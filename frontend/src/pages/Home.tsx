import { useWallet } from '@solana/wallet-adapter-react'
import { useNavigate } from 'react-router-dom'
import BalanceCard from '../components/BalanceCard'

export default function Home() {
  const { connected } = useWallet()
  const navigate = useNavigate()

  const transactions = [
    { id: 1, name: 'Kopi Kenangan', date: 'Today, 09:15', amount: '-Rp 50.000', status: 'Success' },
    { id: 2, name: 'Indomaret Point', date: 'Yesterday, 18:30', amount: '-Rp 124.500', status: 'Success' },
  ]

  return (
    <div className="flex flex-col h-full bg-surface relative">
      <div className="flex-1 overflow-y-auto px-margin-edge pt-stack-md pb-32">
        {/* Balance Card - Flagship Component */}
        <BalanceCard />

        {/* Quick Insights / Recent Activity */}
        <section className="animate-fade-in-up mt-8" style={{ animationDelay: '0.2s' }}>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Recent Activity</h2>
            <button className="text-primary text-[11px] font-bold">View History</button>
          </div>

          <div className="space-y-2.5">
            {transactions.map((tx) => (
              <div 
                key={tx.id} 
                className="flex items-center gap-3.5 p-3.5 bg-white rounded-2xl border border-outline-variant/20 shadow-sm hover:bg-surface-container-low transition-all cursor-pointer active:scale-[0.98]"
              >
                <div className="w-9 h-9 rounded-full bg-primary/5 flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined !text-[18px] fill-icon">history</span>
                </div>
                <div className="flex-1">
                  <p className="text-[13px] font-bold text-on-surface leading-tight">{tx.name}</p>
                  <p className="text-[11px] text-on-surface-variant mt-0.5">{tx.date}</p>
                </div>
                <div className="text-right">
                  <p className="text-[13px] font-bold text-on-surface leading-tight">{tx.amount}</p>
                  <span className="text-[9px] text-success font-bold px-2 py-0.5 bg-success/5 rounded-full uppercase mt-1 inline-block">
                    {tx.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>


        {!connected && (
          <div className="mt-8 p-4 bg-primary-container/10 rounded-xl text-center border border-primary-container/20 border-dashed">
            <p className="text-caption text-primary font-bold">Wallet not connected. Connect to start transacting.</p>
          </div>
        )}
      </div>
    </div>
  )
}
