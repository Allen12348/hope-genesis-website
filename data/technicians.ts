import type { TechnicianProfile } from "@/types";

export const technicians: TechnicianProfile[] = [
  {
    id: "t1",
    name: "Engr. Marco Dela Cruz",
    role: "Lead HVAC Engineer",
    photo:
      "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=800&q=80",
    photoAlt: "Professional portrait of male engineer",
    yearsExperience: 12,
    certifications: [
      "Refrigeration service license (mock)",
      "Work-at-height safety",
      "VRF commissioning workshop",
    ],
    specialties: ["VRF/VRV", "Commercial retrofit", "Leak diagnostics"],
    completedProjects: 186,
    bio: "Leads complex commercial cutovers with a documentation-first mindset — commissioning evidence clients can audit.",
  },
  {
    id: "t2",
    name: "Anna Reyes",
    role: "Senior Service Technician",
    photo:
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80",
    photoAlt: "Professional portrait of female technician",
    yearsExperience: 9,
    certifications: [
      "EPA-style safe handling (training mock)",
      "Electrical fundamentals for HVAC",
      "Customer premises etiquette",
    ],
    specialties: ["Deep cleaning", "Residential premium installs", "PM programs"],
    completedProjects: 412,
    bio: "Known for spotless handovers and owner education — fewer repeat callbacks, happier homes.",
  },
  {
    id: "t3",
    name: "Jon Villarin",
    role: "Industrial Refrigeration Specialist",
    photo:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=800&q=80",
    photoAlt: "Professional portrait of male specialist",
    yearsExperience: 11,
    certifications: ["Cold room safety", "Motor control basics", "Trend logging"],
    specialties: ["Cold chain", "Makeup air", "Panel upgrades"],
    completedProjects: 97,
    bio: "Industrial sites trust his airflow verification discipline — measure first, adjust second.",
  },
];
