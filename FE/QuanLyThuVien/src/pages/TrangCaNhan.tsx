import React, { useState, useEffect } from 'react';
import Header from '../components/GiaoDienChinh/DauTrang';
import ProfileHeader from '../components/ThongTinCaNhan/DauTrangCaNhan';
import ProfileStats from '../components/ThongTinCaNhan/ThongKeCaNhan';
import PersonalInfo from '../components/ThongTinCaNhan/ThongTinCaNhan';
import SecuritySettings from '../components/ThongTinCaNhan/CaiDatBaoMat';
import styles from './TrangCaNhan.module.css';
import { getProfileApi, getUserId, type ProfileData } from '../dichVu/modules/dichVuXacThuc';
import { CheckBorrowingLimit } from '../dichVu/modules/dichVuMuonSach';

const ProfilePage: React.FC = () => {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      const userId = getUserId();
      if (!userId) {
        setLoading(false);
        return;
      }
      try {
        const [profileData, statsData] = await Promise.all([
          getProfileApi(userId),
          CheckBorrowingLimit(userId)
        ]);
        setProfile(profileData);
        setStats(statsData);
      } catch (error) {
        console.error("Lỗi khi tải hồ sơ:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className={styles['profile-page-container']}>
        <Header />
        <div className={styles['loading-container']} style={{ textAlign: 'center', padding: '100px' }}>
          <div className={styles['spinner']}>Đang tải thông tin...</div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles['profile-page-container']}>
      <Header />
      <main className={styles['profile-main-content']}>
        <div className={styles['profile-page-header']}>
          <h1>Hồ sơ cá nhân</h1>
          <p>Quản lý thông tin tài khoản của bạn</p>
        </div>
        
        <div className={styles['profile-content-wrapper']}>
          <ProfileHeader profile={profile} />
          <ProfileStats stats={stats} />
          <PersonalInfo profile={profile} />
          <SecuritySettings />
        </div>
      </main>
    </div>
  );
};

export default ProfilePage;
