import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/autoplay';

import img1 from '../assets/20251202-165356.jpeg';
import img2 from '../assets/20251202-165406.jpeg';
import img3 from '../assets/20251202-165413.jpeg';

import styles from './index.less';

export default function HomePage() {
  const slides = [
    { id: 2, image: img1, title: 'Image 1' },
    { id: 3, image: img2, title: 'Image 2' },
    { id: 4, image: img3, title: 'Image 3' },
  ];

  return (
    <div className={styles.homeContainer}>
      <Swiper
        modules={[Autoplay]}
        spaceBetween={0}
        slidesPerView={1}
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
        }}
        loop={true}
        className={styles.swiper}
      >
        {slides.map((slide) => (
          <SwiperSlide key={slide.id}>
            <div className={styles.slideContent}>
              <img src={slide.image} alt={slide.title} className={styles.slideImage} />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
      
      <div className={styles.welcomeSection}>
        <h2 className={styles.welcomeTitle}>Yay! Welcome to Mi Mobile!</h2>
        <p className={styles.description}>
          Enjoy the beautiful carousel experience on your device.
        </p>
      </div>
    </div>
  );
}
