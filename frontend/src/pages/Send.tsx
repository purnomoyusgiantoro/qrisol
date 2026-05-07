import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import { 
  PublicKey, 
  Transaction, 
  SystemProgram, 
  LAMPORTS_PER_SOL 
} from '@solana/web3.js'

export default function Send() {
  const navigate = useNavigate()
  const { connection } = useConnection()
  const { publicKey, sendTransaction, connected } = useWallet()
  
  const [address, setAddress] = useState('')
  const [amount, setAmount] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSend = async () => {
    if (!publicKey || !address || !amount) return
    setLoading(true)
    setError(null)
    
    try {
      const destinationPubkey = new PublicKey(address)
      const lamports = parseFloat(amount) * LAMPORTS_PER_SOL
      
      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey: destinationPubkey,
          lamports: Math.floor(lamports),
        })
      )

      const signature = await sendTransaction(transaction, connection)
      
      // Wait for confirmation
      const latestBlockhash = await connection.getLatestBlockhash()
      await connection.confirmTransaction({
        signature,
        ...latestBlockhash
      })
      
      setLoading(false)
      navigate('/success', { 
        state: { 
          merchantName: `Sent to: ${address.slice(0, 4)}...${address.slice(-4)}`,
          amount: parseFloat(amount) * 2450000, 
          solAmount: parseFloat(amount),
          txHash: signature
        } 
      })
    } catch (err: any) {
      console.error('Transfer failed:', err)
      setError(err.message || 'Transaction failed')
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col h-full bg-surface">
      {/* Header */}
      <header className="flex justify-between items-center w-full px-5 py-2 h-14 bg-white border-b border-outline-variant/30">
        <button onClick={() => navigate('/')} className="text-primary flex items-center gap-1">
          <span className="material-symbols-outlined">arrow_back</span>
          <span className="font-bold text-label-sm">Back</span>
        </button>
        <h1 className="text-body-base font-bold text-on-surface">Send Funds</h1>
        <div className="w-12"></div>
      </header>

      <main className="flex-1 p-6 flex flex-col gap-6 overflow-y-auto">
        {error && (
          <div className="p-3 bg-error/10 border border-error/20 rounded-xl text-error text-[12px] font-bold">
            {error}
          </div>
        )}

        {/* Destination Input */}
        <div className="flex flex-col gap-2">
          <label className="text-label-sm font-bold text-on-surface-variant uppercase tracking-wider">Destination Address</label>
          <div className="relative">
            <input 
              type="text" 
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Enter Solana address..."
              className="w-full bg-white border border-outline-variant rounded-2xl p-4 pr-12 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-body-base font-medium"
            />
            <button className="absolute right-4 top-1/2 -translate-y-1/2 text-primary">
              <span className="material-symbols-outlined">qr_code_scanner</span>
            </button>
          </div>
        </div>

        {/* Amount Input */}
        <div className="flex flex-col gap-2">
          <label className="text-label-sm font-bold text-on-surface-variant uppercase tracking-wider">SOL Amount</label>
          <div className="relative">
            <input 
              type="number" 
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              className="w-full bg-white border border-outline-variant rounded-2xl p-4 pr-16 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-[24px] font-bold text-primary"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 font-bold text-primary">SOL</span>
          </div>
          <p className="text-caption text-on-surface-variant ml-1 font-medium">
            ≈ Rp {(parseFloat(amount || '0') * 2450000).toLocaleString('id-ID')}
          </p>
        </div>
      </main>

      {/* Action Footer */}
      <footer className="p-6">
        <button 
          onClick={handleSend}
          disabled={!connected || !address || !amount || loading}
          className="w-full h-14 solana-gradient text-white rounded-2xl flex items-center justify-center gap-3 shadow-lg active:scale-95 transition-all disabled:opacity-50 disabled:grayscale"
        >
          {loading ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span className="font-bold">Signing...</span>
            </>
          ) : (
            <>
              <span className="material-symbols-outlined">send</span>
              <span className="font-bold text-headline-md tracking-wide">SEND NOW</span>
            </>
          )}
        </button>
      </footer>
    </div>
  )
}
