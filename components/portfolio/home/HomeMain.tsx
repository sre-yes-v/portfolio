import Hero from "./Hero";
import About from "./About";


export default function HomeMain() {
  return (
    <section className="relative w-full ">
      <div className="mx-auto w-full max-w-full">
        <Hero />
        <About />
      </div>
    </section>
  );
}