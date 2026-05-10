import { useNavigate } from 'react-router-dom'
import { useState, useRef, useEffect, useCallback } from 'react'
import jsQR from 'jsqr'
import { parseQRIS } from '../utils/qris-parser'

export default function Scanner() {
  const navigate = useNavigate()
  const videoRef = useRef<HTMLVideoElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [cameraActive, setCameraActive] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const streamRef = useRef<MediaStream | null>(null)
  const animationFrameId = useRef<number | null>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    canvasRef.current = document.createElement('canvas')
  }, [])

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
          // Start scanning loop
          requestAnimationFrame(scanQRCode)
        }
        setCameraActive(true)
      }
    } catch (err: any) {
      console.error('Camera error:', err)
      setError(err.message || 'Failed to access camera. Please check permissions.')
    }
  }, [])

  const scanQRCode = () => {
    if (videoRef.current && canvasRef.current && videoRef.current.readyState === videoRef.current.HAVE_ENOUGH_DATA) {
      const video = videoRef.current
      const canvas = canvasRef.current
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
      const ctx = canvas.getContext('2d', { willReadFrequently: true })

      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
        const code = jsQR(imageData.data, imageData.width, imageData.height, {
          inversionAttempts: "dontInvert",
        })

        if (code) {
          console.log("Found QR code", code.data)
          handleQRData(code.data)
          return // Stop scanning loop on success
        }
      }
    }
    
    // Continue scanning if not found
    animationFrameId.current = requestAnimationFrame(scanQRCode)
  }

  const stopCamera = useCallback(() => {
    if (animationFrameId.current) {
      cancelAnimationFrame(animationFrameId.current)
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop())
    }
  }, [])

  useEffect(() => {
    startCamera()
    return () => {
      stopCamera()
    }
  }, [startCamera, stopCamera])

  const handleQRData = (data: string) => {
    stopCamera()
    setLoading(true)
    
    setTimeout(() => {
      try {
        const parsedData = parseQRIS(data)
        
        // Simple check if it resembles QRIS
        if (parsedData && parsedData.merchantName !== 'Unknown Merchant') {
          navigate('/checkout', { state: parsedData })
        } else {
          alert("Kode QR tidak valid atau bukan format QRIS standar.")
          setLoading(false)
          startCamera() // restart camera
        }
      } catch (err) {
        console.error('Parsing error:', err)
        alert("Gagal memproses data QRIS.")
        setLoading(false)
        startCamera()
      }
    }, 500) // Small delay for UX
  }

  // Handle manual file upload
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setLoading(true)
    stopCamera()

    const reader = new FileReader()
    reader.onload = (e) => {
      const img = new Image()
      img.onload = () => {
        const canvas = document.createElement('canvas')
        canvas.width = img.width
        canvas.height = img.height
        const ctx = canvas.getContext('2d')
        if (ctx) {
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
          const code = jsQR(imageData.data, imageData.width, imageData.height, {
            inversionAttempts: "dontInvert",
          })
          
          if (code) {
            handleQRData(code.data)
          } else {
            alert('Tidak ditemukan kode QR pada gambar.')
            setLoading(false)
            startCamera()
          }
        }
      }
      img.src = e.target?.result as string
    }
    reader.readAsDataURL(file)
  }

  // Fallback simulation if clicked on viewfinder directly
  const simulateScan = async () => {
    setLoading(true)
    stopCamera()
    try {
      const response = await fetch('/api/parse-qris', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageUrl: 'simulated' }),
      })
      const data = await response.json()
      navigate('/checkout', { state: data })
    } catch (err) {
      console.error('Simulation error:', err)
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
                  <div className="absolute inset-0 cursor-pointer" onClick={simulateScan} title="Click to simulate scan" />
                </>
              )}
            </div>
            <div className="flex-1 bg-black/60" />
          </div>
          <div className="flex-1 bg-black/60 pt-8 flex flex-col items-center">
            <p className="text-white text-caption text-center px-10 opacity-80">
              {error ? 'Gunakan upload manual' : 'Arahkan kode QR ke dalam area bingkai'}
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
          onChange={handleFileUpload}
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
          <p className="font-bold">Mengekstrak data QRIS...</p>
        </div>
      )}
    </div>
  )
}
