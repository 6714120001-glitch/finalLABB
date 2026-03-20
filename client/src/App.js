import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register'; // ตรวจสอบว่ามีไฟล์นี้
import Dashboard from './pages/Dashboard';
import ReportDetail from './pages/ReportDetail';
import SubmitReport from './pages/SubmitReport';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/report/:id" element={<ReportDetail />} />
                <Route path="/submit-report" element={<SubmitReport />} />
                <Route path="/" element={<Login />} />
            </Routes>
        </Router>
    );
}
export default App;