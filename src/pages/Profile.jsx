import React, { useState } from 'react';
import {
  Save,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Plus,
  X,
  FileCheck2,
  Briefcase,
  GraduationCap,
  Sparkles,
  Upload
} from 'lucide-react';
import ResumeUploaderModal from '../components/ResumeUploaderModal.jsx';

const COMMON_SKILLS = [
  'JavaScript', 'React', 'HTML', 'CSS', 'Node.js', 'Java', 'Spring Boot',
  'Python', 'SQL', 'Git', 'Data Structures', 'Data Visualization',
  'Algorithms', 'Docker', 'Excel', 'REST APIs', 'TypeScript', 'Tailwind CSS'
];

export const DEFAULT_SAMPLE_PROFILE = {
  fullName: 'Aarav Sharma',
  email: 'aarav.sharma@example.com',
  degree: 'B.Tech',
  specialization: 'Computer Science and Engineering',
  institution: 'National Institute of Technology',
  graduationYear: 2026,
  academicScore: '8.4',
  gradingScale: '10',
  yearsOfExperience: '0',
  skills: ['JavaScript', 'React', 'HTML', 'CSS', 'Git', 'SQL', 'Node.js'],
  certifications: 'Meta Frontend Developer Certificate, HackerRank SQL Gold',
  projects: 'Campus Placement Portal (React + Vite), Real-time Chat App',
  preferredRoles: 'Frontend Developer, Software Engineer, Full Stack Intern',
  preferredLocations: 'Bengaluru, Hyderabad, Remote'
};

export default function Profile({ profile, setProfile }) {
  const [formData, setFormData] = useState({
    fullName: profile?.fullName || '',
    email: profile?.email || '',
    degree: profile?.degree || '',
    specialization: profile?.specialization || '',
    institution: profile?.institution || '',
    graduationYear: profile?.graduationYear || '',
    academicScore: profile?.academicScore ?? '',
    gradingScale: profile?.gradingScale || '10',
    yearsOfExperience: profile?.yearsOfExperience ?? '',
    skills: Array.isArray(profile?.skills) ? [...profile.skills] : [],
    certifications: profile?.certifications || '',
    projects: profile?.projects || '',
    preferredRoles: profile?.preferredRoles || '',
    preferredLocations: profile?.preferredLocations || ''
  });

  const [skillInput, setSkillInput] = useState('');
  const [saveStatus, setSaveStatus] = useState(null);
  const [errors, setErrors] = useState({});
  const [isResumeModalOpen, setIsResumeModalOpen] = useState(false);

  const handleApplyResumeProfile = (extracted) => {
    setFormData(extracted);
    setProfile(extracted);
    setSaveStatus('success');
    setErrors({});
  };

  const validate = () => {
    const errs = {};
    if (!formData.fullName.trim()) errs.fullName = 'Full name is required.';
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errs.email = 'Please enter a valid email address.';
    }
    if (!formData.degree.trim()) errs.degree = 'Education degree is required.';

    if (formData.academicScore !== '' && formData.academicScore !== undefined) {
      const score = parseFloat(formData.academicScore);
      if (Number.isNaN(score) || score < 0) {
        errs.academicScore = 'Score must be a positive number.';
      } else if (formData.gradingScale === '10' && score > 10) {
        errs.academicScore = 'CGPA cannot exceed 10.0 on a 10-point scale.';
      } else if (formData.gradingScale === '4' && score > 4) {
        errs.academicScore = 'GPA cannot exceed 4.0 on a 4-point scale.';
      } else if (formData.gradingScale === 'percentage' && score > 100) {
        errs.academicScore = 'Percentage cannot exceed 100%.';
      }
    }

    if (formData.yearsOfExperience !== '' && formData.yearsOfExperience !== undefined) {
      const exp = parseFloat(formData.yearsOfExperience);
      if (Number.isNaN(exp) || exp < 0) {
        errs.yearsOfExperience = 'Experience must be a non-negative number.';
      }
    }

    if (formData.skills.length === 0) {
      errs.skills = 'Add at least one technical skill.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
    setSaveStatus(null);
  };

  const addSkill = (skillToAdd) => {
    const target = (skillToAdd || skillInput).trim();
    if (!target) return;
    if (!formData.skills.some(s => s.toLowerCase() === target.toLowerCase())) {
      setFormData(prev => ({ ...prev, skills: [...prev.skills, target] }));
      if (errors.skills) setErrors(prev => ({ ...prev, skills: null }));
    }
    setSkillInput('');
    setSaveStatus(null);
  };

  const removeSkill = (skillToRemove) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(s => s !== skillToRemove)
    }));
    setSaveStatus(null);
  };

  const handleKeyDownSkill = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addSkill();
    }
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (validate()) {
      setProfile(formData);
      setSaveStatus('success');
      setTimeout(() => setSaveStatus(null), 4000);
    }
  };

  const handleLoadSample = () => {
    setFormData(DEFAULT_SAMPLE_PROFILE);
    setProfile(DEFAULT_SAMPLE_PROFILE);
    setErrors({});
    setSaveStatus('success');
  };

  const handleClear = () => {
    if (window.confirm('Clear your candidate profile? This cannot be undone.')) {
      const emptyProfile = {
        fullName: '',
        email: '',
        degree: '',
        specialization: '',
        institution: '',
        graduationYear: '',
        academicScore: '',
        gradingScale: '10',
        yearsOfExperience: '',
        skills: [],
        certifications: '',
        projects: '',
        preferredRoles: '',
        preferredLocations: ''
      };
      setFormData(emptyProfile);
      setProfile(emptyProfile);
      setErrors({});
      setSaveStatus('cleared');
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Candidate Profile
          </h2>
          <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
            Stored locally in your browser. Used by the rules engine for instant qualification audits.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setIsResumeModalOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-md bg-blue-600 px-3.5 py-1.5 text-xs font-semibold text-white shadow-xs hover:bg-blue-700"
          >
            <Upload size={13} />
            <span>Upload Resume (Auto-Fill)</span>
          </button>
          <button
            type="button"
            onClick={handleLoadSample}
            className="inline-flex items-center gap-1.5 rounded border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 shadow-2xs hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
          >
            <Sparkles size={13} className="text-blue-500" />
            <span>Load Sample</span>
          </button>
          <button
            type="button"
            onClick={handleClear}
            className="inline-flex items-center gap-1.5 rounded border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-rose-600 shadow-2xs hover:bg-rose-50 dark:border-slate-700 dark:bg-slate-800 dark:text-rose-400"
          >
            <RotateCcw size={13} />
            <span>Clear</span>
          </button>
        </div>
      </div>

      {/* Instant Resume Upload Banner */}
      <div className="flex flex-col justify-between gap-3 rounded-lg border border-blue-200 bg-blue-50/60 p-4 sm:flex-row sm:items-center dark:border-blue-900/50 dark:bg-blue-950/30">
        <div className="flex items-start gap-3">
          <div className="mt-0.5 flex h-7 w-7 items-center justify-center rounded bg-blue-600 text-white shrink-0">
            <Upload size={14} />
          </div>
          <div>
            <h3 className="text-xs font-bold text-blue-950 dark:text-blue-100">
              Skip manual entry — Auto-fill from your Resume
            </h3>
            <p className="text-[11px] text-blue-900/80 dark:text-blue-300/80">
              Upload your PDF, Word, or plain text resume to instantly extract your degree, CGPA, graduation year, and technical skills.
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setIsResumeModalOpen(true)}
          className="inline-flex shrink-0 items-center justify-center gap-1.5 rounded-md bg-white border border-blue-300 px-3.5 py-1.5 text-xs font-semibold text-blue-700 shadow-2xs hover:bg-blue-50 dark:bg-slate-800 dark:border-blue-800 dark:text-blue-300"
        >
          <Upload size={13} />
          <span>Upload Resume Now</span>
        </button>
      </div>

      {/* Save Notification */}
      {saveStatus === 'success' && (
        <div className="flex items-center gap-2 rounded-md border border-emerald-200 bg-emerald-50/80 p-3.5 text-xs font-medium text-emerald-800 dark:border-emerald-800/80 dark:bg-emerald-950/40 dark:text-emerald-300">
          <CheckCircle2 size={16} className="shrink-0 text-emerald-600" />
          <span>Profile saved successfully. Assessments immediately reflect your updated qualifications.</span>
        </div>
      )}

      {saveStatus === 'cleared' && (
        <div className="flex items-center gap-2 rounded-md border border-slate-200 bg-slate-100 p-3.5 text-xs font-medium text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
          <AlertCircle size={16} className="shrink-0 text-slate-500" />
          <span>Profile cleared. Enter your details to perform eligibility checks.</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Section 1: Personal Details */}
        <div className="rounded-lg border border-slate-200/90 bg-white p-6 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
          <div className="border-b border-slate-100 pb-3 dark:border-slate-800">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-200">
              1. Personal Details
            </h3>
          </div>

          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="fullName" className="block text-xs font-medium text-slate-700 dark:text-slate-300">
                Full Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                placeholder="e.g. Aarav Sharma"
                className={`mt-1 block w-full rounded-md border px-3 py-2 text-xs shadow-2xs focus:border-blue-500 focus:outline-hidden dark:bg-slate-800 dark:text-slate-100 ${
                  errors.fullName ? 'border-rose-400' : 'border-slate-200 dark:border-slate-700'
                }`}
              />
              {errors.fullName && <p className="mt-1 text-xs text-rose-500">{errors.fullName}</p>}
            </div>

            <div>
              <label htmlFor="email" className="block text-xs font-medium text-slate-700 dark:text-slate-300">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="e.g. candidate@example.com"
                className={`mt-1 block w-full rounded-md border px-3 py-2 text-xs shadow-2xs focus:border-blue-500 focus:outline-hidden dark:bg-slate-800 dark:text-slate-100 ${
                  errors.email ? 'border-rose-400' : 'border-slate-200 dark:border-slate-700'
                }`}
              />
              {errors.email && <p className="mt-1 text-xs text-rose-500">{errors.email}</p>}
            </div>
          </div>
        </div>

        {/* Section 2: Education */}
        <div className="rounded-lg border border-slate-200/90 bg-white p-6 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
          <div className="border-b border-slate-100 pb-3 dark:border-slate-800">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-200">
              2. Academic Credentials
            </h3>
          </div>

          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <label htmlFor="degree" className="block text-xs font-medium text-slate-700 dark:text-slate-300">
                Degree Level <span className="text-rose-500">*</span>
              </label>
              <select
                id="degree"
                name="degree"
                value={formData.degree}
                onChange={handleInputChange}
                className={`mt-1 block w-full rounded-md border px-3 py-2 text-xs shadow-2xs focus:border-blue-500 focus:outline-hidden dark:bg-slate-800 dark:text-slate-100 ${
                  errors.degree ? 'border-rose-400' : 'border-slate-200 dark:border-slate-700'
                }`}
              >
                <option value="">Select degree...</option>
                <option value="B.Tech">B.Tech / B.E. (Engineering)</option>
                <option value="BCA">BCA (Computer Applications)</option>
                <option value="B.Sc">B.Sc (Computer Science / IT)</option>
                <option value="M.Tech">M.Tech / M.E.</option>
                <option value="MCA">MCA (Master of Computer Applications)</option>
                <option value="M.Sc">M.Sc</option>
                <option value="Bachelor">Bachelor (General / Other)</option>
                <option value="Master">Master (General / Other)</option>
              </select>
              {errors.degree && <p className="mt-1 text-xs text-rose-500">{errors.degree}</p>}
            </div>

            <div>
              <label htmlFor="specialization" className="block text-xs font-medium text-slate-700 dark:text-slate-300">
                Specialisation / Branch
              </label>
              <input
                type="text"
                id="specialization"
                name="specialization"
                value={formData.specialization}
                onChange={handleInputChange}
                placeholder="e.g. Computer Science"
                className="mt-1 block w-full rounded-md border border-slate-200 px-3 py-2 text-xs shadow-2xs focus:border-blue-500 focus:outline-hidden dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
              />
            </div>

            <div>
              <label htmlFor="institution" className="block text-xs font-medium text-slate-700 dark:text-slate-300">
                Institution / University
              </label>
              <input
                type="text"
                id="institution"
                name="institution"
                value={formData.institution}
                onChange={handleInputChange}
                placeholder="e.g. State Technical University"
                className="mt-1 block w-full rounded-md border border-slate-200 px-3 py-2 text-xs shadow-2xs focus:border-blue-500 focus:outline-hidden dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
              />
            </div>

            <div>
              <label htmlFor="graduationYear" className="block text-xs font-medium text-slate-700 dark:text-slate-300">
                Graduation Year
              </label>
              <input
                type="number"
                id="graduationYear"
                name="graduationYear"
                value={formData.graduationYear}
                onChange={handleInputChange}
                min={2015}
                max={2032}
                placeholder="e.g. 2026"
                className="mt-1 block w-full rounded-md border border-slate-200 px-3 py-2 text-xs shadow-2xs focus:border-blue-500 focus:outline-hidden dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
              />
            </div>

            <div>
              <label htmlFor="gradingScale" className="block text-xs font-medium text-slate-700 dark:text-slate-300">
                Grading Scale
              </label>
              <select
                id="gradingScale"
                name="gradingScale"
                value={formData.gradingScale}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border border-slate-200 px-3 py-2 text-xs shadow-2xs focus:border-blue-500 focus:outline-hidden dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
              >
                <option value="10">10-Point CGPA (e.g. 8.5 / 10)</option>
                <option value="4">4.0 GPA (e.g. 3.5 / 4.0)</option>
                <option value="percentage">Percentage (e.g. 85%)</option>
              </select>
            </div>

            <div>
              <label htmlFor="academicScore" className="block text-xs font-medium text-slate-700 dark:text-slate-300">
                Academic Score / CGPA
              </label>
              <input
                type="number"
                step="0.01"
                id="academicScore"
                name="academicScore"
                value={formData.academicScore}
                onChange={handleInputChange}
                placeholder="e.g. 8.4"
                className={`mt-1 block w-full rounded-md border px-3 py-2 text-xs shadow-2xs focus:border-blue-500 focus:outline-hidden dark:bg-slate-800 dark:text-slate-100 ${
                  errors.academicScore ? 'border-rose-400' : 'border-slate-200 dark:border-slate-700'
                }`}
              />
              {errors.academicScore && <p className="mt-1 text-xs text-rose-500">{errors.academicScore}</p>}
            </div>
          </div>
        </div>

        {/* Section 3: Skills & Experience */}
        <div className="rounded-lg border border-slate-200/90 bg-white p-6 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
          <div className="border-b border-slate-100 pb-3 dark:border-slate-800">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-200">
              3. Technical Skills &amp; Experience
            </h3>
          </div>

          <div className="mt-4 space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300">
                Technical Skills <span className="text-rose-500">*</span>
              </label>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Normalized exact match against opportunity criteria. Case and outer spaces are handled automatically.
              </p>

              <div className="mt-2 flex gap-2">
                <input
                  type="text"
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyDown={handleKeyDownSkill}
                  placeholder="Type a skill (e.g. React, Java, SQL) and press Enter"
                  className="block flex-1 rounded-md border border-slate-200 px-3 py-2 text-xs shadow-2xs focus:border-blue-500 focus:outline-hidden dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                />
                <button
                  type="button"
                  onClick={() => addSkill()}
                  className="inline-flex items-center gap-1 rounded border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                >
                  <Plus size={13} /> Add
                </button>
              </div>

              {errors.skills && <p className="mt-1 text-xs text-rose-500">{errors.skills}</p>}

              {/* Active candidate skills */}
              <div className="mt-3 flex flex-wrap gap-1.5">
                {formData.skills.map((skill) => (
                  <span
                    key={skill}
                    className="inline-flex items-center gap-1 rounded border border-blue-200 bg-blue-50/70 px-2.5 py-1 text-xs font-medium text-blue-800 dark:border-blue-900 dark:bg-blue-950/60 dark:text-blue-200"
                  >
                    <span>{skill}</span>
                    <button
                      type="button"
                      onClick={() => removeSkill(skill)}
                      className="text-blue-500 hover:text-blue-700"
                      aria-label={`Remove ${skill}`}
                    >
                      <X size={12} />
                    </button>
                  </span>
                ))}
              </div>

              {/* Suggestions */}
              <div className="mt-3 border-t border-slate-100 pt-2.5 dark:border-slate-800">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                  Quick Add:
                </span>
                <div className="mt-1.5 flex flex-wrap gap-1">
                  {COMMON_SKILLS.filter(s => !formData.skills.some(fs => fs.toLowerCase() === s.toLowerCase())).slice(0, 8).map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => addSkill(s)}
                      className="rounded border border-slate-200 bg-white px-2 py-0.5 text-xs text-slate-600 hover:border-blue-300 hover:text-blue-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
                    >
                      + {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Experience fields */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="yearsOfExperience" className="block text-xs font-medium text-slate-700 dark:text-slate-300">
                  Full-Time Experience (Years)
                </label>
                <input
                  type="number"
                  step="0.5"
                  min="0"
                  id="yearsOfExperience"
                  name="yearsOfExperience"
                  value={formData.yearsOfExperience}
                  onChange={handleInputChange}
                  placeholder="0 for freshers"
                  className="mt-1 block w-full rounded-md border border-slate-200 px-3 py-2 text-xs shadow-2xs focus:border-blue-500 focus:outline-hidden dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                />
              </div>

              <div>
                <label htmlFor="certifications" className="block text-xs font-medium text-slate-700 dark:text-slate-300">
                  Certifications
                </label>
                <input
                  type="text"
                  id="certifications"
                  name="certifications"
                  value={formData.certifications}
                  onChange={handleInputChange}
                  placeholder="e.g. AWS Cloud Practitioner"
                  className="mt-1 block w-full rounded-md border border-slate-200 px-3 py-2 text-xs shadow-2xs focus:border-blue-500 focus:outline-hidden dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                />
              </div>

              <div>
                <label htmlFor="preferredRoles" className="block text-xs font-medium text-slate-700 dark:text-slate-300">
                  Preferred Job Roles
                </label>
                <input
                  type="text"
                  id="preferredRoles"
                  name="preferredRoles"
                  value={formData.preferredRoles}
                  onChange={handleInputChange}
                  placeholder="e.g. Frontend Engineer, Full Stack"
                  className="mt-1 block w-full rounded-md border border-slate-200 px-3 py-2 text-xs shadow-2xs focus:border-blue-500 focus:outline-hidden dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                />
              </div>

              <div>
                <label htmlFor="preferredLocations" className="block text-xs font-medium text-slate-700 dark:text-slate-300">
                  Preferred Locations
                </label>
                <input
                  type="text"
                  id="preferredLocations"
                  name="preferredLocations"
                  value={formData.preferredLocations}
                  onChange={handleInputChange}
                  placeholder="e.g. Bengaluru, Remote"
                  className="mt-1 block w-full rounded-md border border-slate-200 px-3 py-2 text-xs shadow-2xs focus:border-blue-500 focus:outline-hidden dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                />
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="projects" className="block text-xs font-medium text-slate-700 dark:text-slate-300">
                  Portfolio Projects
                </label>
                <textarea
                  id="projects"
                  name="projects"
                  rows={2}
                  value={formData.projects}
                  onChange={handleInputChange}
                  placeholder="Brief summary of projects"
                  className="mt-1 block w-full rounded-md border border-slate-200 px-3 py-2 text-xs shadow-2xs focus:border-blue-500 focus:outline-hidden dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex items-center justify-end">
          <button
            type="submit"
            className="inline-flex items-center gap-1.5 rounded-md bg-blue-600 px-5 py-2.5 text-xs font-semibold text-white shadow-xs hover:bg-blue-700"
          >
            <Save size={14} />
            <span>Save Profile Changes</span>
          </button>
        </div>
      </form>

      {/* Resume Auto-Fill Modal */}
      <ResumeUploaderModal
        isOpen={isResumeModalOpen}
        onClose={() => setIsResumeModalOpen(false)}
        onApplyProfile={handleApplyResumeProfile}
      />
    </div>
  );
}
