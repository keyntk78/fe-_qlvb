import { Outlet } from 'react-router-dom';
import Footer from 'views/congthongtin/Footer';
import Header from 'views/congthongtin/Header';

// project imports
// import Customization from '../Customization';

// ==============================|| MINIMAL LAYOUT ||============================== //

const SubLayout = () => (
  <>
    <Header />
    <main>
      <Outlet /> {/* Đây là nơi trang con sẽ được hiển thị */}
    </main>
    <Footer />
  </>
);

export default SubLayout;
