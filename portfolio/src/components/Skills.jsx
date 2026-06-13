const columns = [
  {
    heading: 'Security',
    emoji: '🛡️',
    color: 'text-rose-400 border-rose-200 bg-rose-50',
    dot: 'bg-rose-400',
    items: [
      'OWASP Top 10',
      'Burp Suite',
      'SAST / DAST',
      'Snyk',
      'Semgrep',
      'Threat Modeling',
      'Penetration Testing',
      'Security+ (CompTIA)',
    ],
  },
  {
    heading: 'Development',
    emoji: '💻',
    color: 'text-orange-400 border-orange-200 bg-orange-50',
    dot: 'bg-orange-400',
    items: [
      'Python',
      'JavaScript / React',
      'C++ / Java / C#',
      'REST APIs',
      'Docker',
      'CI/CD (GitHub Actions)',
      'Git',
      'SQL',
    ],
  },
  {
    heading: 'Cloud & Infra',
    emoji: '☁️',
    color: 'text-sky-400 border-sky-200 bg-sky-50',
    dot: 'bg-sky-400',
    items: [
      'AWS (IAM, S3, EC2, Lambda)',
      'GCP',
      'Azure (fundamentals)',
      'Terraform',
      'Linux',
      'Kubernetes (basics)',
    ],
  },
];

export default function Skills() {
  return (
    <section id="skills" className="py-24 px-6 bg-orange-50/40 border-t border-orange-100">
      <div className="max-w-5xl mx-auto">
        <p className="font-mono text-orange-400 text-xs tracking-widest uppercase mb-4">Skills</p>
        <h2 className="text-3xl font-bold text-stone-900 mb-12">Tools & Technologies 🧰</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {columns.map(({ heading, emoji, color, dot, items }) => (
            <div key={heading} className="bg-white rounded-2xl p-6 border border-stone-100 shadow-sm">
              <h3 className={`text-sm font-mono tracking-widest uppercase mb-4 pb-2 border-b ${color}`}>
                {emoji} {heading}
              </h3>
              <ul className="space-y-2.5">
                {items.map((item) => (
                  <li key={item} className="flex items-center gap-2 text-stone-500 text-sm">
                    <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${dot}`} />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
