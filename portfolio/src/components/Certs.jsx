const certs = [
  {
    name: 'CompTIA Security+',
    issuer: 'CompTIA',
    year: '2026',
    status: 'active',
    emoji: '🔐',
    color: 'border-orange-200 bg-orange-50',
    badge: 'text-orange-500 bg-orange-100',
    description: 'Industry-standard baseline security certification covering threats, cryptography, network security, and identity management.',
  },
  {
    name: 'Google Data Analytics',
    issuer: 'Google / Coursera',
    year: '2024',
    status: 'active',
    emoji: '📊',
    color: 'border-sky-200 bg-sky-50',
    badge: 'text-sky-500 bg-sky-100',
    description: 'Professional certificate covering data cleaning, analysis, visualization, and SQL. Applied directly in internship analytics work.',
  },
  {
    name: 'eJPT',
    issuer: 'eLearnSecurity',
    year: 'In Progress',
    status: 'pending',
    emoji: '⚔️',
    color: 'border-stone-200 bg-stone-50',
    badge: 'text-stone-400 bg-stone-100',
    description: 'Entry-level penetration testing certification — hands-on assessment of network and web application exploitation.',
  },
  {
    name: 'AWS Security Specialty',
    issuer: 'Amazon Web Services',
    year: 'Planned',
    status: 'pending',
    emoji: '☁️',
    color: 'border-amber-200 bg-amber-50',
    badge: 'text-amber-500 bg-amber-100',
    description: 'Advanced AWS security certification covering data protection, incident response, infrastructure security, and compliance.',
  },
];

export default function Certs() {
  return (
    <section id="certs" className="py-24 px-6 bg-rose-50/40 border-t border-rose-100">
      <div className="max-w-5xl mx-auto">
        <p className="font-mono text-orange-400 text-xs tracking-widest uppercase mb-4">Certifications</p>
        <h2 className="text-3xl font-bold text-stone-900 mb-12">Credentials 🏅</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {certs.map(({ name, issuer, year, status, emoji, color, badge, description }) => (
            <div
              key={name}
              className={`border-2 rounded-2xl p-5 transition-all duration-200 ${color} ${
                status === 'pending' ? 'opacity-60' : 'hover:shadow-md hover:-translate-y-0.5'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className={`text-xs font-mono px-2 py-0.5 rounded-full font-medium ${badge}`}>
                  {status === 'pending' ? 'In Progress' : year}
                </span>
                <span className="text-xl">{emoji}</span>
              </div>
              <h3 className="text-stone-800 font-semibold mb-1 text-sm">{name}</h3>
              <p className="text-stone-400 text-xs mb-3">{issuer}</p>
              <p className="text-stone-500 text-xs leading-relaxed">{description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
