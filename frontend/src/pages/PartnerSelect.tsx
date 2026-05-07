import { useNavigate } from 'react-router-dom'

export default function PartnerSelect() {
  const navigate = useNavigate()

  const partners = [
    { id: 1, name: 'CEX', logo: '', color: 'bg-[#F3BA2F]/10' },
    { id: 2, name: 'CEX', logo: '', color: 'bg-[#000000]/5' },
    { id: 3, name: 'CEX', logo: '', color: 'bg-[#000000]/10' },
  ]

  const handleSelect = (partner: string) => {
    console.log('Selected Partner:', partner)
    navigate('/scan')
  }

  return (
    <div className="flex flex-col h-full bg-surface">
      {/* Header */}
      <header className="flex justify-between items-center w-full px-5 py-2 h-14 bg-white border-b border-outline-variant/30">
        <button onClick={() => navigate('/')} className="text-primary flex items-center gap-1">
          <span className="material-symbols-outlined">arrow_back</span>
          <span className="font-bold text-label-sm">Cancel</span>
        </button>
        <h1 className="text-body-base font-bold text-on-surface">Select CEX Partner</h1>
        <div className="w-12"></div>
      </header>

      <main className="flex-1 p-6 flex flex-col gap-6 overflow-y-auto">
        <div className="text-center mb-4">
          <h2 className="text-headline-md font-bold text-on-surface mb-2">Choose Funding Source</h2>
          <p className="text-caption text-on-surface-variant">Connect your CEX account for automatic conversion to Solana</p>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {partners.map((partner) => (
            <button
              key={partner.id}
              onClick={() => handleSelect(partner.name)}
              className={`flex items-center gap-4 p-5 rounded-3xl border border-outline-variant/30 bg-white hover:bg-surface-container-low transition-all active:scale-[0.98] shadow-sm group`}
            >
              <div className={`w-14 h-14 rounded-2xl ${partner.color} flex items-center justify-center p-2`}>
                <img src={partner.logo} alt={partner.name} className="w-full h-full object-contain group-hover:scale-110 transition-transform" />
              </div>
              <div className="flex-1 text-left">
                <h3 className="text-body-base font-bold text-on-surface">{partner.name}</h3>
                <p className="text-caption text-on-surface-variant">Instant Connection & Low Fees</p>
              </div>
              <span className="material-symbols-outlined text-primary opacity-50 group-hover:opacity-100 transition-opacity">chevron_right</span>
            </button>
          ))}
        </div>

        {/* Info Box */}
        <div className="mt-4 p-4 bg-primary/5 rounded-2xl border border-primary/20 flex gap-3">
          <span className="material-symbols-outlined text-primary !text-[20px]">verified</span>
          <p className="text-[11px] text-on-surface-variant text-left leading-snug">
            QRISol partners with trusted exchanges to ensure your <b>IDR to SOL</b> liquidity is always available at the best price.
          </p>
        </div>
      </main>

      <footer className="p-6">
        <p className="text-[10px] text-center text-on-surface-variant opacity-50 uppercase font-bold tracking-widest">Powered by Jupiter & Solana Pay</p>
      </footer>
    </div>
  )
}
