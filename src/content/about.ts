// About pop-up content (from the About view in the claude.ai design project).

export const bio = {
  name: 'Skylar Ziyi Wang',
  nameZh: '王子怡',
  lead: 'Skylar is an interaction designer and creative technologist born in Shanghai, currently based between NYC and Dallas.',
  paras: [
    'By day, she works in fintech, untangling complex payment systems and turning them into simple user experiences. By night, she explores new ways of storytelling through code, design, writing, and physical making.',
    'She’s drawn to the in-between spaces where abstract systems and ideology meet stories — creating experiences that feel poetic yet understandable, and emotionally resonant.',
  ],
}

export interface Role { role: string; org: string; when: string; where: string; points: string[] }

export const experience: { label: string; items: Role[] }[] = [
  { label: 'Work', items: [
    { role: 'Product Designer', org: 'Worldpay', when: '06.2024 – Present', where: 'Remote', points: [
      'Owned the end-to-end setup experience for the SMB merchant portal — an application tracker, 4 onboarding features and a cross-channel communication strategy — cutting merchant activation time from 21 to 13 days.',
      'Leading design for an upcoming reconciliation feature that helps merchants match payouts to sales; validated concepts through interviews with 10 merchants and internal ops teams, and aligned product and engineering on scope.',
      'Led the SMB portal rebrand and design-token migration, using Claude Code to audit and cluster existing screen patterns. Contributed new components to the design system, met WCAG 2.1 AA and raised CSAT by 8%.',
      'Rebuilt the merchant mobile app’s login flow and information architecture, raising the iOS rating from 2.4 to 3.9.',
    ] },
    { role: 'Interaction Designer & Technologist', org: 'GE Appliances', when: '05.2022 – 05.2023', where: 'Louisville, KY', points: [
      'Revamped the UI components for the SmartHQ IoT mobile app design system, with accessibility guidelines for 11 product lines and 1k+ appliance models.',
      'Streamlined the smart cooking feature for 125+ ingredients across 3 brands and handed off to engineering, improving the customer success rate by 30%.',
      'Prototyped and tested an AR concept to enhance device commissioning, increasing first-time smart appliance pairing success rates.',
    ] },
    { role: 'Digital Designer', org: 'LISH London', when: '02.2020 – 02.2021', where: 'London, UK', points: [
      'Designed web, newsletter and multi-channel campaign creative, and co-led an influencer collaboration strategy that grew Instagram followers by 12%.',
    ] },
  ] },
  { label: 'Freelance', items: [
    { role: 'Designer & Technologist', org: 'School for Social Research', when: '04.2022 – 04.2024', where: 'New York, NY', points: [
      'Designed and developed a web interface with 200+ participants’ data using p5.js for children’s socio-economic research.',
      'Led the web team designing the thesis projects website, optimizing the cross-device experience for the work of 150+ students using Figma and WordPress.',
    ] },
    { role: 'Founding Product Designer', org: 'Meechu Classmate Finder', when: '01.2021 – 08.2021', where: 'Boston, MA', points: [
      'Led the web and mobile interface design for “Meechu”, a classmate-finding app for Boston University students, growing to 2k+ active users.',
    ] },
  ] },
]

export const skills = [
  { title: 'Design & prototyping', items: ['Figma', 'Claude', 'Cursor', 'GitHub Copilot', 'Jira', 'Webflow', 'Adobe Creative Suite', 'Cinema 4D'] },
  { title: 'Tech', items: ['JavaScript', 'React', 'TypeScript', 'Node.js', 'HTML & CSS', 'Arduino', 'Unity', 'SparkAR'] },
  { title: 'Research', items: ['Journey mapping', 'Info architecture', 'Interviews', 'Contextual inquiry', 'User testing', 'A/B testing'] },
]

export const awards = [
  { event: 'Milan Design Week', work: 'Exhibited “Buzz Beyond Border”', result: 'Interactive installation' },
  { event: 'Wonderville', work: 'Exhibited “Museum of Remaking Hanzi”', result: 'Learning tool' },
  { event: 'MIT Mixed Reality Hack', work: '“PlantAR”', result: 'Hardware track winner' },
  { event: 'IBM Quantum Design Jam', work: '“Bio × Bits”', result: 'Honorable mention' },
  { event: 'ShapesXR Hack', work: '“GrindMasters” VR game', result: '3rd place' },
]

export const education = [
  { school: 'The New School Parsons', when: '2021 – 2024', degree: 'MFA, Design and Technology', note: 'GPA 3.98 / 4 · Scholarship award' },
  { school: 'Boston University', when: '2017 – 2021', degree: 'BA, Advertising & Economics', note: 'Minor in Visual Art · Dean’s List · Cum Laude' },
]
