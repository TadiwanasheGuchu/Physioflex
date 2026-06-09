# Physioflex — Development Progress

## Completed

### Authentication & Users
- [x] Admin user creation script (`scripts/create-admin.mjs`)
- [x] Password reset flow fixed — `/auth/callback` route added for PKCE code exchange
- [x] Middleware updated to allow `/auth/reset` and `/auth/callback` when logged in
- [x] Role-based access control working (`/admin` requires role = 'admin')
- [x] SQL helper to promote user to admin via `UPDATE public.profiles SET role = 'admin'`

### Admin Dashboard
- [x] Services fully editable (add / edit / delete / toggle active)
- [x] Reviews manageable (approve / reject / reply)
- [x] Live stats on homepage pulled from database (appointments, patients, services, therapists)

### Public Site Content
- [x] Address updated — Shop Nr 2, Spar Ocean View Shopping Centre, Eugene Muller Street, Swakopmund
- [x] Working hours updated — Mon–Fri 08:00–18:00
- [x] Medical aids updated — NHP, NMC, Named, Prosperity, Napotel, GemHealth
- [x] FAQ answers updated (referral policy, first appointment checklist with N$60 admin fee)
- [x] Google Maps embed updated to exact clinic coordinates (-22.640907, 14.537624)
- [x] All service prices removed from public-facing pages
- [x] Service duration display removed from booking flow

### Team
- [x] Dummy staff removed from code (Anri, Marco, Liesl, David)
- [x] Susan Mubatapasango added with real photo
- [x] Vimbai Shumba added with real photo (name updated)
- [x] Team page photo display fixed (portrait aspect ratio 4:5)
- [x] Homepage team section updated with real names
- [x] Static fallback reviews updated to use real staff names
- [x] Dummy therapists in Supabase deactivated — SQL: `UPDATE public.therapists SET is_active = false`
- [x] Susan and Vimbai inserted into Supabase therapists table

### Reviews
- [x] Reviews page displays real approved reviews from database
- [x] Open review form — anyone can submit without appointment token
- [x] Token-based review flow — post-appointment verified reviews still work
- [x] Testimonials section on homepage hidden until 3+ real approved reviews exist
- [x] Rating summary card is dynamic (real avg, real count) and hidden when no reviews
- [x] Static fallback reviews on /reviews page remain (shown only when no DB reviews)

### Emails
- [x] Password reset email template designed (`src/emails/supabase-reset-password.html`)
- [x] Paste into Supabase → Authentication → Email Templates → Reset Password

### Database
- [x] All services set to 45 min (`UPDATE public.services SET duration_min = 45`)
- [x] Admin user created in Supabase Auth + profile role set to 'admin'

---

## Pending — Needs Real Info From Client

### Contact Details (19+ instances across codebase)
- [ ] Real phone number — replaces `+264 64 000 0000`
- [ ] Real WhatsApp number — replaces `264640000000` and `264811234567`
- [ ] Real email address — replaces `info@physioflex.na`
- [ ] Notifications from-email — replaces `appointments@physioflex.na` in `src/lib/notifications.ts`
- [ ] Bank account number — replaces `000 000 0000` in invoice PDF
- [ ] Company registration number — replaces `Reg. No. XXXXXXX` in email invoices
- [ ] VAT number — replaces `VAT No. XXXXXXX` in email invoices

### Staff
- [ ] HPCNA registration numbers for Susan Mubatapasango and Vimbai Shumba

### External Links
- [ ] Real Google review URL — replaces `g.page/r/physioflex/review`
- [ ] Real Facebook page URL — replaces `facebook.com/physioflex.na`
- [ ] Real Instagram page URL — replaces `instagram.com/physioflex.na`

### Images (real clinic photos needed)
- [ ] Gallery — 9 Pexels stock photos in `src/app/gallery/gallery-client.tsx`
- [ ] Blog cover images — 6 Pexels photos in `src/lib/blog-data.ts`
- [ ] Homepage hero/about image — 1 Pexels photo in `src/app/page.tsx`

### Blog Content
- [ ] Blog post authors — still show `Anri van der Berg` and `Marco Shiimi`
- [ ] Blog cover images (see Images above)

### Dummy Content Still Live (low priority — only visible when no DB data)
- [ ] 8 static fallback reviews on `/reviews` page (Sarah M., Johan V., etc.)
- [ ] 2 success stories on `/reviews` page (Johan V., Elke B.)
- [ ] Homepage stats: `10+` years experience and `98%` satisfaction still hardcoded

### Domain
- [ ] Update `https://physioflex.na` to real production domain once live
- [ ] Add production domain to Supabase → Authentication → Redirect URLs
- [ ] Update sitemap and robots.txt base URL
