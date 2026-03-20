import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:5000/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            const data = await response.json();
            if (response.ok) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));
                window.location.href = '/dashboard';
            } else { setError(data.message); }
        } catch (err) { setError('Connection Error'); }
    };

    return (
        <div className="storm-wrapper">
            <div className="storm-card">
                <div className="storm-icon-box">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M21 4H3M20 8H6M18 12H9M15 16H8M17 20h-6" />
                    </svg>
                </div>
                <h1 className="storm-title">Storm Login</h1>
                <p className="storm-subtitle">Secure Access Portal</p>

                {error && <p style={{color:'red', fontSize:'11px', marginBottom:'10px'}}>{error}</p>}

                <form onSubmit={handleLogin}>
                    <input className="storm-input" type="email" placeholder="EMAIL" onChange={e => setEmail(e.target.value)} required />
                    <input className="storm-input" type="password" placeholder="PASSWORD" onChange={e => setPassword(e.target.value)} required />
                    <button type="submit" className="storm-btn">Login</button> {/* เปลี่ยนชื่อเป็น Login */}
                </form>

                <span className="storm-footer-link" onClick={() => navigate('/register')}>CREATE NEW ACCOUNT</span>
            </div>
        </div>
    );
};

export default Login;