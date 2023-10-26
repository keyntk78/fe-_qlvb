import SubLayout from 'layout/SubLayout';
import CreateDonyeucau from 'views/congthongtin/CreateDonyeucau';
import DanhmucTintuc from 'views/congthongtin/DanhmucTintuc';
import DetailTintuc from 'views/congthongtin/DetailTintuc';
import Thongtintintuc from 'views/congthongtin/Tintuc';
import TracuuDonyeucau from 'views/congthongtin/TracuuDonyeucau';
import TracuuVBCC from 'views/congthongtin/TracuuVBCC';

// project imports

// ==============================|| Congthongtin ROUTING ||============================== //

const Congthongtin = {
  path: '/',
  element: <SubLayout />,
  children: [
    {
      path: '/tracuu-vanbang',
      element: <TracuuVBCC />
    },
    {
      path: '/tracuu-donyeucau',
      element: <TracuuDonyeucau />
    },
    {
      path: '/dangky-donyeucau',
      element: <CreateDonyeucau />
    },
    {
      path: '/',
      element: <Thongtintintuc />
    },
    {
      path: '/chitiet-tintuc',
      element: <DetailTintuc />
    },
    {
      path: '/danhmuc-tintuc',
      element: <DanhmucTintuc />
    }
  ]
};

export default Congthongtin;
