import { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import Navbar from "../components/Navbar"
import axios from 'axios'

export default function Home() {
    const { setResult, setCoords, setLocation } = useApp()
    const navigate = useNavigate()

    const [image, setImage] = useState<File | null>(null)
    const [preview, setPreview] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)
    const [showCamera, setShowCamera] = useState(false)
    const [locationInput, setLocationInput] = useState('')
    const [gpsStatus, setGpsStatus] = useState<'idle' | 'fetching' | 'done' | 'failed'>('idle')

    const uploadRef = useRef<HTMLInputElement>(null)
    const cameraRef = useRef<HTMLInputElement>(null)
    const videoRef = useRef<HTMLVideoElement>(null)
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const streamRef = useRef<MediaStream | null>(null)

    const isMobile = window.innerWidth < 768

    function handleImage(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0]
        if (!file) return
        setImage(file)
        setPreview(URL.createObjectURL(file))
        // uploaded photo — clear any GPS, user will type location
        setCoords(null)
    }

    function grabGPS() {
        setGpsStatus('fetching')
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                const c = { lat: pos.coords.latitude, lng: pos.coords.longitude }
                setCoords(c)
                setLocation(`${c.lat.toFixed(5)}, ${c.lng.toFixed(5)}`)
                setGpsStatus('done')
            },
            () => {
                setGpsStatus('failed')
                setCoords(null)
            },
            { enableHighAccuracy: true, timeout: 10000 }
        )
    }

    async function openDesktopCamera() {
        grabGPS() // request GPS at same time as camera
        setShowCamera(true)
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
            streamRef.current = stream
            if (videoRef.current) videoRef.current.srcObject = stream
        } catch {
            alert('Camera access denied')
            setShowCamera(false)
        }
    }

    function handleMobileCamera() {
        grabGPS() // request GPS at same time as camera
        cameraRef.current?.click()
    }

    function captureDesktop() {
        const video = videoRef.current
        const canvas = canvasRef.current
        if (!video || !canvas) return

        canvas.width = video.videoWidth
        canvas.height = video.videoHeight
        canvas.getContext('2d')?.drawImage(video, 0, 0)

        canvas.toBlob((blob) => {
            if (!blob) return
            const file = new File([blob], 'capture.jpg', { type: 'image/jpeg' })
            setImage(file)
            setPreview(URL.createObjectURL(file))
            stopCamera()
        }, 'image/jpeg')
    }

    function stopCamera() {
        streamRef.current?.getTracks().forEach(t => t.stop())
        streamRef.current = null
        setShowCamera(false)
    }

    async function handleDetect() {
        if (!image) return
        setLoading(true)

        // save manual location to context if upload mode
        if (locationInput) setLocation(locationInput)

        const formData = new FormData()
        formData.append("file", image)

        try {
            const res = await axios.post('http://localhost:8000/api/detect', formData)
            setResult({ ...res.data, image: preview })
            navigate('/result')
        } catch (e) {
            alert('Server not running')
            console.error(e)
        } finally {
            setLoading(false)
        }
    }

    function reset() {
        setImage(null)
        setPreview(null)
        setLocationInput('')
        setCoords(null)
        setGpsStatus('idle')
    }

    return (
        <div className="min-h-screen bg-slate-900">
            <Navbar />
            <div className='max-w-md mx-auto px-4 py-10'>
                <h1 className='text-white text-3xl font-medium mb-2'>Waste Detection</h1>
                <p className='text-slate-400 text-sm mb-8'>Upload a photo or use your camera</p>

                <input ref={uploadRef} type="file" accept="image/*" onChange={handleImage} className='hidden' />
                {isMobile && (
                    <input ref={cameraRef} type="file" accept="image/*" capture="environment" onChange={handleImage} className='hidden' />
                )}

                {/* Desktop camera stream */}
                {showCamera && (
                    <div className='mb-6'>
                        <video ref={videoRef} autoPlay playsInline className='w-full rounded-lg mb-3' />
                        <canvas ref={canvasRef} className='hidden' />
                        <div className='flex gap-3'>
                            <button onClick={captureDesktop} className='flex-1 bg-green-500 text-white py-2 rounded-lg text-sm'>
                                📸 Capture
                            </button>
                            <button onClick={stopCamera} className='flex-1 border border-slate-600 text-slate-400 py-2 rounded-lg text-sm'>
                                Cancel
                            </button>
                        </div>
                    </div>
                )}

                {/* Upload / Camera buttons */}
                {!preview && !showCamera && (
                    <div className='flex gap-3 mb-6'>
                        <button
                            onClick={() => uploadRef.current?.click()}
                            className='flex-1 border border-slate-600 text-slate-300 py-3 rounded-lg text-sm hover:border-slate-400 transition'
                        >
                            📁 Upload Photo
                        </button>
                        <button
                            onClick={isMobile ? handleMobileCamera : openDesktopCamera}
                            className='flex-1 border border-slate-600 text-slate-300 py-3 rounded-lg text-sm hover:border-slate-400 transition'
                        >
                            📷 Take Photo
                        </button>
                    </div>
                )}

                {/* Preview + location */}
                {preview && (
                    <div className='mb-6'>
                        <img src={preview} alt="preview" className='w-full rounded-lg max-h-72 object-contain mb-3' />

                        {/* GPS status (camera mode) */}
                        {gpsStatus === 'fetching' && (
                            <p className='text-slate-400 text-xs mb-3'>📍 Fetching GPS location...</p>
                        )}
                        {gpsStatus === 'done' && (
                            <p className='text-green-400 text-xs mb-3'>📍 GPS location captured</p>
                        )}
                        {gpsStatus === 'failed' && (
                            <p className='text-red-400 text-xs mb-3'>📍 GPS failed — please type location below</p>
                        )}

                        {/* Manual location input (upload mode or GPS failed) */}
                        {(gpsStatus === 'idle' || gpsStatus === 'failed') && (
                            <input
                                type="text"
                                placeholder="Enter location (e.g. Sector 14, Faridabad)"
                                value={locationInput}
                                onChange={e => setLocationInput(e.target.value)}
                                className='w-full bg-slate-800 text-slate-300 text-sm px-3 py-2 rounded-lg mb-3 outline-none border border-slate-600 focus:border-slate-400'
                            />
                        )}

                        <button onClick={reset} className='text-slate-400 text-sm underline'>
                            Remove
                        </button>
                    </div>
                )}

                <button
                    onClick={handleDetect}
                    disabled={!image || loading}
                    className='bg-green-500 disabled:bg-slate-700 disabled:text-slate-500 text-white px-6 py-3 rounded-lg w-full transition'
                >
                    {loading ? 'Detecting...' : 'Detect Waste'}
                </button>
            </div>
        </div>
    )
}