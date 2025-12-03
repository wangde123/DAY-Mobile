import React from 'react';
import { Swiper, Image } from 'antd-mobile';

import img1 from '../assets/20251203-101051.jpeg';
import img2 from '../assets/20251203-101109.jpeg';
import img3 from '../assets/20251203-101129.jpeg';

import styles from './index.less';

export default function HomePage() {
  const slides = [
    { id: 2, image: img1, title: 'Image 1' },
    { id: 3, image: img2, title: 'Image 2' },
    { id: 4, image: img3, title: 'Image 3' },
  ];

  return (
    <div className={styles.homeContainer}>
      <Swiper autoplay loop autoplayInterval={2000}>
        {slides.map((slide) => (
          <Swiper.Item key={slide.id}>
            <div className={styles.swiperItem}>
              <Image  src={slide.image} alt={slide.title} className={styles.swiperImage} />
            </div>
          </Swiper.Item>
        ))}
      </Swiper>
      
      <div className={styles.welcomeSection}>
        <h2 className={styles.welcomeTitle}>宝宝生日快乐</h2>
      </div>
    </div>
  );
}
