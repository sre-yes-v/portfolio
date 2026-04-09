import Hero from "./Hero";
import About from "./About";
import Contact from "./Contact";


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
        <div className="relative">
          <About />
          <div className="-mt-2 sm:-mt-4">
            <Contact />
          </div>
        </div>
      </div>
    </section>
  );
}