import { useTheme } from '@emotion/react';
import { useTranslation } from 'react-i18next';

export const useTranslatedColumns = () => {
  const { t } = useTranslation();
  const theme = useTheme();
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
    },
    {
      field: 'message',
      headerName: t('Lý do'),
      flex: 1,
      renderCell: (
        params // Thêm tham số theme vào hàm renderCell
      ) => (
        <div
          style={{
            color: params.row.errorCode === -1 ? theme.palette.error.main : params.row.errorCode === -2 ? 'orange' : 'inherit'
          }}
        >
          {params.value}
        </div>
      )
    }
  ];
  const columns_DanToc = [
    {
      field: 'id',
      headerName: t('serial'),
      width: 50,
      sortable: false,
      filterable: false
    },
    {
      field: 'ten',
      headerName: t('Tên'),
      flex: 1
    },
    {
      field: 'message',
      headerName: t('Lý do'),
      flex: 1,
      renderCell: (
        params // Thêm tham số theme vào hàm renderCell
      ) => (
        <div
          style={{
            color: params.row.errorCode === -1 ? theme.palette.error.main : params.row.errorCode === -2 ? 'orange' : 'inherit'
          }}
        >
          {params.value}
        </div>
      )
    }
  ];
  const columns_HinhThucDaoTao = [
    {
      field: 'id',
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
    },
    {
      field: 'message',
      headerName: t('Lý do'),
      flex: 1,
      renderCell: (
        params // Thêm tham số theme vào hàm renderCell
      ) => (
        <div
          style={{
            color: params.row.errorCode === -1 ? theme.palette.error.main : params.row.errorCode === -2 ? 'orange' : 'inherit'
          }}
        >
          {params.value}
        </div>
      )
    }
  ];
  const columns_KhoaThi = [
    {
      field: 'id',
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
    },
    {
      flex: 1,
      field: 'nam',
      headerName: t('Năm thi'),
      minWidth: 100
    },
    {
      field: 'message',
      headerName: t('Lý do'),
      flex: 1,
      renderCell: (
        params // Thêm tham số theme vào hàm renderCell
      ) => (
        <div
          style={{
            color: params.row.errorCode === -1 ? theme.palette.error.main : params.row.errorCode === -2 ? 'orange' : 'inherit'
          }}
        >
          {params.value}
        </div>
      )
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
    },

    {
      field: 'message',
      headerName: t('Lý do'),
      flex: 1,
      renderCell: (
        params // Thêm tham số theme vào hàm renderCell
      ) => (
        <div
          style={{
            color: params.row.errorCode === -1 ? theme.palette.error.main : params.row.errorCode === -2 ? 'orange' : 'inherit'
          }}
        >
          {params.value}
        </div>
      )
    }
  ];
  const columns_MonHoc = [
    {
      field: 'id',
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
    },

    {
      field: 'message',
      headerName: t('Lý do'),
      flex: 1,
      renderCell: (
        params // Thêm tham số theme vào hàm renderCell
      ) => (
        <div
          style={{
            color: params.row.errorCode === -1 ? theme.palette.error.main : params.row.errorCode === -2 ? 'orange' : 'inherit'
          }}
        >
          {params.value}
        </div>
      )
    }
  ];
  const columns_DonVi = [
    {
      field: 'id',
      headerName: t('serial'),
      width: 50,
      sortable: false,
      filterable: false
    },
    {
      field: 'ma',
      headerName: t('Mã trường'),
      width: 70
    },
    {
      field: 'ten',
      headerName: t('Tên trường'),
      width: 250
    },
    {
      field: 'maHeDaoTao',
      headerName: t('Mã HĐT'),
      width: 70
    },
    {
      field: 'maHinhThucDaoTao',
      headerName: t('Mã HTĐT'),
      width: 70
    },
    {
      field: 'hieuTruong',
      headerName: t('Hiệu trưởng'),
      flex: 1
    },
    {
      field: 'tenDiaPhuong',
      headerName: t('Tên địa phương'),
      flex: 1
    },
    {
      field: 'message',
      headerName: t('Lý do'),
      flex: 1,
      renderCell: (
        params // Thêm tham số theme vào hàm renderCell
      ) => (
        <div
          style={{
            color: params.row.errorCode === -1 ? theme.palette.error.main : params.row.errorCode === -2 ? 'orange' : 'inherit'
          }}
        >
          {params.value}
        </div>
      )
    }
  ];
  return {
    columns_DanToc,
    columns_HeDaoTao,
    columns_HinhThucDaoTao,
    columns_KhoaThi,
    columns_MonHoc,
    columns_NamThi,
    columns_DonVi
  };
};
