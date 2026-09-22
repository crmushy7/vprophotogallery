import "./About.css";
import vproImage from "../assets/vpro.jpg";

function About() {
  return (
    <main className="about-page">

      {/* =========================
          HERO
      ========================= */}
      <section className="about-hero">

        <div className="about-hero-shape shape-one"></div>
        <div className="about-hero-shape shape-two"></div>

        <div className="about-hero-content">

          <div className="about-hero-text">
            <span className="about-small-label">
              VPRO PHOTOGRAPHY
            </span>

            <h1>
              Stories worth
              <span> remembering.</span>
            </h1>

            <p>
              Tunakamata nyakati zinazopita haraka,
              na kuzihifadhi katika picha ambazo
              zinaweza kuishi nasi kwa miaka mingi.
            </p>

            <a href="/gallery" className="about-primary-button">
              Explore Gallery
              <span>→</span>
            </a>
          </div>

          <div className="about-hero-image-area">

            <div className="hero-image-decoration"></div>

            <div className="about-hero-image">
              <img
                src="/Vipro.jpg"
                alt="VPro Photography"
              />
            </div>

            <div className="hero-floating-card">
              <div className="floating-card-icon">✦</div>

              <div>
                <strong>VPro</strong>
                <span>Photography</span>
              </div>
            </div>

            <div className="hero-photo-number">
              01
            </div>

          </div>

        </div>
      </section>


      {/* =========================
          ABOUT VPRO
      ========================= */}
      <section className="story-section">

        <div className="section-container">

          <div className="section-top-line">
            <span>01</span>
            <p>KUHUSU VPRO</p>
          </div>

          <div className="story-layout">

            <div className="story-heading">
              <h2>
                Zaidi ya
                <span> picha.</span>
              </h2>

              <div className="green-line"></div>

              <p className="story-highlight">
                Kila tukio lina wakati wake.
                Kila wakati una hisia zake.
                Na kila hisia ina hadithi yake.
              </p>
            </div>

            <div className="story-text">

              <p>
                <strong>VPro Photography</strong> ni chapa
                inayolenga kunasa na kuhifadhi nyakati
                muhimu za maisha kupitia picha.
              </p>

              <p>
                Kwa VPro, upigaji picha si kuchukua picha
                tu. Ni kuhifadhi hisia, watu, mazingira
                na matukio ambayo yanaifanya siku fulani
                kuwa ya kipekee.
              </p>

              <p>
                Kuanzia harusi na mahafali hadi sherehe,
                events na matukio mbalimbali, VPro inalenga
                kuacha kumbukumbu ambayo inaweza kurudiwa
                tena kupitia picha.
              </p>

              <div className="story-signature">
                <span>VPRO</span>
                <small>CAPTURING MOMENTS</small>
              </div>

            </div>

          </div>

        </div>
      </section>


      {/* =========================
          QUOTE
      ========================= */}
      <section className="quote-section">

        <div className="quote-decoration quote-circle"></div>
        <div className="quote-decoration quote-circle-small"></div>

        <div className="quote-content">

          <span className="quote-label">
            OUR PHILOSOPHY
          </span>

          <div className="quote-mark">“</div>

          <h2>
            Kila picha ina
            <span> hadithi yake.</span>
          </h2>

          <p>
            Kazi yetu ni kuhakikisha
            hadithi hiyo haipotei.
          </p>

          <div className="quote-bottom">
            VPRO PHOTOGRAPHY
          </div>

        </div>
      </section>


      {/* =========================
          WEBSITE
      ========================= */}
      <section className="website-section">

        <div className="section-container">

          <div className="section-top-line">
            <span>02</span>
            <p>KUHUSU TOVUTI HII</p>
          </div>

          <div className="website-heading">

            <div>
              <h2>
                Nyumba ya kidijitali
                <span> ya VPro.</span>
              </h2>
            </div>

            <p>
              Tovuti hii imeundwa kuwa sehemu rahisi,
              nzuri na salama ya kuhifadhi, kuonyesha
              na kushirikisha kazi za VPro Photography.
            </p>

          </div>


          <div className="feature-grid">

            <div className="feature-card feature-green">

              <div className="feature-number">
                01
              </div>

              <div className="feature-icon">
                ◫
              </div>

              <h3>Albums</h3>

              <p>
                Kila tukio linaweza kuwa na album yake,
                likiwa limepangwa kwa urahisi ili
                kumbukumbu zisipotee.
              </p>

            </div>


            <div className="feature-card feature-cream">

              <div className="feature-number">
                02
              </div>

              <div className="feature-icon">
                ◌
              </div>

              <h3>Collections</h3>

              <p>
                Picha hupangwa katika collections
                zinazorahisisha kuchunguza sehemu
                mbalimbali za tukio.
              </p>

            </div>


            <div className="feature-card feature-light-green">

              <div className="feature-number">
                03
              </div>

              <div className="feature-icon">
                ↓
              </div>

              <h3>View & Download</h3>

              <p>
                Tazama picha zako kwa urahisi na
                pakua picha unazohitaji wakati wowote.
              </p>

            </div>

          </div>

        </div>
      </section>


      {/* =========================
          WHY PHOTOS MATTER
      ========================= */}
      <section className="memory-section">

        <div className="section-container">

          <div className="memory-layout">

            <div className="memory-image-wrapper">

              <div className="memory-image-back"></div>

              <img
  src={vproImage}
  alt="Photography memories"
  className="memory-image"
/>

              <div className="memory-badge">
                <span>MEMORIES</span>
                <strong>✦</strong>
              </div>

            </div>


            <div className="memory-text">

              <span className="about-small-label green-label">
                WHY IT MATTERS
              </span>

              <h2>
                Picha zinapita.
                <span>
                  Kumbukumbu zinabaki.
                </span>
              </h2>

              <p>
                Harusi inapita. Mahafali yanafika mwisho.
                Sherehe inaisha. Watu wanaendelea na maisha.
              </p>

              <p>
                Lakini miaka inapopita, picha inaweza
                kukurudisha kwenye siku hiyo — watu
                waliokuwepo, tabasamu, furaha na moments
                ambazo huwezi kurudia kwa namna ile ile.
              </p>

              <div className="memory-highlight">
                <span>“</span>

                <p>
                  Tunapiga picha kwa ajili ya leo,
                  lakini tunazihifadhi kwa ajili ya kesho.
                </p>
              </div>

            </div>

          </div>

        </div>
      </section>


      {/* =========================
          FINAL CTA
      ========================= */}
      <section className="about-final">

        <div className="final-decoration final-circle"></div>

        <div className="final-content">

          <span>
            KARIBU VPRO
          </span>

          <h2>
            Capturing Moments.
            <br />
            <strong>Preserving Memories.</strong>
          </h2>

          <p>
            Chunguza albums mbalimbali na ugundue
            matukio yaliyohifadhiwa kupitia picha.
          </p>

          <a
            href="/gallery"
            className="final-button"
          >
            Explore the Gallery
            <span>→</span>
          </a>

        </div>

      </section>

    </main>
  );
}

export default About;
