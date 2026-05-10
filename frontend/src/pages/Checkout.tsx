import { useNavigate, useLocation } from 'react-router-dom'
import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import { useState, useEffect } from 'react'
import { 
  PublicKey, 
  SystemProgram, 
  LAMPORTS_PER_SOL,
  TransactionMessage,
  VersionedTransaction
} from '@solana/web3.js'
import { getSOLPriceIDRService } from '../services/solana'

interface QRISData {
  merchantName: string
  merchantId: string
  amount: number
  currency: string
}

// Placeholder Merchant Wallet for Devnet Testing
const DEVNET_MERCHANT_WALLET = 'vines1vzrYbzduYv9nR3pjw32cfC4w7pM6zNfhrvcyf' // Valid Devnet Public Key

export default function Checkout() {
  const navigate = useNavigate()
  const location = useLocation()
  const { connection } = useConnection()
  const { publicKey, sendTransaction } = useWallet()
  
  const qrisData: QRISData = location.state || {
    merchantName: 'Blessing Grocery Store',
    merchantId: 'ID2024081200001',
    amount: 50000,
    currency: 'IDR',
  }

  const [processing, setProcessing] = useState(false)
  const [loadingPrice, setLoadingPrice] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [solPrice, setSolPrice] = useState<number>(2450000) 
  const [selectedPartner, setSelectedPartner] = useState<{name: string, fee: string}>({ name: 'Tokocrypto', fee: '0.1%' })
  const [inputAmount, setInputAmount] = useState<number>(qrisData.amount || 0)

  useEffect(() => {
    const fetchPriceAndRoute = async () => {
      setLoadingPrice(true)
      try {
        // Smart Routing: Simulate picking best rate from partners
        const partners = [
          { name: 'Tokocrypto', fee: '0.1%', rateMod: 1.001 },
          { name: 'Indodax', fee: '0.12%', rateMod: 1.002 },
          { name: 'Pintu', fee: '0.15%', rateMod: 1.003 }
        ]
        
        const priceIDR = await getSOLPriceIDRService()
        
        // Pick the best one (simulated)
        const bestPartner = partners[Math.floor(Math.random() * partners.length)]
        setSelectedPartner(bestPartner)

        if (priceIDR) {
          setSolPrice(priceIDR * bestPartner.rateMod) 
        }
      } catch (err) {
        console.error('Smart routing failed:', err)
      } finally {
        setLoadingPrice(false)
      }
    }
    fetchPriceAndRoute()
  }, [])

  const solAmount = inputAmount / solPrice

  const handlePayment = async () => {
    if (!publicKey) return
    if (inputAmount <= 0) {
      setError("Masukkan jumlah pembayaran yang valid")
      return
    }

    setProcessing(true)
    setError(null)

    try {
      // Fetch recent blockhash first for Mobile Wallet Adapter compatibility
      const latestBlockhash = await connection.getLatestBlockhash()

      // Build real transaction
      const destination = new PublicKey(DEVNET_MERCHANT_WALLET)
      const lamports = Math.floor(solAmount * LAMPORTS_PER_SOL)

      // Use VersionedTransaction for better compatibility with MWA
      const messageV0 = new TransactionMessage({
        payerKey: publicKey,
        recentBlockhash: latestBlockhash.blockhash,
        instructions: [
          SystemProgram.transfer({
            fromPubkey: publicKey,
            toPubkey: destination,
            lamports: lamports,
          })
        ]
      }).compileToV0Message()

      const transaction = new VersionedTransaction(messageV0)

      const signature = await sendTransaction(transaction, connection)
      
      // Wait for confirmation
      await connection.confirmTransaction({
        signature,
        ...latestBlockhash
      })

      navigate('/success', {
        state: {
          merchantName: qrisData.merchantName,
          amount: inputAmount,
          solAmount: solAmount,
          txHash: signature,
          partner: selectedPartner.name
        },
      })
    } catch (err: any) {
      console.error('Payment failed:', err)
      setError(err.message || 'Payment failed')
      setProcessing(false)
    }
  }

  return (
    <div className="flex flex-col h-full bg-surface animate-page-fade">
      <header className="flex justify-between items-center w-full px-5 py-2 h-14 bg-surface border-b border-outline-variant/30">
        <button 
          onClick={() => navigate('/')}
          className="flex items-center gap-1 text-primary hover:bg-surface-container-low px-2 py-1 rounded-lg transition-transform active:scale-95"
        >
          <span className="material-symbols-outlined text-[18px]">arrow_back</span>
          <span className="text-[12px] font-bold">Cancel</span>
        </button>
        <h1 className="text-[16px] font-bold text-on-surface">Payment Confirmation</h1>
        <div className="w-12"></div>
      </header>

      <main className="flex-1 overflow-y-auto px-margin-edge py-6 flex flex-col gap-5">
        {error && (
          <div className="p-3 bg-error/5 border border-error/10 rounded-xl text-error text-[11px] font-bold text-center">
            {error}
          </div>
        )}

        <section className="bg-white rounded-2xl p-4 shadow-sm border border-outline-variant/20 flex items-center gap-3.5 animate-fade-in-up">
          <div className="w-10 h-10 rounded-full bg-primary-container/10 flex items-center justify-center text-primary">
            <span className="material-symbols-outlined fill-icon !text-[20px]">store</span>
          </div>
          <div>
            <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Merchant</p>
            <h2 className="text-[14px] font-bold text-on-surface leading-tight">{qrisData.merchantName}</h2>
          </div>
        </section>

        <section className="bg-white rounded-[28px] p-6 border border-outline-variant/30 shadow-sm flex flex-col gap-4 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          <div className="text-center">
            <p className="text-[11px] font-bold text-on-surface-variant mb-1 uppercase tracking-wider">Payment Amount</p>
            {qrisData.amount > 0 ? (
              <h3 className="text-[22px] font-bold text-primary tracking-tight">Rp {qrisData.amount.toLocaleString('id-ID')}</h3>
            ) : (
              <div className="flex items-center justify-center gap-2 mt-2">
                <span className="text-[18px] font-bold text-on-surface-variant">Rp</span>
                <input 
                  type="number" 
                  value={inputAmount || ''}
                  onChange={(e) => setInputAmount(Number(e.target.value))}
                  placeholder="0"
                  className="w-32 text-[24px] font-bold text-primary text-center bg-transparent border-b-2 border-primary/30 focus:border-primary outline-none"
                  autoFocus
                />
              </div>
            )}
          </div>
          
          <div className="border-t border-dashed border-outline-variant/30 my-1"></div>
          
          <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                {!loadingPrice && <span className="w-1.5 h-1.5 bg-success rounded-full animate-pulse"></span>}
                <span className="text-[12px] text-on-surface-variant">Current Exchange</span>
              </div>
              <div className="text-right">
                <span className="text-[13px] font-bold text-on-surface block">1 SOL = Rp {solPrice.toLocaleString('id-ID', { maximumFractionDigits: 0 })}</span>
                <span className="text-[10px] text-on-surface-variant font-medium mt-0.5 block">Real-time Market Rate</span>
              </div>
            </div>


            <div className="flex justify-between items-center py-0.5">
              <span className="text-[12px] text-on-surface-variant">Routing Partner</span>
              <div className="flex items-center gap-2">
                <div className="px-2.5 py-1 bg-primary/5 rounded-full border border-primary/10 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-primary rounded-full"></span>
                  <span className="text-[10px] font-bold text-primary uppercase tracking-tight">{selectedPartner.name}</span>
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-[12px] text-on-surface-variant">Total Deduction</span>
              <div className="text-right">
                <span className="text-[15px] font-bold text-secondary">
                  {loadingPrice ? '...' : `≈ ${solAmount.toFixed(6)} SOL`}
                </span>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-[12px] text-on-surface-variant">Processing Fee</span>
              <div className="flex items-center gap-1">
                <span className="px-2 py-0.5 bg-tertiary/10 text-tertiary font-bold text-[10px] rounded-full uppercase">
                  {selectedPartner.fee}
                </span>
              </div>
            </div>
          </div>
        </section>

      </main>

      <footer className="px-margin-edge pb-8 pt-4 bg-surface border-t border-outline-variant/30">
        <div className="flex justify-center items-center gap-1.5 mb-5 opacity-40">
          <span className="material-symbols-outlined text-[14px]">verified_user</span>
          <span className="text-[10px] font-bold uppercase tracking-wider">Securely Encrypted</span>
        </div>

        <button 
          onClick={handlePayment}
          disabled={processing || !publicKey || inputAmount <= 0}
          className={`w-full h-14 solana-gradient rounded-2xl flex items-center justify-center gap-3 shadow-lg active:scale-95 transition-all relative overflow-hidden group ${
            (processing || !publicKey || inputAmount <= 0) ? 'opacity-50 grayscale cursor-not-allowed' : ''
          }`}
        >
          {processing ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span className="font-bold text-white text-[14px]">Processing...</span>
            </>
          ) : (
            <>
              <span className="material-symbols-outlined text-white !text-[20px]">bolt</span>
              <span className="font-bold text-white text-[16px] tracking-wide uppercase">Confirm & Pay</span>
            </>
          )}
        </button>
      </footer>

    </div>
  )
}
