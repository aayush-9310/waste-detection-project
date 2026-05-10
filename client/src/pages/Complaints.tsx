import { useState } from 'react'
import Navbar from '../components/Navbar'
import axios from 'axios'

interface TimelineEntry {
    status: string
    note: string
    updatedAt: string
}

interface Complaint {
    complaint_id: string
    name: string
    waste_type: string
    severity: string
    status: string
    location: string
    createdAt: string
    timeline: TimelineEntry[]
}

const statusColor: Record<string, string> = {
    'Pending': 'bg-red-900 text-red-400',
    'Viewed': 'bg-blue-900 text-blue-400',
    'Forwarded': 'bg-purple-900 text-purple-400',
    'In Progress': 'bg-yellow-900 text-yellow-400',
    'Resolved': 'bg-green-900 text-green-400',
}

const STATUS_PIPELINE = ['Pending', 'Viewed', 'Forwarded', 'In Progress', 'Resolved']

export default function Complaints() {
    const [query, setQuery] = useState('')
    const [complaints, setComplaints] = useState<Complaint[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    async function handleTrack() {
        if (!query.trim()) return
        setLoading(true)
        setError('')
        setComplaints([])

        try {
            const res = await axios.get(`http://localhost:3000/api/complaints/track?q=${query.trim()}`)
            setComplaints(res.data.complaints)
        } catch (e) {
            setError('No complaint found for this ID or email')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className='max-h-screen bg-slate-900'>
            <Navbar />
            <div className='max-w-md mx-auto px-4 mt-24 pb-8'>
                <h1 className='text-white text-2xl font-medium mb-2'>Track Your Complaint</h1>
                <p className='text-slate-400 text-sm mb-8'>Enter your complaint ID or email to check status</p>

                <div className='flex gap-2 mb-6'>
                    <input
                        type='text'
                        placeholder='e.g. WD3X9K2A or your@email.com'
                        value={query}
                        onChange={e => setQuery(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && handleTrack()}
                        className='flex-1 bg-slate-800 text-slate-300 text-sm px-3 py-2 rounded-lg border border-slate-600 outline-none focus:border-slate-400'
                    />
                    <button
                        onClick={handleTrack}
                        disabled={loading}
                        className='bg-green-500 disabled:bg-slate-700 text-white text-sm px-4 py-2 rounded-lg transition'
                    >
                        {loading ? '...' : 'Track'}
                    </button>
                </div>

                {error && <p className='text-red-400 text-sm mb-4'>{error}</p>}

                {complaints.length > 0 && (
                    <div>
                        <p className='text-slate-400 text-sm mb-4'>Found {complaints.length} complaint{complaints.length !== 1 ? 's' : ''}</p>
                        <div className='max-h-[600px] overflow-y-auto space-y-4 pr-2'>
                            {complaints.map((complaint) => (
                                <div key={complaint.complaint_id} className='bg-slate-800 rounded-lg p-4'>
                                    {/* Header */}
                                    <div className='flex justify-between items-start mb-4'>
                                        <div>
                                            <p className='text-white font-medium'>{complaint.complaint_id}</p>
                                            <p className='text-slate-400 text-xs mt-0.5'>Filed on {new Date(complaint.createdAt).toLocaleString()}</p>
                                        </div>
                                        <span className={`text-xs px-2 py-1 rounded-full ${statusColor[complaint.status]}`}>
                                            {complaint.status}
                                        </span>
                                    </div>

                                    {/* Info */}
                                    <div className='grid grid-cols-2 gap-2 text-sm mb-4'>
                                        <div>
                                            <p className='text-slate-400 text-xs'>Waste Type</p>
                                            <p className='text-slate-300 capitalize'>{complaint.waste_type}</p>
                                        </div>
                                        <div>
                                            <p className='text-slate-400 text-xs'>Severity</p>
                                            <p className={complaint.severity === 'HIGH' ? 'text-red-400' : 'text-green-400'}>{complaint.severity}</p>
                                        </div>
                                        <div className='col-span-2'>
                                            <p className='text-slate-400 text-xs'>Location</p>
                                            <p className='text-slate-300'>{complaint.location}</p>
                                        </div>
                                    </div>

                                    {/* Timeline */}
                                    <div>
                                        <p className='text-slate-400 text-xs mb-3'>Timeline</p>
                                        <div className='flex flex-col gap-3'>
                                            {STATUS_PIPELINE.map((s, i) => {
                                                const entry = complaint.timeline?.find(t => t.status === s)
                                                const reached = STATUS_PIPELINE.indexOf(complaint.status) >= i
                                                return (
                                                    <div key={s} className='flex gap-3 items-start'>
                                                        <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${reached ? 'bg-green-400' : 'bg-slate-600'}`} />
                                                        <div>
                                                            <p className={`text-sm ${reached ? 'text-white' : 'text-slate-500'}`}>{s}</p>
                                                            {entry?.note && <p className='text-slate-400 text-xs mt-0.5'>{entry.note}</p>}
                                                            {entry?.updatedAt && <p className='text-slate-500 text-xs'>{new Date(entry.updatedAt).toLocaleString()}</p>}
                                                        </div>
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}