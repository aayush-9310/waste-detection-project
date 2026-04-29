import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import axios from 'axios'

export default function ComplaintForm() {
    const { result, location, coords } = useApp()
    const navigate = useNavigate()

    const [name, setName] = useState('')
    const [contact, setContact] = useState('')
    const [email, setEmail] = useState('')
    const [description, setDescription] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    // location string — prefer GPS coords, fallback to manual text
    const locationString = coords
        ? `${coords.lat.toFixed(5)}, ${coords.lng.toFixed(5)}`
        : location

    async function handleSubmit() {
        if (!name || !contact || !email || !locationString) {
            setError('Name, contact, email and location are required')
            return
        }

        setLoading(true)
        setError('')

        try {
            await axios.post('http://localhost:3000/api/complaints', {
                name,
                contact,
                email,
                location: locationString,
                description,
                imageUrl: result?.image ?? '',
                waste_type: result?.waste_type ?? '',
                severity: result?.severity ?? ''
            })
            navigate('/admin')
        } catch (e) {
            console.error(e)
            setError('Failed to file complaint. Try again.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className='max-w-md mx-auto px-4 py-8'>
            <h2 className='text-white text-2xl font-medium mb-6'>File a Complaint</h2>

            {/* Auto-filled info */}
            <div className='bg-slate-800 rounded-lg p-4 mb-6'>
                <p className='text-slate-400 text-xs mb-1'>Detected Waste</p>
                <p className='text-white capitalize'>{result?.waste_type} — <span className={result?.severity === 'HIGH' ? 'text-red-400' : 'text-green-400'}>{result?.severity}</span></p>
                <p className='text-slate-400 text-xs mt-2 mb-1'>Location</p>
                <p className='text-slate-300 text-sm'>{locationString || 'No location captured'}</p>
            </div>

            {/* User fills */}
            <div className='flex flex-col gap-3'>
                <input
                    type='text'
                    placeholder='Your name'
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className='bg-slate-800 text-slate-300 text-sm px-3 py-2 rounded-lg border border-slate-600 outline-none focus:border-slate-400'
                />
                <input
                    type='text'
                    placeholder='Contact number'
                    value={contact}
                    onChange={e => setContact(e.target.value)}
                    className='bg-slate-800 text-slate-300 text-sm px-3 py-2 rounded-lg border border-slate-600 outline-none focus:border-slate-400'
                />
                <input
                    type='email'
                    placeholder='Your email'
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className='bg-slate-800 text-slate-300 text-sm px-3 py-2 rounded-lg border border-slate-600 outline-none focus:border-slate-400'
                />
                <textarea
                    placeholder='Description (optional)'
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    rows={3}
                    className='bg-slate-800 text-slate-300 text-sm px-3 py-2 rounded-lg border border-slate-600 outline-none focus:border-slate-400 resize-none'
                />
            </div>

            {error && <p className='text-red-400 text-sm mt-3'>{error}</p>}

            <button
                onClick={handleSubmit}
                disabled={loading}
                className='bg-green-500 disabled:bg-slate-700 disabled:text-slate-500 text-white px-6 py-3 rounded-lg w-full mt-6 transition'
            >
                {loading ? 'Submitting...' : 'Submit Complaint'}
            </button>
        </div>
    )
}