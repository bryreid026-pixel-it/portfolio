import Nav from './components/Nav';
import WorldHero from './components/WorldHero';
import About from './components/About';
import Projects from './components/Projects';
import Skills from './components/Skills';
import Experience from './components/Experience';
import Certs from './components/Certs';
import Contact from './components/Contact';
import Footer from './components/Footer';
import './index.css';

export default function App() {
  return (
    <div className="bg-[#fafaf8] min-h-screen text-stone-800">
      <Nav />
      <main>
        <WorldHero />
        <About />
        <Projects />
        <Skills />
        <Experience />
        <Certs />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
