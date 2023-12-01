import { lazy } from 'react';

// project imports
import MainLayout from 'layout/MainLayout';
import Loadable from 'components/Loadable';
import CapBangGoc from 'views/capbangbangoc/CapBangGoc';
import HocSinhTruong from 'views/hocsinhtotnghiep/HocSinh';
import CapPhatBang from 'views/capphatbang/CapPhatBang';
import CapBangSao from 'views/capbangbansao/CapBangSao';
import Xacminhvanbang from 'views/xacminhvanbang/Xacminhvanbang';
import SaoLuu from 'views/saoluu/SaoLuu';
// dashboard routing
// const DashboardDefault = Loadable(lazy(() => import('views/dashboard/Default')));

// utilities routing
const User = Loadable(lazy(() => import('views/user/User')));
const Role = Loadable(lazy(() => import('views/role/RoleIndex')));
const DanToc = Loadable(lazy(() => import('views/dantoc/DanToc')));
const Phoigoc = Loadable(lazy(() => import('views/phoigoc/Phoigoc.js')));
const DanhmucTN = Loadable(lazy(() => import('views/danhmuctotnghiep/Danhmuctotnghiep')));
const Hinhthucdaotao = Loadable(lazy(() => import('views/hinhthucdaotao/Hinhthucdaotao')));
const Monthi = Loadable(lazy(() => import('views/monthi/Monthi')));
const Menu = Loadable(lazy(() => import('views/menu/Menu')));
const Donvi = Loadable(lazy(() => import('views/donvitruong/Donvitruong')));
const HocSinh = Loadable(lazy(() => import('views/hocsinh/HocSinh')));
const AccessHistory = Loadable(lazy(() => import('views/accesshistory/AccessHistory')));
const Phoibansao = Loadable(lazy(() => import('views/phoibansao/Phoibansao')));
const Config = Loadable(lazy(() => import('views/config/Config')));
const SoGoc = Loadable(lazy(() => import('views/sogoc/Sogoc')));
const DonYeuCau = Loadable(lazy(() => import('views/donyeucau/DonYeuCau')));
const SoBanSao = Loadable(lazy(() => import('views/sobansao/Sobansao')));
const SoCapPhatBang = Loadable(lazy(() => import('views/socapphatbang/SoCapPhatBang')));
const Hedaotao = Loadable(lazy(() => import('views/hedaotao/Hedaotao')));
const Namthi = Loadable(lazy(() => import('views/namthi/Namthi')));
const XuLyDuLieu = Loadable(lazy(() => import('views/xulydulieu/XuLyDuLieu')));
const Functions = Loadable(lazy(() => import('views/function/Function')));
const UtilsTypography = Loadable(lazy(() => import('views/utilities/Typography')));
const UtilsColor = Loadable(lazy(() => import('views/utilities/Color')));
const UtilsShadow = Loadable(lazy(() => import('views/utilities/Shadow')));
const UtilsMaterialIcons = Loadable(lazy(() => import('views/utilities/MaterialIcons')));
const UtilsTablerIcons = Loadable(lazy(() => import('views/utilities/TablerIcons')));
const TinTuc = Loadable(lazy(() => import('views/tintuc/tintuc')));
const TinNhan = Loadable(lazy(() => import('views/message/Message')));
const CauHinhTinNhan = Loadable(lazy(() => import('views/messageconfig/MessageConfig')));
const LoaiTinTuc = Loadable(lazy(() => import('views/loaitintuc/LoaiTinTuc')));
const TrangChu = Loadable(lazy(() => import('views/trangchu/trangchu')));
const HocSinhTotNghiep = Loadable(lazy(() => import('views/thongke/phong/hocSinhDoTotNghiep/index')));
const HocSinhDoTotNghiep = Loadable(lazy(() => import('views/thongke/truong/HocSinhDoTotNghiep/index')));
const PhatBang = Loadable(lazy(() => import('views/thongke/phong/phatBang/index')));
const InPhoiBang = Loadable(lazy(() => import('views/thongke/phong/inPhoiBang/index')));
const ImportDanhSachVanBang = Loadable(lazy(() => import('views/ImportDanhSachVanBang/DanhSachImport')));
const Report = Loadable(lazy(() => import('views/report/Report')));
const SoGocCu = Loadable(lazy(() => import('views/sogoccu/SoGocCu')));
// sample page routing
const SamplePage = Loadable(lazy(() => import('views/sample-page')));
const PhuLucSoGoc = Loadable(lazy(() => import('views/phulucsogoc/PhuLucSoGoc')));

// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = {
  path: '/admin/',
  element: <MainLayout />,
  children: [
    {
      path: '/admin/',
      element: <TrangChu />
    },
    // {
    //   path: 'trangchu',
    //   element: <TrangChu />
    // },
    {
      path: 'menu',
      element: <Menu />
    },
    {
      path: 'role',
      element: <Role />
    },
    // {
    //   path: 'vanbang',
    //   element: <Role />
    // },
    {
      path: 'report',
      element: <Report />
    },
    {
      path: 'chuyendoisogoccu',
      element: <SoGocCu />
    },
    {
      path: 'hinhthucdaotao',
      element: <Hinhthucdaotao />
    },
    {
      path: 'monthi',
      element: <Monthi />
    },
    {
      path: 'donvi',
      element: <Donvi />
    },
    {
      path: 'user',
      element: <User />
    },
    {
      path: 'Import',
      element: <ImportDanhSachVanBang />
    },
    {
      path: 'function',
      element: <Functions />
    },
    {
      path: 'history',
      element: <AccessHistory />
    },
    {
      path: 'tinnhan',
      element: <TinNhan />
    },
    {
      path: 'dantoc',
      element: <DanToc />
    },
    {
      path: 'danhmuctotnghiep',
      element: <DanhmucTN />
    },
    {
      path: 'hocsinhtotnghiep',
      element: <HocSinhTruong />
    },
    {
      path: 'capphatbang',
      element: <CapPhatBang />
    },
    {
      path: 'namthi',
      element: <Namthi />
    },
    {
      path: 'xulydulieu',
      element: <XuLyDuLieu />
    },
    {
      path: 'cauhinh',
      element: <Config />
    },
    {
      path: 'phoigoc',
      element: <Phoigoc />
    },
    {
      path: 'phoibansao',
      element: <Phoibansao />
    },
    {
      path: 'hedaotao',
      element: <Hedaotao />
    },
    {
      path: 'quanlyhocsinh',
      element: <HocSinh />
    },
    {
      path: 'sogoc',
      element: <SoGoc />
    },
    {
      path: 'donyeucau',
      element: <DonYeuCau />
    },
    {
      path: 'sobansao',
      element: <SoBanSao />
    },
    {
      path: 'socapphatbang',
      element: <SoCapPhatBang />
    },
    {
      path: 'capbangbangoc',
      element: <CapBangGoc />
    },
    {
      path: 'capbangbansao',
      element: <CapBangSao />
    },
    {
      path: 'loaitintuc',
      element: <LoaiTinTuc />
    },
    {
      path: 'tintuc',
      element: <TinTuc />
    },
    {
      path: 'cauhinhtinnhan',
      element: <CauHinhTinNhan />
    },
    {
      path: 'thongkehocsinhtotnghiep',
      element: <HocSinhTotNghiep />
    },
    {
      path: 'thongkehocsinhdototnghiep',
      element: <HocSinhDoTotNghiep />
    },
    {
      path: 'thongkephatbang',
      element: <PhatBang />
    },
    {
      path: 'thongkeinphoibang',
      element: <InPhoiBang />
    },
    {
      path: 'phulucsogoc',
      element: <PhuLucSoGoc />
    },
    {
      path: 'tracuuvanbang',
      element: <Xacminhvanbang />
    },
    {
      path: 'saoluu',
      element: <SaoLuu />
    },
    {
      path: 'utils',
      children: [
        {
          path: 'util-typography',
          element: <UtilsTypography />
        }
      ]
    },
    {
      path: 'utils',
      children: [
        {
          path: 'util-color',
          element: <UtilsColor />
        }
      ]
    },
    {
      path: 'utils',
      children: [
        {
          path: 'util-shadow',
          element: <UtilsShadow />
        }
      ]
    },
    {
      path: 'icons',
      children: [
        {
          path: 'tabler-icons',
          element: <UtilsTablerIcons />
        }
      ]
    },
    {
      path: 'icons',
      children: [
        {
          path: 'material-icons',
          element: <UtilsMaterialIcons />
        }
      ]
    },
    {
      path: 'sample-page',
      element: <SamplePage />
    }
  ]
};

export default MainRoutes;
