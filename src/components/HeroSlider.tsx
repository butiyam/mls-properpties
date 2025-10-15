import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-fade';
import styles from './HeroSlider.module.css';


const slides = [
  {
    image: '/gallery1.png', // Replace with actual image path
    title: 'Available Properties',
    subtitle: 'Lush Estates, private communities, and easy access to Chicago',
    tagline: 'The perfect blend of serenity and sophistication'
  },
  {
    image: '/gallery2.png', // Replace with actual image path
    title: 'Available Properties',
    subtitle: 'Lush Estates, private communities, and easy access to Chicago',
    tagline: 'The perfect blend of serenity and sophistication'
  },
  {
    image: '/gallery3.png', // Replace with actual image path
    title: 'Available Properties',
    subtitle: 'Lush Estates, private communities, and easy access to Chicago',
    tagline: 'The perfect blend of serenity and sophistication'
  },
  {
    image: '/gallery4.png', // Replace with actual image path
    title: 'Available Properties',
    subtitle: 'Lush Estates, private communities, and easy access to Chicago',
    tagline: 'The perfect blend of serenity and sophistication'
  },
  {
    image: '/gallery5.png', // Replace with actual image path
    title: 'Available Properties',
    subtitle: 'Lush Estates, private communities, and easy access to Chicago',
    tagline: 'The perfect blend of serenity and sophistication'
  },
  {
    image: '/gallery6.png', // Replace with actual image path
    title: 'Available Properties',
    subtitle: 'Lush Estates, private communities, and easy access to Chicago',
    tagline: 'The perfect blend of serenity and sophistication'
  },
  // Add more slides as needed
];

export default function HeroSlider() {
  return (
    <Swiper
      modules={[Autoplay, EffectFade]}
      effect="fade"
      loop
      autoplay={{ delay: 3000, disableOnInteraction: false }}
      className={styles.heroSwiper}
      slidesPerView={1}
    >
      {slides.map((src, idx) => (
        <SwiperSlide key={idx}>
          <div
            className={styles.slideBg}
            style={{ backgroundImage: `url(${src})` }}
          >
            <div className={styles.overlay}>
              <h1 className={styles.title}>Find a home in style</h1>
              {/* Your search bar component goes here */}
            </div>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
