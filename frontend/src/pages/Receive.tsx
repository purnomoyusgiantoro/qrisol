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
      <header className="flex justify-between items-center w-full px-5 py-2 h-14 bg-surface border-b border-outline-variant/30">
        <button onClick={() => navigate('/')} className="text-primary flex items-center gap-1">
          <span className="material-symbols-outlined !text-[18px]">arrow_back</span>
          <span className="font-bold text-[12px]">Back</span>
        </button>
        <h1 className="text-[16px] font-bold text-on-surface">Receive SOL</h1>
        <div className="w-12"></div>
      </header>

      <main className="flex-1 p-6 flex flex-col items-center justify-start gap-6 pt-4 overflow-y-auto">
        <div className="text-center">
          <h2 className="text-[16px] font-bold text-on-surface mb-0.5">Wallet QR Code</h2>
          <p className="text-[11px] text-on-surface-variant font-medium">Use this to receive Solana funds</p>
        </div>

        {/* QR Code Container */}
        <div className="bg-white p-5 rounded-[32px] shadow-sm border border-outline-variant/30 relative">
          {address ? (
            <img src={qrUrl} alt="Wallet QR" className="w-44 h-44 rounded-xl" />
          ) : (
            <div className="w-44 h-44 bg-surface-container rounded-xl flex items-center justify-center">
              <p className="text-[10px] text-center px-4 opacity-50 font-bold uppercase tracking-widest">Connect Wallet</p>
            </div>
          )}
        </div>

        {/* Address Display */}
        <div className="w-full bg-white p-5 rounded-[28px] border border-outline-variant/20 shadow-sm flex flex-col items-center gap-3">
          <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest opacity-60">Your Public Address</p>
          <div className="bg-surface px-3 py-2.5 rounded-xl border border-outline-variant/10 w-full">
            <p className="text-[11px] font-mono text-on-surface break-all text-center leading-tight">
              {address || 'Wallet not connected'}
            </p>
          </div>
          <button 
            onClick={copyToClipboard}
            disabled={!address}
            className="w-full h-12 bg-primary text-white rounded-2xl font-bold text-[13px] flex items-center justify-center gap-2 active:scale-95 transition-all disabled:opacity-50"
          >
            <span className="material-symbols-outlined !text-[18px]">
              {copied ? 'check_circle' : 'content_copy'}
            </span>
            {copied ? 'Copied Successfully' : 'Copy Address'}
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
