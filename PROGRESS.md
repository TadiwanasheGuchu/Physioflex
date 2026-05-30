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
- [x] Dummy staff removed (Anri, Marco, Liesl, David)
- [x] Susan Mubatapasango added with real photo
- [x] Vimbai added with real photo
- [x] Team page photo display fixed (portrait aspect ratio 4:5)
- [x] Homepage team section updated with real names
- [x] Static fallback reviews updated to use real staff names

### Reviews
- [x] Reviews page displays real approved reviews from database
- [x] Open review form — anyone can submit without appointment token
- [x] Token-based review flow — post-appointment verified reviews still work
- [x] Testimonials section on homepage hidden until 3+ real approved reviews exist
- [x] Rating summary card is dynamic (real avg, real count) and hidden when no reviews

### Emails
- [x] Password reset email template designed (`src/emails/supabase-reset-password.html`)
- [x] Paste into Supabase → Authentication → Email Templates → Reset Password

### Database
- [x] All services set to 45 min (`UPDATE public.services SET duration_min = 45`)
- [x] Admin user created in Supabase Auth + profile role set to 'admin'

---

## Pending (see REPLACE.md for full list)

### Real Contact Details Needed
- [ ] Real phone number (currently `+264 64 000 0000`)
- [ ] Real WhatsApp number (currently `264640000000` / `264811234567`)
- [ ] Real email address (currently `info@physioflex.na`)
- [ ] Bank account number for invoices (currently `000 000 0000`)

### Staff
- [ ] HPCNA registration numbers for Susan and Vimbai
- [ ] Vimbai's full last name

### Images
- [ ] Real clinic photos to replace Pexels stock images (gallery, blog, homepage hero)

### External Links
- [ ] Google review URL (currently placeholder)
- [ ] Real Facebook page URL
- [ ] Real Instagram page URL

### Domain
- [ ] Update `https://physioflex.na` to real production domain once live
- [ ] Add production domain to Supabase redirect URLs
