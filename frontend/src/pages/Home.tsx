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
        <section className="animate-fade-in-up mt-stack-lg" style={{ animationDelay: '0.2s' }}>
          <div className="flex justify-between items-center mb-stack-sm">
            <h2 className="text-label-sm font-bold text-on-surface-variant uppercase tracking-wider">Recent Activity</h2>
            <button className="text-primary text-label-sm font-bold">See All</button>
          </div>

          <div className="space-y-3">
            {transactions.map((tx) => (
              <div 
                key={tx.id} 
                className="flex items-center gap-4 p-3 bg-white rounded-xl border border-outline-variant/30 shadow-sm hover:bg-surface-container-low transition-all cursor-pointer active:scale-[0.98]"
              >
                <div className="w-10 h-10 rounded-full bg-tertiary/10 flex items-center justify-center text-tertiary">
                  <span className="material-symbols-outlined !text-[20px] fill-icon">check_circle</span>
                </div>
                <div className="flex-1">
                  <p className="text-body-base font-bold text-on-surface">{tx.name}</p>
                  <p className="text-caption text-on-surface-variant">{tx.date}</p>
                </div>
                <div className="text-right">
                  <p className="text-body-base font-bold text-on-surface">{tx.amount}</p>
                  <span className="text-[10px] text-tertiary font-bold px-2 py-0.5 bg-tertiary/10 rounded-full">
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
