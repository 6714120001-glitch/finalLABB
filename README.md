# 🛡️ Secure Vulnerability Reporting Platform
[cite_start]**NECS1205 - LAB Exam Project** ระบบรับแจ้งช่องโหว่ความปลอดภัย (Bug Bounty Platform) ที่ออกแบบตามมาตรฐานความปลอดภัยระดับสากล [cite: 7, 9]

---

## 🚀 วิธีการติดตั้งและใช้งาน (Getting Started)
[cite_start]ระบบนี้ถูกออกแบบมาให้รันผ่าน **Docker Container** เพื่อความสะดวกและรวดเร็วในการทดสอบ [cite: 4, 40]

1.  **Clone หรือแตกไฟล์ Project** เข้าไปในเครื่องของคุณ
2.  **เปิด Terminal** ในโฟลเดอร์โปรเจกต์ (Root Directory)
3.  **รันคำสั่ง Docker Compose:**
    ```bash
    docker-compose up --build
    ```
4.  **เข้าใช้งานผ่านเบราว์เซอร์:**
    * **Frontend:** `http://localhost:3000` [cite: 16]
    * **Backend API:** `http://localhost:5000` [cite: 23]

---

## 👥 บัญชีสำหรับทดสอบระบบ (Test Accounts)
[cite_start]ระบบมีการแยกสิทธิการเข้าถึง (Role-based Access Control) อย่างชัดเจน[cite: 36, 45]:

| บทบาท (Role) | อีเมล (Email) | รหัสผ่าน (Password) | [cite_start]สิทธิการใช้งาน [cite: 46, 47] |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@test.com` | `admin3456-` | [cite_start]ดูรายงานได้ทั้งหมด, Filter ระดับ Critical, เปลี่ยนสถานะรายงาน [cite: 47, 56] |
| **Researcher** | `hunter@test.com` | `hunter987` | [cite_start]ส่งรายงานช่องโหว่, ดูได้เฉพาะรายงานของตนเอง [cite: 46, 50] |

---

## ✨ ฟีเจอร์หลัก (Core Features)
* [cite_start]**Vulnerability Submission:** ฟอร์มส่งรายงานพร้อมระบบเลือกประเภทช่องโหว่ตาม OWASP [cite: 49, 50]
* [cite_start]**Real-time Live Chat:** ระบบแชทโต้ตอบระหว่าง Researcher และ Admin ผ่าน WebSocket (Socket.IO) [cite: 29, 30]
* [cite_start]**Role Dashboard:** หน้าจัดการข้อมูลที่แยกตามสิทธิ์ของผู้ใช้งาน [cite: 45]
* [cite_start]**Security Focus:** ป้องกันช่องโหว่ตามมาตรฐาน **OWASP Top 10: 2025** [cite: 37, 60]

---

## 🔒 มาตรฐานความปลอดภัย (Security Implementations)
[cite_start]โปรเจกต์นี้มีการป้องกันความปลอดภัยในจุดสำคัญ[cite: 32, 38]:
* [cite_start]**Authentication:** เข้ารหัสรหัสผ่านด้วย `bcrypt` และใช้ `JWT` สำหรับ Session [cite: 34, 36]
* [cite_start]**Access Control:** ป้องกันการเข้าถึงข้อมูลข้ามสิทธิ์ (Broken Access Control) [cite: 48, 61]
* [cite_start]**Input Validation:** ป้องกันช่องโหว่ Injection และ XSS ในทุกฟอร์ม [cite: 44, 51, 97]
* [cite_start]**Rate Limiting:** ป้องกันการโจมตีแบบ Brute-force ในหน้า Login [cite: 44, 108]

---

## 📂 โครงสร้างไฟล์ส่งงาน
1.  [cite_start]**Source Code:** โฟลเดอร์ `/server` (Backend) และ `/client` (Frontend) [cite: 4]
2.  [cite_start]**Docker:** ไฟล์ `docker-compose.yml` สำหรับรันระบบทั้งหมด [cite: 4, 40]
3.  [cite_start]**Security Report:** เอกสารอธิบายการป้องกันช่องโหว่ตามมาตรฐาน OWASP [cite: 5, 59]