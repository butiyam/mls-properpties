import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectFade, Autoplay } from 'swiper/modules';
import Image from 'next/image';
import 'swiper/css';
import 'swiper/css/effect-fade';

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
    <div className="relative w-full h-[440px] overflow-hidden">
      <Swiper
        modules={[EffectFade, Autoplay]}
        effect="fade"
        autoplay={{ delay: 4500, disableOnInteraction: false }}
        loop
        className="w-full h-full"
      >
        {slides.map((slide, idx) => (
          <SwiperSlide key={idx}>
            <div className="absolute inset-0 w-full h-full">
              <Image
                src={slide.image}
                alt={slide.title}
               width={400}
               height={300}
               style={{ width: "100%", height: "auto" }}
              />
              {/* Overlay */}
              <div className="absolute inset-0 bg-black/30 flex flex-col justify-center items-center">
                <h1 className="text-5xl md:text-3xl font-bold text-white mb-4 drop-shadow text-center">{slide.title}</h1>
                <p className="text-lg md:text-xl text-white mb-2 p-5 text-center">{slide.subtitle}</p>
                <p className="text-lg text-white">{slide.tagline}</p>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
