import { useState } from 'react';
import styles from './AboutUsSection.module.css';
import { FaHome } from "react-icons/fa";
import Link from 'next/link';

export default function AboutUsSection() {

  const [modalOpen, setModalOpen] = useState(false);

  function handle360Play() {
    setModalOpen(true);
  }
  function closeModal() {
    setModalOpen(false);
  }

  return (
    <section className={styles.root}>
      <div className={styles.grid}>
        {/* Left: Image & badge */}
        <div className={styles.visual}>
          <div className={styles.imgBox}>
            <img src="/aboutus.png" alt="Modern Real Estate" className={styles.homeShape}/>
          
          {/* Circular SVG overlay */}
            <button
              className={styles.brand360Play}
              aria-label="Play 360 video"
               onClick={handle360Play}
     
            >
               <div style={{ position: "relative", width: 120, height: 120 }}>
      <svg
        width="110"
        height="110"
        viewBox="0 0 110 110"
        style={{ display: "block", overflow: "visible" }}
      >
        {/* Outer circle */}
        <circle cx="55" cy="55" r="52" fill="#23dbc7" stroke="#fff" strokeWidth="2" />
        {/* Circle Path for text */}
        <defs>
          <path
            id="circlePath"
            d="
              M 55,55
              m -38,0
              a 38,38 0 1,1 76,0
              a 38,38 0 1,1 -76,0
            "
          />
        </defs>
        {/* Brand text path group with animation */}
        <g className="brand-circle-text">
          <text
            fontSize="12"
            fill="#fff"
            fontWeight="bold"
          >
            <textPath href="#circlePath" startOffset="0">
              OAK BROOK REALTY · OAK BROOK REALTY ·
            </textPath>
          </text>
        </g>
        {/* Play icon (centered polygon triangle) */}
        <polygon
          points="65,55 49,44 49,66"
          fill="#fff"
        />
      </svg>
      <style>{`
        .brand-circle-text {
          transform-origin: 55px 55px;
          animation: spintext 8s linear infinite;
        }
        @keyframes spintext {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
               </div>
            </button>

              {/* Modal with iframe */}
              {modalOpen && (
                <div className={styles.videoModalBackdrop} onClick={closeModal}>
                  <div className={styles.videoModalBox} onClick={e => e.stopPropagation()}>
                    <iframe
                      width="560"
                      height="315"
                      src="/Oak-Brook-Realty-4.mp4"
                      title="360° Property Tour"
                      frameBorder="0"
                      allow="autoplay; encrypted-media"
                      allowFullScreen
                    />
                    <button className={styles.modalClose} onClick={closeModal}>&times;</button>
                  </div>
                </div>
              )}

          </div>
        </div>
        {/* Right: Text */}
        <div className={styles.content}>
          <p className={styles.label}>About Us</p>
          <h2 className={styles.title}>
            Curators of Distinctive Living
          </h2>
          <p className={styles.text}>
            At Oak Brook Realty, we redefine the art of real estate. With a curated portfolio
            of high-end residences in the world’s most sought-after destinations,
            ...we offer more than homes—we offer access to an extraordinary lifestyle.<br /><br />
            Our seasoned team blends local expertise with global vision, ensuring every transaction is as seamless as it is sophisticated.
          </p>

            <Link className={styles.cta+' w-full'} href="/view-properties"><FaHome/> Explore More</Link>
          
        </div>
      </div>
    </section>
  );
}
