import { describe, it, expect } from 'vitest';
import {
  parseResumeText,
  extractFullName,
  extractEmail,
  extractDegree,
  extractAcademicScore,
  extractSkills
} from '../utils/resumeParser.js';

describe('Local Resume Parser Utility', () => {
  const sampleResumeText = `
Rohan Verma
Email: rohan.verma@example.com | Phone: +91 9876543210
Bengaluru, Karnataka

EDUCATION
National Institute of Technology, Surathkal
B.Tech in Computer Science and Engineering
Graduation: 2026 | CGPA: 8.7 / 10

SKILLS
Programming: JavaScript, TypeScript, Python, Java
Frontend & Web: React, Tailwind CSS, HTML, CSS
Backend & DB: Node.js, Express, SQL, PostgreSQL, REST APIs
Tools: Git, GitHub, Docker, Vitest

PROJECTS
EligibleMe Web Platform: Automated rule matching engine built with React and Vite.
Campus Placement Portal: Student eligibility verification system.

EXPERIENCE
Software Engineering Intern at CloudTech Labs (Summer 2025)
  `;

  it('correctly extracts candidate full name', () => {
    const name = extractFullName(sampleResumeText);
    expect(name).toBe('Rohan Verma');
  });

  it('correctly extracts email address', () => {
    const email = extractEmail(sampleResumeText);
    expect(email).toBe('rohan.verma@example.com');
  });

  it('correctly extracts degree and score', () => {
    const degree = extractDegree(sampleResumeText);
    expect(degree).toBe('B.Tech');

    const scoreData = extractAcademicScore(sampleResumeText);
    expect(scoreData.score).toBe('8.7');
    expect(scoreData.scale).toBe('10');
  });

  it('extracts technical skills using exact boundary matching', () => {
    const skills = extractSkills(sampleResumeText);
    expect(skills).toContain('React');
    expect(skills).toContain('JavaScript');
    expect(skills).toContain('TypeScript');
    expect(skills).toContain('Python');
    expect(skills).toContain('Java');
    expect(skills).toContain('SQL');
    expect(skills).toContain('Git');
    expect(skills).toContain('Docker');
    expect(skills).toContain('Node.js');
  });

  it('produces a full parsed profile object', () => {
    const profile = parseResumeText(sampleResumeText);
    expect(profile).not.toBeNull();
    expect(profile.fullName).toBe('Rohan Verma');
    expect(profile.email).toBe('rohan.verma@example.com');
    expect(profile.degree).toBe('B.Tech');
    expect(profile.specialization).toBe('Computer Science and Engineering');
    expect(profile.academicScore).toBe('8.7');
    expect(profile.skills.length).toBeGreaterThan(5);
  });

  it('handles percentage grading scales properly', () => {
    const percentResume = `
Priya Sharma
priya@domain.com
Bachelor of Science in Information Technology
Percentage: 84.5%
Skills: Python, SQL, Excel, Tableau
    `;
    const profile = parseResumeText(percentResume);
    expect(profile.academicScore).toBe('84.5');
    expect(profile.gradingScale).toBe('percentage');
    expect(profile.skills).toContain('Python');
    expect(profile.skills).toContain('SQL');
  });
});
