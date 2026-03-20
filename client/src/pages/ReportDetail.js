import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import io from 'socket.io-client';
import '../App.css';

const socket = io('http://localhost:5000');

const ReportDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [report, setReport] = useState(null);
    const [message, setMessage] = useState('');
    const [chat, setChat] = useState([]);
    const [user] = useState(JSON.parse(localStorage.getItem('user')));
    const chatEndRef = useRef(null);

    useEffect(() => {
        const fetchDetail = async () => {
            const token = localStorage.getItem('token');
            const res = await fetch(`http://localhost:5000/api/report/${id}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            setReport(data);
            setChat(data.chatHistory || []);
        };
        fetchDetail();
        socket.emit('joinReport', id);
        socket.on('receiveMessage', (msg) => setChat(prev => [...prev, msg]));
        return () => { socket.emit('leaveReport', id); socket.off('receiveMessage'); };
    }, [id]);

    useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: "smooth" }) }, [chat]);

    // ฟังก์ชันสำหรับ Admin เปลี่ยน Status
    const updateStatus = async (newStatus) => {
        if (user.role !== 'admin') return;
        const token = localStorage.getItem('token');
        const res = await fetch(`http://localhost:5000/api/report/${id}/status`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify({ status: newStatus })
        });
        if (res.ok) {
            setReport({ ...report, status: newStatus });
            alert(`Status updated to: ${newStatus}`);
        }
    };

    const handleChecklist = async (key, val) => {
        if (user.role !== 'admin') return;
        const newChecklist = { ...report.checklist, [key]: val };
        const token = localStorage.getItem('token');
        const res = await fetch(`http://localhost:5000/api/report/${id}/checklist`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify(newChecklist)
        });
        if (res.ok) setReport({ ...report, checklist: newChecklist });
    };

    const sendChat = (e) => {
        e.preventDefault();
        if (!message.trim()) return;
        socket.emit('sendReportMessage', { reportId: id, user: user.email, role: user.role, text: message });
        setMessage('');
    };

    if (!report) return <div className="storm-wrapper">Loading...</div>;

    return (
        <div className="dash-container" style={{maxWidth: '1200px'}}>
            <div className="dash-header">
                <div style={{display: 'flex', alignItems: 'center', gap: '12px'}}>
                    <div className="storm-icon-box" style={{width: '40px', height: '40px', margin: 0}}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                            <path d="M21 4H3M20 8H6M18 12H9M15 16H8M17 20h-6" />
                        </svg>
                    </div>
                    <h1 className="dash-title" style={{fontSize: '22px'}}>Report Detail</h1>
                </div>
                <button className="btn-outline-sm" onClick={() => navigate('/dashboard')}>← Back</button>
            </div>

            <div style={{display: 'grid', gridTemplateColumns: window.innerWidth > 992 ? '1fr 380px' : '1fr', gap: '25px'}}>
                <div>
                    <div className="report-item" style={{display: 'block', cursor: 'default', padding: '30px'}}>
                        <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'15px'}}>
                            <div>
                                {/* Status Section (Admin เปลี่ยนได้) */}
                                <div style={{display:'flex', alignItems:'center', gap:'8px', marginBottom:'5px'}}>
                                    <p style={{fontSize:'10px', fontWeight:900, color:'#94a3b8'}}>STATUS:</p>
                                    {user.role === 'admin' ? (
                                        <select
                                            value={report.status}
                                            onChange={(e) => updateStatus(e.target.value)}
                                            style={{fontSize:'10px', fontWeight:900, color:'#3b82f6', background:'#f0f9ff', border:'none', borderRadius:'5px', cursor:'pointer'}}
                                        >
                                            <option value="Pending">Pending</option>
                                            <option value="Triaged">Triaged</option>
                                            <option value="Resolved">Resolved</option>
                                            <option value="Closed">Closed</option>
                                        </select>
                                    ) : (
                                        <span style={{fontSize:'10px', fontWeight:900, color:'#3b82f6'}}>{report.status}</span>
                                    )}
                                </div>
                                <h2 style={{fontSize: '28px', fontWeight: 900, color: '#1e3a8a'}}>{report.title}</h2>
                                <p style={{fontSize:'10px', fontWeight:900, color:'#94a3b8'}}>CATEGORY: {report.category}</p>
                            </div>
                            <div className={`severity-tag ${report.severity.toLowerCase()}`}>
                                Severity: {report.severity}
                            </div>
                        </div>
                        <div style={{background: '#f8fafc', padding: '20px', borderRadius: '20px', border: '1px solid #f1f5f9'}}>
                            <p style={{fontSize: '14px', color:'#475569', lineHeight: 1.6}}>{report.description}</p>
                        </div>
                    </div>

                    {/* Checklist สำหรับ Admin */}
                    {user.role === 'admin' && (
                        <div className="report-item" style={{display:'block', cursor:'default', marginTop:'20px'}}>
                            <p style={{fontSize:'10px', fontWeight:800, color:'#a1a1aa', textTransform:'uppercase', marginBottom:'15px'}}>Workflow Tracking</p>
                            <div className="workflow-checklist">
                                {['isReceived', 'isTriaged', 'isFixed', 'isRewarded'].map(k => (
                                    <label key={k} className={`checklist-item ${report.checklist?.[k] ? 'active' : ''}`}>
                                        <span className="checklist-label">{k.replace('is', '')}</span>
                                        <input
                                            type="checkbox"
                                            checked={report.checklist?.[k] || false}
                                            onChange={(e) => handleChecklist(k, e.target.checked)}
                                            className="checklist-input"
                                        />
                                    </label>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Chat History */}
                <div className="storm-card" style={{padding:0, borderRadius:'30px', display:'flex', flexDirection:'column', height:'550px', overflow:'hidden', maxWidth:'none'}}>
                    <div style={{padding:'15px', background:'#1e3a8a', color:'white', fontWeight:900, fontSize:'11px', textAlign:'center'}}>
                        DISCUSSION LOG
                    </div>
                    <div style={{flex:1, padding:'20px', overflowY:'auto', display:'flex', flexDirection:'column', gap:'10px', background:'#fff'}}>
                        {chat.map((m, i) => (
                            <div key={i} style={{alignSelf: m.user === user.email ? 'flex-end' : 'flex-start', maxWidth:'85%'}}>
                                <p style={{fontSize:'8px', fontWeight:900, color:'#cbd5e1', marginBottom:'3px', textAlign: m.user === user.email ? 'right' : 'left'}}>
                                    {m.user.split('@')[0].toUpperCase()} ({m.role})
                                </p>
                                <div className={`chat-bubble ${m.user === user.email ? 'mine' : 'others'}`}>
                                    {m.text}
                                </div>
                            </div>
                        ))}
                        <div ref={chatEndRef} />
                    </div>
                    <form onSubmit={sendChat} style={{padding:'15px', borderTop:'1px solid #f1f5f9', display:'flex', gap:'8px'}}>
                        <input className="storm-input" style={{marginBottom:0, padding:'12px'}} value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Message..." />
                        <button type="submit" className="btn-primary-sm" style={{padding:'0 15px', height:'45px'}}>
                            <svg width="18" height="18" fill="currentColor" viewBox="0 0 20 20"><path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"/></svg>
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};
export default ReportDetail;