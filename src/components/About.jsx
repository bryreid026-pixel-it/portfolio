export default function About() {
  return (
    <section id="about" className="py-24 px-6 bg-white">
      <div className="max-w-3xl mx-auto">
        <p className="font-mono text-orange-400 text-xs tracking-widest uppercase mb-4">About</p>
        <h2 className="text-3xl font-bold text-stone-900 mb-6">
          Engineer who thinks like an attacker. 🔐
        </h2>
        <div className="text-stone-500 text-lg leading-relaxed space-y-4">
          <p>
            I studied Computer Science (with a Math specialization) at the University of Chicago,
            where coursework in Computer Security and Network Security gave me a formal foundation
            in how systems fail — and how to build them so they don't.
          </p>
          <p>
            Today I write production software at Pacific Life, shipping React + RESTful API features
            in an Agile environment on a large codebase. Before that I taught Azure AI-900 certification
            prep to 90+ high school students, achieving an 85% pass rate — which means I can explain
            complex technical concepts clearly, not just implement them.
          </p>
          <p>
            My focus is shifting toward Application Security and DevSecOps. I hold CompTIA Security+
            and actively practice offensive techniques on TryHackMe to keep my attacker mindset sharp.
            I'm looking for AppSec and cloud security roles where engineering depth and security-first
            thinking are both required.
          </p>
        </div>
      </div>
    </section>
  );
}
