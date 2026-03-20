import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css'; // ไฟล์นี้ถ้าไม่มีให้สร้างไฟล์เปล่าทิ้งไว้ หรือลบบรรทัดนี้ออกได้ครับ
import App from './App';
import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);