'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/pagination';

import styles from './ClientTestimonials.module.css';

const testimonials = [
  {
    name: 'Jill Mirante',
    icon: '/home-icon.png',
    stars: 5,
    quote:
      '“Oak Brook Realty managed every detail with care and precision—turning a house hunt into a truly elevated living experience.”',
  },
  {
    name: 'Paul Chindada',
    icon: '/home-icon.png',
    stars: 5,
    quote:
      '“With unrivaled market insight and concierge-level service, Oak Brook Realty delivers an experience that sets a new standard in real estate.”',
  },
  {
    name: 'Binu Mohan',
    icon: '/home-icon.png',
    stars: 5,
    quote:
      '“Oak Brook Realty not only found me the condo of my dreams, but also guided the sale years later—both seamless, and stress-free.”',
  },
  {
    name: 'Alex Smith',
    icon: '/home-icon.png',
    stars: 5,
    quote:
      '“Best real estate experience ever with Oak Brook Realty!”',
  },
];

export default function TestimonialsSection() {
  return (
    <section className={styles.section}>
      <div className={styles.testimonialsRow}>
        <img src="/gallery5.png" className={styles.leftCircleImage} alt="Home pool" />
        <div className={styles.cardsBlock}>
          <span className={styles.label}>Testimonials</span>
          <h2 className={styles.title}>What Our Clients Say?</h2>
          <Swiper
            modules={[Autoplay, Pagination]}
            spaceBetween={15}
            slidesPerView={2}
            loop={true}
            autoplay={{ delay: 4000, disableOnInteraction: false }}
             pagination={{ clickable: true, el: '.swiper-pagination' }}
            breakpoints={{
              0: { slidesPerView: 1 },
              768: { slidesPerView: 2 },
            }}
            className={styles.testimonialsCarousel}
          >
            {testimonials.map((item, idx) => (
              <SwiperSlide key={idx} className={styles.testimonialCard}>
                <img src={item.icon} alt="" className={styles.cardIcon} />
                <div className={styles.name}>{item.name}</div>
                <div className={styles.stars}>★★★★★</div>
                <div className={styles.quoteMark}>❞</div>
                <div className={styles.cardText}>{item.quote}</div>
              </SwiperSlide>
            ))}
             <div className="swiper-pagination"></div>
          </Swiper>
        </div>
      </div>
    </section>
  );
}
