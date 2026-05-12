import React from 'react';
import Header from '../components/GiaoDienChinh/DauTrang';
import LibraryHero from '../components/GiaoDienChinh/BannerThuVien';
import HomeAnnouncements from '../components/TrangChu/ThongBaoTrangChu';
import PopularBooks from '../components/TrangChu/SachPhoBien';
import NewBooks from '../components/TrangChu/SachMoi';
import PromotionProgram from '../components/TrangChu/ChuongTrinhKhuyenMai';
import BrowseBooks from '../components/TrangChu/DuyetSach';
import BorrowingRules from '../components/TrangChu/QuyDinhMuonSach';
import Footer from '../components/GiaoDienChinh/CuoiTrang';

const HomePage: React.FC = () => {
  return (
    <div style={{ backgroundColor: '#fff', minHeight: '100vh' }}>
      <Header />
      <LibraryHero />
      <main>
        <HomeAnnouncements />
        <PopularBooks />
        <NewBooks />
        <PromotionProgram />
        <BrowseBooks />
        <BorrowingRules />
      </main>
      <Footer />
    </div>
  );
};

export default HomePage;
