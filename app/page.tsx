import { PerfumeExperience } from "@/components/experience/PerfumeExperience";

export default function HomePage() {
  return (
    <main>
      <header className="site-header">
        <a className="brand-mark" href="#" aria-label="WAVE home">WAVE</a>
        <nav className="site-nav" aria-label="Primary navigation">
          <a href="#collection">Collection</a>
          <a href="#wave">WAVE</a>
        </nav>
      </header>

      <section className="hero" id="collection" aria-labelledby="collection-title">
        <div className="hero-copy">
          <p className="eyebrow">WAVE Fragrances</p>
          <h1 id="collection-title">Explore the collection</h1>
          <p className="interaction-hint">Drag, swipe or scroll to move across the rail.</p>
        </div>
        <PerfumeExperience />
      </section>

      <section className="homepage-band" id="wave">
        <div>
          <p className="eyebrow">WAVE</p>
          <h2>Seven fragrances. One interactive collection.</h2>
        </div>
        <p className="band-note">
          Product content is data-driven and will fill in as the approved catalog is supplied.
        </p>
      </section>

      <footer className="site-footer">
        <span>WAVE Fragrances</span>
        <span>2026</span>
      </footer>
    </main>
  );
}
