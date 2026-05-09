import { Link, useLocation } from 'react-router-dom'

export default function Navbar() {
    const { pathname } = useLocation()

    const links = [
        { to: '/', label: 'Home' },
        { to: '/complaints', label: 'Track Complaint' },
    ]

    return (
        <nav className='flex items-center justify-between bg-slate-800 px-10 h-14'>
            <Link to="/" className='text-white text-lg'>
                Waste Detection
            </Link>
            <div className='flex gap-8'>
                {links.map(link => (
                    <Link
                        key={link.to}
                        to={link.to}
                        className={pathname === link.to ? 'text-green-400' : 'text-slate-400'}
                    >
                        {link.label}
                    </Link>
                ))}
            </div>
        </nav>
    )
}