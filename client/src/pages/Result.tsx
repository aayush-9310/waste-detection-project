
import { useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import Navbar from "../components/Navbar";

export default function Result(){
    const {result} = useApp()
    const navigate = useNavigate()

    if(!result){
        return(
            <div>
                <Navbar />
                <p className="text-white p-4">No Result Found</p>
            </div>
        )
    }
    return(
        <div>
            <Navbar />
            <div className="max-w-md max-auto px-4 py-8">
                <h1 className="text-white text-2xl font-medium mb-6">
                    Detection Result
                </h1>

                <div className="bg-slate-800 rounded-lg p-4 mb-4">
                    <p className="text-slate-400 text-sm mb-1">Waste Type</p>
                    <p className="text-white text-lg capitalize">{result.waste_type}</p>
                    <p className="text-slate-300 mt-1">{result.waste_conf}</p>
                </div>

                <div className="bg-slate-800 rounded-lg p-4 mb-4">
                    <p className="text-slate-400 text-sm mb-1">Severity</p>
                    <p className= {result.severity === 'HIGH' ? 'text-red-400 text-lg font-bold' : 'text-green-400 text-lg font-extrabold'}>{result.severity}</p>
                    <p>{result.severity_conf}</p>
                </div>

                {result.severity === "HIGH" ? (
                    <button className="bg-green-500 text-white px-6 py-2 rounded-lg w-full" onClick={() => navigate('/complaints')}>
                        File a Complaint
                    </button>
                ): (<p className="text-slate-400"> Tips Coming soon ...</p>)}
            </div>
        </div>
    )
}