import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css';

const Register = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('researcher');
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:5000/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password, role })
            });
            if (response.ok) {
                alert('🎉 Registration Successful! You can login now.'); // แจ้งเตือนสำเร็จ
                navigate('/login');
            } else {
                alert('Registration failed. Email might be already in use.');
            }
        } catch (err) {
            alert('Server error. Please try again later.');
        }
    };

    return (
        <div className="storm-wrapper">
            <div className="storm-card">
                <div className="storm-icon-box">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M21 4H3M20 8H6M18 12H9M15 16H8M17 20h-6" />
                    </svg>
                </div>
                <h1 className="storm-title">Join Storm</h1>
                <p className="storm-subtitle">Create your researcher account</p>
                <form onSubmit={handleRegister}>
                    <input className="storm-input" type="email" placeholder="EMAIL" onChange={e => setEmail(e.target.value)} required />
                    <input className="storm-input" type="password" placeholder="PASSWORD" onChange={e => setPassword(e.target.value)} required />
                    <select className="storm-input" onChange={e => setRole(e.target.value)}>
                        <option value="researcher">RESEARCHER</option>
                        <option value="admin">ADMIN (FOR TEST)</option>
                    </select>
                    <button type="submit" className="storm-btn">Register</button>
                </form>
                <p className="storm-footer-link" onClick={() => navigate('/login')}>BACK TO LOGIN</p>
            </div>
        </div>
    );
};
export default Register;