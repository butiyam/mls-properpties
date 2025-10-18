import { useState } from 'react';
import { FaMapMarkerAlt, FaEnvelope, FaPhoneAlt, FaFax, FaFacebookF, FaTwitter, FaLinkedinIn, FaInstagram } from "react-icons/fa";
import Image from "next/image";
import Link from "next/link";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Zoom } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/zoom';
import styles from './FooterGallery.module.css';

const images = [
  "/gallery1.png", // Replace with actual image URLs or import statements
  "/gallery2.png",
  "/gallery3.png",
  "/gallery4.png",
  "/gallery5.png",
  "/gallery6.png",
];

export default function Footer() {

  const [modalOpen, setModalOpen] = useState(false);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [fullscreen, setFullscreen] = useState(false);

  function openModal(idx: number) {
    setCurrentIdx(idx);
    setModalOpen(true);
  }
  function closeModal() {
    setModalOpen(false);
    setFullscreen(false);
  }
  function toggleFullscreen() {
    setFullscreen(f => !f);
  }

  return (
    <footer className="bg-footer text-white pt-8">
      {/* Contact Bar */}
      <div className="max-w-6xl mx-auto mb-10 p-5">
        <div className="bg-[#00bfa6] rounded-2xl flex flex-wrap justify-between items-center p-6 gap-6 md:gap-0 shadow-md">
          {/* Address */}
          <div className="flex items-center gap-2 min-w-[200px]">
            <div className="bg-[#fff] p-3 rounded-full text-white"><FaMapMarkerAlt fill="#00bfa6" size={22} /></div>
            <div>
              <div className="font-semibold">Address</div>
              <div className="text-sm text-white">7 N. Grant Street Suite LL<br />Hinsdale, IL 60521</div>
            </div>
          </div>
          {/* Email */}
          <div className="flex items-center gap-2 min-w-[200px]">
            <div className="bg-[#fff] p-3 rounded-full text-white"><FaEnvelope fill="#00bfa6" size={22} /></div>
            <div>
              <div className="font-semibold">Send Email</div>
              <div className="text-sm text-white">info@obrglobal.com</div>
            </div>
          </div>
          {/* Call */}
          <div className="flex items-center gap-2 min-w-[180px]">
            <div className="bg-[#fff] p-3 rounded-full text-[#00bfa6]"><FaPhoneAlt fill="#00bfa6" size={22} /></div>
            <div>
              <div className="font-semibold">Call Today</div>
              <div className="text-sm text-white">(630) 242-5662</div>
            </div>
          </div>
          {/* Fax */}
          <div className="flex items-center gap-2 min-w-[160px]">
            <div className="bg-[#fff] p-3 rounded-full text-white"><FaFax fill="#00bfa6" size={22} /></div>
            <div>
              <div className="font-semibold">Fax</div>
              <div className="text-sm text-white">(312) 291-4258</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10 pb-8 items-start">
        {/* Company & Social */}
        <div className="flex flex-col md:items-center items-start text-justify md:text-left p-5">
            <Image src="/logo-footer.png" width={180}  height={180} alt="Company Logo" />
            <p className="mb-4 text-gray-200">Discover timeless elegance, world-class design, and unmatched locations.<br />
              Your next extraordinary home awaits.</p>
            <div className="flex gap-5 justify-center md:justify-start mb-4">
              <span>Follow on</span>
              <a href="#"><FaFacebookF className="hover:text-[#1fe6e6]" /></a>
              <a href="#"><FaTwitter className="hover:text-[#1fe6e6]" /></a>
              <a href="#"><FaLinkedinIn className="hover:text-[#1fe6e6]" /></a>
              <a href="#"><FaInstagram className="hover:text-[#1fe6e6]" /></a>
            </div>
        </div>
        {/* Quick Links */}
        <div className="flex flex-col md:items-center items-start  p-5">
          <h4 className="text-lg font-semibold mb-2 border-b-2 border-[#1fe6e6] w-fit">Quick Links</h4>
          <ul className="space-y-3 text-[#1fe6e6] text-base mt-2 font-semibold">
            <li>
              <Link href="/" className="flex items-center gap-2">
              &raquo; <span className="text-white hover:text-[#1fe6e6]">Home</span>
              </Link>
            </li>
            <li>
              <Link href="/contact-us" className="flex items-center gap-2">
              &raquo; <span className="text-white hover:text-[#1fe6e6]">Contact Us</span>
              </Link>
            </li>
            <li>
              <Link href="/view-properties" className="flex items-center gap-2">
              &raquo; <span className="text-white hover:text-[#1fe6e6]">View Properties</span>
              </Link>
            </li>
          </ul>
        </div>
        {/* Gallery */}
        <div className="p-5">
          <h4 className="text-lg font-semibold mb-2 border-b-2 border-[#1fe6e6] w-fit">Gallery</h4>
          <div className="grid md:grid-cols-2 grid-cols-3 gap-2 mt-2">
            <div className={styles.gallerySection}>
          <div className={styles.galleryGrid}>
            {images.map((src, idx) => (
              <div className={styles.galleryThumb} key={idx}
                tabIndex={0}
                onClick={() => openModal(idx)}
                onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && openModal(idx)}
              >
                <img src={src} alt={`Property ${idx + 1}`} />
              </div>
            ))}
          </div>
          {modalOpen && (
            <div
              className={`${styles.modalBackdrop} ${fullscreen ? styles.fullscreen : ''}`}
              onClick={closeModal}
            >
              <div
                className={styles.modalImageBox}
                style={{ width: fullscreen ? '100vw' : undefined, height: fullscreen ? '100vh' : undefined }}
                onClick={e => e.stopPropagation()}
                tabIndex={-1}
              >
                <Swiper
                  modules={[Navigation, Zoom]}
                  navigation
                  zoom
                  initialSlide={currentIdx}
                  spaceBetween={30}
                  slidesPerView={1}
                  onSlideChange={swiper => setCurrentIdx(swiper.activeIndex)}
                  className={styles.modalSwiper}
                >
                  {images.map((src, idx) => (
                    <SwiperSlide key={idx}>
                      <div className="swiper-zoom-container">
                        <img src={src} alt={`Large property ${idx + 1}`} />
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>
                <button className={styles.modalClose} onClick={closeModal} aria-label="Close gallery">&times;</button>
                <button className={styles.modalFullscreen} onClick={toggleFullscreen} aria-label="Toggle full screen">
                  {fullscreen ? '🗗' : '🗖'}
                </button>
              </div>
            </div>
          )}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-600 py-4 text-center text-gray-200 text-sm">
        &copy; 2025 Oak Brook Realty. Designed By Samak Solutions
      </div>
    </footer>
  );
}
