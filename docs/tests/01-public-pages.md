# 01 — Public Pages

No login required. Test in a private/incognito window to avoid cached sessions.

---

## Homepage `/`

- [ ] Page loads without errors
- [ ] Navigation bar visible with logo and links
- [ ] Hero section renders (headline, subtitle, CTA buttons)
- [ ] **Book Now** button links to `/book`
- [ ] Services section lists available services
- [ ] Team section shows Susan Mubatapasango and Vimbai Shumba with photos
- [ ] Stats section shows live counts (patients, appointments, therapists)
- [ ] Testimonials section is hidden (shows only when 3+ approved reviews exist)
- [ ] Footer shows correct address: Shop Nr 2, Spar Ocean View Shopping Centre, Eugene Muller Street, Swakopmund
- [ ] Footer working hours: Mon–Fri 08:00–18:00
- [ ] Footer medical aids listed: NHP, NMC, Named, Prosperity, Napotel, GemHealth
- [ ] Mobile layout — hamburger menu opens and closes

---

## Team `/team`

- [ ] Page loads
- [ ] Susan Mubatapasango card shows with photo and title
- [ ] Vimbai Shumba card shows with photo and title
- [ ] Photos display in portrait (4:5) ratio — not stretched or cropped awkwardly
- [ ] No dummy staff visible (Anri, Marco, Liesl, David)

---

## Services (public view)

- [ ] Services are visible in the booking flow at `/book`
- [ ] Service prices are NOT shown on any public page
- [ ] Service duration is NOT shown in the booking flow

---

## Blog `/blog`

- [ ] Blog listing page loads
- [ ] At least 1 post card is visible
- [ ] Clicking a post card opens the detail page `/blog/[slug]`
- [ ] Post detail page shows title, body, and estimated read time

---

## Conditions `/conditions`

- [ ] Conditions listing page loads
- [ ] Clicking a condition opens `/conditions/[slug]`
- [ ] Detail page renders content without errors

---

## Gallery `/gallery`

- [ ] Page loads
- [ ] Images display in a grid
- [ ] No broken image placeholders

---

## Reviews `/reviews`

- [ ] Page loads
- [ ] If approved reviews exist in DB → they display
- [ ] If no DB reviews → static fallback reviews display
- [ ] Star rating summary card is hidden when no real reviews exist
- [ ] **Leave a Review** button visible and links to review form

---

## Review Submission `/reviews/submit` or inline form

- [ ] Form loads with name, rating (stars), and comment fields
- [ ] Submitting without required fields shows validation error
- [ ] Valid submission shows success message
- [ ] Submitted review appears in Admin → Content → Reviews with status **pending**

---

## Contact `/contact`

- [ ] Page loads
- [ ] Address, phone, email, and hours are displayed
- [ ] Google Maps embed loads and shows correct pin location (-22.640907, 14.537624)
- [ ] Contact form (if present) accepts input

---

## Symptom Check `/symptom-check`

- [ ] Page loads
- [ ] Symptom checker input is functional
- [ ] AI response returns without error (requires API key configured)

---

## Resources `/resources`

- [ ] Page loads
- [ ] Resource cards or links are visible

---

## Privacy Policy `/privacy`

- [ ] Page loads without errors

---

## 404 Page

- [ ] Go to `/this-page-does-not-exist`
- [ ] Custom 404 page shows (not a raw Next.js error)
- [ ] Link back to homepage works
