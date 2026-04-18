import React from 'react';
import Header from '../components/layout/Header';
import LibraryHero from '../components/layout/LibraryHero';
import HomeAnnouncements from '../components/home/HomeAnnouncements';
import PopularBooks from '../components/home/PopularBooks';
import BookCategories from '../components/home/BookCategories';
import NewBooks from '../components/home/NewBooks';
import PromotionProgram from '../components/home/PromotionProGram';
import BrowseBooks from '../components/home/BrowseBooks';
import BorrowingRules from '../components/home/BorrowingRules';
import Footer from '../components/layout/Footer';

const HomePage: React.FC = () => {
  return (
    <div style={{ backgroundColor: '#fff', minHeight: '100vh' }}>
      <Header />
      <LibraryHero />
      <main>
        <HomeAnnouncements />
        <PopularBooks />
        <BookCategories />
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
