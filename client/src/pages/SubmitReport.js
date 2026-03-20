import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css';

const SubmitReport = () => {
    const [title, setTitle] = useState('');
    const [category, setCategory] = useState('Broken Access Control');
    const [severity, setSeverity] = useState('Low');
    const [description, setDescription] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        try {
            const res = await fetch('http://localhost:5000/api/report', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ title, category, severity, description })
            });
            if (res.ok) {
                alert('🚀 Report Sent Successfully!');
                navigate('/dashboard');
            }
        } catch (err) {
            alert('Failed to send report.');
        }
    };

    return (
        <div className="storm-wrapper">
            <div className="storm-card" style={{maxWidth: '600px'}}>
                <h1 className="storm-title">Submit Vulnerability</h1>
                <p className="storm-subtitle">Report a bug to help us improve</p>
                <form onSubmit={handleSubmit}>
                    <input className="storm-input" placeholder="REPORT TITLE" onChange={e => setTitle(e.target.value)} required />
                    <div style={{display: 'flex', gap: '10px'}}>
                        <select className="storm-input" onChange={e => setCategory(e.target.value)}>
                            <option>Broken Access Control</option>
                            <option>Injection</option>
                            <option>XSS</option>
                            <option>Other</option>
                        </select>
                        <select className="storm-input" onChange={e => setSeverity(e.target.value)}>
                            <option value="Low">Low</option>
                            <option value="Medium">Medium</option>
                            <option value="High">High</option>
                            <option value="Critical">Critical</option>
                        </select>
                    </div>
                    <textarea className="storm-input" style={{height: '150px', resize: 'none'}} placeholder="DESCRIPTION / REPRODUCTION STEPS" onChange={e => setDescription(e.target.value)} required />

                    <div style={{display: 'flex', gap: '15px', marginTop: '10px'}}>
                        <button type="submit" className="storm-btn" style={{flex: 2}}>Send Report</button>
                        <button type="button" className="storm-btn" style={{flex: 1, background: '#f1f5f9', color: '#64748b'}} onClick={() => navigate('/dashboard')}>Cancel</button>
                    </div>
                </form>
            </div>
        </div>
    );
};
export default SubmitReport;