import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import GuideSection from './components/GuideSection';
import Footer from './components/Footer';
import Hero from './components/Hero';
import BookingPage from './pages/BookingPage';
import HistoryPage from './pages/HistoryPage';
import AdminLoginPage from './pages/AdminLoginPage';
import AdminDashboard from './pages/AdminDashboard';
import AdminApprovalsPage from './pages/AdminApprovalsPage';
import AdminOfficePage from './pages/AdminOfficePage';
import AdminSlotPage from './pages/AdminSlotPage';
import AdminCreatePage from './pages/AdminCreatePage';
import AdminUserDetails from './pages/AdminUserDetails';
import './App.css';

function Home() {
  return (
    <>
      <Hero />
      <GuideSection />
      <Footer />
    </>
  );
}

function App() {
  return (
    <Router>
      <div className="app">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/booking" element={<BookingPage />} />
          <Route path="/history" element={<HistoryPage />} />
          <Route path="/admin-login" element={<AdminLoginPage />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/approvals" element={<AdminApprovalsPage />} />
          <Route path="/office-master" element={<AdminOfficePage />} />
          <Route path="/slot-management" element={<AdminSlotPage />} />
          <Route path="/create-admin" element={<AdminCreatePage />} />
          <Route path="/user-details" element={<AdminUserDetails />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
