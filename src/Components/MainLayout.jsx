import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

const MainLayout = () => {
  return (
    <div className="flex flex-col min-h-screen bg-[#F7F5F0] dark:bg-[#0F172A] text-[#1F2937] dark:text-white transition-colors duration-300">
      <Navbar />
      <main className="flex-grow bg-[#F7F5F0] dark:bg-[#0F172A]">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;