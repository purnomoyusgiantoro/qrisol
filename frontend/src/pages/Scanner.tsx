import { useNavigate } from 'react-router-dom'
import { useState, useRef, useEffect, useCallback } from 'react'

export default function Scanner() {
  const navigate = useNavigate()
  const videoRef = useRef<HTMLVideoElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [cameraActive, setCameraActive] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const streamRef = useRef<MediaStream | null>(null)

  // Start camera automatically
  const startCamera = useCallback(async () => {
    try {
      setError(null)
      
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera API not supported or blocked by insecure context (needs HTTPS or localhost)')
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode: 'environment',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
      })
      
      streamRef.current = stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        // Force play to ensure it starts
        videoRef.current.onloadedmetadata = () => {
          videoRef.current?.play().catch(e => console.error("Video play failed", e))
        }
        setCameraActive(true)
      }
    } catch (err: any) {
      console.error('Camera error:', err)
      setError(err.message || 'Failed to access camera. Please check permissions.')
    }
  }, [])


  useEffect(() => {
    startCamera()
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop())
      }
    }
  }, [startCamera])

  // System Integration: Call Backend to "Parse" QRIS
  const processQR = async (source: string) => {
    setLoading(true)
    try {
      const response = await fetch('http://localhost:3001/api/parse-qris', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageUrl: source }),
      })
      const data = await response.json()
      
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop())
      }

      navigate('/checkout', { state: data })
    } catch (err) {
      console.error('Processing error:', err)
      navigate('/checkout', { 
        state: { 
          merchantName: 'Toko Kelontong Berkah (Fallback)', 
          amount: 50000,
          merchantId: 'ID12345678'
        } 
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col h-full bg-black relative overflow-hidden">
      {/* Header */}
      <header className="scanner-header !bg-transparent !border-none !text-white z-20">
        <button onClick={() => navigate('/')} className="scanner-header-btn !text-white">
          <span className="material-symbols-outlined">arrow_back</span>
          <span>Back</span>
        </button>
        <h1 className="scanner-title !text-white">Scan QRIS</h1>
        <div className="w-16" />
      </header>

      {/* Viewfinder */}
      <div className="flex-1 relative z-10 flex flex-col">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${cameraActive ? 'opacity-60' : 'opacity-0'}`}
        />

        {/* Overlay with Cutout */}
        <div className="absolute inset-0 flex flex-col">
          <div className="flex-1 bg-black/60" />
          <div className="flex h-64">
            <div className="flex-1 bg-black/60" />
            <div className="w-64 h-64 relative border-2 border-white/20 rounded-2xl overflow-hidden">
              {error ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center p-4 bg-error/20 text-center">
                  <span className="material-symbols-outlined text-error mb-2">videocam_off</span>
                  <p className="text-[10px] text-white font-bold leading-tight">{error}</p>
                  <button 
                    onClick={() => startCamera()}
                    className="mt-2 px-3 py-1 bg-white/20 rounded-lg text-[10px] font-bold text-white active:scale-95"
                  >
                    Retry
                  </button>
                </div>
              ) : (
                <>
                  <div className="absolute -top-1 -left-1 w-8 h-8 border-t-4 border-l-4 border-primary rounded-tl-xl" />
                  <div className="absolute -top-1 -right-1 w-8 h-8 border-t-4 border-r-4 border-primary rounded-tr-xl" />
                  <div className="absolute -bottom-1 -left-1 w-8 h-8 border-b-4 border-l-4 border-primary rounded-bl-xl" />
                  <div className="absolute -bottom-1 -right-1 w-8 h-8 border-b-4 border-r-4 border-primary rounded-br-xl" />
                  <div className="scanner-line !bg-primary !shadow-primary/50" />
                  <div className="absolute inset-0 cursor-pointer" onClick={() => processQR('camera_stream')} />
                </>
              )}
            </div>
            <div className="flex-1 bg-black/60" />
          </div>
          <div className="flex-1 bg-black/60 pt-8 flex flex-col items-center">
            <p className="text-white text-caption text-center px-10 opacity-80">
              {error ? 'Please use manual upload' : 'Position the QR code inside the frame'}
            </p>
          </div>
        </div>

      </div>

      {/* Footer Controls */}
      <div className="absolute bottom-10 left-0 right-0 z-20 flex flex-col items-center gap-4 px-margin-edge">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={() => processQR('uploaded_file')}
        />
        
        <button 
          onClick={() => fileInputRef.current?.click()}
          className="w-full h-12 bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-xl flex items-center justify-center gap-2 font-bold text-label-sm active:scale-95 transition-all"
        >
          <span className="material-symbols-outlined">image</span>
          Upload QRIS Image
        </button>
      </div>

      {/* Loading Overlay */}
      {loading && (
        <div className="absolute inset-0 z-50 bg-black/80 flex flex-col items-center justify-center text-white">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="font-bold">Extracting QRIS data...</p>
        </div>
      )}
    </div>
  )
}
