export type BlogCategory =
  | "Injury Prevention"
  | "Recovery Tips"
  | "Education"
  | "Lifestyle"
  | "Exercise"
  | "FAQ";

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  category: BlogCategory;
  author: string;
  authorTitle: string;
  publishedAt: string;
  readTime: string;
  coverImage: string;
  content: ContentBlock[];
}

export type ContentBlock =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "quote"; text: string }
  | { type: "cta"; text: string };

export const categoryMeta: Record<BlogCategory, { bg: string; text: string }> = {
  "Injury Prevention": { bg: "#ccfbf1", text: "#0f766e" },
  "Recovery Tips": { bg: "#fef3c7", text: "#92400e" },
  Education: { bg: "#e0e7ff", text: "#3730a3" },
  Lifestyle: { bg: "#fdf4f0", text: "#9b6829" },
  Exercise: { bg: "#fce7f3", text: "#9d174d" },
  FAQ: { bg: "#f1f5f9", text: "#475569" },
};

export const blogPosts: BlogPost[] = [
  {
    slug: "lower-back-pain-exercises",
    title: "5 exercises for lower back pain you can do at home",
    excerpt:
      "Lower back pain is one of the most common conditions we treat at Physioflex. These five exercises can help you manage pain and strengthen your spine between sessions.",
    category: "Injury Prevention",
    author: "Anri van der Berg",
    authorTitle: "Senior Physiotherapist",
    publishedAt: "2026-05-10",
    readTime: "5 min",
    coverImage:
      "https://images.pexels.com/photos/4506072/pexels-photo-4506072.jpeg",
    content: [
      {
        type: "p",
        text: "Lower back pain affects around 80% of people at some point in their lives. In Namibia, where many people spend long hours sitting at desks or performing manual labour, the spine is under constant strain. The good news: targeted exercise is one of the most effective treatments available.",
      },
      {
        type: "h2",
        text: "Before you start",
      },
      {
        type: "p",
        text: "These exercises are suitable for non-specific lower back pain. If you have acute severe pain, recent surgery, or pain radiating down your leg with numbness, please book an assessment with one of our physiotherapists before starting any exercise programme.",
      },
      {
        type: "h2",
        text: "Exercise 1: Cat-Cow Stretch",
      },
      {
        type: "p",
        text: "Start on all fours with your hands under your shoulders and knees under your hips. Slowly arch your back upward (cat), hold for 2 seconds, then let it sag downward (cow), hold for 2 seconds. Repeat 10 times. This exercise gently mobilises the lumbar spine and reduces stiffness.",
      },
      {
        type: "h2",
        text: "Exercise 2: Knee-to-Chest Stretch",
      },
      {
        type: "p",
        text: "Lie on your back with knees bent. Bring one knee to your chest, holding behind the thigh, and hold for 20 seconds. Repeat with the other leg, then both together. This stretch targets the lower back muscles and hip flexors.",
      },
      {
        type: "h2",
        text: "Exercise 3: Pelvic Tilts",
      },
      {
        type: "p",
        text: "Lie on your back with knees bent and feet flat. Gently flatten your lower back against the floor by tightening your abdominals — imagine pressing your belly button to the floor. Hold for 5 seconds, then release. Repeat 15 times. This activates deep core stabilisers.",
      },
      {
        type: "h2",
        text: "Exercise 4: Glute Bridges",
      },
      {
        type: "p",
        text: "From the same position, squeeze your glutes and lift your hips until your body forms a straight line from shoulders to knees. Hold 3 seconds at the top, then lower slowly. Aim for 3 sets of 12. Weak glutes are one of the most common contributors to lower back pain.",
      },
      {
        type: "h2",
        text: "Exercise 5: Bird-Dog",
      },
      {
        type: "p",
        text: "Back on all fours, extend your right arm and left leg simultaneously, keeping your core tight and spine neutral. Hold 3 seconds, then alternate sides. Aim for 10 reps per side. This exercise challenges your deep spinal stabilisers and improves balance.",
      },
      {
        type: "quote",
        text: "Consistency beats intensity. Five minutes of gentle exercise done daily is far more valuable than an hour done once a week.",
      },
      {
        type: "h2",
        text: "When should I see a physiotherapist?",
      },
      {
        type: "ul",
        items: [
          "Pain lasting more than 6 weeks despite home exercise",
          "Pain radiating below the knee",
          "Numbness or tingling in the leg or foot",
          "Bladder or bowel changes alongside back pain",
          "Pain that wakes you from sleep consistently",
        ],
      },
      {
        type: "cta",
        text: "If your back pain is persisting, our team at Physioflex can assess the root cause and build a plan that works. Book an appointment today.",
      },
    ],
  },
  {
    slug: "after-acl-surgery-namibia",
    title: "What to expect in ACL surgery recovery",
    excerpt:
      "ACL reconstruction is a major procedure. Here's an honest timeline of what the recovery looks like and how physiotherapy helps at each stage.",
    category: "Recovery Tips",
    author: "Marco Shiimi",
    authorTitle: "Sports Rehabilitation Specialist",
    publishedAt: "2026-04-28",
    readTime: "7 min",
    coverImage:
      "https://images.pexels.com/photos/20860577/pexels-photo-20860577.jpeg",
    content: [
      {
        type: "p",
        text: "An ACL (anterior cruciate ligament) tear is one of the most feared injuries in sport. The surgery is relatively straightforward — the real work is the 9–12 months of rehabilitation that follows. As someone who has guided dozens of Namibian athletes through ACL recovery, I want to give you an honest picture of what to expect.",
      },
      {
        type: "h2",
        text: "Phase 1: Weeks 1–6 — Control swelling, restore range of motion",
      },
      {
        type: "p",
        text: "In the first six weeks, the goal is not strength — it is settling the knee down. You will work on reducing swelling with ice and elevation, regaining the ability to fully straighten and gradually bend the knee, and activating the quadriceps muscle which often goes into 'shutdown' after knee surgery.",
      },
      {
        type: "h2",
        text: "Phase 2: Weeks 6–16 — Build strength and proprioception",
      },
      {
        type: "p",
        text: "Once the graft is anchoring in (biologically, around 8–12 weeks), we progressively load the leg. Squats, leg press, single-leg exercises, and balance training form the core of this phase. The goal is symmetry: your operated leg should match your unaffected leg in strength before you progress.",
      },
      {
        type: "h2",
        text: "Phase 3: Weeks 16–36 — Running, agility, and sport-specific training",
      },
      {
        type: "p",
        text: "Return to running is a milestone, not a finish line. We use a structured return-to-run protocol and gradually reintroduce cutting, pivoting, and sport-specific movements. Psychological readiness is as important as physical readiness at this stage.",
      },
      {
        type: "quote",
        text: "The graft is actually at its weakest at 6–8 weeks when it feels the best. This is why self-guided recovery is risky — the graft's biology doesn't match how you feel.",
      },
      {
        type: "h2",
        text: "Phase 4: Months 9–12 — Return to competition",
      },
      {
        type: "p",
        text: "Return to competitive sport should not happen before 9 months, and evidence suggests 12 months significantly reduces the risk of re-injury. We use return-to-sport testing (hop tests, strength assessments) to make this decision objectively, not by feel.",
      },
      {
        type: "h2",
        text: "Common mistakes that slow recovery",
      },
      {
        type: "ul",
        items: [
          "Returning to running before the quad is strong enough",
          "Skipping sessions when the knee 'feels fine'",
          "Not addressing hip and glute weakness",
          "Returning to sport too early based on how the knee feels",
          "Comparing your timeline to someone else's",
        ],
      },
      {
        type: "cta",
        text: "Whether you're preparing for surgery or already in recovery, our sports rehabilitation team can guide you through every phase. Book your ACL assessment today.",
      },
    ],
  },
  {
    slug: "dry-needling-explained",
    title: "Dry needling: what it is and who it helps",
    excerpt:
      "Dry needling uses thin needles to target trigger points in muscle. Here's how it works and whether it could help your pain.",
    category: "Education",
    author: "Anri van der Berg",
    authorTitle: "Senior Physiotherapist",
    publishedAt: "2026-04-15",
    readTime: "4 min",
    coverImage:
      "https://images.pexels.com/photos/20860586/pexels-photo-20860586.jpeg",
    content: [
      {
        type: "p",
        text: "When patients hear 'needles', they often tense up. But dry needling is one of the most effective tools we have for releasing stubborn muscle tension and reducing chronic pain — and most patients are surprised by how little discomfort it causes.",
      },
      {
        type: "h2",
        text: "What is dry needling?",
      },
      {
        type: "p",
        text: "Dry needling involves inserting a thin, sterile needle (the same type used in acupuncture) into a trigger point — a hyper-irritable knot within a muscle band. Unlike acupuncture, which is based on Traditional Chinese Medicine meridian theory, dry needling targets specific muscle anatomy and neurophysiology.",
      },
      {
        type: "h2",
        text: "What does it feel like?",
      },
      {
        type: "p",
        text: "Most patients feel very little on needle insertion. When the needle reaches a trigger point, you may experience a 'twitch response' — a brief involuntary muscle contraction. This is actually a good sign, indicating the needle has found its target. After the session, mild muscle soreness lasting 24–48 hours is normal.",
      },
      {
        type: "h2",
        text: "Who benefits from dry needling?",
      },
      {
        type: "ul",
        items: [
          "Neck and upper trapezius tension (desk workers, particularly common in Swakopmund's office population)",
          "Chronic lower back pain not responding to other treatments",
          "Headaches originating from cervical trigger points",
          "Shoulder impingement where rotator cuff muscles are tight",
          "Calf and hamstring tightness in runners and cyclists",
          "Plantar fasciitis and heel pain",
        ],
      },
      {
        type: "h2",
        text: "Is it safe?",
      },
      {
        type: "p",
        text: "Yes, when performed by a trained physiotherapist. At Physioflex, all practitioners who perform dry needling have completed advanced post-graduate certification. We use single-use, sterile needles, and the technique is avoided in patients on blood thinners, those with needle phobia, or during pregnancy.",
      },
      {
        type: "quote",
        text: "Dry needling is a tool, not a cure. It works best as part of a broader treatment plan that includes exercise and postural work.",
      },
      {
        type: "cta",
        text: "Wondering if dry needling is right for your condition? Book a consultation and we'll assess whether it fits your treatment plan.",
      },
    ],
  },
  {
    slug: "desk-posture-swakopmund",
    title: "Desk worker's guide to avoiding neck and shoulder pain",
    excerpt:
      "Hours at a desk without proper setup leads to a predictable cascade of neck, shoulder, and back pain. Here's how to set yourself up correctly.",
    category: "Lifestyle",
    author: "Liesl Haussmann",
    authorTitle: "Manual Therapy Specialist",
    publishedAt: "2026-03-22",
    readTime: "6 min",
    coverImage:
      "https://images.pexels.com/photos/4506072/pexels-photo-4506072.jpeg",
    content: [
      {
        type: "p",
        text: "Swakopmund's growing professional class — government offices, tourism companies, fishing industry admin — has brought a surge in what we call 'desk worker syndrome': a predictable pattern of neck stiffness, upper trapezius tension, and shoulder aching that builds over months of poor workstation setup.",
      },
      {
        type: "h2",
        text: "The ideal desk setup",
      },
      {
        type: "ul",
        items: [
          "Monitor top at eye level — not looking down at a laptop screen",
          "Chair height so feet are flat on the floor and thighs horizontal",
          "Elbows at 90° with the keyboard and mouse close to the body",
          "Lower back supported by the chair's lumbar support or a rolled towel",
          "Screen an arm's length away",
        ],
      },
      {
        type: "h2",
        text: "The 20-20-20 rule",
      },
      {
        type: "p",
        text: "Every 20 minutes, look at something 20 feet (6 metres) away for 20 seconds. This rests your eye muscles. More importantly, use this break to roll your shoulders back, gently retract your chin, and take three deep breaths. These micro-breaks are more effective than one longer break.",
      },
      {
        type: "h2",
        text: "Three stretches you can do at your desk",
      },
      {
        type: "ul",
        items: [
          "Chin tucks: gently draw the chin straight back (creating a 'double chin'), hold 5 seconds, repeat 10 times — counteracts forward head posture",
          "Upper trap stretch: tilt the ear toward the shoulder, apply gentle pressure with the same-side hand, hold 30 seconds each side",
          "Chest opener: clasp hands behind your back, gently squeeze shoulder blades together, look slightly upward — opens the chest that sitting closes",
        ],
      },
      {
        type: "h2",
        text: "When stretches aren't enough",
      },
      {
        type: "p",
        text: "If neck pain has been present for more than 6 weeks, is accompanied by headaches more than twice a week, or has started radiating into the arm, it's time to get a proper assessment. These are signs of joint restriction or early disc involvement that stretching alone won't resolve.",
      },
      {
        type: "quote",
        text: "The best posture is your next posture. Movement variety is more important than maintaining a 'perfect' static position.",
      },
      {
        type: "cta",
        text: "We offer workstation assessment as part of our initial consultation. Book with Liesl or the team to get your setup and posture evaluated.",
      },
    ],
  },
  {
    slug: "sports-warm-up-routine",
    title: "The warm-up routine every Namibian athlete should know",
    excerpt:
      "A proper warm-up isn't a slow jog. Here's the evidence-based routine that prepares your body for sport and significantly reduces injury risk.",
    category: "Exercise",
    author: "Marco Shiimi",
    authorTitle: "Sports Rehabilitation Specialist",
    publishedAt: "2026-03-05",
    readTime: "5 min",
    coverImage:
      "https://images.pexels.com/photos/20860587/pexels-photo-20860587.jpeg",
    content: [
      {
        type: "p",
        text: "Namibian sport is serious. From the Coastal League football teams in Swakopmund to the athletes competing at national level, there is real physical demand being placed on bodies that are often not properly prepared. A 5-minute slow jog before sport is not a warm-up — it's a habit that leaves injury risk on the table.",
      },
      {
        type: "h2",
        text: "Phase 1: Raise the temperature (3 minutes)",
      },
      {
        type: "p",
        text: "Start with light cardiovascular activity: jogging, skipping, or cycling. The goal is to literally raise muscle temperature (which improves elasticity and nerve conduction speed) and elevate heart rate to begin shifting blood to working muscles. At the end of this phase, you should be warm but not breathing hard.",
      },
      {
        type: "h2",
        text: "Phase 2: Dynamic mobility (4 minutes)",
      },
      {
        type: "ul",
        items: [
          "Leg swings (forward/back and side-to-side) — 10 each direction",
          "Hip circles — 10 each direction",
          "Arm circles and cross-body reaches — 10 each direction",
          "Walking lunges with torso rotation — 8 each leg",
          "Lateral shuffles — 2 × 10 metres",
        ],
      },
      {
        type: "h2",
        text: "Phase 3: Activation (3 minutes)",
      },
      {
        type: "p",
        text: "Activate the key muscle groups for your sport. For football and running sports: single-leg glute bridges (10 each side), banded clamshells (15 each side), and calf raises (20 reps). For throwing sports: external rotation band exercises and scapular retractions (15 reps each). These activate the stabilisers that protect joints under load.",
      },
      {
        type: "h2",
        text: "Phase 4: Sport-specific prep (2 minutes)",
      },
      {
        type: "p",
        text: "Ramp up to match intensity. Sprint progressions (50%, 75%, 90% effort), direction changes, or position-specific movements. The body's neuromuscular system needs to be primed for the speed and force it's about to experience.",
      },
      {
        type: "quote",
        text: "The FIFA 11+ warm-up programme has been shown to reduce injury rates in football by up to 50%. It takes 20 minutes and costs nothing.",
      },
      {
        type: "h2",
        text: "Common warm-up mistakes",
      },
      {
        type: "ul",
        items: [
          "Static stretching before sport (reduces power output — save it for cool-down)",
          "Rushing through the phases",
          "Skipping activation because 'it takes too long'",
          "Not adapting the warm-up to temperature (Swakopmund's coastal wind makes muscles cold faster)",
        ],
      },
      {
        type: "cta",
        text: "If you're dealing with a recurring sports injury, our team can help identify whether your warm-up and movement patterns are contributing. Book a sports assessment.",
      },
    ],
  },
  {
    slug: "how-many-physio-sessions",
    title: "How many physiotherapy sessions do I actually need?",
    excerpt:
      "One of the most common questions we get. The honest answer depends on several factors — here's how to think about it.",
    category: "FAQ",
    author: "Anri van der Berg",
    authorTitle: "Senior Physiotherapist",
    publishedAt: "2026-02-18",
    readTime: "4 min",
    coverImage:
      "https://images.pexels.com/photos/5793651/pexels-photo-5793651.jpeg",
    content: [
      {
        type: "p",
        text: "This is probably the question I'm asked most often during initial consultations: 'How many sessions will I need?' It's a completely reasonable question — patients want to plan their time and budget. The honest answer is: it depends, but there are useful benchmarks.",
      },
      {
        type: "h2",
        text: "The general benchmarks",
      },
      {
        type: "ul",
        items: [
          "Acute muscle strain or mild sprain: 3–6 sessions over 3–4 weeks",
          "Chronic lower back pain or neck pain: 6–12 sessions over 6–8 weeks",
          "Post-surgical rehabilitation (knee or hip replacement): 12–20 sessions over 3–6 months",
          "ACL reconstruction: 30–40 sessions across 9–12 months",
          "Neurological conditions (ongoing): Monthly maintenance after initial intensive phase",
        ],
      },
      {
        type: "h2",
        text: "What makes recovery faster?",
      },
      {
        type: "ul",
        items: [
          "Doing your home exercises consistently between sessions",
          "Addressing the root cause, not just the symptoms",
          "Starting treatment early (before the problem becomes chronic)",
          "Good sleep and nutrition, which supports tissue healing",
          "A positive, active mindset about recovery",
        ],
      },
      {
        type: "h2",
        text: "What slows recovery down?",
      },
      {
        type: "ul",
        items: [
          "Skipping home exercises",
          "Returning to full activity too soon",
          "Anxiety or fear of movement (pain catastrophising)",
          "Underlying health conditions that affect healing",
          "Waiting too long before seeking treatment",
        ],
      },
      {
        type: "quote",
        text: "Physiotherapy works best when it's a partnership. My job is to give you the right treatment and the right exercises. Your job is to do them.",
      },
      {
        type: "h2",
        text: "Medical aid and sessions",
      },
      {
        type: "p",
        text: "In Namibia, most medical aid schemes (PSEMAS, Namflex, NHP) have annual physiotherapy benefit limits. At Physioflex, we'll work with you to use your benefit efficiently — prioritising the sessions that will have the greatest impact and ensuring you have a solid home programme to continue independently.",
      },
      {
        type: "cta",
        text: "Not sure where to start? Book an initial assessment and we'll give you a clear, honest treatment plan with a realistic timeline.",
      },
    ],
  },
];
