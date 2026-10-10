/**
 * Local Resume Parser Engine
 * Extracts structured candidate profile data from raw resume text
 * using rule-based heuristics and regular expressions.
 *
 * Runs 100% locally in the browser without external service calls.
 */

// Comprehensive dictionary of technical skills to match
export const SKILL_LEXICON = [
  // Languages & Core
  'JavaScript', 'TypeScript', 'Python', 'Java', 'C++', 'C#', 'C', 'Go', 'Rust', 'PHP', 'Ruby', 'Swift', 'Kotlin',
  // Frontend
  'React', 'Next.js', 'Vue.js', 'Vue', 'Angular', 'HTML', 'CSS', 'Tailwind CSS', 'Tailwind', 'Bootstrap', 'Redux', 'Sass',
  // Backend & APIs
  'Node.js', 'Express', 'Express.js', 'Spring Boot', 'Spring', 'Django', 'Flask', 'FastAPI', 'REST APIs', 'REST', 'GraphQL', 'Microservices',
  // Databases
  'SQL', 'PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'SQLite', 'Oracle', 'Cassandra',
  // Cloud & DevOps
  'Docker', 'Kubernetes', 'AWS', 'Azure', 'GCP', 'Google Cloud', 'CI/CD', 'Git', 'GitHub', 'GitLab', 'Linux', 'Bash',
  // Data & Analytics
  'Data Structures', 'Algorithms', 'Pandas', 'NumPy', 'Scikit-learn', 'Machine Learning', 'Data Visualization', 'Tableau', 'Power BI', 'Excel',
  // Testing & Tooling
  'Vitest', 'Jest', 'JUnit', 'Selenium', 'Cypress', 'Postman', 'Webpack', 'Vite'
];

/**
 * Clean and normalise extracted text
 * @param {string} rawText
 * @returns {string}
 */
export function cleanRawText(rawText) {
  if (!rawText || typeof rawText !== 'string') return '';
  return rawText
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    .replace(/[ \t]+/g, ' ')
    .trim();
}

/**
 * Extract email address
 * @param {string} text
 * @returns {string}
 */
export function extractEmail(text) {
  const match = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
  return match ? match[0].trim() : '';
}

/**
 * Extract candidate full name from header
 * @param {string} text
 * @returns {string}
 */
export function extractFullName(text) {
  const lines = text.split('\n')
    .map(l => l.trim())
    .filter(l => l.length > 0);

  // Common heading words to ignore
  const ignorePatterns = [
    /resume/i, /curriculum/i, /vitae/i, /profile/i, /summary/i,
    /contact/i, /page \d/i, /email/i, /phone/i, /portfolio/i, /github/i, /linkedin/i
  ];

  for (let i = 0; i < Math.min(lines.length, 6); i++) {
    const line = lines[i];
    // Must not contain ignore words
    if (ignorePatterns.some(p => p.test(line))) continue;
    // Must not contain email or URL
    if (line.includes('@') || line.includes('http') || line.includes('.com')) continue;
    // Check if line looks like a person's name (2-4 words, capitalized letters, no numbers)
    const words = line.split(/\s+/);
    if (words.length >= 2 && words.length <= 4 && !/\d/.test(line) && line.length <= 40) {
      // Looks like a name!
      return line.replace(/[^a-zA-Z\s.-]/g, '').trim();
    }
  }

  return '';
}

/**
 * Extract degree qualification
 * @param {string} text
 * @returns {string}
 */
export function extractDegree(text) {
  const lower = text.toLowerCase();

  if (/\b(b\.?tech|bachelor of technology|b\.?e\.?|bachelor of engineering)\b/i.test(lower)) {
    return 'B.Tech';
  }
  if (/\b(m\.?tech|master of technology|m\.?e\.?|master of engineering)\b/i.test(lower)) {
    return 'M.Tech';
  }
  if (/\b(bca|bachelor of computer applications)\b/i.test(lower)) {
    return 'BCA';
  }
  if (/\b(mca|master of computer applications)\b/i.test(lower)) {
    return 'MCA';
  }
  if (/\b(b\.?sc|bsc|bachelor of science)\b/i.test(lower)) {
    return 'B.Sc';
  }
  if (/\b(m\.?sc|msc|master of science)\b/i.test(lower)) {
    return 'M.Sc';
  }
  if (/\b(master'?s|master of)\b/i.test(lower)) {
    return 'Master';
  }
  if (/\b(bachelor'?s|bachelor of)\b/i.test(lower)) {
    return 'Bachelor';
  }

  return '';
}

/**
 * Extract specialization/branch
 * @param {string} text
 * @returns {string}
 */
export function extractSpecialization(text) {
  const lower = text.toLowerCase();

  if (/\b(computer science and engineering|computer science & engineering|computer science|cse|cs)\b/i.test(lower)) {
    return 'Computer Science and Engineering';
  }
  if (/\b(information technology|it)\b/i.test(lower)) {
    return 'Information Technology';
  }
  if (/\b(electronics and communication|electronics & communication|ece)\b/i.test(lower)) {
    return 'Electronics and Communication Engineering';
  }
  if (/\b(data science|data analytics)\b/i.test(lower)) {
    return 'Data Science';
  }
  if (/\b(electrical engineering|electrical)\b/i.test(lower)) {
    return 'Electrical Engineering';
  }
  if (/\b(mechanical engineering|mechanical)\b/i.test(lower)) {
    return 'Mechanical Engineering';
  }

  return '';
}

/**
 * Extract institution name
 * @param {string} text
 * @returns {string}
 */
export function extractInstitution(text) {
  const lines = text.split('\n');

  for (const line of lines) {
    const trimmed = line.trim();
    if (
      /(institute of technology|university|college of engineering|national institute of technology|indian institute of technology|\bnit\b|\biit\b|\biiit\b|\bbits\b)/i.test(trimmed)
    ) {
      if (trimmed.length < 90 && !trimmed.toLowerCase().includes('email') && !trimmed.toLowerCase().includes('http')) {
        return trimmed.replace(/^[-•*]\s*/, '').trim();
      }
    }
  }

  return '';
}

/**
 * Extract graduation year
 * @param {string} text
 * @returns {string|number}
 */
export function extractGraduationYear(text) {
  // Look for 4-digit years between 2018 and 2032
  const matches = text.match(/\b(20[1-3][0-9])\b/g);
  if (!matches) return '';

  // Take the highest year or year associated with graduation
  const years = matches.map(Number).filter(y => y >= 2018 && y <= 2032);
  if (years.length === 0) return '';

  // Check if any year is right next to "graduat" or "pass" or "batch"
  const gradMatch = text.match(/(?:graduat|batch|passing|expected|class of)[^0-9\n]{0,20}(20[1-3][0-9])/i);
  if (gradMatch && gradMatch[1]) {
    return Number(gradMatch[1]);
  }

  return Math.max(...years);
}

/**
 * Extract academic score (CGPA or percentage)
 * @param {string} text
 * @returns {{ score: string, scale: string }}
 */
export function extractAcademicScore(text) {
  // 1. Look for CGPA patterns: "CGPA: 8.4", "CGPA 8.4/10", "8.4 CGPA", "GPA: 3.8/4.0"
  const cgpaMatch = text.match(/(?:cgpa|gpa|score|grade)[^0-9\n]{0,10}(\d{1,2}(?:\.\d{1,2})?)\s*(?:\/\s*(\d{1,2}(?:\.\d{1,2})?))?/i);
  if (cgpaMatch) {
    const val = parseFloat(cgpaMatch[1]);
    const maxScale = cgpaMatch[2] ? parseFloat(cgpaMatch[2]) : null;

    if (maxScale === 4.0 || (val <= 4.0 && text.toLowerCase().includes('4.0'))) {
      return { score: String(val), scale: '4' };
    }
    if (maxScale === 10 || val <= 10.0) {
      return { score: String(val), scale: '10' };
    }
    if (val > 10.0 && val <= 100) {
      return { score: String(val), scale: 'percentage' };
    }
  }

  // 2. Look for percentage patterns: "82.5%", "Percentage: 78%"
  const percentMatch = text.match(/(?:percentage|aggregate|marks|pct)?[^0-9\n]{0,10}(\d{2}(?:\.\d{1,2})?)\s*%/i);
  if (percentMatch) {
    const pVal = parseFloat(percentMatch[1]);
    if (pVal >= 40 && pVal <= 100) {
      return { score: String(pVal), scale: 'percentage' };
    }
  }

  // 3. Fallback: match "X.X / 10" or "X.X / 10.0"
  const scale10Match = text.match(/(\d(?:\.\d{1,2})?)\s*\/\s*10(?:\.0)?/i);
  if (scale10Match) {
    return { score: scale10Match[1], scale: '10' };
  }

  return { score: '', scale: '10' };
}

/**
 * Extract years of experience
 * @param {string} text
 * @returns {string}
 */
export function extractExperience(text) {
  const lower = text.toLowerCase();

  if (/\b(fresher|student|intern|no experience|recent graduate|entry level)\b/i.test(lower)) {
    return '0';
  }

  const expMatch = text.match(/(\d+(?:\.\d+)?)\s*(?:\+)?\s*(?:years?|yrs?)(?:\s+of)?\s+experience/i);
  if (expMatch) {
    return expMatch[1];
  }

  return '0';
}

/**
 * Extract technical skills from text using lexicon
 * @param {string} text
 * @returns {Array<string>}
 */
export function extractSkills(text) {
  const detected = new Set();

  SKILL_LEXICON.forEach(skill => {
    // Escape special regex characters (like +, ., #)
    const escaped = skill.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    // Boundary match
    const regex = new RegExp(`(?:^|[^a-zA-Z0-9_#+])${escaped}(?:$|[^a-zA-Z0-9_#+])`, 'i');
    if (regex.test(text)) {
      detected.add(skill);
    }
  });

  return Array.from(detected);
}

/**
 * Extract notable projects from text
 * @param {string} text
 * @returns {string}
 */
export function extractProjects(text) {
  const projSection = text.match(/(?:projects|key projects|academic projects)([\s\S]*?)(?:experience|education|skills|certifications|achievements|$)/i);
  if (projSection && projSection[1]) {
    const lines = projSection[1].split('\n')
      .map(l => l.trim())
      .filter(l => l.length > 5 && !l.toLowerCase().includes('project'))
      .slice(0, 3);
    return lines.join(', ');
  }
  return '';
}

/**
 * Extract certifications from text
 * @param {string} text
 * @returns {string}
 */
export function extractCertifications(text) {
  const certSection = text.match(/(?:certifications|licenses|courses)([\s\S]*?)(?:experience|education|skills|projects|achievements|$)/i);
  if (certSection && certSection[1]) {
    const lines = certSection[1].split('\n')
      .map(l => l.trim())
      .filter(l => l.length > 5 && !l.toLowerCase().includes('certification'))
      .slice(0, 3);
    return lines.join(', ');
  }
  return '';
}

/**
 * Main parser entry point: Parses text and generates populated profile object
 * @param {string} rawResumeText
 * @returns {Object} Extracted candidate profile
 */
export function parseResumeText(rawResumeText) {
  const clean = cleanRawText(rawResumeText);
  if (!clean || clean.length < 20) {
    return null;
  }

  const fullName = extractFullName(clean);
  const email = extractEmail(clean);
  const degree = extractDegree(clean);
  const specialization = extractSpecialization(clean);
  const institution = extractInstitution(clean);
  const graduationYear = extractGraduationYear(clean);
  const { score, scale } = extractAcademicScore(clean);
  const yearsOfExperience = extractExperience(clean);
  const skills = extractSkills(clean);
  const projects = extractProjects(clean);
  const certifications = extractCertifications(clean);

  // Infer preferred roles
  const roles = [];
  const skillsSet = new Set(skills.map(s => s.toLowerCase()));
  if (skillsSet.has('react') || skillsSet.has('html') || skillsSet.has('css') || skillsSet.has('javascript')) {
    roles.push('Frontend Developer');
  }
  if (skillsSet.has('java') || skillsSet.has('spring boot') || skillsSet.has('node.js') || skillsSet.has('sql')) {
    roles.push('Backend Engineer');
  }
  if (skillsSet.has('python') || skillsSet.has('sql') || skillsSet.has('pandas')) {
    roles.push('Data Analyst');
  }
  if (roles.length === 0) {
    roles.push('Software Engineer', 'Graduate Trainee');
  }

  return {
    fullName: fullName || '',
    email: email || '',
    degree: degree || '',
    specialization: specialization || '',
    institution: institution || '',
    graduationYear: graduationYear || '',
    academicScore: score || '',
    gradingScale: scale || '10',
    yearsOfExperience: yearsOfExperience || '0',
    skills: skills.length > 0 ? skills : [],
    certifications: certifications || '',
    projects: projects || '',
    preferredRoles: roles.join(', '),
    preferredLocations: 'Bengaluru, Hyderabad, Remote'
  };
}
