# Migration Tracker: Supabase to MySQL

## Phase 01: Audit
- [ ] Cari semua file yang import `@supabase/supabase-js`
- [ ] Cari semua file yang pakai `NEXT_PUBLIC_SUPABASE_URL`
- [ ] Export schema database Supabase saat ini ke SQL
- [ ] Petakan alur login/auth saat ini

## Phase 02 & 03: MySQL Setup
- [ ] Setup MySQL lokal / Hostinger
- [ ] Install Prisma (`npm i prisma --save-dev`)
- [ ] Init Prisma (`npx prisma init`)
- [ ] Tulis `schema.prisma` berdasarkan hasil audit

*(Sisa checklist akan diupdate seiring berjalannya phase)*