export default function Contact() {
  return (
    <section id="contact" className="py-24 px-6 bg-white border-t border-stone-100">
      <div className="max-w-xl mx-auto text-center">
        <p className="font-mono text-orange-400 text-xs tracking-widest uppercase mb-4">Contact</p>
        <h2 className="text-3xl font-bold text-stone-900 mb-4">Let's talk. 👋</h2>
        <p className="text-stone-500 mb-8 leading-relaxed">
          I'm actively looking for AppSec and cloud security roles. If you're building something
          that needs an engineer who thinks about security from the ground up — reach out!
        </p>
        <div className="flex items-center justify-center gap-4 flex-wrap">
          <a
            href="mailto:bryreid026@gmail.com"
            className="px-6 py-3 bg-orange-400 text-white font-semibold text-sm rounded-xl hover:bg-orange-500 transition-colors shadow-sm"
          >
            ✉️ Send an Email
          </a>
          <a
            href="https://linkedin.com/in/bryanna-reid"
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 border-2 border-orange-200 text-orange-400 text-sm font-medium rounded-xl hover:bg-orange-50 transition-all"
          >
            LinkedIn ↗
          </a>
          <a
            href="https://github.com/bryreid026"
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 border-2 border-stone-200 text-stone-500 text-sm font-medium rounded-xl hover:bg-stone-50 hover:border-stone-300 transition-all"
          >
            GitHub ↗
          </a>
        </div>
      </div>
    </section>
  );
}
