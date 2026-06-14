# 🦆 Duck Hunt Portfolio — ณรงค์เดช เมธาวี

พอร์ตโฟลิโอแบบเกมยิงเป็ด เมาส์เป็นเป้าเล็ง ยิงเป็ดแต่ละตัวเพื่อเปิดหน้าข้อมูลแต่ละหมวด
(About / Skills / Projects / Contact) มีปุ่ม "ดูแบบปกติ" สำหรับ recruiter ที่อยากอ่าน resume เร็วๆ

สร้างด้วย **Vite + TypeScript + Canvas API** (ไม่มี dependency เกมภายนอก เบาและเร็ว)

## เริ่มใช้งาน

```bash
npm install      # ติดตั้ง dependency
npm run dev      # รัน dev server (เปิด http://localhost:5173)
npm run build    # build ขึ้น production (ออกที่โฟลเดอร์ dist/)
npm run preview  # ดูตัว production build
```

## แก้ข้อมูลของตัวเอง

แก้ที่ไฟล์เดียว: **`src/data/portfolio.ts`**
ทั้ง profile, skills, projects, experience, education, contact อยู่ในนั้นหมด
แก้แล้วเว็บอัปเดตตามทันที ไม่ต้องไปยุ่งกับโค้ดเกม

## ปรับแต่งเกม

- เพิ่ม/ลดเป็ด หรือเปลี่ยนสี: แก้ `PALETTE` ใน `src/game/duck.ts`
- ปรับความเร็วเป็ด: แก้ค่า `vx`, `vy` ใน `spawnDucks()`
- เสียงยิง/โดน: ฟังก์ชัน `playShot()` / `playHit()` (ใช้ Web Audio API สังเคราะห์เสียง ไม่ต้องโหลดไฟล์)

## Deploy ขึ้น Vercel (ฟรี)

1. push โค้ดขึ้น GitHub
2. ไปที่ vercel.com → New Project → เลือก repo นี้
3. Vercel จะ detect Vite ให้อัตโนมัติ (มี `vercel.json` กำกับไว้แล้ว) → กด Deploy
4. ผูก custom domain ได้ที่ Settings → Domains (เช่น `narongdej.dev`)

ทุกครั้งที่ push ขึ้น GitHub Vercel จะ deploy ใหม่ให้อัตโนมัติ

## TODO ที่อยากทำต่อ (ไอเดีย)

- [ ] เป็ด sprite / pixel art แทนรูปวาด canvas
- [ ] หมาคาบเป็ดแบบ Duck Hunt ต้นฉบับ
- [ ] กระสุนจำกัด + reload, ระบบ combo
- [ ] หลาย wave เป็ดบินเร็วขึ้นเรื่อยๆ
- [ ] ปุ่มเปิด/ปิดเสียง
- [ ] ใส่รูปโปรไฟล์จริงในหน้า About
