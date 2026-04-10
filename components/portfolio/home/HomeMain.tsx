import Hero from "./Hero";
import About from "./About";
import Contact from "./Contact";
import Projects from "./Projects";


export default function HomeMain() {
  return (
    <section className="relative w-full ">
      <div
        className="mx-auto w-full max-w-full"
        style={{
          background:
            "linear-gradient(180deg, #0b1020 0%, #080d1a 100%)",
        }}
      >
        <Hero />
        <div className="relative space-y-20">
          <About />
          <Projects/>
            <Contact />
        </div>
      </div>
    </section>
  );
}