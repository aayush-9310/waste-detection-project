import { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import axios from 'axios'

interface Complaint {
    _id: string
    complaint_id: string
    name: string
    contact: string
    email: string
    location: string
    description: string
    waste_type: string
    severity: string
    status: string
    createdAt: string
}

export default function Admin() {
    const [complaints, setComplaints] = useState<Complaint[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        async function fetchComplaints() {
            try {
                const res = await axios.get('http://localhost:3000/api/complaints')
                setComplaints(res.data.complaints)
            } catch (e) {
                console.error(e)
                setError('Failed to fetch complaints')
            } finally {
                setLoading(false)
            }
        }
        fetchComplaints()
    }, [])

    return (
        <div className='min-h-screen bg-slate-900'>
            <Navbar />
            <div className='max-w-3xl mx-auto px-4 py-8'>
                <h1 className='text-white text-2xl font-medium mb-6'>Admin Dashboard</h1>

                {loading && <p className='text-slate-400'>Loading complaints...</p>}
                {error && <p className='text-red-400'>{error}</p>}

                {!loading && complaints.length === 0 && (
                    <p className='text-slate-400'>No complaints filed yet.</p>
                )}

                <div className='flex flex-col gap-4'>
                    {complaints.map(c => (
                        <div key={c._id} className='bg-slate-800 rounded-lg p-4'>
                            <div className='flex justify-between items-start mb-3'>
                                <p className='text-white font-medium'>{c.complaint_id}</p>
                                <span className={`text-xs px-2 py-1 rounded-full ${
                                    c.status === 'Resolved' ? 'bg-green-900 text-green-400' :
                                    c.status === 'In Progress' ? 'bg-yellow-900 text-yellow-400' :
                                    'bg-red-900 text-red-400'
                                }`}>
                                    {c.status}
                                </span>
                            </div>

                            <div className='grid grid-cols-2 gap-2 text-sm mb-2'>
                                <div>
                                    <p className='text-slate-400 text-xs'>Name</p>
                                    <p className='text-slate-300'>{c.name}</p>
                                </div>
                                <div>
                                    <p className='text-slate-400 text-xs'>Contact</p>
                                    <p className='text-slate-300'>{c.contact}</p>
                                </div>
                                <div>
                                    <p className='text-slate-400 text-xs'>Email</p>
                                    <p className='text-slate-300'>{c.email}</p>
                                </div>
                                <div>
                                    <p className='text-slate-400 text-xs'>Waste Type</p>
                                    <p className='text-slate-300 capitalize'>{c.waste_type}</p>
                                </div>
                                <div>
                                    <p className='text-slate-400 text-xs'>Severity</p>
                                    <p className={c.severity === 'HIGH' ? 'text-red-400' : 'text-green-400'}>{c.severity}</p>
                                </div>
                                <div>
                                    <p className='text-slate-400 text-xs'>Filed At</p>
                                    <p className='text-slate-300'>{new Date(c.createdAt).toLocaleString()}</p>
                                </div>
                            </div>

                            <div>
                                <p className='text-slate-400 text-xs'>Location</p>
                                <p className='text-slate-300 text-sm'>{c.location}</p>
                            </div>

                            {c.description && (
                                <div className='mt-2'>
                                    <p className='text-slate-400 text-xs'>Description</p>
                                    <p className='text-slate-300 text-sm'>{c.description}</p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
