import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import axios from 'axios'

interface TimelineEntry {
    status: string
    note: string
    updatedAt: string
}

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
    timeline: TimelineEntry[]
    createdAt: string
}

const STATUS_PIPELINE = ['Pending', 'Viewed', 'Forwarded', 'In Progress', 'Resolved']

const statusColor: Record<string, string> = {
    'Pending': 'bg-red-900 text-red-400',
    'Viewed': 'bg-blue-900 text-blue-400',
    'Forwarded': 'bg-purple-900 text-purple-400',
    'In Progress': 'bg-yellow-900 text-yellow-400',
    'Resolved': 'bg-green-900 text-green-400',
}

export default function Admin() {
    const navigate = useNavigate()
    const [complaints, setComplaints] = useState<Complaint[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [expanded, setExpanded] = useState<string | null>(null)
    const [updating, setUpdating] = useState<string | null>(null)
    const [noteInput, setNoteInput] = useState<Record<string, string>>({})
    const [statusInput, setStatusInput] = useState<Record<string, string>>({})

    const token = localStorage.getItem('admin_token')

    const authHeader = { headers: { Authorization: `Bearer ${token}` } }

    useEffect(() => {
        fetchComplaints()
    }, [])

    async function fetchComplaints() {
        try {
            const res = await axios.get('http://localhost:3000/api/complaints', authHeader)
            setComplaints(res.data.complaints)
        } catch (e) {
            console.error(e)
            setError('Failed to fetch complaints')
        } finally {
            setLoading(false)
        }
    }

    async function updateStatus(complaint_id: string) {
        const status = statusInput[complaint_id]
        const note = noteInput[complaint_id] || ''
        if (!status) return

        setUpdating(complaint_id)
        try {
            const res = await axios.patch(
                `http://localhost:3000/api/complaints/${complaint_id}`,
                { status, note },
                authHeader
            )
            setComplaints(prev => prev.map(c =>
                c.complaint_id === complaint_id
                    ? { ...c, status: res.data.status, timeline: res.data.timeline }
                    : c
            ))
            setNoteInput(prev => ({ ...prev, [complaint_id]: '' }))
            setStatusInput(prev => ({ ...prev, [complaint_id]: '' }))
        } catch (e) {
            console.error(e)
        } finally {
            setUpdating(null)
        }
    }

    function handleLogout() {
        localStorage.removeItem('admin_token')
        navigate('/admin/login')
    }

    return (
        <div className='min-h-screen bg-slate-900'>
            <Navbar />
            <div className='max-w-3xl mx-auto px-4 py-8'>
                <div className='flex justify-between items-center mb-6'>
                    <h1 className='text-white text-2xl font-medium'>
                        Admin Dashboard
                        <span className='text-slate-400 text-sm font-normal ml-3'>{complaints.length} complaints</span>
                    </h1>
                    <button
                        onClick={handleLogout}
                        className='text-slate-400 text-sm border border-slate-600 px-3 py-1 rounded-lg hover:border-slate-400 transition'
                    >
                        Logout
                    </button>
                </div>

                {loading && <p className='text-slate-400'>Loading...</p>}
                {error && <p className='text-red-400'>{error}</p>}
                {!loading && complaints.length === 0 && <p className='text-slate-400'>No complaints yet.</p>}

                <div className='flex flex-col gap-4'>
                    {complaints.map(c => (
                        <div key={c._id} className='bg-slate-800 rounded-lg p-4'>

                            <div className='flex justify-between items-start mb-3'>
                                <div>
                                    <p className='text-white font-medium'>{c.complaint_id}</p>
                                    <p className='text-slate-400 text-xs mt-0.5'>{new Date(c.createdAt).toLocaleString()}</p>
                                </div>
                                <span className={`text-xs px-2 py-1 rounded-full ${statusColor[c.status]}`}>
                                    {c.status}
                                </span>
                            </div>

                            <div className='grid grid-cols-2 gap-2 text-sm mb-3'>
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
                                    <p className='text-slate-400 text-xs'>Location</p>
                                    <p className='text-slate-300'>{c.location}</p>
                                </div>
                            </div>

                            {c.description && (
                                <div className='mb-3'>
                                    <p className='text-slate-400 text-xs'>Description</p>
                                    <p className='text-slate-300 text-sm'>{c.description}</p>
                                </div>
                            )}

                            <button
                                onClick={() => setExpanded(expanded === c.complaint_id ? null : c.complaint_id)}
                                className='text-slate-400 text-xs underline mb-3'
                            >
                                {expanded === c.complaint_id ? 'Hide Timeline' : 'View Timeline'}
                            </button>

                            {expanded === c.complaint_id && (
                                <div className='mb-4 border-l-2 border-slate-600 pl-4 flex flex-col gap-3'>
                                    {c.timeline.map((t, i) => (
                                        <div key={i}>
                                            <div className='flex items-center gap-2'>
                                                <span className={`text-xs px-2 py-0.5 rounded-full ${statusColor[t.status]}`}>
                                                    {t.status}
                                                </span>
                                                <p className='text-slate-500 text-xs'>{new Date(t.updatedAt).toLocaleString()}</p>
                                            </div>
                                            {t.note && <p className='text-slate-300 text-sm mt-1'>{t.note}</p>}
                                        </div>
                                    ))}
                                </div>
                            )}

                            {c.status !== 'Resolved' && (
                                <div className='flex flex-col gap-2 pt-3 border-t border-slate-700'>
                                    <select
                                        value={statusInput[c.complaint_id] || ''}
                                        onChange={e => setStatusInput(prev => ({ ...prev, [c.complaint_id]: e.target.value }))}
                                        className='bg-slate-700 text-slate-300 text-sm px-3 py-2 rounded-lg outline-none'
                                    >
                                        <option value=''>Select next status</option>
                                        {STATUS_PIPELINE
                                            .filter(s => STATUS_PIPELINE.indexOf(s) > STATUS_PIPELINE.indexOf(c.status))
                                            .map(s => (
                                                <option key={s} value={s}>{s}</option>
                                            ))
                                        }
                                    </select>
                                    <input
                                        type='text'
                                        placeholder='Action note (optional)'
                                        value={noteInput[c.complaint_id] || ''}
                                        onChange={e => setNoteInput(prev => ({ ...prev, [c.complaint_id]: e.target.value }))}
                                        className='bg-slate-700 text-slate-300 text-sm px-3 py-2 rounded-lg outline-none'
                                    />
                                    <button
                                        onClick={() => updateStatus(c.complaint_id)}
                                        disabled={!statusInput[c.complaint_id] || updating === c.complaint_id}
                                        className='bg-green-500 disabled:bg-slate-700 disabled:text-slate-500 text-white text-sm py-2 rounded-lg transition'
                                    >
                                        {updating === c.complaint_id ? 'Updating...' : 'Update Status'}
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}