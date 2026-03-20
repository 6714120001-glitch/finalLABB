import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css';

const Dashboard = () => {
    const [reports, setReports] = useState([]);
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        const savedUser = localStorage.getItem('user');
        if (!token || !savedUser) { navigate('/login'); return; }
        setUser(JSON.parse(savedUser));

        fetch('http://localhost:5000/api/report', { headers: { 'Authorization': `Bearer ${token}` }})
            .then(res => res.json()).then(data => { if (Array.isArray(data)) setReports(data); });
    }, [navigate]);

    return (
        <div className="dash-container">
            <div className="dash-header">
                <div>
                    <h1 className="dash-title">Storm <span style={{color: '#3b82f6'}}>Dash</span></h1>
                    <p style={{fontSize: '11px', fontWeight: 'bold', color: '#a1a1aa'}}>USER: {user?.email} • ROLE: {user?.role}</p>
                </div>
                <div style={{display: 'flex', gap: '8px'}}>
                    <button className="btn-primary-sm" onClick={() => navigate('/submit-report')}>+ NEW</button>
                    <button className="btn-outline-sm" onClick={() => {localStorage.clear(); window.location.href='/login'}}>Logout</button>
                </div>
            </div>

            <div className="report-list">
                {reports.map(rpt => (
                    <div key={rpt._id} className="report-item" onClick={() => navigate(`/report/${rpt._id}`)}>
                        <div className="report-title-box">
                            <p>{rpt.category}</p>
                            <h3>{rpt.title}</h3>
                        </div>
                        <div className="report-status-box" style={{textAlign: 'right'}}>
                            <div className={`severity-tag ${rpt.severity.toLowerCase()}`}> {/* ใช้สีดาเมจ */}
                                {rpt.severity}
                            </div>
                            <p style={{fontSize: '10px', fontWeight: 'bold', color: '#cbd5e1', marginTop: '6px'}}>{rpt.status}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
export default Dashboard;