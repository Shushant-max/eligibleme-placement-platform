/**
 * EligibleMe — Local Rules Engine
 * Independent, pure JavaScript module for evaluating candidate profile
 * eligibility against opportunity requirements.
 *
 * All evaluations are deterministic and run locally in the client browser.
 */

/**
 * Status Constants
 */
export const STATUS = {
  ELIGIBLE: 'Eligible',
  PARTIALLY_MATCHED: 'Partially matched',
  INCOMPLETE: 'Incomplete assessment',
  NOT_ELIGIBLE: 'Not eligible'
};

/**
 * Normalise a skill string for comparison (trim + lowercase).
 * @param {string} skill
 * @returns {string}
 */
export function normalizeSkill(skill) {
  if (!skill || typeof skill !== 'string') return '';
  return skill.trim().toLowerCase();
}

/**
 * Normalise education degree strings for comparison.
 * Maps common variants to standard buckets.
 * @param {string} degree
 * @returns {string}
 */
export function normalizeDegree(degree) {
  if (!degree || typeof degree !== 'string') return '';
  const d = degree.trim().toLowerCase();

  if (d.includes('b.tech') || d.includes('btech') || d.includes('b.e.') || d.includes('be ') || d.includes('bachelor of technology') || d.includes('bachelor of engineering')) {
    return 'bachelor_tech';
  }
  if (d.includes('m.tech') || d.includes('mtech') || d.includes('m.e.') || d.includes('master of technology')) {
    return 'master_tech';
  }
  if (d.includes('bca') || d.includes('bachelor of computer applications')) {
    return 'bca';
  }
  if (d.includes('mca') || d.includes('master of computer applications')) {
    return 'mca';
  }
  if (d.includes('b.sc') || d.includes('bsc') || d.includes('bachelor of science')) {
    return 'bachelor_science';
  }
  if (d.includes('m.sc') || d.includes('msc') || d.includes('master of science')) {
    return 'master_science';
  }
  if (d.includes('bba') || d.includes('b.com') || d.includes('bachelor')) {
    return 'bachelor_general';
  }
  if (d.includes('mba') || d.includes('master')) {
    return 'master_general';
  }
  if (d.includes('phd') || d.includes('doctorate')) {
    return 'doctorate';
  }
  if (d.includes('diploma') || d.includes('high school') || d.includes('12th')) {
    return 'diploma';
  }
  return d;
}

/**
 * Normalise score into a standard 0-100 percentage.
 * Handles:
 * - 10-point scale: uses standard AICTE / UGC conversion (CGPA * 9.5 or CGPA * 10)
 * - 4.0-point scale: GPA / 4.0 * 100
 * - Percentage: direct value
 * @param {number|string} score
 * @param {'10'|'4'|'percentage'|string} scale
 * @returns {number|null} Normalized score (0-100) or null if invalid
 */
export function normalizeScoreToPercentage(score, scale = '10') {
  if (score === null || score === undefined || score === '') return null;
  const num = typeof score === 'string' ? parseFloat(score) : Number(score);
  if (Number.isNaN(num) || num < 0) return null;

  const scaleStr = String(scale).toLowerCase();

  if (scaleStr === '10' || scaleStr.includes('10')) {
    if (num > 10) return null; // Invalid CGPA on 10 pt scale
    return Math.min(100, Math.round(num * 9.5 * 10) / 10);
  }
  if (scaleStr === '4' || scaleStr.includes('4')) {
    if (num > 4) return null;
    return Math.min(100, Math.round((num / 4.0) * 100 * 10) / 10);
  }
  if (scaleStr === 'percentage' || scaleStr.includes('%') || scaleStr.includes('percent')) {
    if (num > 100) return null;
    return Math.round(num * 10) / 10;
  }
  return null;
}

/**
 * Check if candidate's degree satisfies opportunity required degree.
 * @param {string} profileDegree
 * @param {string|Array<string>} requiredDegree
 * @returns {{ satisfies: boolean, isUnknown: boolean, reason: string }}
 */
export function evaluateDegree(profileDegree, requiredDegree) {
  if (!requiredDegree || (Array.isArray(requiredDegree) && requiredDegree.length === 0)) {
    return { satisfies: true, isUnknown: false, reason: 'No specific degree required.' };
  }
  if (!profileDegree || typeof profileDegree !== 'string' || !profileDegree.trim()) {
    return { satisfies: false, isUnknown: true, reason: 'Candidate education level is not provided in profile.' };
  }

  const pNorm = normalizeDegree(profileDegree);
  const reqList = Array.isArray(requiredDegree) ? requiredDegree : [requiredDegree];

  for (const req of reqList) {
    const rNorm = normalizeDegree(req);
    // Exact normalized category match
    if (pNorm === rNorm) {
      return { satisfies: true, isUnknown: false, reason: `Candidate holds qualifying degree (${profileDegree}).` };
    }
    // Any Bachelor's in Tech / Science if open to Bachelor's
    if (rNorm === 'bachelor_general' && (pNorm === 'bachelor_tech' || pNorm === 'bca' || pNorm === 'bachelor_science' || pNorm === 'bachelor_general')) {
      return { satisfies: true, isUnknown: false, reason: `Degree satisfies general Bachelor's requirement.` };
    }
    // Master's degree typically satisfies Bachelor's requirement
    if (rNorm === 'bachelor_tech' && pNorm === 'master_tech') {
      return { satisfies: true, isUnknown: false, reason: `Master's degree satisfies technical graduate requirement.` };
    }
    // String inclusion fallback (e.g. "Computer Science" or "Engineering")
    if (profileDegree.toLowerCase().includes(req.toLowerCase()) || req.toLowerCase().includes(profileDegree.toLowerCase())) {
      return { satisfies: true, isUnknown: false, reason: `Degree satisfies requirement (${req}).` };
    }
  }

  return {
    satisfies: false,
    isUnknown: false,
    reason: `Candidate degree (${profileDegree}) does not match required qualification (${Array.isArray(requiredDegree) ? requiredDegree.join(', ') : requiredDegree}).`
  };
}

/**
 * Main Eligibility Assessment Engine
 *
 * @param {Object} profile - User's saved profile
 * @param {Object} opportunity - Opportunity requirement record
 * @returns {Object} Structured assessment results
 */
export function assessEligibility(profile = {}, opportunity = {}) {
  const explanations = [];
  const recommendations = [];
  const passedRequirements = [];
  const failedRequirements = [];
  const unknownRequirements = [];

  // Basic validation of inputs
  if (!opportunity || typeof opportunity !== 'object' || !opportunity.id) {
    return {
      status: STATUS.INCOMPLETE,
      skillCoverage: 0,
      requirementCoverage: 0,
      matchedSkills: [],
      missingSkills: [],
      passedRequirements: [],
      failedRequirements: [],
      unknownRequirements: ['Opportunity specification is missing or corrupted.'],
      recommendations: ['Please select a valid opportunity from the explorer.'],
      explanations: ['Cannot evaluate eligibility because the opportunity data is incomplete.']
    };
  }

  const hasProfile = Boolean(profile && Object.keys(profile).length > 0 && (profile.fullName || profile.degree || (profile.skills && profile.skills.length > 0)));

  // If profile is completely empty
  if (!hasProfile) {
    return {
      status: STATUS.INCOMPLETE,
      skillCoverage: 0,
      requirementCoverage: 0,
      matchedSkills: [],
      missingSkills: opportunity.requiredSkills || [],
      passedRequirements: [],
      failedRequirements: [],
      unknownRequirements: [
        'Personal & academic profile not yet created',
        'Skills profile not yet configured'
      ],
      recommendations: [
        'Go to "My Profile" and enter your academic background and technical skills to run this assessment.'
      ],
      explanations: [
        'No candidate profile found. Profile completion is required to assess eligibility.'
      ]
    };
  }

  // 1. SKILLS EVALUATION
  const requiredSkills = Array.isArray(opportunity.requiredSkills) ? opportunity.requiredSkills : [];
  const profileSkills = Array.isArray(profile.skills) ? profile.skills : [];
  const profileSkillsNormMap = new Map();
  profileSkills.forEach(s => {
    const norm = normalizeSkill(s);
    if (norm) profileSkillsNormMap.set(norm, s);
  });

  const matchedSkills = [];
  const missingSkills = [];

  requiredSkills.forEach(reqSkill => {
    const normReq = normalizeSkill(reqSkill);
    if (profileSkillsNormMap.has(normReq)) {
      matchedSkills.push(reqSkill);
    } else {
      missingSkills.push(reqSkill);
    }
  });

  let skillCoverage = 0;
  if (requiredSkills.length === 0) {
    skillCoverage = 100; // Handled without dividing by zero
  } else {
    skillCoverage = Math.round((matchedSkills.length / requiredSkills.length) * 100);
  }

  if (requiredSkills.length > 0) {
    if (missingSkills.length === 0) {
      passedRequirements.push({
        id: 'req_skills',
        category: 'Skills',
        label: `Skill Coverage: 100% (${matchedSkills.length}/${requiredSkills.length} matched)`,
        mandatory: true
      });
      explanations.push(`Satisfies all ${requiredSkills.length} required technical skills.`);
    } else {
      failedRequirements.push({
        id: 'req_skills',
        category: 'Skills',
        label: `Missing ${missingSkills.length} required skill(s): ${missingSkills.join(', ')}`,
        mandatory: true
      });
      explanations.push(`Missing ${missingSkills.length} required skill(s): ${missingSkills.join(', ')}.`);
      recommendations.push(`Prioritize learning or demonstrating proficiency in: ${missingSkills.join(', ')}.`);
    }
  } else {
    passedRequirements.push({
      id: 'req_skills',
      category: 'Skills',
      label: 'No mandatory skills specified by provider',
      mandatory: false
    });
    explanations.push('No mandatory skills specified for this opportunity.');
  }

  // 2. EDUCATION REQUIREMENT EVALUATION
  if (opportunity.requiredDegree) {
    const eduEval = evaluateDegree(profile.degree, opportunity.requiredDegree);
    if (eduEval.isUnknown) {
      unknownRequirements.push({
        id: 'req_education',
        category: 'Education',
        label: 'Degree information missing in profile',
        mandatory: true
      });
      recommendations.push('Add your degree or education qualification in your profile.');
    } else if (eduEval.satisfies) {
      passedRequirements.push({
        id: 'req_education',
        category: 'Education',
        label: eduEval.reason,
        mandatory: true
      });
      explanations.push(eduEval.reason);
    } else {
      failedRequirements.push({
        id: 'req_education',
        category: 'Education',
        label: eduEval.reason,
        mandatory: true
      });
      explanations.push(eduEval.reason);
      recommendations.push(`Review opportunity degree requirement (${Array.isArray(opportunity.requiredDegree) ? opportunity.requiredDegree.join(', ') : opportunity.requiredDegree}).`);
    }
  }

  // 3. ACADEMIC SCORE EVALUATION
  const hasMinScoreReq = opportunity.minScore !== undefined && opportunity.minScore !== null && opportunity.minScore !== '';
  if (hasMinScoreReq) {
    const oppMinNormalized = normalizeScoreToPercentage(opportunity.minScore, opportunity.scoreScale || '10');
    const profileNormalized = normalizeScoreToPercentage(profile.academicScore, profile.gradingScale || '10');

    if (profile.academicScore === undefined || profile.academicScore === null || profile.academicScore === '') {
      unknownRequirements.push({
        id: 'req_score',
        category: 'Academics',
        label: `Academic score not specified in profile (Requires min ${opportunity.minScore} on ${opportunity.scoreScale || '10'} scale)`,
        mandatory: true
      });
      recommendations.push('Update your CGPA or academic percentage in your profile to verify academic cut-off.');
    } else if (profileNormalized === null) {
      unknownRequirements.push({
        id: 'req_score',
        category: 'Academics',
        label: `Invalid academic score format (${profile.academicScore}) in profile`,
        mandatory: true
      });
      recommendations.push('Enter a valid numerical CGPA or percentage in your profile.');
    } else if (oppMinNormalized === null) {
      unknownRequirements.push({
        id: 'req_score',
        category: 'Academics',
        label: 'Opportunity minimum score criteria is unparseable',
        mandatory: true
      });
    } else {
      if (profileNormalized >= oppMinNormalized) {
        passedRequirements.push({
          id: 'req_score',
          category: 'Academics',
          label: `Academic score meets requirement (Candidate: ~${profileNormalized}%, Minimum: ~${oppMinNormalized}%)`,
          mandatory: true
        });
        explanations.push(`Academic score satisfies the cutoff (${profile.academicScore} meets minimum requirement).`);
      } else {
        failedRequirements.push({
          id: 'req_score',
          category: 'Academics',
          label: `Academic score below cutoff (Candidate: ~${profileNormalized}%, Minimum required: ~${oppMinNormalized}%)`,
          mandatory: true
        });
        explanations.push(`Academic score (${profile.academicScore}) is below the required cutoff (${opportunity.minScore}).`);
      }
    }
  }

  // 4. EXPERIENCE EVALUATION
  const hasExpReq = opportunity.minExperience !== undefined && opportunity.minExperience !== null && opportunity.minExperience > 0;
  if (hasExpReq) {
    const candExp = profile.yearsOfExperience !== undefined && profile.yearsOfExperience !== null && profile.yearsOfExperience !== ''
      ? parseFloat(profile.yearsOfExperience)
      : null;

    if (candExp === null || Number.isNaN(candExp)) {
      unknownRequirements.push({
        id: 'req_exp',
        category: 'Experience',
        label: `Years of experience not stated in profile (Requires min ${opportunity.minExperience} yr(s))`,
        mandatory: true
      });
      recommendations.push('Add your years of experience in your profile.');
    } else if (candExp >= opportunity.minExperience) {
      passedRequirements.push({
        id: 'req_exp',
        category: 'Experience',
        label: `Experience meets criteria (${candExp} years >= ${opportunity.minExperience} year(s) required)`,
        mandatory: true
      });
      explanations.push(`Candidate experience (${candExp} yr) meets or exceeds requirement (${opportunity.minExperience} yr).`);
    } else {
      failedRequirements.push({
        id: 'req_exp',
        category: 'Experience',
        label: `Experience below requirement (${candExp} years < ${opportunity.minExperience} year(s) required)`,
        mandatory: true
      });
      explanations.push(`Requires at least ${opportunity.minExperience} year(s) experience; profile shows ${candExp} year(s).`);
      recommendations.push(`Opportunity requires ${opportunity.minExperience} years of experience. Consider applying to junior or graduate roles.`);
    }
  }

  // 5. REQUIREMENT WEIGHTED COVERAGE CALCULATION
  // We document weights explicitly:
  // - Skills: 40%
  // - Education: 25% (if configured)
  // - Academic score: 20% (if configured)
  // - Experience: 15% (if configured)
  // If an attribute is not required by opportunity, weights normalize dynamically over assessable items.
  const assessableWeights = [];
  // Skills weight:
  assessableWeights.push({
    weight: 40,
    score: (skillCoverage / 100) * 40
  });

  // Education weight:
  if (opportunity.requiredDegree) {
    const isPassed = passedRequirements.some(r => r.id === 'req_education');
    assessableWeights.push({
      weight: 25,
      score: isPassed ? 25 : 0
    });
  }

  // Academic score weight:
  if (hasMinScoreReq) {
    const isPassed = passedRequirements.some(r => r.id === 'req_score');
    assessableWeights.push({
      weight: 20,
      score: isPassed ? 20 : 0
    });
  }

  // Experience weight:
  if (hasExpReq) {
    const isPassed = passedRequirements.some(r => r.id === 'req_exp');
    assessableWeights.push({
      weight: 15,
      score: isPassed ? 15 : 0
    });
  }

  const totalMaxWeight = assessableWeights.reduce((sum, item) => sum + item.weight, 0);
  const totalEarnedWeight = assessableWeights.reduce((sum, item) => sum + item.score, 0);

  const requirementCoverage = totalMaxWeight > 0
    ? Math.round((totalEarnedWeight / totalMaxWeight) * 100)
    : 100;

  // 6. FINAL STATUS DETERMINATION
  // Rules:
  // 1. If any mandatory requirement failed:
  //    Never use high skill percentage to override a failed mandatory requirement.
  //    If at least one requirement passed, it is "Partially matched".
  //    If no requirements passed (or 0% coverage with hard failures), it is "Not eligible".
  // 2. If no mandatory requirements failed, but there are unknown requirements:
  //    -> "Incomplete assessment"
  // 3. If all mandatory requirements passed and no unknown requirements:
  //    -> "Eligible"
  let status = STATUS.ELIGIBLE;

  if (failedRequirements.length > 0) {
    if (passedRequirements.length > 0 || (skillCoverage > 0 && skillCoverage < 100)) {
      status = STATUS.PARTIALLY_MATCHED;
    } else {
      status = STATUS.NOT_ELIGIBLE;
    }
  } else if (unknownRequirements.length > 0) {
    status = STATUS.INCOMPLETE;
  } else {
    status = STATUS.ELIGIBLE;
  }

  if (status === STATUS.ELIGIBLE) {
    recommendations.push('You satisfy all configured mandatory requirements. Review the job description and prepare your application!');
  } else if (status === STATUS.PARTIALLY_MATCHED) {
    explanations.unshift('Note: Although some requirements are satisfied, one or more mandatory requirements are currently unmet.');
  }

  return {
    status,
    skillCoverage,
    requirementCoverage,
    matchedSkills,
    missingSkills,
    passedRequirements,
    failedRequirements,
    unknownRequirements,
    recommendations,
    explanations
  };
}
