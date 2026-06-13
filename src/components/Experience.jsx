import { useState } from 'react';

const roles = [
  {
    title: 'Software Engineer',
    org: 'Pacific Life',
    location: 'Newport Beach, CA',
    period: 'Jan 2026 – Present',
    emoji: '💼',
    color: 'border-orange-300 bg-orange-400',
    bullets: [
      'Design and implement features using React and RESTful APIs, ensuring correct data persistence, validation, and alignment between frontend and backend contracts.',
      'Coordinate feature rollouts with backend readiness, implementing safeguards to prevent invalid or premature data submission.',
      'Independently analyze a large production codebase, identifying architectural patterns and edge cases to deliver enhancements with minimal regression risk.',
      'Contribute in Agile/Scrum — refinement, pull requests, review feedback, cross-functional collaboration.',
    ],
  },
  {
    title: 'Artificial Intelligence Instructor',
    org: 'Orange County Public Schools',
    location: 'Orlando, FL',
    period: 'Jan 2025 – Jan 2026',
    emoji: '🤖',
    color: 'border-rose-300 bg-rose-400',
    bullets: [
      'Designed and led Azure AI-900 certification prep curriculum for 90+ students, achieving an 85% pass rate through hands-on ML labs and responsible AI modules.',
      'Managed end-to-end ML pipelines from data preprocessing to deployment on Azure.',
      'Built hands-on Computer Vision and NLP labs using real-world datasets, translating complex ML concepts for non-technical audiences.',
    ],
  },
  {
    title: 'Data Analytics Intern',
    org: 'STEMZ',
    location: 'CA',
    period: 'Nov 2024 – Feb 2025',
    emoji: '📊',
    color: 'border-violet-300 bg-violet-400',
    bullets: [
      'Built real-time analytics dashboards tracking engagement, completion, and performance trends across 200 students and 30 courses.',
      'Integrated tools to analyze qualitative metrics like creativity and critical thinking, improving data-driven curriculum decisions.',
    ],
  },
  {
    title: 'IT Intern',
    org: 'Lavner Education',
    location: 'Orlando, FL',
    period: 'Jun 2023 – Sep 2023',
    emoji: '🖥️',
    color: 'border-sky-300 bg-sky-400',
    bullets: [
      'Assisted with hardware/software setup and debugging; supported daily operations.',
      'Coded SQL queries to organize and analyze user data, improving troubleshooting processes.',
      'Analyzed technical support tickets to identify and address recurring system issues.',
    ],
  },
];

function TimelineItem({ role, isLast }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative flex gap-6">
      <div className="flex flex-col items-center">
        <button
          onClick={() => setOpen(!open)}
          className={`w-3 h-3 rounded-full border-2 flex-shrink-0 mt-1 transition-colors ${role.color} hover:opacity-80`}
        />
        {!isLast && <div className="w-px flex-1 bg-stone-200 mt-1" />}
      </div>
      <div className="pb-8 flex-1">
        <button onClick={() => setOpen(!open)} className="text-left w-full group">
          <div className="flex items-baseline justify-between gap-4 flex-wrap">
            <div>
              <span className="text-stone-800 font-semibold">{role.emoji} {role.title}</span>
              <span className="text-stone-400 text-sm ml-2">@ {role.org}</span>
              <span className="text-stone-300 text-xs ml-1">· {role.location}</span>
            </div>
            <span className="text-stone-400 text-xs font-mono whitespace-nowrap">{role.period}</span>
          </div>
          <span className="text-xs text-stone-400 group-hover:text-orange-400 transition-colors">
            {open ? '▲ collapse' : '▼ expand'}
          </span>
        </button>
        {open && (
          <ul className="mt-3 space-y-2">
            {role.bullets.map((b, i) => (
              <li key={i} className="text-stone-500 text-sm leading-relaxed pl-3 border-l-2 border-orange-200">
                {b}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default function Experience() {
  return (
    <section id="experience" className="py-24 px-6 bg-white border-t border-stone-100">
      <div className="max-w-3xl mx-auto">
        <p className="font-mono text-orange-400 text-xs tracking-widest uppercase mb-4">Experience</p>
        <h2 className="text-3xl font-bold text-stone-900 mb-12">Timeline 📍</h2>
        <div>
          {roles.map((role, i) => (
            <TimelineItem key={role.title} role={role} isLast={i === roles.length - 1} />
          ))}
        </div>
      </div>
    </section>
  );
}
