import Navbar from '../components/Navbar'
import ComplaintForm from '../components/ComplaintForm'

export default function Complaints() {
    return (
        <div className='min-h-screen bg-slate-900'>
            <Navbar />
            <ComplaintForm />
        </div>
    )
}