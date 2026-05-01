import React from 'react';
import Header from '../components/layout/Header';
import ProfileHeader from '../components/Profile/ProfileHeader';
import ProfileStats from '../components/Profile/ProfileStats';
import PersonalInfo from '../components/Profile/PersonalInfo';
import SecuritySettings from '../components/Profile/SecuritySettings';
import './ProfilePage.css';

const ProfilePage: React.FC = () => {
  return (
    <div className="profile-page-container">
      <Header />
      <main className="profile-main-content">
        <div className="profile-page-header">
          <h1>Hồ sơ cá nhân</h1>
          <p>Quản lý thông tin tài khoản của bạn</p>
        </div>
        
        <div className="profile-content-wrapper">
          <ProfileHeader />
          <ProfileStats />
          <PersonalInfo />
          <SecuritySettings />
        </div>
      </main>
    </div>
  );
};

export default ProfilePage;
