# 🚀 Bayview Admin Dashboard

Admin Dashboard สำหรับควบคุมและ Monitor ระบบ LINE OA + AI Automation ครบวงจร

---

## 🛠️ Tech Stack

- **Frontend / Fullstack Framework**: Next.js 15/16 (App Router)
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui
- **Database & Auth**: Supabase (PostgreSQL + Supabase Auth + Row Level Security)
- **Data Visualization**: Recharts
- **Automation Integration**: n8n Webhook & PostgreSQL Trigger
- **Hosting**: Vercel (Free Tier)

---

## 📂 โครงสร้างโปรเจกต์

```text
admin-dashboard/
├── src/
│   ├── app/
│   │   ├── api/n8n/
│   │   │   ├── broadcast/route.ts       # API ส่ง Broadcast ผ่าน n8n
│   │   │   └── send-message/route.ts    # API ส่ง Direct Message ผ่าน n8n
│   │   ├── dashboard/
│   │   │   ├── layout.tsx               # Sidebar + Header layout
│   │   │   ├── page.tsx                 # Overview & Stats
│   │   │   ├── dashboard-client.tsx
│   │   │   ├── users/
│   │   │   │   └── page.tsx             # Users & Chat Logs
│   │   │   └── settings/
│   │   │       ├── page.tsx             # AI & Model Controls
│   │   │       └── settings-client.tsx
│   │   ├── login/
│   │   │   ├── page.tsx                 # Login form
│   │   │   └── actions.ts               # Server Actions (Auth)
│   │   ├── layout.tsx                   # Root layout + Theme + Sonner Toaster
│   │   └── page.tsx                     # Redirect to /dashboard
│   ├── components/
│   │   ├── dashboard/
│   │   │   ├── stat-card.tsx
│   │   │   ├── usage-chart.tsx
│   │   │   └── recent-activity.tsx
│   │   ├── users/
│   │   │   ├── users-table.tsx
│   │   │   └── chat-log-dialog.tsx
│   │   └── ui/                          # shadcn UI components
│   ├── lib/
│   │   ├── supabase/
│   │   │   ├── client.ts                # Client-side Supabase client
│   │   │   └── server.ts                # Server-side Supabase client (SSR)
│   │   ├── n8n.ts                       # n8n Webhook helpers
│   │   └── types.ts                     # Database & API types
│   └── middleware.ts                    # Auth & Role Protection Guard
├── supabase_schema.sql                  # SQL Script สำหรับรันใน Supabase
└── .env.local                           # Environment Variables
```

---

## ⚙️ ขั้นตอนการติดตั้งและใช้งาน (Setup Guide)

### 1. ตั้งค่า Supabase Database

1. ไปที่ [Supabase Dashboard](https://app.supabase.com) แล้วสร้างโปรเจกต์ใหม่ (ฟรี)
2. ไปที่เมนู **SQL Editor** แล้วคัดลอกโค้ดจากไฟล์ `supabase_schema.sql` ไปวางและกด **Run**
3. ไปที่ **Project Settings -> API** เพื่อคัดลอก:
   - `Project URL`
   - `anon public key`

### 2. สร้าง Admin User คนแรก

1. ใน Supabase Dashboard ไปที่ **Authentication -> Users** แล้วกด **Add User -> Create User**
2. ใส่ Email และ Password ของ Admin
3. ไปที่ **SQL Editor** แล้วรันคำสั่งผูกสิทธิ์ Admin:
   ```sql
   INSERT INTO public.admin_users (user_id, email)
   VALUES ('<UUID-ของ-User-ที่เพิ่งสร้าง>', 'your-admin@example.com');
   ```

### 3. ตั้งค่า Environment Variables

แก้ไขไฟล์ `.env.local` ในโปรเจกต์:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOi...
N8N_WEBHOOK_URL=https://your-n8n-domain.com/webhook
```

### 4. รันโปรเจกต์ใน Local

```bash
npm run dev
```

เปิดบราวเซอร์ไปที่ [http://localhost:3000](http://localhost:3000)

---

## 🌐 การ Deploy ขึ้น Vercel (ฟรี 100%)

1. Push โค้ดทั้งหมดขึ้น GitHub
2. ไปที่ [Vercel](https://vercel.com) แล้วเลือก **Import Project** จาก GitHub
3. ในส่วน **Root Directory** ให้เลือกโฟลเดอร์ `admin-dashboard`
4. ในส่วน **Environment Variables** ให้เพิ่ม:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `N8N_WEBHOOK_URL`
5. กด **Deploy** เรียบร้อย!
