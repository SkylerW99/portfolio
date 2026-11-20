// About pop-up content (from the About view in the claude.ai design project).

export const bio = {
  name: 'Skylar Ziyi Wang',
  nameZh: '王子怡',
  lead: 'Skylar is an interaction designer and creative technologist born in Shanghai, currently based in Dallas.',
  paras: [
    'By day, she works in fintech, untangling complex payment systems and turning them into simple user experiences. By night, she explores new ways of storytelling through code, design, writing, and physical making.',
    'She’s drawn to the in-between spaces where abstract systems and ideology meet stories — creating experiences that feel poetic yet understandable, and emotionally resonant.',
  ],
}

// `projects` are slugs; the About pop-up links each to its case study or art pop-up.
export interface Role { role: string; org: string; when: string; where: string; projects: string[] }

export const experience: { label: string; items: Role[] }[] = [
  { label: 'Work', items: [
    { role: 'Senior Product Designer', org: 'Worldpay', when: '06.2024 – Present', where: 'Remote',
      projects: ['fast-launch', 'reconciliation', 'iq-portal-rebrand', 'iq-mobile-app'] },
    { role: 'Interaction Designer & Technologist', org: 'GE Appliances', when: '05.2022 – 05.2023', where: 'Louisville, KY',
      projects: ['precision-cooking', 'smartHQ-design-system', 'apex', 'ar-commissioning', 'smarthq-onboarding'] },
  ] },
  { label: 'Freelance', items: [
    { role: 'Designer & Technologist', org: 'School for Social Research', when: '04.2022 – 04.2024', where: 'New York, NY',
      projects: ['robin-hood-experiment', 'spiraling-ashore'] },
    { role: 'Founding Product Designer', org: 'Meechu Classmate Finder', when: '01.2021 – 08.2021', where: 'Boston, MA',
      projects: ['meechu-classmate-finder'] },
  ] },
]

export const skills = [
  { title: 'Design & prototyping', items: ['Figma', 'Claude', 'Cursor', 'GitHub Copilot', 'Jira', 'Webflow', 'Adobe Creative Suite', 'Cinema 4D'] },
  { title: 'Tech', items: ['JavaScript', 'React', 'TypeScript', 'Node.js', 'HTML & CSS', 'Arduino', 'Unity', 'SparkAR'] },
  { title: 'Research', items: ['Journey mapping', 'Info architecture', 'Interviews', 'Contextual inquiry', 'User testing', 'A/B testing'] },
]

export const awards = [
  { event: 'NYC Resistor Interactive Show', work: 'Exhibited “Brickpress”', result: 'Generative print tool', slug: 'brickpress' },
  { event: 'Milan Design Week', work: 'Exhibited “Buzz Beyond Border”', result: 'Interactive installation', slug: 'buzz-beyond-border' },
  { event: 'Wonderville', work: 'Exhibited “Museum of Remaking Hanzi”', result: 'Learning tool', slug: 'hanzi-museum' },
  { event: 'MIT Mixed Reality Hack', work: '“PlantAR”', result: 'Hardware track winner', slug: 'plantar' },
  { event: 'IBM Quantum Design Jam', work: '“Bio × Bits”', result: 'Honorable mention', slug: 'bio-bits' },
  { event: 'ShapesXR Hack', work: '“GrindMasters” VR game', result: '3rd place', slug: 'grindmasters' },
]

export const education = [
  { school: 'The New School Parsons', when: '2021 – 2024', degree: 'MFA, Design and Technology' },
  { school: 'Boston University', when: '2017 – 2021', degree: 'BA, Advertising & Economics' },
]
