import React, { useCallback, useEffect, useState } from 'react';
import { Swiper, Image, ImageUploader, Toast ,Dialog} from 'antd-mobile';
import type { ImageUploadItem } from 'antd-mobile/es/components/image-uploader';
import { createClient } from '@supabase/supabase-js';
import styles from './index.less';

// Inline Supabase client (env-free)
const supabase = createClient(
  'https://tuiwsyyxhzhjonchrtps.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR1aXdzeXl4aHpoam9uY2hydHBzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ3NDc3NjQsImV4cCI6MjA4MDMyMzc2NH0.6izd1nRzDu3FUc7Yx08W_-MN05l21uVy1sbe13Np3kA'
);

const BUCKET_NAME = 'photos';

export default function HomePage() {
  const [fileList, setFileList] = useState<ImageUploadItem[]>([]);
  const [slides, setSlides] = useState<{ image: string; id: number,title:string }[]>([]);
  const run = async () => {
    const prefix = 'uploads';
    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .list(prefix, {
        limit: 100,
        offset: 0,
        sortBy: { column: 'name', order: 'desc' },
      });
    if (error) {
      console.error('[Supabase list error]', error.message);
      Toast.show({ content: '获取图片列表失败', duration: 2000, icon: 'fail' });
      return;
    }
    const urls = (data || [])
      .filter((item) => item.name)
      .map((item, index) => {
        return {
          image: supabase.storage
            .from(BUCKET_NAME)
            .getPublicUrl(`${prefix}/${item.name}`).data.publicUrl,
          id: index,
        title: item.name
        }
      }

      );
    setSlides(urls);
    setFileList(urls.map((u) => ({ url: u.image })));
    console.log('[Supabase photos]', urls);
  };
  useEffect(() => {
    run();
  }, []);




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
    [],
  );


  const pathFromPublicUrl = (u: string) =>
    decodeURIComponent(u.replace(/^https?:\/\/[^/]+\/storage\/v1\/object\/public\/[^/]+\//, ''));

  const onDelete = async (item: ImageUploadItem) => {
    const confirmed = await Dialog.confirm({ content: '是否确认删除' });
    if (!confirmed) return false;
    const url = item.url as string | undefined;
    if (!url) return false;
    const path = pathFromPublicUrl(url);
    const { error } = await supabase.storage.from(BUCKET_NAME).remove([path]);
    if (error) {
      Toast.show({ content: '删除失败', duration: 2000, icon: 'fail' });
      return false;
    }
    Toast.show({ content: '已删除', duration: 1500, icon: 'success' });
    setSlides((prev) => prev.filter((s) => s.image !== url));
    return true;
  };



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

      <ImageUploader value={fileList} onChange={setFileList} upload={upload} onDelete={onDelete} maxCount={5} />
    </div>
  );
}
