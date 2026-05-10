import { Link, useLocation } from 'react-router-dom'

export default function Navbar() {
    const { pathname } = useLocation()

    const links = [
        { to: '/', label: 'Home' },
        { to: '/complaints', label: 'Track Complaint' },
        { to: '/admin/login', label: 'Admin Dashboard' },
    ]

    return (
        <nav className='fixed top-0 w-screen flex items-center justify-between bg-slate-800 px-10 h-14'>
            <Link to="/" className='text-white text-lg'>
                Waste Detection & Complaint System
            </Link>
            <div className='flex gap-8'>
                {links.map(link => (
                    <Link
                        key={link.to}
                        to={link.to}
                        className={pathname === link.to || (link.to === '/admin/login' && pathname.startsWith('/admin')) ? 'text-green-400' : 'text-slate-400'}
                    >
                        {link.label}
                    </Link>
                ))}
            </div>
        </nav>
    )
}