import { useNavigate, useLocation } from 'react-router-dom'

interface SuccessData {
  merchantName: string
  amount: number
  solAmount: number
  txHash: string
}

export default function Success() {
  const navigate = useNavigate()
  const location = useLocation()

  const data: SuccessData = location.state || {
    merchantName: 'Toko Kelontong Berkah',
    amount: 50000,
    solAmount: 0.0217,
    txHash: 'SolABC123XYZ',
  }

  return (
    <div className="flex flex-col h-full bg-surface">
      {/* Header */}
      <header className="bg-surface border-b border-outline-variant flex justify-between items-center w-full px-5 py-2 h-14">
        <span className="text-[18px] font-bold text-primary">QRISol</span>
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-primary">account_balance_wallet</span>
        </div>
      </header>

      {/* Main Success Canvas */}
      <div className="flex-1 overflow-y-auto px-margin-edge pt-stack-lg flex flex-col items-center">
        {/* Celebration Icon */}
        <div className="relative w-32 h-32 mb-stack-lg mt-4 animate-scale-in">
          <div className="absolute inset-0 bg-tertiary/10 rounded-full scale-125 blur-2xl animate-pulse"></div>
          <div className="relative flex items-center justify-center w-full h-full bg-tertiary-container rounded-full shadow-xl border-4 border-white">
            <span className="material-symbols-outlined text-on-tertiary !text-[72px] fill-icon">check_circle</span>
          </div>
        </div>

        {/* Title & Status */}
        <div className="text-center mb-stack-lg animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          <h1 className="text-headline-md font-bold text-on-surface mb-1">Payment Successful!</h1>
          <p className="text-body-base text-on-surface-variant font-medium">Transaction processed via Solana</p>
        </div>

        {/* Receipt Card (Bento Element) */}
        <div className="w-full bg-white rounded-3xl p-6 border border-outline-variant/50 shadow-md space-y-5 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
          <div className="flex justify-between items-start">
            <div>
              <p className="text-label-sm font-bold text-on-surface-variant mb-1">Total Payment</p>
              <h2 className="text-[24px] font-bold text-on-surface leading-none">Rp {data.amount.toLocaleString('id-ID')}</h2>
              <div className="mt-2 inline-flex items-center gap-1 bg-tertiary/10 text-tertiary px-3 py-1 rounded-full font-bold text-[11px]">
                <span className="material-symbols-outlined !text-[14px]">bolt</span>
                {data.solAmount.toFixed(6)} SOL
              </div>
            </div>
            <div className="bg-surface-container-highest p-3 rounded-2xl">
              <span className="material-symbols-outlined text-primary !text-[32px]">storefront</span>
            </div>
          </div>

          <div className="pt-5 border-t border-dashed border-outline-variant/50">
            <div className="flex justify-between mb-3">
              <span className="text-body-base text-on-surface-variant">Recipient</span>
              <span className="text-body-base font-bold text-on-surface">{data.merchantName}</span>
            </div>
            <div className="flex justify-between mb-3">
              <span className="text-body-base text-on-surface-variant">Transaction ID</span>
              <span className="text-body-base font-bold text-primary truncate max-w-[120px]">{data.txHash}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-body-base text-on-surface-variant">Method</span>
              <span className="text-body-base font-bold text-on-surface">QRIS - Solana Pay</span>
            </div>
          </div>
        </div>

        {/* Transaction Status Chip */}
        <div className="mt-stack-lg flex justify-center animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
          <div className="flex items-center gap-2 bg-tertiary/10 text-tertiary py-1.5 px-4 rounded-full border border-tertiary/20">
            <span className="material-symbols-outlined !text-[18px]">verified</span>
            <span className="text-label-sm font-bold">Confirmed on Blockchain</span>
          </div>
        </div>
      </div>

      {/* Sticky Bottom Action Area */}
      <footer className="p-margin-edge bg-surface border-t border-outline-variant">
        <button 
          onClick={() => navigate('/')}
          className="w-full bg-primary text-white py-4 rounded-2xl font-bold text-headline-md shadow-lg shadow-primary/20 active:scale-95 transition-transform flex items-center justify-center gap-2"
        >
          <span>DONE (BACK HOME)</span>
        </button>
        <div className="flex justify-center mt-4">
          <button className="text-primary font-bold text-label-sm flex items-center gap-2 hover:underline">
            <span className="material-symbols-outlined !text-[16px]">share</span>
            Share Receipt
          </button>
        </div>
      </footer>
    </div>
  )
}
