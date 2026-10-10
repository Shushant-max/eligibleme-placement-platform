import React, { useState, useRef } from 'react';
import {
  Upload,
  FileText,
  CheckCircle2,
  AlertCircle,
  X,
  FileCode,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  RefreshCw
} from 'lucide-react';
import { extractTextFromFile } from '../utils/fileTextExtractor.js';
import { parseResumeText } from '../utils/resumeParser.js';

const SAMPLE_RESUMES = [
  {
    label: 'Full-Stack Developer (B.Tech, 8.6 CGPA)',
    text: `Ananya Deshmukh
Email: ananya.deshmukh@example.com | Phone: +91 9123456789
Bengaluru, India

EDUCATION
National Institute of Technology Karnataka (NIT Surathkal)
B.Tech in Computer Science and Engineering
Graduation: 2026 | CGPA: 8.6 / 10

TECHNICAL SKILLS
Languages: JavaScript, TypeScript, Python, Java, SQL
Frontend: React, HTML, CSS, Tailwind CSS, Vite
Backend: Node.js, Express, REST APIs, PostgreSQL
DevOps & Tools: Git, GitHub, Docker, Linux, Vitest

PROJECTS
EligibleMe Platform: Rule-based eligibility engine and candidate verification dashboard.
E-Commerce API: Scalable RESTful API with PostgreSQL and authentication.

EXPERIENCE
Frontend Developer Intern at AgileTech Solutions (Summer 2025)`
  },
  {
    label: 'Java Backend Engineer (B.Tech, 7.8 CGPA)',
    text: `Vikram Singhania
Email: vikram.singhania@example.com
Hyderabad, Telangana

EDUCATION
Birla Institute of Technology
B.Tech in Information Technology
Batch: 2025 | CGPA: 7.8 / 10

SKILLS
Core Java, Spring Boot, Microservices, SQL, MySQL, REST APIs, Git, Docker, Hibernate, JUnit

PROJECTS
Banking Transaction Engine: High-throughput transaction settlement service using Spring Boot.
Inventory Tracker: Cloud inventory microservice with MySQL and Redis.

EXPERIENCE
1 year of experience as Junior Backend Developer at Apex Systems`
  },
  {
    label: 'Data & BI Analyst (B.Sc, 82% Marks)',
    text: `Meera Nair
Email: meera.nair@example.com
Pune, Maharashtra

EDUCATION
Pune University
Bachelor of Science in Computer Science
Graduation: 2026 | Percentage: 82.5%

SKILLS
Python, SQL, Data Visualization, Excel, Tableau, Power BI, Pandas, NumPy, Data Structures, Git

PROJECTS
Customer Churn Prediction: Exploratory data analysis and predictive classification in Python.
Retail Executive Dashboard: Interactive Power BI and Tableau visualization suite.

EXPERIENCE
Fresher / Entry level graduate`
  }
];

export default function ResumeUploaderModal({ isOpen, onClose, onApplyProfile }) {
  const [activeTab, setActiveTab] = useState('upload'); // 'upload' | 'paste'
  const [dragActive, setDragActive] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [pastedText, setPastedText] = useState('');
  const [extractedData, setExtractedData] = useState(null);
  const fileInputRef = useRef(null);

  if (!isOpen) return null;

  const handleFileProcess = async (file) => {
    if (!file) return;
    setIsProcessing(true);
    setErrorMsg(null);

    try {
      const text = await extractTextFromFile(file);
      const parsed = parseResumeText(text);

      if (!parsed || (!parsed.fullName && parsed.skills.length === 0)) {
        throw new Error('Unable to detect meaningful profile data from this file. Please verify it contains text or try pasting directly.');
      }

      setExtractedData(parsed);
    } catch (err) {
      console.error('File parsing error:', err);
      setErrorMsg(err.message || 'Failed to read resume file. You can also paste your resume text directly.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileProcess(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const handleFileInputChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFileProcess(e.target.files[0]);
    }
  };

  const handleParsePastedText = () => {
    if (!pastedText.trim()) {
      setErrorMsg('Please paste some resume text first.');
      return;
    }

    setIsProcessing(true);
    setErrorMsg(null);

    try {
      const parsed = parseResumeText(pastedText);
      if (!parsed || (!parsed.fullName && parsed.skills.length === 0)) {
        throw new Error('Could not parse profile fields. Ensure the text contains educational credentials or skills.');
      }
      setExtractedData(parsed);
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleLoadSample = (sample) => {
    setPastedText(sample.text);
    const parsed = parseResumeText(sample.text);
    setExtractedData(parsed);
    setErrorMsg(null);
  };

  const handleConfirmApply = () => {
    if (extractedData) {
      onApplyProfile(extractedData);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
      <div className="relative max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-lg border border-slate-200 bg-white p-6 shadow-xl dark:border-slate-800 dark:bg-slate-900">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 rounded p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          aria-label="Close modal"
        >
          <X size={18} />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded bg-blue-600 text-white">
            <Upload size={16} />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
              Auto-Extract Profile from Resume
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Instantly populates your education, CGPA, and technical skills using in-browser parsing.
            </p>
          </div>
        </div>

        {/* Client-Side Privacy Notice */}
        <div className="mt-3 flex items-center gap-1.5 rounded bg-slate-50 p-2.5 text-xs text-slate-600 dark:bg-slate-800/60 dark:text-slate-300">
          <ShieldCheck size={14} className="text-emerald-600 shrink-0" />
          <span>
            <strong>100% Private &amp; Local:</strong> Processed entirely in your browser. No files are uploaded to any external server.
          </span>
        </div>

        {/* If Extracted Data is Ready: Review & Confirm View */}
        {extractedData ? (
          <div className="mt-5 space-y-4">
            <div className="rounded-md border border-emerald-200 bg-emerald-50/70 p-4 dark:border-emerald-900/50 dark:bg-emerald-950/30">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300">
                <CheckCircle2 size={16} />
                <span>Extracted Profile Qualifications</span>
              </div>
              <p className="mt-1 text-xs text-emerald-700 dark:text-emerald-400">
                Review the parsed information below. You can apply it directly to your profile.
              </p>
            </div>

            {/* Extracted Details Grid */}
            <div className="rounded-md border border-slate-200 bg-white p-4 text-xs dark:border-slate-800 dark:bg-slate-800/40">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <span className="text-slate-400 block uppercase text-[10px] font-semibold">Candidate Name</span>
                  <strong className="text-slate-800 dark:text-slate-200">{extractedData.fullName || 'Not detected'}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block uppercase text-[10px] font-semibold">Email</span>
                  <span className="text-slate-800 dark:text-slate-200">{extractedData.email || 'Not detected'}</span>
                </div>
                <div>
                  <span className="text-slate-400 block uppercase text-[10px] font-semibold">Degree Level</span>
                  <strong className="text-slate-800 dark:text-slate-200">{extractedData.degree || 'Not detected'}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block uppercase text-[10px] font-semibold">Specialisation</span>
                  <span className="text-slate-800 dark:text-slate-200">{extractedData.specialization || 'General / CSE'}</span>
                </div>
                <div>
                  <span className="text-slate-400 block uppercase text-[10px] font-semibold">Academic Score</span>
                  <strong className="text-slate-800 dark:text-slate-200">
                    {extractedData.academicScore ? `${extractedData.academicScore} on ${extractedData.gradingScale} scale` : 'Unspecified'}
                  </strong>
                </div>
                <div>
                  <span className="text-slate-400 block uppercase text-[10px] font-semibold">Graduation Year</span>
                  <span className="text-slate-800 dark:text-slate-200">{extractedData.graduationYear || '2026'}</span>
                </div>
              </div>

              {/* Skills */}
              <div className="mt-4 border-t border-slate-100 pt-3 dark:border-slate-800">
                <span className="text-slate-400 block uppercase text-[10px] font-semibold">
                  Detected Technical Skills ({extractedData.skills?.length || 0})
                </span>
                <div className="mt-1.5 flex flex-wrap gap-1">
                  {extractedData.skills?.map((s) => (
                    <span
                      key={s}
                      className="rounded border border-blue-200 bg-blue-50 px-2 py-0.5 text-[11px] font-medium text-blue-800 dark:border-blue-900 dark:bg-blue-950 dark:text-blue-300"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between border-t border-slate-100 pt-3 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setExtractedData(null)}
                className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-slate-700 dark:text-slate-400"
              >
                <RefreshCw size={13} />
                <span>Upload a different resume</span>
              </button>

              <button
                type="button"
                onClick={handleConfirmApply}
                className="inline-flex items-center gap-1.5 rounded-md bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-blue-700"
              >
                <span>Apply to My Profile</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        ) : (
          /* File Upload / Paste Tabs */
          <div className="mt-5 space-y-4">
            {/* Tabs */}
            <div className="flex items-center gap-2 border-b border-slate-100 pb-2 text-xs dark:border-slate-800">
              <button
                type="button"
                onClick={() => setActiveTab('upload')}
                className={`font-medium pb-1.5 border-b-2 transition ${
                  activeTab === 'upload'
                    ? 'border-blue-600 text-blue-700 font-semibold dark:border-blue-400 dark:text-blue-300'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                Upload File (.pdf, .txt, .md)
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('paste')}
                className={`font-medium pb-1.5 border-b-2 transition ${
                  activeTab === 'paste'
                    ? 'border-blue-600 text-blue-700 font-semibold dark:border-blue-400 dark:text-blue-300'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                Paste Resume Text
              </button>
            </div>

            {errorMsg && (
              <div className="flex items-center gap-2 rounded-md border border-rose-200 bg-rose-50 p-3 text-xs text-rose-700 dark:border-rose-900 dark:bg-rose-950 dark:text-rose-300">
                <AlertCircle size={15} className="shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {activeTab === 'upload' ? (
              <div>
                {/* Drag and Drop Zone */}
                <div
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onClick={() => fileInputRef.current?.click()}
                  className={`flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-8 text-center transition ${
                    dragActive
                      ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-950/30'
                      : 'border-slate-200 hover:border-blue-400 bg-slate-50/50 dark:border-slate-700 dark:bg-slate-800/40'
                  }`}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,.txt,.md,.json,.doc,.docx"
                    onChange={handleFileInputChange}
                    className="hidden"
                  />

                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-600 dark:bg-blue-950 dark:text-blue-300">
                    <Upload size={22} />
                  </div>

                  <p className="mt-3 text-xs font-semibold text-slate-800 dark:text-slate-200">
                    Click to browse or drag &amp; drop your resume here
                  </p>
                  <p className="mt-1 text-[11px] text-slate-400">
                    Supports PDF, TXT, or Markdown documents (Max 5MB)
                  </p>
                </div>

                {isProcessing && (
                  <div className="mt-3 text-center text-xs font-medium text-blue-600 dark:text-blue-400">
                    Extracting credentials and technical skills...
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-3">
                <textarea
                  rows={8}
                  value={pastedText}
                  onChange={(e) => setPastedText(e.target.value)}
                  placeholder="Paste your resume text here (including Education, Degree, CGPA, and Skills)..."
                  className="block w-full rounded-md border border-slate-200 p-3 text-xs shadow-2xs focus:border-blue-500 focus:outline-hidden dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                />

                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={handleParsePastedText}
                    disabled={isProcessing || !pastedText.trim()}
                    className="inline-flex items-center gap-1.5 rounded-md bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
                  >
                    <span>Extract Profile</span>
                    <ArrowRight size={13} />
                  </button>
                </div>
              </div>
            )}

            {/* Quick Sample Resumes for Instant Testing */}
            <div className="border-t border-slate-100 pt-3 dark:border-slate-800">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                Or Try A Sample Resume Preset:
              </span>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {SAMPLE_RESUMES.map((sample) => (
                  <button
                    key={sample.label}
                    type="button"
                    onClick={() => handleLoadSample(sample)}
                    className="inline-flex items-center gap-1 rounded border border-slate-200 bg-white px-2.5 py-1 text-xs text-slate-700 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
                  >
                    <Sparkles size={12} className="text-blue-500" />
                    <span>{sample.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
