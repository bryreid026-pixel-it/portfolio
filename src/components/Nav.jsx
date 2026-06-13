export default function Nav() {
  const links = [
    { href: '#about',      label: 'About'      },
    { href: '#projects',   label: 'Projects'   },
    { href: '#skills',     label: 'Skills'     },
    { href: '#experience', label: 'Experience' },
    { href: '#certs',      label: 'Certs'      },
    { href: '#contact',    label: 'Contact'    },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur border-b border-orange-100">
      <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
        <span className="font-mono text-orange-400 text-sm tracking-wider font-semibold">
          bryanna reid
        </span>
        <ul className="flex gap-6">
          {links.map(({ href, label }) => (
            <li key={href}>
              <a
                href={href}
                className="text-sm text-stone-500 hover:text-orange-400 transition-colors duration-200"
              >
                {label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
