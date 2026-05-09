import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from './pages/Home'
import Result from './pages/Result'
import Complaints from './pages/Complaints'
import Admin from './pages/Admin'
import AdminLogin from './pages/AdminLogin'
import ProtectedRoute from './components/ProtectedRoute'

function App() {
    return (
   <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/result" element={<Result />} />
                <Route path="/complaints" element={<Complaints />} />
                <Route path="/admin/login" element={<AdminLogin />} />
                <Route path="/admin" element={
                    <ProtectedRoute>
                        <Admin />
                    </ProtectedRoute>
                } />
            </Routes>
        </BrowserRouter>
    )
}

export default App