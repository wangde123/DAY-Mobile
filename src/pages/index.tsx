import React, { useCallback, useMemo, useState } from 'react';
import { Swiper, Image, ImageUploader, Toast } from 'antd-mobile';
import type { ImageUploadItem } from 'antd-mobile/es/components/image-uploader';
import { createClient } from '@supabase/supabase-js';
import img1 from '../assets/20251203-101051.jpeg';
import img2 from '../assets/20251203-101109.jpeg';
import img3 from '../assets/20251203-101129.jpeg';
import styles from './index.less';

const BUCKET_NAME = 'photos';

const createSupabaseClient = () => {
  const url = process.env.SUPABASE_URL;
  const anonKey = process.env.SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    throw new Error('Missing SUPABASE_URL or SUPABASE_ANON_KEY environment variables.');
  }

  return createClient(url, anonKey);
};

export default function HomePage() {
  const [fileList, setFileList] = useState<ImageUploadItem[]>([]);

  const supabase = useMemo(() => createSupabaseClient(), []);

  const upload = useCallback(
    async (file: File) => {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${fileExt}`;
      const filePath = `uploads/${fileName}`;

      const { error } = await supabase.storage.from(BUCKET_NAME).upload(filePath, file, {
        cacheControl: '3600',
        upsert: true,
      });

      if (error) {
        Toast.show({ content: '上传失败，请稍后重试', duration: 2000, icon: 'fail' });
        throw error;
      }

      const { data } = supabase.storage.from(BUCKET_NAME).getPublicUrl(filePath);

      Toast.show({ content: '上传成功', duration: 1500, icon: 'success' });
      return {
        url: data.publicUrl,
      };
    },
    [supabase],
  );

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
              <Image src={slide.image} alt={slide.title} className={styles.swiperImage} />
            </div>
          </Swiper.Item>
        ))}
      </Swiper>

      <ImageUploader value={fileList} onChange={setFileList} upload={upload} />
    </div>
  );
}
