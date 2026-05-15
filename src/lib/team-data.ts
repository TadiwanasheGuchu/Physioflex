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
    id: "anri-van-der-berg",
    name: "Anri van der Berg",
    title: "Senior Physiotherapist",
    hpcnaNumber: "HPCNA Reg. #PT-2847",
    photo: "https://images.pexels.com/photos/5452293/pexels-photo-5452293.jpeg",
    specialisations: ["Sports Rehabilitation", "Dry Needling", "Pain Management"],
    languages: ["English", "Afrikaans"],
    bio: "Anri brings over 12 years of clinical experience to Physioflex, having trained at the University of Stellenbosch and completed advanced certification in dry needling and sports rehabilitation. She is passionate about empowering patients through education and evidence-based treatment.",
    yearsExperience: 12,
  },
  {
    id: "marco-shiimi",
    name: "Marco Shiimi",
    title: "Sports Rehabilitation Specialist",
    hpcnaNumber: "HPCNA Reg. #PT-3921",
    photo: "https://images.pexels.com/photos/5327585/pexels-photo-5327585.jpeg",
    specialisations: ["Sports Injuries", "ACL Recovery", "Strength & Conditioning"],
    languages: ["English", "Oshiwambo"],
    bio: "Marco is a high-performance sports rehabilitation specialist who has worked with Namibian national athletes and local club teams. His approach combines biomechanical analysis with targeted strengthening to get athletes back on the field faster and safer.",
    yearsExperience: 8,
  },
  {
    id: "liesl-haussmann",
    name: "Liesl Haussmann",
    title: "Manual Therapy Specialist",
    hpcnaNumber: "HPCNA Reg. #PT-4156",
    photo: "https://images.pexels.com/photos/5452201/pexels-photo-5452201.jpeg",
    specialisations: ["Manual Therapy", "Spinal Assessment", "Post-Surgical Rehab"],
    languages: ["English", "Afrikaans", "German"],
    bio: "Liesl completed her postgraduate certification in orthopaedic manual therapy in Cape Town and is one of few practitioners in Namibia with this advanced qualification. She brings a gentle, hands-on approach to treating chronic spinal conditions and post-operative patients.",
    yearsExperience: 10,
  },
  {
    id: "david-naango",
    name: "David Naango",
    title: "Neurological Rehabilitation Specialist",
    hpcnaNumber: "HPCNA Reg. #PT-5033",
    photo: "https://images.pexels.com/photos/5452274/pexels-photo-5452274.jpeg",
    specialisations: ["Neurological Rehab", "Stroke Recovery", "Paediatric Physio"],
    languages: ["English", "Oshiwambo", "Otjiherero"],
    bio: "David specialises in neurological and paediatric physiotherapy, working with patients recovering from stroke, Parkinson's disease, and developmental conditions. He is committed to making quality neurological rehabilitation accessible to all communities in Namibia.",
    yearsExperience: 7,
  },
];
