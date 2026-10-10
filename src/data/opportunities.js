/**
 * Curated Catalogue of Sample Opportunities for EligibleMe.
 *
 * Notice: All entries in this file are illustrative sample profiles designed
 * for demonstrating local eligibility rules evaluation. They do not represent
 * official active vacancies, guaranteed endorsements, or binding institutional rules.
 */

export const OPPORTUNITY_CATEGORIES = [
  'All Categories',
  'Software development',
  'Java development',
  'Frontend development',
  'Data analytics',
  'Graduate trainee programmes',
  'Internships',
  'Scholarships'
];

export const INITIAL_OPPORTUNITIES = [
  {
    id: 'opp-frontend-intern',
    title: 'Frontend React Developer Intern',
    organization: 'Acme Cloud Solutions (Sample)',
    category: 'Frontend development',
    type: 'Internship',
    location: 'Bengaluru / Remote (India)',
    description: 'Work with the product engineering team to build accessible, high-performance web interfaces using modern React, Tailwind CSS, and component testing.',
    requiredDegree: 'B.Tech',
    minScore: 7.0,
    scoreScale: '10',
    minExperience: 0,
    requiredSkills: ['JavaScript', 'React', 'HTML', 'CSS', 'Git'],
    preferredQualifications: [
      'Experience with TypeScript and Tailwind CSS',
      'Familiarity with Vitest or Jest testing',
      'Personal GitHub project showcase'
    ],
    applicationUrl: 'https://example.com/careers/sample-frontend-intern',
    isSampleData: true,
    sourceDesignation: 'Curated Benchmark Sample',
    deadline: 'Rolling Admission'
  },
  {
    id: 'opp-java-backend-eng',
    title: 'Junior Java Backend Engineer',
    organization: 'FinTech Innovations Lab (Sample)',
    category: 'Java development',
    type: 'Full-time',
    location: 'Hyderabad, India (Hybrid)',
    description: 'Design and maintain high-throughput microservices for digital banking and payment processing using modern Java, Spring Boot, and PostgreSQL.',
    requiredDegree: 'B.Tech',
    minScore: 7.5,
    scoreScale: '10',
    minExperience: 1,
    requiredSkills: ['Java', 'Spring Boot', 'SQL', 'Git', 'REST APIs'],
    preferredQualifications: [
      'Docker containerisation knowledge',
      'Experience with JUnit testing',
      'Understanding of distributed caching and Redis'
    ],
    applicationUrl: 'https://example.com/careers/sample-junior-java-eng',
    isSampleData: true,
    sourceDesignation: 'Curated Benchmark Sample',
    deadline: 'Sample Position'
  },
  {
    id: 'opp-data-analytics-assoc',
    title: 'Associate Data & BI Analyst',
    organization: 'Nexus Analytics Group (Sample)',
    category: 'Data analytics',
    type: 'Full-time',
    location: 'Pune / Mumbai (Hybrid)',
    description: 'Transform operational and customer engagement metrics into actionable business intelligence dashboards, executive reports, and automated ETL pipelines.',
    requiredDegree: 'Bachelor',
    minScore: 6.5,
    scoreScale: '10',
    minExperience: 0,
    requiredSkills: ['SQL', 'Python', 'Excel', 'Data Visualization'],
    preferredQualifications: [
      'Tableau or Power BI dashboard development',
      'Pandas & NumPy data manipulation',
      'Statistical testing fundamentals'
    ],
    applicationUrl: 'https://example.com/careers/sample-data-analyst',
    isSampleData: true,
    sourceDesignation: 'Curated Benchmark Sample',
    deadline: 'Sample Position'
  },
  {
    id: 'opp-grad-trainee-software',
    title: 'Graduate Engineering Trainee (GET)',
    organization: 'Global Systems Enterprise (Sample)',
    category: 'Graduate trainee programmes',
    type: 'Graduate Programme',
    location: 'Pan-India (Multiple Locations)',
    description: 'Comprehensive 12-month foundational engineering immersion spanning full-stack web architectures, systems engineering, CI/CD pipelines, and enterprise standards.',
    requiredDegree: 'B.Tech',
    minScore: 6.5,
    scoreScale: '10',
    minExperience: 0,
    requiredSkills: ['Data Structures', 'Java', 'Git'],
    preferredQualifications: [
      'Consistent academic track record with no active backlogs',
      'Clear verbal and technical communication',
      'Demonstrated collaborative capstone project'
    ],
    applicationUrl: 'https://example.com/careers/sample-grad-trainee',
    isSampleData: true,
    sourceDesignation: 'Campus Hiring Benchmark Sample',
    deadline: 'Annual Cohort'
  },
  {
    id: 'opp-swe-fullstack',
    title: 'Junior Full-Stack Software Developer',
    organization: 'Apex Web Technologies (Sample)',
    category: 'Software development',
    type: 'Full-time',
    location: 'Remote',
    description: 'Build end-to-end customer features across responsive web frontends and Node.js REST API services in a rapid product iteration cycle.',
    requiredDegree: 'B.Tech',
    minScore: 7.0,
    scoreScale: '10',
    minExperience: 0,
    requiredSkills: ['JavaScript', 'Node.js', 'React', 'Git', 'SQL'],
    preferredQualifications: [
      'Experience deploying apps to Vercel or Cloud Run',
      'Familiarity with state management and automated tests',
      'REST API design principles'
    ],
    applicationUrl: 'https://example.com/careers/sample-junior-swe',
    isSampleData: true,
    sourceDesignation: 'Industry Standard Benchmark Sample',
    deadline: 'Rolling Applications'
  },
  {
    id: 'opp-summer-tech-intern',
    title: 'Summer Technology Intern 2026',
    organization: 'Vertex Digital Research (Sample)',
    category: 'Internships',
    type: 'Internship',
    location: 'Bengaluru, India',
    description: 'A 10-week paid summer internship for pre-final and final year undergraduate students to collaborate with senior mentors on core internal tooling.',
    requiredDegree: 'Bachelor',
    minScore: 7.5,
    scoreScale: '10',
    minExperience: 0,
    requiredSkills: ['Python', 'Git', 'Algorithms'],
    preferredQualifications: [
      'Competitive programming or open-source PRs',
      'Basic knowledge of Linux / bash scripting',
      'Good understanding of relational databases'
    ],
    applicationUrl: 'https://example.com/careers/sample-summer-intern',
    isSampleData: true,
    sourceDesignation: 'Undergraduate Internship Sample',
    deadline: 'Summer Term'
  },
  {
    id: 'opp-stem-merit-scholarship',
    title: 'Women in Technology & STEM Excellence Fellowship',
    organization: 'National STEM Foundation (Sample)',
    category: 'Scholarships',
    type: 'Scholarship',
    location: 'National / Online Grant',
    description: 'Annual financial scholarship and executive mentorship grant awarded to high-achieving undergraduate students pursuing degrees in Computer Science and STEM.',
    requiredDegree: 'B.Tech',
    minScore: 8.5,
    scoreScale: '10',
    minExperience: 0,
    requiredSkills: ['Computer Science Fundamentals'],
    preferredQualifications: [
      'Active leadership in technical clubs or campus communities',
      'Published paper or community technology project',
      'Letter of academic recommendation'
    ],
    applicationUrl: 'https://example.com/fellowships/sample-stem-scholarship',
    isSampleData: true,
    sourceDesignation: 'Academic Merit Fellowship Sample',
    deadline: 'Academic Year Grant'
  },
  {
    id: 'opp-data-science-intern',
    title: 'Machine Learning & Analytics Intern',
    organization: 'Cortex Data Systems (Sample)',
    category: 'Data analytics',
    type: 'Internship',
    location: 'Hyderabad / Remote',
    description: 'Collaborate with researchers and data engineers to validate statistical models, benchmark query performance, and build exploratory data pipelines.',
    requiredDegree: 'Bachelor',
    minScore: 7.5,
    scoreScale: '10',
    minExperience: 0,
    requiredSkills: ['Python', 'SQL', 'Data Visualization', 'Git'],
    preferredQualifications: [
      'Scikit-learn or statistical modeling familiarity',
      'Jupyter notebooks presentation skills',
      'Good academic grounding in linear algebra and probability'
    ],
    applicationUrl: 'https://example.com/careers/sample-ml-intern',
    isSampleData: true,
    sourceDesignation: 'Curated Benchmark Sample',
    deadline: 'Rolling Selection'
  }
];
