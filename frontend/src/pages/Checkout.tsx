import { useNavigate, useLocation } from 'react-router-dom'
import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import { useState, useEffect } from 'react'
import { 
  PublicKey, 
  Transaction, 
  SystemProgram, 
  LAMPORTS_PER_SOL 
} from '@solana/web3.js'
import { getSOLPriceIDR } from '../services/jupiter'

interface QRISData {
  merchantName: string
  merchantId: string
  amount: number
  currency: string
}

// Placeholder Merchant Wallet for Devnet Testing
const DEVNET_MERCHANT_WALLET = 'A1b2C3d4E5f6G7h8I9j0K1l2M3n4O5p6Q7r8S9t0U1v2' // Replace with a real devnet pubkey if needed

export default function Checkout() {
  const navigate = useNavigate()
  const location = useLocation()
  const { connection } = useConnection()
  const { publicKey, sendTransaction } = useWallet()
  
  const [processing, setProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [solPrice, setSolPrice] = useState<number>(2300000) 

  const qrisData: QRISData = location.state || {
    merchantName: 'Blessing Grocery Store',
    merchantId: 'ID2024081200001',
    amount: 50000,
    currency: 'IDR',
  }

  useEffect(() => {
    const fetchPrice = async () => {
      const priceIDR = await getSOLPriceIDR()
      if (priceIDR) {
        setSolPrice(priceIDR) 
      }
    }
    fetchPrice()
  }, [])

  const solAmount = qrisData.amount / solPrice

  const handlePayment = async () => {
    if (!publicKey) return
    setProcessing(true)
    setError(null)

    try {
      // Build real transaction
      const destination = new PublicKey(DEVNET_MERCHANT_WALLET)
      const lamports = Math.floor(solAmount * LAMPORTS_PER_SOL)

      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey: destination,
          lamports: lamports,
        })
      )

      const signature = await sendTransaction(transaction, connection)
      
      // Wait for confirmation
      const latestBlockhash = await connection.getLatestBlockhash()
      await connection.confirmTransaction({
        signature,
        ...latestBlockhash
      })

      navigate('/success', {
        state: {
          merchantName: qrisData.merchantName,
          amount: qrisData.amount,
          solAmount: solAmount,
          txHash: signature,
        },
      })
    } catch (err: any) {
      console.error('Payment failed:', err)
      setError(err.message || 'Payment failed')
      setProcessing(false)
    }
  }

  return (
    <div className="flex flex-col h-full bg-surface">
      <header className="flex justify-between items-center w-full px-5 py-2 h-14 bg-surface border-b border-outline-variant">
        <button 
          onClick={() => navigate('/')}
          className="flex items-center gap-1 text-primary hover:bg-surface-container-low px-2 py-1 rounded-lg transition-transform active:scale-95"
        >
          <span className="material-symbols-outlined text-[20px]">arrow_back</span>
          <span className="text-[12px] font-bold">Cancel</span>
        </button>
        <h1 className="text-[18px] font-bold text-on-surface">Confirm Payment</h1>
        <div className="w-12"></div>
      </header>

      <main className="flex-1 overflow-y-auto px-margin-edge py-stack-lg flex flex-col gap-6">
        {error && (
          <div className="p-3 bg-error/10 border border-error/20 rounded-xl text-error text-[12px] font-bold">
            {error}
          </div>
        )}

        <section className="bg-white rounded-2xl p-4 shadow-sm border border-outline-variant/30 flex items-center gap-4 animate-fade-in-up">
          <div className="w-12 h-12 rounded-full bg-primary-container/10 flex items-center justify-center text-primary">
            <span className="material-symbols-outlined fill-icon !text-[28px]">store</span>
          </div>
          <div>
            <p className="text-caption font-bold text-on-surface-variant uppercase tracking-wider">Payment To</p>
            <h2 className="text-body-base font-bold text-on-surface leading-tight">{qrisData.merchantName}</h2>
          </div>
        </section>

        <section className="bg-white rounded-3xl p-6 border border-outline-variant/50 shadow-md flex flex-col gap-4 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          <div className="text-center">
            <p className="text-label-sm font-bold text-on-surface-variant mb-1">Payment Amount</p>
            <h3 className="text-[24px] font-bold text-primary leading-none">Rp {qrisData.amount.toLocaleString('id-ID')}</h3>
          </div>
          
          <div className="border-t border-dashed border-outline-variant/50 my-2"></div>
          
          <div className="flex flex-col gap-3">
            <div className="flex justify-between items-center">
              <span className="text-label-sm font-bold text-on-surface-variant">Current Exchange</span>
              <span className="text-label-sm font-bold text-on-surface">1 SOL = Rp {solPrice.toLocaleString('id-ID')}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-label-sm font-bold text-on-surface-variant">Total Deduction</span>
              <div className="flex items-center gap-1">
                <span className="text-body-base font-bold text-secondary">≈ {solAmount.toFixed(6)} SOL</span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-label-sm font-bold text-on-surface-variant">Network Fee</span>
              <span className="px-2 py-0.5 bg-tertiary/10 text-tertiary font-bold text-[10px] rounded-full uppercase">FREE</span>
            </div>
          </div>
        </section>
      </main>

      <footer className="px-margin-edge pb-margin-edge pt-4 bg-surface border-t border-outline-variant">
        <div className="flex justify-center items-center gap-1 mb-4 opacity-50">
          <span className="material-symbols-outlined text-[14px]">verified_user</span>
          <span className="text-caption font-bold">Secure Transaction encrypted by QRISol</span>
        </div>

        <button 
          onClick={handlePayment}
          disabled={processing || !publicKey}
          className={`w-full h-14 solana-gradient rounded-2xl flex items-center justify-center gap-3 shadow-lg active:scale-95 transition-all relative overflow-hidden group ${
            (processing || !publicKey) ? 'opacity-50 grayscale cursor-not-allowed' : ''
          }`}
        >
          {processing ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span className="font-bold text-white text-body-base">Processing...</span>
            </>
          ) : (
            <>
              <span className="material-symbols-outlined text-white">bolt</span>
              <span className="font-bold text-white text-headline-md tracking-wide">PAY NOW</span>
            </>
          )}
        </button>
      </footer>
    </div>
  )
}
