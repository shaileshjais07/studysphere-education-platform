# StudySphere — Education Platform (Future Ready)

This is the single merged starter for the requested Education Platform: Expo/React Native Web + Express + Prisma/PostgreSQL. It is designed around **database-driven content**, so new classes/programs can be created without changing mobile source code.

## What is included
- Dynamic Classes/Programs (Class 1–12, BCA, BBA, UG, PG, competitive exams, custom categories)
- Dynamic Subjects → Chapters → Lessons
- Student/Admin roles: SUPER_ADMIN, ADMIN, TEACHER, STUDENT
- Server-side JWT role protection
- Password hashing with bcrypt
- OTP architecture with hashed OTP records and 5-minute expiry; provider credentials stay backend-only
- Questions, mock-test data model, progress, bookmarks, notifications, announcements, feedback, media, AI conversations, audit logs
- Seed demo data
- StudySphere-style responsive Expo Web home screen

> Important: This ZIP is a strong working foundation, not a claim that every external provider (WhatsApp/Email/AI/Cloud storage) is already connected. Those providers require your own accounts/credentials.

## Windows PowerShell setup

### 1. Backend
```powershell
cd C:\Projects\education-platform-future-readyackend
npm install
Copy-Item .env.example .env
notepad .env
```
Set `DATABASE_URL` to your PostgreSQL database and create a long `JWT_SECRET`. Then:

```powershell
npx prisma generate
npx prisma migrate dev --name init
npm run seed
npm run dev
```
Backend: `http://localhost:5000/api/health`

### 2. Mobile/Web — second PowerShell
```powershell
cd C:\Projects\education-platform-future-ready\mobile
npm install
npx expo start -c
```
Press `w` or open `http://localhost:8081`.

If Expo reports a missing `expo-linking`, run:
```powershell
npx expo install expo-linking expo-constants
npx expo start -c
```

## Demo login
Only for local development:
- Student: `student@studysphere.local` / `ChangeMe123!`
- Admin: `admin@studysphere.local` / `ChangeMe123!`
Change the seed password before any real deployment.

## Future class workflow
Admin API creates a class, for example:
```json
{
  "name":"Class 11",
  "slug":"class-11",
  "category":"SCHOOL",
  "board":"CBSE",
  "level":"11",
  "sortOrder":3
}
```
Then add subjects, chapters and lessons. The mobile app reads `/api/classes`, so the new class appears automatically. No frontend source-code edit is required.

## Security notes
- Never commit `.env`.
- Never put AI/WhatsApp/email provider keys in mobile code.
- Production OTP delivery needs a real provider such as Resend/SES/SendGrid or Meta WhatsApp/Twilio.
- Configure production CORS and HTTPS.
- Add object storage credentials only on the backend.
- Do not use demo credentials in production.

## Project structure
```text
education-platform-future-ready/
├── backend/
│   ├── prisma/schema.prisma
│   └── src/
│       ├── middleware/
│       ├── routes/
│       ├── seed.ts
│       └── server.ts
├── mobile/
│   ├── app/
│   ├── constants/
│   └── services/
├── README.md
└── .gitignore
```
