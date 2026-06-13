import { useState } from 'react';
import Terminal from './Terminal';
import ThreeBackground from './ThreeBackground';

const GithubIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
  </svg>
);

const LinkedInIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
);

const TryHackMeIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M12 2a10 10 0 100 20A10 10 0 0012 2zm0 2a8 8 0 110 16A8 8 0 0112 4zm-1 4v2H9v2h2v4h2v-4h2v-2h-2V8h-2z"/>
  </svg>
);

function GridBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* 3D Three.js network scene */}
      <ThreeBackground />
      {/* bottom fade so the 3D scene bleeds cleanly into the next panel */}
      <div
        className="absolute inset-x-0 bottom-0 h-40 pointer-events-none"
        style={{ background: 'linear-gradient(to bottom, transparent, #0f0f0f)' }}
      />
    </div>
  );
}

export default function Hero() {
  const [termOpen, setTermOpen] = useState(false);

  return (
    <>
      <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 pt-14">
        <GridBackground />

        <div className="relative max-w-2xl mx-auto z-10">
          {/* currently building chip */}
          <div className="inline-flex items-center gap-2 border border-[#00ff9f]/20 bg-[#00ff9f]/5 rounded-full px-4 py-1.5 mb-8">
            <span className="w-2 h-2 rounded-full bg-[#00ff9f] animate-pulse" />
            <span className="text-xs font-mono text-[#00ff9f]">
              currently building: CloudSentinel · DevSecOps Pipeline
            </span>
          </div>

          <h1 className="text-5xl md:text-6xl font-bold text-white leading-tight mb-4">
            I build things<br />
            <span className="text-[#00ff9f]">and break them.</span>
          </h1>
          <p className="text-gray-400 text-lg mb-8 leading-relaxed">
            Software Engineer specializing in Application Security.<br />
            UChicago CS · Pacific Life · Security+ · Azure AI-900
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <a
              href="https://github.com/bryreid026"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 rounded border border-white/10 text-gray-400 hover:text-[#00ff9f] hover:border-[#00ff9f]/40 transition-all duration-200 text-sm"
            >
              <GithubIcon /> GitHub
            </a>
            <a
              href="https://linkedin.com/in/bryanna-reid"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 rounded border border-white/10 text-gray-400 hover:text-[#00ff9f] hover:border-[#00ff9f]/40 transition-all duration-200 text-sm"
            >
              <LinkedInIcon /> LinkedIn
            </a>
            <a
              href="https://tryhackme.com/p/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 rounded border border-white/10 text-gray-400 hover:text-[#00ff9f] hover:border-[#00ff9f]/40 transition-all duration-200 text-sm"
            >
              <TryHackMeIcon /> TryHackMe
            </a>
            <button
              onClick={() => setTermOpen(true)}
              className="flex items-center gap-2 px-4 py-2 rounded border border-[#00ff9f]/30 text-[#00ff9f] bg-[#00ff9f]/5 hover:bg-[#00ff9f]/10 transition-all duration-200 text-sm font-mono"
            >
              <span className="text-base leading-none">›_</span> terminal
            </button>
          </div>

          <div className="mt-16 animate-bounce">
            <a href="#about" className="text-gray-600 hover:text-[#00ff9f] transition-colors">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5 mx-auto">
                <path d="M19 9l-7 7-7-7"/>
              </svg>
            </a>
          </div>
        </div>
      </section>

      {termOpen && <Terminal onClose={() => setTermOpen(false)} />}
    </>
  );
}
