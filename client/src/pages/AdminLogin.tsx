import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import axios from 'axios'

export default function AdminLogin() {
    const navigate = useNavigate()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        const token = localStorage.getItem('admin_token')
        if (token) navigate('/admin')
    }, [])

    async function handleLogin(e: React.FormEvent) {
        e.preventDefault()
        
        if (!email || !password) {
            setError('Email and password are required')
            return
        }

        setLoading(true)
        setError('')

        try {
            const res = await axios.post('http://localhost:3000/api/auth/login', { email, password })
            localStorage.setItem('admin_token', res.data.token)
            navigate('/admin')
        } catch (e) {
            setError('Invalid credentials')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className='min-h-screen bg-slate-900 flex items-center justify-center pt-5'>
            <Navbar />
            <div className='bg-slate-800 rounded-lg p-8 w-full max-w-sm'>
                <h1 className='text-white text-2xl font-medium mb-2'>Admin Login</h1>
                <p className='text-slate-400 text-sm mb-6'>Waste Detection System</p>

                <form onSubmit={handleLogin}>
                    <div className='flex flex-col gap-3'>
                        <input
                            type='email'
                            placeholder='Email'
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            className='bg-slate-700 text-slate-300 text-sm px-3 py-2 rounded-lg border border-slate-600 outline-none focus:border-slate-400'
                        />
                        <input
                            type='password'
                            placeholder='Password'
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            className='bg-slate-700 text-slate-300 text-sm px-3 py-2 rounded-lg border border-slate-600 outline-none focus:border-slate-400'
                        />
                    </div>

                    {error && <p className='text-red-400 text-sm mt-3'>{error}</p>}

                    <button
                        type='submit'
                        disabled={loading}
                        className='bg-green-500 disabled:bg-slate-700 disabled:text-slate-500 text-white py-2 rounded-lg w-full mt-6 transition'
                    >
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                </form>
                
            </div>
        </div>
    )
}