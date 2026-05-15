export type ConditionCategory =
  | "musculoskeletal"
  | "sports"
  | "neurological"
  | "post-surgical"
  | "paediatric";

export interface Condition {
  id: string;
  name: string;
  category: ConditionCategory;
  description: string;
  symptoms: string[];
  treatmentApproach: string;
  icon: string;
}

export const categoryMeta: Record<
  ConditionCategory,
  { label: string; bg: string; text: string }
> = {
  musculoskeletal: { label: "Musculoskeletal", bg: "#ccfbf1", text: "#0f766e" },
  sports: { label: "Sports", bg: "#fef3c7", text: "#92400e" },
  neurological: { label: "Neurological", bg: "#e0e7ff", text: "#3730a3" },
  "post-surgical": { label: "Post-Surgical", bg: "#fdf4f0", text: "#9b6829" },
  paediatric: { label: "Paediatric", bg: "#fce7f3", text: "#9d174d" },
};

export const conditions: Condition[] = [
  // Musculoskeletal
  {
    id: "lower-back-pain",
    name: "Lower Back Pain",
    category: "musculoskeletal",
    description: "One of the most common conditions we treat — caused by poor posture, muscle strain, or disc problems.",
    symptoms: ["Dull or sharp pain in the lumbar region", "Stiffness after sitting or sleeping", "Pain radiating into the buttocks", "Difficulty standing upright"],
    treatmentApproach: "We combine manual therapy, targeted core strengthening, and postural education to address the root cause and prevent recurrence.",
    icon: "Activity",
  },
  {
    id: "neck-pain",
    name: "Neck Pain & Stiffness",
    category: "musculoskeletal",
    description: "Tension, joint restriction, or disc issues in the cervical spine causing pain and limited movement.",
    symptoms: ["Stiffness turning the head", "Headaches originating at the base of the skull", "Pain radiating into the shoulder or arm", "Muscle spasm"],
    treatmentApproach: "Cervical mobilisation, soft tissue release, and posture correction exercises tailored to your work setup.",
    icon: "User",
  },
  {
    id: "shoulder-impingement",
    name: "Shoulder Impingement",
    category: "musculoskeletal",
    description: "Compression of rotator cuff tendons causing pain with overhead or reaching movements.",
    symptoms: ["Pain lifting the arm above the shoulder", "Weakness carrying objects", "Painful arc between 60–120°", "Night pain when lying on the shoulder"],
    treatmentApproach: "Rotator cuff strengthening, scapular stabilisation, and joint mobilisation to restore pain-free movement.",
    icon: "Zap",
  },
  {
    id: "hip-knee-osteoarthritis",
    name: "Hip & Knee Osteoarthritis",
    category: "musculoskeletal",
    description: "Degenerative joint changes causing pain, stiffness, and reduced function in the hip or knee.",
    symptoms: ["Joint pain that worsens with activity", "Morning stiffness lasting less than 30 minutes", "Crepitus (clicking or grinding)", "Reduced range of motion"],
    treatmentApproach: "Exercise therapy, joint mobilisation, and load management strategies to maintain function and delay surgical intervention.",
    icon: "Shield",
  },
  {
    id: "plantar-fasciitis",
    name: "Plantar Fasciitis",
    category: "musculoskeletal",
    description: "Inflammation of the plantar fascia causing heel pain, especially with the first steps in the morning.",
    symptoms: ["Sharp heel pain on first steps", "Pain after prolonged standing", "Tight calf muscles", "Tenderness at the heel"],
    treatmentApproach: "Stretching programmes, load management, foot taping, and orthotic advice to offload the fascia.",
    icon: "Footprints",
  },
  {
    id: "scoliosis",
    name: "Scoliosis",
    category: "musculoskeletal",
    description: "Abnormal lateral curvature of the spine that can cause back pain and postural imbalances.",
    symptoms: ["Uneven shoulder or hip height", "One shoulder blade more prominent", "Back pain with prolonged sitting", "Visible spinal curve"],
    treatmentApproach: "Scoliosis-specific exercises (SEAS/Schroth method), postural training, and regular monitoring.",
    icon: "Waves",
  },
  // Sports
  {
    id: "acl-meniscus-tears",
    name: "ACL / Meniscus Tears",
    category: "sports",
    description: "Ligament and cartilage injuries of the knee common in cutting and pivoting sports.",
    symptoms: ["Sudden pop at time of injury", "Rapid knee swelling", "Instability or giving way", "Pain with weight bearing"],
    treatmentApproach: "Structured rehabilitation through acute, strengthening, and return-to-sport phases — pre- and post-surgical.",
    icon: "Target",
  },
  {
    id: "rotator-cuff-injuries",
    name: "Rotator Cuff Injuries",
    category: "sports",
    description: "Tears or tendinopathy of the four rotator cuff muscles controlling shoulder stability and rotation.",
    symptoms: ["Shoulder pain with throwing or lifting", "Weakness in internal/external rotation", "Night pain", "Limited overhead reach"],
    treatmentApproach: "Progressive rotator cuff loading, shoulder biomechanics correction, and sport-specific return programming.",
    icon: "Circle",
  },
  {
    id: "tennis-golfers-elbow",
    name: "Tennis / Golfer's Elbow",
    category: "sports",
    description: "Tendinopathy of the forearm extensor or flexor tendons causing outer or inner elbow pain.",
    symptoms: ["Pain gripping or shaking hands", "Tenderness at the elbow", "Weakness carrying objects", "Pain with wrist extension"],
    treatmentApproach: "Eccentric loading, manual therapy, and activity modification to restore tendon capacity.",
    icon: "Dumbbell",
  },
  {
    id: "ankle-sprains",
    name: "Ankle Sprains",
    category: "sports",
    description: "Lateral ligament injuries from rolling the ankle — one of the most common sports injuries.",
    symptoms: ["Outer ankle pain and swelling", "Bruising", "Difficulty weight bearing", "Feeling of instability"],
    treatmentApproach: "RICE protocol in the acute phase, then proprioception training and progressive loading to prevent recurrence.",
    icon: "Footprints",
  },
  {
    id: "hamstring-strains",
    name: "Hamstring Strains",
    category: "sports",
    description: "Muscle tears at the posterior thigh, common in sprinting and kicking sports.",
    symptoms: ["Sudden sharp pain at the back of the thigh", "Swelling or bruising", "Weakness in knee flexion", "Pain sitting on a hard surface"],
    treatmentApproach: "Graded eccentric rehabilitation and neuromuscular control training using the Nordic hamstring protocol.",
    icon: "Flame",
  },
  {
    id: "shin-splints",
    name: "Shin Splints",
    category: "sports",
    description: "Medial tibial stress syndrome — pain along the inner shin from repetitive impact loading.",
    symptoms: ["Shin pain during or after running", "Tenderness along the tibia", "Pain easing with rest", "Mild swelling"],
    treatmentApproach: "Training load reduction, calf and tibialis strengthening, running gait analysis, and gradual return to sport.",
    icon: "TrendingUp",
  },
  // Neurological
  {
    id: "stroke-rehabilitation",
    name: "Stroke Rehabilitation",
    category: "neurological",
    description: "Physiotherapy to restore movement, balance, and function following a stroke.",
    symptoms: ["Weakness or paralysis on one side", "Difficulty walking or balancing", "Muscle stiffness (spasticity)", "Loss of coordination"],
    treatmentApproach: "Neuroplasticity-based movement re-education, task-specific training, and balance rehabilitation with a structured graded programme.",
    icon: "Brain",
  },
  {
    id: "parkinsons",
    name: "Parkinson's Disease",
    category: "neurological",
    description: "Physiotherapy to manage motor symptoms, improve mobility, and maintain independence.",
    symptoms: ["Shuffling gait and freezing episodes", "Rigidity and reduced arm swing", "Postural instability", "Soft voice and reduced facial expression"],
    treatmentApproach: "LSVT BIG therapy principles, cueing strategies, balance training, and falls prevention education.",
    icon: "Brain",
  },
  {
    id: "sciatica",
    name: "Sciatica",
    category: "neurological",
    description: "Compression or irritation of the sciatic nerve causing pain from the lower back into the leg.",
    symptoms: ["Burning or shooting pain down one leg", "Numbness or tingling in the foot", "Weakness in the leg", "Pain worse with sitting"],
    treatmentApproach: "Neural mobilisation, lumbar decompression exercises, and postural correction to take pressure off the nerve root.",
    icon: "Zap",
  },
  // Post-Surgical
  {
    id: "knee-replacement-rehab",
    name: "Knee Replacement Rehab",
    category: "post-surgical",
    description: "Structured recovery programme after total or partial knee replacement surgery.",
    symptoms: ["Post-operative swelling and pain", "Difficulty bending or straightening the knee", "Muscle weakness", "Altered gait pattern"],
    treatmentApproach: "Phase-based rehabilitation from acute swelling management through functional recovery to return to full daily activities.",
    icon: "Shield",
  },
  {
    id: "hip-replacement-rehab",
    name: "Hip Replacement Rehab",
    category: "post-surgical",
    description: "Rehabilitation following total hip arthroplasty to restore strength, movement, and confidence.",
    symptoms: ["Post-surgical pain and stiffness", "Difficulty with stairs and inclines", "Hip flexor weakness", "Fear of dislocation"],
    treatmentApproach: "Hip precaution education, progressive strengthening, gait retraining, and functional task practice.",
    icon: "Shield",
  },
  {
    id: "spinal-surgery-recovery",
    name: "Spinal Surgery Recovery",
    category: "post-surgical",
    description: "Rehabilitation following discectomy, spinal fusion, or decompression surgery.",
    symptoms: ["Post-operative pain at incision site", "Residual leg symptoms", "Core weakness", "Fear of movement"],
    treatmentApproach: "Graduated core stabilisation, neural mobility exercises, and progressive loading within surgical precautions.",
    icon: "Activity",
  },
  // Paediatric
  {
    id: "developmental-delays",
    name: "Developmental Delays (Motor)",
    category: "paediatric",
    description: "Supporting children who are late to reach gross motor milestones such as sitting, crawling, and walking.",
    symptoms: ["Late to sit, crawl, or walk", "Low muscle tone (hypotonia)", "Difficulty with balance", "Clumsiness or coordination problems"],
    treatmentApproach: "Play-based physiotherapy to stimulate motor development, strengthen postural muscles, and coach caregivers.",
    icon: "Star",
  },
  {
    id: "cerebral-palsy",
    name: "Cerebral Palsy",
    category: "paediatric",
    description: "Physiotherapy to maximise function, mobility, and independence for children with cerebral palsy.",
    symptoms: ["Spasticity and muscle tightness", "Balance and coordination difficulties", "Altered walking patterns", "Reduced endurance"],
    treatmentApproach: "Goal-directed functional therapy, stretching, strengthening, and equipment prescription to optimise independence.",
    icon: "Heart",
  },
];
