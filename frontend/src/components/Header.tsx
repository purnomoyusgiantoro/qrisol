import { useWallet } from '@solana/wallet-adapter-react'
import { useWalletModal } from '@solana/wallet-adapter-react-ui'

export default function Header() {
  const { publicKey, connected, disconnect } = useWallet()
  const { setVisible } = useWalletModal()

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 4)}...${addr.slice(-4)}`
  }

  const handleWalletClick = () => {
    if (connected) {
      if (window.confirm('Disconnect your wallet?')) {
        disconnect()
      }
    } else {
      setVisible(true)
    }
  }

  return (
    <header className="flex justify-between items-center w-full px-5 py-2 h-14 bg-white z-20 border-b border-outline-variant/30 shadow-sm">
      {/* Profile & Brand Area */}
      <div className="flex items-center gap-3">
        {/* Colorful Profile Button */}
        <button className="w-9 h-9 rounded-full bg-gradient-to-tr from-primary to-secondary flex items-center justify-center text-white shadow-md hover:shadow-lg transition-all active:scale-90 border border-white/20">
          <span className="material-symbols-outlined !text-[20px] fill-icon">person</span>
        </button>

        {/* Brand Text */}
        <div className="flex flex-col justify-center">
          <div className="flex items-center gap-1.5">
            <span className="text-[18px] font-extrabold text-primary tracking-tight leading-none">QRISol</span>
            <div className="flex items-center gap-1 px-1.5 py-0.5 bg-success/10 rounded-md border border-success/20">
              <span className="w-1 h-1 bg-success rounded-full animate-pulse"></span>
              <span className="text-[7px] font-black text-success tracking-tighter">DEVNET</span>
            </div>
          </div>
          <span className="text-[10px] font-bold text-on-surface-variant opacity-60">Solana Pay</span>
        </div>

      </div>

      {/* Wallet Indicator */}
      <button 
        onClick={handleWalletClick}
        className={`flex items-center gap-2 px-3 py-1.5 rounded-full transition-all active:scale-95 duration-150 border ${
          connected 
            ? 'bg-surface-container-low border-primary/20 text-on-surface' 
            : 'bg-primary text-white border-primary shadow-md hover:bg-primary-container'
        }`}
      >
        <span className="text-[11px] font-bold tracking-wide">
          {connected && publicKey ? formatAddress(publicKey.toBase58()) : 'CONNECT'}
        </span>
        {connected && <span className="w-1.5 h-1.5 bg-success rounded-full"></span>}
        {!connected && (
          <span className="material-symbols-outlined !text-[16px] text-white">
            account_balance_wallet
          </span>
        )}

      </button>
    </header>
  )
}
