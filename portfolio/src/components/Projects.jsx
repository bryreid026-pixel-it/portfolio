import { useState } from 'react';

const projects = [
  {
    title: 'DVWA Security Audit',
    description:
      'Full walkthrough of Damn Vulnerable Web Application — documented SQL injection, XSS, CSRF, and broken authentication vulnerabilities with exploitation methodology and developer-side remediation steps.',
    tags: ['Burp Suite', 'SQLi', 'XSS', 'OWASP Top 10', 'PHP'],
    github: 'https://github.com/bryreid026',
    type: 'Lab',
    category: 'Security',
    detail: {
      objective: 'Audit DVWA for every OWASP Top 10 vulnerability class present in the application.',
      methodology: 'Manual testing with Burp Suite intercept proxy + automated scan baseline. Each finding documented with reproduction steps.',
      findings: ['Reflected & Stored XSS in guestbook and search', 'Union-based SQLi on login form', 'CSRF on password-change endpoint', 'Broken session management (predictable token)'],
      takeaway: 'Demonstrated that missing output encoding causes both XSS and SQLi. Wrote remediation patches for each finding.',
    },
  },
  {
    title: 'DevSecOps CI/CD Pipeline',
    description:
      'Demo app with a hardened GitHub Actions pipeline: SAST via Semgrep, dependency scanning with Snyk, secrets detection with Gitleaks, and automated DAST on PR. Documented every finding caught in CI before merge.',
    tags: ['GitHub Actions', 'Snyk', 'Semgrep', 'Gitleaks', 'Docker'],
    github: 'https://github.com/bryreid026',
    type: 'DevSecOps',
    category: 'Engineering',
    detail: {
      objective: 'Show how to integrate security gates into a standard CI/CD workflow without slowing down deployments.',
      methodology: 'Built a React + Node.js app, wired four security tools as GitHub Actions jobs running in parallel on every PR.',
      findings: ['Snyk caught 3 high-severity npm deps on day one', 'Semgrep flagged eval() usage in a dependency', 'Gitleaks blocked a hardcoded AWS key in test fixtures'],
      takeaway: 'Security caught before merge = zero prod incidents. Pipeline adds ~90s to CI runtime.',
    },
  },
  {
    title: 'TryHackMe — OWASP Top 10',
    description:
      'Writeup of the OWASP Top 10 room covering injection, broken auth, sensitive data exposure, and XXE. Includes step-by-step exploitation notes and what each vulnerability looks like in the wild.',
    tags: ['TryHackMe', 'OWASP', 'Web Security', 'Writeup'],
    github: 'https://github.com/bryreid026',
    type: 'Writeup',
    category: 'Security',
    detail: {
      objective: 'Complete the OWASP Top 10 room and produce a reference writeup for each vulnerability class.',
      methodology: 'Worked each challenge sequentially, documenting tool setup, exploit payload, and what the fix looks like in code.',
      findings: ['Broken auth via username enumeration timing attack', 'XXE reading /etc/passwd through upload endpoint', 'Sensitive data via unencrypted cookie inspection'],
      takeaway: 'Most web vulns trace back to trusting user input. Each writeup includes a one-line developer fix.',
    },
  },
  {
    title: 'Open Source Secure Code Review',
    description:
      'Audited a mid-size open source project for security issues — found insecure deserialization, missing input validation, and an IDOR vulnerability. Documented in CVE-style report format with severity ratings.',
    tags: ['Code Review', 'IDOR', 'Input Validation', 'Python'],
    github: 'https://github.com/bryreid026',
    type: 'Research',
    category: 'Security',
    detail: {
      objective: 'Practice security code review on a real codebase and produce a professional-grade vulnerability report.',
      methodology: 'Static analysis with Semgrep + manual review of auth flows, input handlers, and deserialization paths.',
      findings: ['IDOR on /api/user/{id} — no ownership check', 'pickle.loads() on untrusted user upload', 'Missing length validation on text fields (potential DoS)'],
      takeaway: "IDOR is the most common AppSec finding because it's invisible to static analysis — only logic review catches it.",
    },
  },
  {
    title: 'CloudSentinel',
    description:
      'AWS security monitoring tool that audits IAM policies, S3 bucket permissions, and security group rules for misconfigurations. Outputs actionable findings with severity scoring and remediation guidance.',
    tags: ['AWS', 'Python', 'IAM', 'Terraform', 'Cloud Security'],
    github: 'https://github.com/bryreid026',
    type: 'Tool',
    category: 'Engineering',
    detail: {
      objective: 'Build a CLI tool that gives a security posture snapshot of an AWS account in under 60 seconds.',
      methodology: 'Python + boto3 to query IAM, S3, and EC2 APIs. Severity scored by CVSS-inspired rubric. Terraform for test infrastructure.',
      findings: ['Detects public S3 buckets, wildcard IAM policies, open 0.0.0.0/0 security groups', 'Outputs JSON + human-readable HTML report'],
      takeaway: 'Automating the most common cloud misconfigs catches 80% of real-world findings.',
    },
  },
  {
    title: 'Student Analytics Dashboard',
    description:
      'Real-time dashboard tracking engagement, completion, and performance trends across 200 students and 30 courses at STEMZ. Enabled data-driven curriculum decisions and reduced reporting time significantly.',
    tags: ['React', 'SQL', 'Data Visualization', 'Dashboard'],
    github: 'https://github.com/bryreid026',
    type: 'SWE',
    category: 'Engineering',
    detail: {
      objective: 'Replace manual spreadsheet reporting with a live dashboard that surfaces actionable curriculum insights.',
      methodology: 'React frontend pulling from a SQL backend, with chart components for trend visualization.',
      findings: ['Reduced weekly reporting effort from hours to minutes', 'Surfaced drop-off patterns that led to curriculum changes'],
      takeaway: 'Good data infrastructure changes how teams make decisions — the hardest part was defining the right metrics.',
    },
  },
];

const typeStyles = {
  Lab:       { pill: 'text-sky-600 bg-sky-100 border border-sky-200',       bar: 'bg-sky-400'    },
  DevSecOps: { pill: 'text-violet-600 bg-violet-100 border border-violet-200', bar: 'bg-violet-400' },
  Writeup:   { pill: 'text-amber-600 bg-amber-100 border border-amber-200',  bar: 'bg-amber-400'  },
  Research:  { pill: 'text-orange-600 bg-orange-100 border border-orange-200', bar: 'bg-orange-400' },
  Tool:      { pill: 'text-rose-600 bg-rose-100 border border-rose-200',     bar: 'bg-rose-400'   },
  SWE:       { pill: 'text-teal-600 bg-teal-100 border border-teal-200',     bar: 'bg-teal-400'   },
};

const FILTERS = ['All', 'Security', 'Engineering'];

function ProjectCard({ title, description, tags, github, type, detail }) {
  const [expanded, setExpanded] = useState(false);
  const style = typeStyles[type] || typeStyles.SWE;

  return (
    <div
      className={`group border-2 rounded-2xl bg-white transition-all duration-300 cursor-pointer overflow-hidden
        ${expanded ? 'border-orange-300 shadow-md' : 'border-stone-100 hover:border-orange-200 hover:shadow-sm'}`}
      onClick={() => setExpanded(!expanded)}
    >
      {/* color bar top */}
      <div className={`h-1 w-full ${style.bar}`} />

      <div className="p-5">
        <div className="flex items-start justify-between mb-3">
          <span className={`text-xs font-mono px-2 py-0.5 rounded-full ${style.pill}`}>
            {type}
          </span>
          <div className="flex items-center gap-2">
            <span className="text-stone-300 text-xs">{expanded ? '▲' : '▼'}</span>
            <a
              href={github}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="text-stone-300 hover:text-orange-400 transition-colors"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3"/>
              </svg>
            </a>
          </div>
        </div>
        <h3 className={`font-semibold text-base mb-2 transition-colors ${expanded ? 'text-orange-500' : 'text-stone-800 group-hover:text-orange-400'}`}>
          {title}
        </h3>
        <p className="text-stone-500 text-sm leading-relaxed mb-4">{description}</p>
        <div className="flex flex-wrap gap-1.5">
          {tags.map((tag) => (
            <span key={tag} className="text-xs font-mono text-stone-400 bg-stone-100 px-2 py-0.5 rounded-full">
              {tag}
            </span>
          ))}
        </div>
      </div>

      {expanded && (
        <div className="border-t border-stone-100 px-5 pb-5 pt-4 space-y-4 bg-orange-50/30" onClick={(e) => e.stopPropagation()}>
          {[
            { label: '🎯 Objective',    text: detail.objective   },
            { label: '🔍 Methodology',  text: detail.methodology },
          ].map(({ label, text }) => (
            <div key={label}>
              <p className="text-xs font-mono text-orange-400 uppercase tracking-widest mb-1">{label}</p>
              <p className="text-stone-500 text-sm leading-relaxed">{text}</p>
            </div>
          ))}
          <div>
            <p className="text-xs font-mono text-orange-400 uppercase tracking-widest mb-2">📋 Findings</p>
            <ul className="space-y-1">
              {detail.findings.map((f, i) => (
                <li key={i} className="text-stone-500 text-sm flex gap-2">
                  <span className="text-orange-300 flex-shrink-0">›</span>{f}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-xs font-mono text-orange-400 uppercase tracking-widest mb-1">💡 Takeaway</p>
            <p className="text-stone-500 text-sm leading-relaxed italic">{detail.takeaway}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default function Projects() {
  const [active, setActive] = useState('All');
  const visible = active === 'All' ? projects : projects.filter((p) => p.category === active);

  return (
    <section id="projects" className="py-24 px-6 bg-white border-t border-stone-100">
      <div className="max-w-5xl mx-auto">
        <p className="font-mono text-orange-400 text-xs tracking-widest uppercase mb-4">Projects</p>
        <h2 className="text-3xl font-bold text-stone-900 mb-3">Research & Engineering 🔬</h2>
        <p className="text-stone-400 mb-8 max-w-xl">
          Click any card to expand methodology, findings, and takeaways.
        </p>

        <div className="flex gap-2 mb-10">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setActive(f)}
              className={`px-4 py-1.5 rounded-full text-sm font-mono transition-all duration-200 ${
                active === f
                  ? 'bg-orange-400 text-white font-semibold shadow-sm'
                  : 'border-2 border-stone-200 text-stone-400 hover:border-orange-300 hover:text-orange-400'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {visible.map((p) => (
            <ProjectCard key={p.title} {...p} />
          ))}
        </div>
      </div>
    </section>
  );
}
