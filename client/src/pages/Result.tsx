import { useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import Navbar from "../components/Navbar";

export default function Result() {
    const { result } = useApp()
    const navigate = useNavigate()

    if (!result) {
        return (
            <div className="min-h-screen bg-slate-900">
                <Navbar />
                <p className="text-white p-4">No Result Found</p>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-slate-900">
            <Navbar />
            <div className="max-w-md mx-auto px-4 py-8">
                <h1 className="text-white text-2xl font-medium mb-6">Detection Result</h1>

                <div className="bg-slate-800 rounded-lg p-4 mb-4">
                    <p className="text-slate-400 text-sm mb-1">Waste Type</p>
                    <p className="text-white text-lg capitalize">{result.waste_type}</p>
                    <p className="text-slate-300 mt-1">{result.waste_conf}%</p>
                </div>

                <div className="bg-slate-800 rounded-lg p-4 mb-4">
                    <p className="text-slate-400 text-sm mb-1">Severity</p>
                    <p className={result.severity === 'HIGH' ? 'text-red-400 text-lg font-bold' : 'text-green-400 text-lg font-bold'}>
                        {result.severity}
                    </p>
                    <p className="text-slate-300 mt-1">{result.severity_conf}%</p>
                </div>

                {result.severity === "HIGH" ? (
              <button
    className="bg-green-500 text-white px-6 py-3 rounded-lg w-full"
    onClick={() => navigate('/file-complaint')}
>
    File a Complaint
</button>
                ) : (
                    result.tips && (
                        <div className="bg-slate-800 rounded-lg p-4">
                            <div className="flex items-center justify-between mb-3">
                                <p className="text-white font-medium">Disposal Tips</p>
                                <span className="text-xs bg-slate-700 text-slate-300 px-2 py-1 rounded-full">
                                    {result.tips.bin_color}
                                </span>
                            </div>
                            <ul className="flex flex-col gap-2">
                                {result.tips.tips.map((tip: string, i: number) => (
                                    <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                                        <span className="text-green-400 mt-0.5">✓</span>
                                        {tip}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )
                )}
            </div>
        </div>
    )
}