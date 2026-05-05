import React, { useEffect, useState } from 'react';
import styles from './DanhMucSach.module.css';
import { GetCategories } from '../../dichVu/modules/dichVuSach';
import type { CategoryItem } from '../../kieuDuLieu/sach';

const colorClasses = [
  'icon-cntt', 'icon-toan', 'icon-vatly', 'icon-lichsu',
  'icon-kinhte', 'icon-ngoaingu', 'icon-vanhoc', 'icon-hoahoc', 'icon-triethoc'
];

const BookCategories: React.FC = () => {
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await GetCategories();
        if (Array.isArray(data)) {
          setCategories(data);
        } else if (data && data.data) {
          setCategories(data.data);
        }
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return (
    <div className={styles['categories-section']}>
      <div className={styles['section-header']}>
        <div className={styles['header-left']}>
          <div className={styles['icon-grid']}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
          </div>
          <div className={styles['header-titles']}>
            <h2 className={styles['section-title']}>Thể loại sách</h2>
            <p className={styles['section-subtitle']}>Duyệt theo chủ đề</p>
          </div>
        </div>
      </div>

      {loading ? (
        <div className={styles['categories-grid']} style={{ minHeight: '150px', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
          <p>Đang tải danh mục...</p>
        </div>
      ) : (
        <div className={styles['categories-grid']}>
          {categories.map((category, index) => {
            const iconClass = colorClasses[index % colorClasses.length];
            const icon = category.icon || '📚';
            return (
              <div className={styles['category-card']} key={category.id}>
                <div className={`${styles['category-icon-wrapper']} ${styles[iconClass]}`}>
                  <span className={styles['category-emoji']} role="img" aria-label={category.tenDanhMuc}>
                    {icon}
                  </span>
                </div>
                <h3 className={styles['category-title']}>{category.tenDanhMuc}</h3>
                <p className={styles['category-count']}>Khám phá</p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default BookCategories;
