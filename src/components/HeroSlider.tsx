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
    <div className="relative w-full h-[300px] md:h-[350px] sm:h-[250px] overflow-hidden">
      <Swiper
        modules={[EffectFade, Autoplay]}
        effect="fade"
        autoplay={{ delay: 4500, disableOnInteraction: false }}
        loop
        className="w-full h-full"
        breakpoints={{
          // when window width is >= 640px (sm breakpoint)
          640: {
            height: 350,
          },
          // when window width is >= 768px (md breakpoint)
          768: {
            height: 440,
          },
        }}
      >
        {slides.map((slide, idx) => (
          <SwiperSlide key={idx}>
            <div className="absolute inset-0 w-full h-full">
              <Image
                src={slide.image}
                alt={slide.title}
                width={400}
                height={300}
                style={{ width: "100%", maxHeight: "600px", objectFit: "cover" }}
                priority // optionally preload images for hero sliders
              />
              {/* Overlay */}
              <div className="absolute inset-0 bg-black/30 flex flex-col justify-center items-center p-4">
                <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 drop-shadow text-center">
                  {slide.title}
                </h1>
                <p className="text-base md:text-lg text-white mb-2 px-4 text-center">
                  {slide.subtitle}
                </p>
                <p className="text-sm sm:text-base hidden sm:block text-white">
                  {slide.tagline}
                </p>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
