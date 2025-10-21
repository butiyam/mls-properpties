import { useState } from 'react';
import styles from './AboutUsSection.module.css';
import { FaHome } from "react-icons/fa";

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
              {/* Modal with iframe */}
              {modalOpen && (
                <div className={styles.videoModalBackdrop} onClick={closeModal}>
                  <div className={styles.videoModalBox} onClick={e => e.stopPropagation()}>
                    <iframe
                      width="560"
                      height="315"
                      src="/Oak-Brook-Realty.mp4"
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
          <button className={styles.cta} onClick={handle360Play} ><FaHome/> Explore More</button>
        </div>
      </div>
    </section>
  );
}
