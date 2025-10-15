import styles from './AboutUsSection.module.css';
import { FaHome } from "react-icons/fa";

export default function AboutUsSection() {
  return (
    <section className={styles.root}>
      <div className={styles.grid}>
        {/* Left: Image & badge */}
        <div className={styles.visual}>
          <div className={styles.imgBox}>
            <img src="/aboutus.png" alt="Modern Real Estate" className={styles.homeShape}/>
          
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
          <button className={styles.cta}><FaHome/> Explore More</button>
        </div>
      </div>
    </section>
  );
}
