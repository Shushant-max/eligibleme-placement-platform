import { describe, it, expect } from 'vitest';
import {
  assessEligibility,
  normalizeSkill,
  normalizeScoreToPercentage,
  evaluateDegree,
  STATUS
} from '../utils/matchingEngine.js';

describe('EligibleMe Local Rules Matching Engine', () => {
  const sampleOpportunity = {
    id: 'opp-1',
    title: 'Junior Software Engineer',
    requiredDegree: 'B.Tech',
    minScore: 7.0,
    scoreScale: '10',
    minExperience: 0,
    requiredSkills: ['JavaScript', 'React', 'Git']
  };

  const fullyQualifiedProfile = {
    fullName: 'Alex Morgan',
    degree: 'B.Tech Computer Science',
    academicScore: 8.2,
    gradingScale: '10',
    yearsOfExperience: 1,
    skills: ['JavaScript', 'React', 'Git', 'Node.js', 'Tailwind CSS']
  };

  it('evaluates a profile satisfying every mandatory requirement as Eligible', () => {
    const result = assessEligibility(fullyQualifiedProfile, sampleOpportunity);
    expect(result.status).toBe(STATUS.ELIGIBLE);
    expect(result.skillCoverage).toBe(100);
    expect(result.requirementCoverage).toBe(100);
    expect(result.missingSkills).toHaveLength(0);
    expect(result.failedRequirements).toHaveLength(0);
    expect(result.unknownRequirements).toHaveLength(0);
  });

  it('detects a confirmed education mismatch', () => {
    const mismatchedProfile = {
      ...fullyQualifiedProfile,
      degree: 'High School Diploma'
    };
    const result = assessEligibility(mismatchedProfile, sampleOpportunity);
    expect(result.status).not.toBe(STATUS.ELIGIBLE);
    const hasEduFailure = result.failedRequirements.some(r => r.id === 'req_education');
    expect(hasEduFailure).toBe(true);
  });

  it('identifies a missing required skill and drops skill coverage', () => {
    const profileMissingSkill = {
      ...fullyQualifiedProfile,
      skills: ['JavaScript', 'HTML'] // missing React and Git
    };
    const result = assessEligibility(profileMissingSkill, sampleOpportunity);
    expect(result.status).not.toBe(STATUS.ELIGIBLE);
    expect(result.matchedSkills).toContain('JavaScript');
    expect(result.missingSkills).toContain('React');
    expect(result.missingSkills).toContain('Git');
    expect(result.skillCoverage).toBe(33); // 1 out of 3 = 33%
  });

  it('marks assessment as Incomplete when critical profile information is missing', () => {
    const incompleteProfile = {
      fullName: 'Sam',
      skills: ['JavaScript', 'React', 'Git']
      // missing degree and score
    };
    const result = assessEligibility(incompleteProfile, sampleOpportunity);
    expect(result.status).toBe(STATUS.INCOMPLETE);
    expect(result.unknownRequirements.length).toBeGreaterThan(0);
  });

  it('passes when an academic score is exactly at the threshold', () => {
    const exactThresholdProfile = {
      ...fullyQualifiedProfile,
      academicScore: 7.0,
      gradingScale: '10'
    };
    const result = assessEligibility(exactThresholdProfile, sampleOpportunity);
    const scorePassed = result.passedRequirements.some(r => r.id === 'req_score');
    expect(scorePassed).toBe(true);
    expect(result.status).toBe(STATUS.ELIGIBLE);
  });

  it('fails when an academic score is below the threshold', () => {
    const belowThresholdProfile = {
      ...fullyQualifiedProfile,
      academicScore: 6.2,
      gradingScale: '10'
    };
    const result = assessEligibility(belowThresholdProfile, sampleOpportunity);
    expect(result.status).not.toBe(STATUS.ELIGIBLE);
    const scoreFailed = result.failedRequirements.some(r => r.id === 'req_score');
    expect(scoreFailed).toBe(true);
  });

  it('does not penalize a missing minimum requirement when opportunity does not configure one', () => {
    const oppWithoutScoreOrExp = {
      id: 'opp-2',
      title: 'Open Source Fellow',
      requiredDegree: 'Bachelor',
      requiredSkills: ['Python']
    };
    const profile = {
      fullName: 'Taylor',
      degree: 'B.Sc Computer Science',
      skills: ['Python']
    };
    const result = assessEligibility(profile, oppWithoutScoreOrExp);
    expect(result.status).toBe(STATUS.ELIGIBLE);
    expect(result.failedRequirements).toHaveLength(0);
    expect(result.unknownRequirements).toHaveLength(0);
  });

  it('handles opportunities with zero required skills without dividing by zero', () => {
    const oppNoSkills = {
      id: 'opp-3',
      title: 'General Fellowship',
      requiredSkills: []
    };
    const profile = {
      fullName: 'Jordan',
      degree: 'B.Tech',
      skills: []
    };
    const result = assessEligibility(profile, oppNoSkills);
    expect(result.skillCoverage).toBe(100);
    expect(Number.isFinite(result.skillCoverage)).toBe(true);
  });

  it('returns Incomplete for an incomplete opportunity record', () => {
    const result = assessEligibility(fullyQualifiedProfile, null);
    expect(result.status).toBe(STATUS.INCOMPLETE);

    const emptyOppResult = assessEligibility(fullyQualifiedProfile, {});
    expect(emptyOppResult.status).toBe(STATUS.INCOMPLETE);
  });

  it('handles invalid CGPA or percentage gracefully as unknown requirement', () => {
    const invalidProfile = {
      ...fullyQualifiedProfile,
      academicScore: 'not-a-number'
    };
    const result = assessEligibility(invalidProfile, sampleOpportunity);
    expect(result.status).toBe(STATUS.INCOMPLETE);
    const hasScoreUnknown = result.unknownRequirements.some(r => r.id === 'req_score');
    expect(hasScoreUnknown).toBe(true);
  });

  it('ensures high skill coverage NEVER overrides a failed mandatory requirement', () => {
    // 100% skills match, but fails required academic score cut-off
    const highSkillFailingScoreProfile = {
      ...fullyQualifiedProfile,
      academicScore: 5.5, // Required is 7.0
      skills: ['JavaScript', 'React', 'Git', 'TypeScript', 'Node.js', 'Docker']
    };
    const result = assessEligibility(highSkillFailingScoreProfile, sampleOpportunity);
    expect(result.skillCoverage).toBe(100);
    expect(result.status).not.toBe(STATUS.ELIGIBLE);
    expect(result.status).toBe(STATUS.PARTIALLY_MATCHED);
    expect(result.failedRequirements.some(r => r.id === 'req_score')).toBe(true);
  });

  it('normalizes skill matching case-insensitively with trim', () => {
    expect(normalizeSkill('  JAVA  ')).toBe('java');
    expect(normalizeSkill('React.js')).toBe('react.js');
    expect(normalizeSkill('JAVA')).not.toBe(normalizeSkill('JavaScript'));
  });

  it('correctly handles grading-scale conversions', () => {
    // 8.0 on 10 scale = 76% (8.0 * 9.5)
    expect(normalizeScoreToPercentage(8.0, '10')).toBe(76);
    // 3.5 on 4.0 scale = 87.5%
    expect(normalizeScoreToPercentage(3.5, '4')).toBe(87.5);
    // Invalid scores > scale max return null
    expect(normalizeScoreToPercentage(12, '10')).toBeNull();
    expect(normalizeScoreToPercentage(-2, '10')).toBeNull();
  });
});
