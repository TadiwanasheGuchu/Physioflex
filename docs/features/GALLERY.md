# Feature Spec — Clinic Gallery

## Goal
Show the physical space before a patient arrives. A clean, professional clinic environment is a major trust signal — especially for new patients who have never visited. The gallery also builds local brand recognition in Swakopmund.

## Pages & Sections
- **Homepage teaser** — masonry or 3-image strip preview
- **Full gallery page** — `/gallery` with category filter and lightbox

---

## Homepage Teaser (Section)
- Placed between **Testimonials** and **Booking CTA**
- Eyebrow: "OUR CLINIC"
- Headline: "A space designed for your recovery"
- Layout: 3-image asymmetric grid
  ```
  [Large image — left, 2/3 width, tall]   [Small image — top right]
                                            [Small image — bottom right]
  ```
- CTA: "Take a tour →" linking to `/gallery`
- Image overlay on hover: slight darkening + "View gallery" label

---

## Full Gallery Page (`/gallery`)

### Hero
- White background, no gradient mesh (keep focus on visuals)
- Headline: "Inside Physioflex"
- Subtext: "Our Swakopmund clinic is equipped with modern rehabilitation equipment in a calm, welcoming environment."

### Filter Bar
```
All | Clinic Space | Equipment | Treatment Rooms | Team in Action
```

### Gallery Grid
- Masonry layout (CSS columns or library)
- 3-column desktop, 2-column tablet, 1-column mobile
- Click any image → lightbox with prev/next navigation

### Lightbox
- Full-screen overlay, dark bg (`#0d253d` at 95% opacity)
- Image centred, max 90vw × 90vh
- Caption: image title + category tag
- Keyboard: ← → to navigate, Esc to close
- Close button: top-right X

---

## Image Categories & Placeholder Content

### Clinic Space (5–8 images)
- Reception/waiting area
- Treatment room overview
- Exterior / entrance
- Courtyard or garden view (if applicable)

### Equipment (4–6 images)
- Treatment table
- Exercise equipment (bands, balls, weights)
- Ultrasound/TENS machines
- Parallel bars or treadmill

### Treatment Rooms (3–4 images)
- Clean empty room shots
- Detail shots of equipment laid out

### Team in Action (use Pexels — non-AI, real physiotherapy photos)
- Therapist working with patient (treatment scenes)
- Consultation at desk
- Exercise guidance

---

## Image Sources
Until real clinic photos are taken, use Pexels:
- Search: "physiotherapy clinic interior", "physical therapy room", "rehabilitation equipment"
- Search: "physiotherapist patient" for treatment scenes
- All from `images.pexels.com` — already in `next.config.ts` remotePatterns

---

## Component Spec

```tsx
// Lightbox: use 'yet-another-react-lightbox' or build a simple custom one
// Install: npm install yet-another-react-lightbox

// Gallery grid: CSS columns
<div className="columns-1 md:columns-2 lg:columns-3 gap-4">
  {images.map(img => (
    <div key={img.id} className="mb-4 break-inside-avoid cursor-pointer group"
      onClick={() => openLightbox(img)}>
      <div className="relative overflow-hidden rounded-xl">
        <Image src={img.src} alt={img.alt} width={600} height={400}
          className="w-full object-cover group-hover:scale-105 transition-transform duration-300" />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
          <span className="text-white opacity-0 group-hover:opacity-100 transition-opacity text-sm font-medium">
            View
          </span>
        </div>
      </div>
    </div>
  ))}
</div>
```

---

## Design Tokens
- Page bg: `#ffffff`
- Filter pills: same active/inactive system as CONDITIONS.md
- Image corners: `rounded-xl` (12px)
- Hover scale: `scale-105` with `duration-300`
- Lightbox overlay: `bg-[#0d253d]/95`

---

## Photography Brief (for real shoot)
When Physioflex has a photography session, capture:
- Wide shots of rooms with natural light (morning is best for Swakopmund light)
- Detail shots of hands/tools — these perform well on social media
- Candid treatment scenes with patient consent
- Portrait-orientation shots of key equipment for the masonry layout
- Avoid staged or stiff poses — natural and warm tone preferred
