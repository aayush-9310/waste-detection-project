
import { Link, useLocation } from 'react-router-dom'

export default function Navbar(){
    const {pathname} = useLocation()

    return(
        <nav className='flex items-center justify-between bg-slate-800 px-10 h-14'>
            <Link to="/" className='text-white text-lg'>
                Waste Detection & Complaint System
            </Link>
            <div className='flex gap-10'>
                <Link to ="/" className={pathname === '/'? 'text-green-400' : 'text-slate-400'}>Home</Link>
                <Link to ="/complaints" className={pathname === '/complaints' ? 'text-green-400' : 'text-slate-400'}>Complaints</Link>
            </div>
        </nav>
    )
}