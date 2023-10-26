import { Button, Divider, Grid, Tooltip } from '@mui/material';
import InputForm1 from 'components/form/InputForm1';
import { useFormik } from 'formik';
import React from 'react';
import { generateDocument } from './xulyxuatword';
import { convertISODateToFormattedDate } from 'utils/formatDate';
import AnimateButton from 'components/extended/AnimateButton';
import { IconPrinter } from '@tabler/icons';
import ExitButton from 'components/button/ExitButton';
import { setLoading, setOpenPopup, showAlert } from 'store/actions';
import '../../index.css';
import useXacMinhVanBangValidationSchema from 'components/validations/xacminhvanbangValidation';
import { useTranslation } from 'react-i18next';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { donviSelector } from 'store/selectors';

const Detaillichsumotnguoi = ({ data }) => {
  const donvi = useSelector(donviSelector);
  const { t } = useTranslation();
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
      generateDocument(DataToExportWord);
      setLoading(false);
      dispatch(setOpenPopup(false));
      dispatch(showAlert(new Date().getTime().toString(), 'success', 'In Thành Công'));
    }
  });
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
    donViXacMinh: formik.values.donViXacMinh ? formik.values.donViXacMinh : '',
    hoTen: data.hocSinhs ? data.hocSinhs[0].hoTen : '',
    gioiTinh: data.hocSinhs ? (data.hocSinhs[0].gioiTinh ? 'Nam' : 'Nữ') : '',
    ngaySinh: data.hocSinhs ? convertISODateToFormattedDate(data.hocSinhs[0].ngaySinh) : '',
    noiSinh: data.hocSinhs ? data.hocSinhs[0].noiSinh : '',
    ngay: formik.values.ngayBanHanh ? new Date(formik.values.ngayBanHanh).getDate() : 0,
    thang: formik.values.ngayBanHanh ? new Date(formik.values.ngayBanHanh).getMonth() + 1 : 0,
    nam: formik.values.ngayBanHanh ? new Date(formik.values.ngayBanHanh).getFullYear() : 0,
    congVanSo: formik.values.congVanSo ? formik.values.congVanSo.toUpperCase() : '',
    khoaThi: data.hocSinhs ? convertISODateToFormattedDate(data.hocSinhs[0].khoaThi) : '',
    nguoiKy: data ? data.nguoiKyBang : '',
    hoiDong: data.hocSinhs ? data.hocSinhs[0].hoiDong : '',
    maHeDaoTao: donvi ? donvi.maHeDaoTao : ''
  };
  const { hoTen, ngaySinh, noiSinh, khoaThi, hoiDong, coQuanCapBang, maHeDaoTao } = DataToExportWord || {};
  const result = (
    <p>
      Ông/bà:<span className="highlight"> {hoTen || ''}</span>, sinh ngày<span className="highlight"> {ngaySinh || ''} </span>
      tại
      <span className="highlight"> {noiSinh || ''} </span> có tên trong danh sách tốt nghiệp Kỳ thi{' '}
      <span className="hightlight">{maHeDaoTao || ''}</span> khóa thi ngày <span className="highlight"> {khoaThi || ''} </span>
      tại Hội đồng thi <span className="highlight">{hoiDong || ''}</span>; có hồ sơ lưu tại
      <span className="highlight"> {coQuanCapBang || ''}</span>.
    </p>
  );
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
        <p>{t('xacminhvanbang.title.thongtinvanbang')}</p>
      </div>
      <Grid container spacing={1}>
        <Grid item xs={12} sm={12} md={12}>
          <p style={{ fontSize: '17px' }}>{result}</p>
        </Grid>
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
              <ExitButton type="subpopup" />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </form>
  );
};

export default Detaillichsumotnguoi;
