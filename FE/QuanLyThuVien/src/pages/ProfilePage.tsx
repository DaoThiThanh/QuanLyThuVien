import React, { useState, useEffect } from 'react';
import Header from '../components/layout/Header';
import ProfileHeader from '../components/Profile/ProfileHeader';
import ProfileStats from '../components/Profile/ProfileStats';
import PersonalInfo from '../components/Profile/PersonalInfo';
import SecuritySettings from '../components/Profile/SecuritySettings';
import './ProfilePage.css';
import { getProfileApi, getUserId, type ProfileData } from '../services/modules/authService';

const ProfilePage: React.FC = () => {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      const userId = getUserId();
      if (!userId) {
        setLoading(false);
        return;
      }
      try {
        const data = await getProfileApi(userId);
        setProfile(data);
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
      <div className="profile-page-container">
        <Header />
        <div className="loading-container" style={{ textAlign: 'center', padding: '100px' }}>
          <div className="spinner">Đang tải thông tin...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-page-container">
      <Header />
      <main className="profile-main-content">
        <div className="profile-page-header">
          <h1>Hồ sơ cá nhân</h1>
          <p>Quản lý thông tin tài khoản của bạn</p>
        </div>
        
        <div className="profile-content-wrapper">
          <ProfileHeader profile={profile} />
          <ProfileStats />
          <PersonalInfo profile={profile} />
          <SecuritySettings />
        </div>
      </main>
    </div>
  );
};

export default ProfilePage;
