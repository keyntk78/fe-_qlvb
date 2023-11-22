import { useTranslation } from 'react-i18next';

export const useTranslatedColumns = () => {
  const { t } = useTranslation();

  const columns_namHoc = [
    {
      field: 'idx',
      headerName: t('serial'),
      width: 50,
      sortable: false,
      filterable: false,
      cellClassName: 'top-aligned-cell'
    },
    {
      field: 'hoTen',
      headerName: t('hocsinh.field.fullname'),
      flex: 2,
      minWidth: 180
    },
    {
      field: 'cccd',
      headerName: t('hocsinh.field.cccd'),
      flex: 1.5,
      minWidth: 100
    },
    {
      field: 'gioiTinh_fm',
      headerName: t('hocsinh.field.gender'),
      flex: 1,
      minWidth: 80
    },
    {
      field: 'ngaySinh_fm',
      headerName: t('hocsinh.field.bdate'),
      flex: 1.3,
      minWidth: 100
    },
    {
      field: 'soHieuVanBang',
      headerName: t('hocsinh.field.soHieu'),
      flex: 1.5,
      minWidth: 100
    }
  ];
  const columns_NamThi = [
    {
      field: 'idx',
      headerName: t('serial'),
      width: 50,
      sortable: false,
      filterable: false
    },
    {
      flex: 1,
      field: 'ten',
      headerName: t('namthi.field.Ten')
    }
  ];
  const columns_DanToc = [
    {
      field: 'idx',
      headerName: t('serial'),
      width: 50,
      sortable: false,
      filterable: false
    },
    {
      field: 'ten',
      headerName: t('Tên'),
      flex: 1
    }
  ];
  const columns_HinhThucDaoTao = [
    {
      field: 'idx',
      headerName: t('serial'),
      width: 50,
      sortable: false,
      filterable: false
    },
    {
      field: 'ma',
      headerName: t('hinhthucdaotao.field.ma'),
      flex: 1,
      minWidth: 80
    },
    {
      field: 'ten',
      headerName: t('hinhthucdaotao.field.ten'),
      flex: 1.5,
      minWidth: 160
    }
  ];
  const columns_KhoaThi = [
    {
      field: 'idx',
      headerName: t('serial'),
      width: 50,
      sortable: false,
      filterable: false
    },
    {
      flex: 1.5,
      field: 'ten',
      headerName: t('khoathi.field.Ten'),
      minWidth: 250
    },
    {
      flex: 1,
      field: 'ngay_fm',
      headerName: t('khoathi.field.Ngay'),
      minWidth: 100
    }
  ];
  const columns_HeDaoTao = [
    {
      field: 'idx',
      headerName: t('serial'),
      width: 50,
      sortable: false,
      filterable: false
    },
    {
      flex: 1,
      field: 'ma',
      headerName: t('hedaotao.field.Ma'),
      minWidth: 80
    },
    {
      flex: 1.5,
      field: 'ten',
      headerName: t('hedaotao.field.Ten'),
      minWidth: 150
    }
  ];
  const columns_MonHoc = [
    {
      field: 'idx',
      headerName: t('serial'),
      width: 50,
      sortable: false,
      filterable: false
    },
    {
      field: 'ma',
      headerName: t('monthi.field.ma'),
      flex: 1
    },
    {
      field: 'ten',
      headerName: t('monthi.field.ten'),
      flex: 1
    }
  ];
  return {
    columns_namHoc,
    columns_DanToc,
    columns_HeDaoTao,
    columns_HinhThucDaoTao,
    columns_KhoaThi,
    columns_MonHoc,
    columns_NamThi
  };
};
