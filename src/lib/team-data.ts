export interface TeamMember {
  id: string;
  name: string;
  title: string;
  hpcnaNumber: string;
  photo: string;
  specialisations: string[];
  languages: string[];
  bio: string;
  yearsExperience: number;
}

export const team: TeamMember[] = [
  {
    id: "susan-mubatapasango",
    name: "Susan Mubatapasango",
    title: "Senior Physiotherapist",
    hpcnaNumber: "HPCNA Registered",
    photo: "/susan-mubatapasango.png",
    specialisations: [
      "Sports Rehabilitation",
      "Manual Therapy",
      "Pain Management",
      "Post-Surgical Rehab",
      "Dry Needling",
      "Paediatric Physio",
    ],
    languages: ["English"],
    bio: "Susan brings over 15 years of clinical experience across a wide range of physiotherapy disciplines. Her patient-centred approach combines evidence-based techniques with genuine compassion, ensuring every patient receives a tailored treatment plan that supports real, lasting recovery. Susan is a founding member of Physioflex and is dedicated to raising the standard of physiotherapy care in Namibia.",
    yearsExperience: 15,
  },
  {
    id: "vimbai",
    name: "Vimbai",
    title: "Senior Physiotherapist",
    hpcnaNumber: "HPCNA Registered",
    photo: "/vimbai.jpeg",
    specialisations: [
      "Sports Rehabilitation",
      "Manual Therapy",
      "Pain Management",
      "Post-Surgical Rehab",
      "Dry Needling",
      "Neurological Rehab",
    ],
    languages: ["English"],
    bio: "With more than 15 years of hands-on clinical practice, Vimbai is an experienced and dedicated physiotherapist committed to helping patients regain function, confidence, and quality of life. Her broad expertise spans sports injuries, chronic pain, neurological rehabilitation, and post-surgical recovery, making her a trusted practitioner for patients of all ages and backgrounds.",
    yearsExperience: 15,
  },
];
