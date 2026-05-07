import { useNavigate, useLocation } from 'react-router-dom'

interface SuccessData {
  merchantName: string
  amount: number
  solAmount: number
  txHash: string
  partner?: string
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
      <div className="flex-1 overflow-y-auto px-margin-edge pt-8 flex flex-col items-center">
        {/* Celebration Icon */}
        <div className="relative w-24 h-24 mb-6 mt-2 animate-scale-in">
          <div className="absolute inset-0 bg-tertiary/10 rounded-full scale-125 blur-2xl animate-pulse"></div>
          <div className="relative flex items-center justify-center w-full h-full bg-tertiary-container rounded-full shadow-lg border-2 border-white">
            <span className="material-symbols-outlined text-on-tertiary !text-[48px] fill-icon">check_circle</span>
          </div>
        </div>

        {/* Title & Status */}
        <div className="text-center mb-8 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          <h1 className="text-[20px] font-bold text-on-surface mb-0.5">Payment Successful</h1>
          <p className="text-[12px] text-on-surface-variant font-medium">Processed via Solana Blockchain</p>
        </div>

        {/* Receipt Card (Bento Element) */}
        <div className="w-full bg-white rounded-[28px] p-6 border border-outline-variant/30 shadow-sm space-y-5 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
          <div className="flex justify-between items-center">
            <div>
              <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-1">Amount Paid</p>
              <h2 className="text-[22px] font-bold text-on-surface tracking-tight">Rp {data.amount.toLocaleString('id-ID')}</h2>
              <div className="mt-2 inline-flex items-center gap-1.5 bg-primary/5 text-primary px-3 py-1 rounded-full font-bold text-[10px]">
                <span className="material-symbols-outlined !text-[12px]">bolt</span>
                {data.solAmount.toFixed(6)} SOL
              </div>
            </div>
            <div className="bg-surface-container-highest w-12 h-12 flex items-center justify-center rounded-2xl">
              <span className="material-symbols-outlined text-primary !text-[24px]">storefront</span>
            </div>
          </div>

          <div className="pt-5 border-t border-dashed border-outline-variant/50 space-y-3.5">
            <div className="flex justify-between items-center">
              <span className="text-[12px] text-on-surface-variant">Merchant</span>
              <span className="text-[12px] font-bold text-on-surface">{data.merchantName}</span>
            </div>
            {data.partner && (
              <div className="flex justify-between items-center">
                <span className="text-[12px] text-on-surface-variant">Exchange Partner</span>
                <span className="text-[12px] font-bold text-primary">{data.partner}</span>
              </div>
            )}
            <div className="flex justify-between items-center">
              <span className="text-[12px] text-on-surface-variant">Transaction ID</span>
              <span className="text-[12px] font-mono font-medium text-on-surface-variant truncate max-w-[100px] bg-surface px-1.5 py-0.5 rounded">{data.txHash}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[12px] text-on-surface-variant">Method</span>
              <span className="text-[12px] font-bold text-on-surface">SOL → IDR (Smart Route)</span>
            </div>
          </div>
        </div>

        {/* Transaction Status Chip */}
        <div className="mt-8 flex justify-center animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
          <div className="flex items-center gap-2 bg-success/5 text-success py-1.5 px-4 rounded-full border border-success/10">
            <span className="material-symbols-outlined !text-[16px]">verified</span>
            <span className="text-[11px] font-bold">Confirmed on Network</span>
          </div>
        </div>
      </div>

      {/* Sticky Bottom Action Area */}
      <footer className="p-6 bg-surface border-t border-outline-variant/50">
        <button 
          onClick={() => navigate('/')}
          className="w-full h-14 bg-primary text-white rounded-2xl font-bold text-[16px] shadow-lg shadow-primary/20 active:scale-95 transition-transform flex items-center justify-center gap-2"
        >
          <span>Return to Home</span>
        </button>
        <div className="flex justify-center mt-4">
          <button className="text-primary font-bold text-[12px] flex items-center gap-2 hover:opacity-70">
            <span className="material-symbols-outlined !text-[16px]">share</span>
            Share Receipt
          </button>
        </div>
      </footer>

    </div>
  )
}
