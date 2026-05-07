import { useWallet } from '@solana/wallet-adapter-react'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'

export default function Receive() {
  const { publicKey } = useWallet()
  const navigate = useNavigate()
  const [copied, setCopied] = useState(false)

  const address = publicKey?.toBase58() || ''
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${address}`

  const copyToClipboard = () => {
    navigator.clipboard.writeText(address)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="flex flex-col h-full bg-surface">
      {/* Header */}
      <header className="flex justify-between items-center w-full px-5 py-2 h-14 bg-white border-b border-outline-variant/30">
        <button onClick={() => navigate('/')} className="text-primary flex items-center gap-1">
          <span className="material-symbols-outlined">arrow_back</span>
          <span className="font-bold text-label-sm">Back</span>
        </button>
        <h1 className="text-body-base font-bold text-on-surface">Receive Funds</h1>
        <div className="w-12"></div>
      </header>

      <main className="flex-1 p-5 flex flex-col items-center justify-start gap-5 pt-4 overflow-y-auto">
        <div className="text-center">
          <h2 className="text-[18px] font-bold text-on-surface mb-1">Scan QR Code</h2>
          <p className="text-[12px] text-on-surface-variant">Send SOL to this address</p>
        </div>

        {/* QR Code Container */}
        <div className="bg-white p-4 rounded-2xl shadow-lg border border-outline-variant/50 relative group">
          {address ? (
            <img src={qrUrl} alt="Wallet QR" className="w-40 h-40 rounded-lg" />
          ) : (
            <div className="w-40 h-40 bg-surface-container rounded-lg flex items-center justify-center">
              <p className="text-[10px] text-center px-4 opacity-50 font-bold uppercase">Connect Wallet</p>
            </div>
          )}
        </div>

        {/* Address Display */}
        <div className="w-full max-w-[300px] bg-white p-4 rounded-2xl border border-outline-variant/30 shadow-sm flex flex-col items-center gap-2">
          <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest opacity-70">Wallet Address</p>
          <p className="text-[11px] font-mono text-primary break-all text-center leading-tight mb-2">
            {address || 'Not Connected'}
          </p>
          <button 
            onClick={copyToClipboard}
            disabled={!address}
            className="w-full h-11 bg-primary text-white rounded-xl font-bold text-label-sm flex items-center justify-center gap-2 active:scale-95 transition-all disabled:opacity-50"
          >
            <span className="material-symbols-outlined !text-[18px]">
              {copied ? 'check_circle' : 'content_copy'}
            </span>
            {copied ? 'COPIED SUCCESSFULLY' : 'COPY ADDRESS'}
          </button>
        </div>
      </main>

      {/* Safety Warning */}
      <footer className="p-4 pb-6 text-center">
        <div className="bg-tertiary/5 border border-tertiary/20 p-3 rounded-xl flex items-start gap-3">
          <span className="material-symbols-outlined text-tertiary !text-[20px]">info</span>
          <p className="text-[11px] text-on-surface-variant text-left leading-snug">
            Only send <b>Solana (SOL)</b> or SPL tokens to this address. Sending other coins may result in permanent loss of funds.
          </p>
        </div>
      </footer>
    </div>
  )
}
