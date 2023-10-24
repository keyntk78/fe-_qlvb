import { Button, Divider, Grid, Tooltip } from '@mui/material';
import InputForm1 from 'components/form/InputForm1';
import { useFormik } from 'formik';
import React from 'react';
import { useEffect } from 'react';
import { generateDocument } from './Xulyxuatword_nhieunguoi';
import AnimateButton from 'components/extended/AnimateButton';
import { IconFileExport, IconPrinter } from '@tabler/icons';
import ExitButton from 'components/button/ExitButton';
import { setLoading, showAlert } from 'store/actions';
import ButtonSuccess from 'components/buttoncolor/ButtonSuccess';
import { DataGrid } from '@mui/x-data-grid';
import { Language } from '@mui/icons-material';
import BackToTop from 'components/scroll/BackToTop';
import useXacMinhVanBangValidationSchema from 'components/validations/xacminhvanbangValidation';
import { convertISODateToFormattedDate } from 'utils/formatDate';
import ExportExcel from './ExportExcel';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';

const Detaillichsunhieunguoi = ({ data }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const formik = useFormik({
    initialValues: {
      donViXacMinh: '',
      ngayBanHanh: '',
      congVanSo: '',
      fileYeuCau: ''
    },
    validationSchema: useXacMinhVanBangValidationSchema(),
    onSubmit: async () => {
      setLoading(true);
      generateDocument(rows, DataToExportWord);
      setLoading(false);
      dispatch(showAlert(new Date().getTime().toString(), 'success', 'In Thành Công'));
    }
  });
  const handleExport = async (e) => {
    e.preventDefault();
    dispatch(setLoading(true));
    await ExportExcel(rows, DataToExportWord);
    dispatch(setLoading(false));
  };
  const columns = [
    {
      field: 'id',
      headerName: t('serial'),
      width: 50,
      sortable: false,
      filterable: false
    },
    {
      flex: 1.5,
      field: 'hoTen',
      headerName: t('user.field.fullname'),
      minWidth: 180
    },
    {
      flex: 1,
      field: 'ngaySinh',
      headerName: t('Ngày sinh'),
      minWidth: 100
    },
    {
      flex: 1.5,
      field: 'noiSinh',
      headerName: t('Nơi Sinh'),
      minWidth: 100
    },
    {
      flex: 1.5,
      field: 'khoaThi',
      headerName: t('Khóa Thi'),
      minWidth: 100
    }
  ];
  const rows =
    data && data.hocSinhs
      ? data.hocSinhs.map((row, index) => ({
          id: index + 1,
          hoTen: row.hoTen,
          ngaySinh: convertISODateToFormattedDate(row.ngaySinh),
          noiSinh: row.noiSinh,
          khoaThi: convertISODateToFormattedDate(row.khoaThi),
          idHocSinh: row.id,
          cccdHocSinh: row.cccd
        }))
      : [];
  useEffect(() => {
    if (data && data.ngayTrenCongVan) {
      const date = new Date(data.ngayTrenCongVan);
      if (!isNaN(date)) {
        const formattedDateForInput = date.toISOString().split('T')[0];
        formik.setValues({
          donViXacMinh: data.donViYeuCauXacMinh || '',
          ngayBanHanh: formattedDateForInput || '',
          congVanSo: data.congVanSo || '',
          fileYeuCau: data.pathFileYeuCau || ''
        });
      }
    }
  }, [data]);

  const DataToExportWord = {
    uyBanNhanDan: data ? data.uyBanNhanDan : '',
    coQuanCapBang: data ? data.coQuanCapBang : '',
    diaPhuongCapBang: data ? data.diaPhuongCapBang : '',
    donViXacMinh: formik.values.donViXacMinh ? formik.values.donViXacMinh.toUpperCase() : '',
    ngay: formik.values.ngayBanHanh ? new Date(formik.values.ngayBanHanh).getDate() : 0,
    thang: formik.values.ngayBanHanh ? new Date(formik.values.ngayBanHanh).getMonth() + 1 : 0,
    nam: formik.values.ngayBanHanh ? new Date(formik.values.ngayBanHanh).getFullYear() : 0,
    congVanSo: formik.values.congVanSo ? formik.values.congVanSo.toUpperCase() : '',
    nguoiKy: data ? data.nguoiKyBang : '',
    soLuong: data && data.hocSinhs ? data.hocSinhs.length : 0
  };
  return (
    <form onSubmit={formik.handleSubmit}>
      <div style={{ borderBottom: '2px solid black', fontWeight: 'bold', paddingTop: 3 }}>
        <p>{t('Thông tin cần bổ sung')}</p>
      </div>
      <Grid container spacing={1}>
        <Grid item xs={6} sm={12} md={12}>
          <InputForm1 xs={12} label={t('xacminhvanbang.field.kinhgui')} name="donViXacMinh" formik={formik} isDisabled />
        </Grid>
        <Grid item xs={6} sm={4} md={3}>
          <InputForm1 xs={12} label={t('xacminhvanbang.field.congvanso')} name="congVanSo" formik={formik} isDisabled />
        </Grid>
        <Grid item xs={6} sm={4} md={3}>
          <InputForm1 xs={12} label={t('xacminhvanbang.field.ngayracongvan')} name="ngayBanHanh" formik={formik} type="date" isDisabled />
        </Grid>
        <Grid item xs={6} sm={4} md={6}>
          <InputForm1 xs={12} label={t('xacminhvanbang.field.file')} name="fileYeuCau" formik={formik} isDisabled />
        </Grid>
      </Grid>
      <div style={{ borderBottom: '2px solid black', fontWeight: 'bold', paddingTop: 3 }}>
        <p>{t('xacminhvanbang.title.danhsachxacminh')}</p>
      </div>
      <Grid container spacing={1} mt={3}>
        <DataGrid
          autoHeight
          columns={columns}
          rows={rows}
          pagination
          localeText={Language === 'vi' ? localeText : null}
          disableSelectionOnClick={true}
        />
        <BackToTop />
      </Grid>
      <Grid item mt={2}>
        <Divider />
      </Grid>
      <Grid item xs={12} container spacing={2} justifyContent="flex-end" mt={1}>
        <Grid item xs={12} container spacing={2} justifyContent="flex-end">
          <Grid item xs={12} container spacing={2} justifyContent="flex-end" mt={1}>
            <Grid item>
              <AnimateButton>
                <Tooltip title={t('button.create')} placement="bottom">
                  <Button type="submit" color="info" variant="contained" size="medium" startIcon={<IconPrinter />}>
                    {t('button.create')}
                  </Button>
                </Tooltip>
              </AnimateButton>
            </Grid>
            <Grid item>
              <ButtonSuccess title={t('Tạo danh sách')} icon={IconFileExport} onClick={handleExport} />
            </Grid>
            <Grid item>
              <ExitButton type="subpopup" />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </form>
  );
};

export default Detaillichsunhieunguoi;
