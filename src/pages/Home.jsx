import { Link } from "react-router-dom";
import "./Home.css";

function Home() {
  return (
    <main className="home">

      <section className="hero">
        <div className="hero-content">
          <p className="hero-label">VPRO PHOTOGRAPHY</p>

          <h1>
            Capturing moments.
            <br />
            Preserving memories.
          </h1>

          <p className="hero-description">
            Explore a collection of weddings, graduations, parties,
            and unforgettable moments captured through photography.
          </p>

          <Link to="/gallery" className="hero-button">
            Explore Gallery
          </Link>
        </div>
      </section>

      <section className="categories-section">
        <div className="section-heading">
          <p>EXPLORE</p>
          <h2>Photography Collections</h2>
        </div>

        <div className="category-grid">
          <div className="category-card">
            <h3>Weddings</h3>
            <p>Beautiful moments from unforgettable celebrations.</p>
          </div>

          <div className="category-card">
            <h3>Graduations</h3>
            <p>Celebrating achievement, growth, and new beginnings.</p>
          </div>

          <div className="category-card">
            <h3>Parties</h3>
            <p>The energy, smiles, and memories of special occasions.</p>
          </div>

          <div className="category-card">
            <h3>Other Events</h3>
            <p>More moments captured and preserved.</p>
          </div>
        </div>
      </section>

    </main>
  );
}

export default Home;