import React from 'react';
import { Divider, Grid, Typography, useMediaQuery } from '@mui/material';
import { useFormik } from 'formik';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { openPopupSelector, selectedHocsinhSelector } from 'store/selectors';
import { useEffect } from 'react';
import ExitButton from 'components/button/ExitButton';
import InputForm1 from 'components/form/InputForm1';
import { IconCertificate, IconUserCircle } from '@tabler/icons';
import config from 'config';
import { useState } from 'react';
import { convertDateTimeToDate } from 'utils/formatDate';
import { getByCCCD } from 'services/capphatbangService';
import FormControlComponent from 'components/form/FormControlComponent ';

const PhatBang = () => {
  const isXs = useMediaQuery('(max-width:800px)');
  const { t } = useTranslation();
  const [urlImage, setUrlImage] = useState('');
  const selectedHocSinh = useSelector(selectedHocsinhSelector);
  const openPopup = useSelector(openPopupSelector);
  const [urlFile, setUrlFile] = useState('');
  const formik = useFormik({
    initialValues: {}
  });

  useEffect(() => {
    const fetchData = async () => {
      const userbyid = await getByCCCD(selectedHocSinh.cccd);
      const datauser = userbyid.data;
      if (selectedHocSinh && openPopup) {
        formik.setValues({
          soHieu: datauser.soHieuVanBang || '',
          soVaoSo: datauser.soVaoSoCapBang || '',
          heDaoTao: datauser.heDaoTao || '',
          hinhThucDaoTao: datauser.hinhThucDaoTao || '',
          ngayCap: convertDateTimeToDate(datauser.ngayCapBang) || '',
          nguoiKy: datauser.soGoc.nguoiKyBang || '',
          ngayKy: convertDateTimeToDate(datauser.ngayCapBang) || '',
          namTotNghiep: datauser.namThi || '',
          cccdNguoiNhanBang: datauser.thongTinPhatBang.cccdNguoiNhanBang || '',
          giayUyQuyen: datauser.thongTinPhatBang.giayUyQuyen,
          moiQuanHe: datauser.thongTinPhatBang.moiQuanHe || '',
          ghiChu: datauser.thongTinPhatBang.ghiChu || '',
          ngayNhan: convertDateTimeToDate(datauser.thongTinPhatBang.ngayNhanBang ? datauser.thongTinPhatBang.ngayNhanBang : '')
        });
      }
      if (datauser.thongTinPhatBang.anhCCCD) {
        setUrlImage(config.urlFile + 'CCCD/' + datauser.thongTinPhatBang.anhCCCD);
      } else {
        setUrlImage(''); // If no avatar value, reset the urlImage state to an empty string
      }
      if (datauser.thongTinPhatBang.giayUyQuyen) {
        setUrlFile(config.urlFile + 'GiayUyQuyen/' + datauser.thongTinPhatBang.giayUyQuyen);
      } else {
        setUrlFile(''); // If no avatar value, reset the urlImage state to an empty string
      }
    };
    fetchData();
  }, [selectedHocSinh]);

  return (
    <form onSubmit={formik.handleSubmit}>
      <Grid item container spacing={1} xs={12} mt={isXs ? 2 : 4} alignItems={'center'}>
        <Grid item>
          <IconCertificate />
        </Grid>
        <Grid item>
          <Typography variant="h4">{t('hocsinh.degreeinfo')}</Typography>
        </Grid>
      </Grid>
      <Grid item xs={12}>
        <Divider />
      </Grid>
      <Grid xs={12} item container spacing={isXs ? 1 : 2}>
        <InputForm1 formik={formik} xs={6} label={t('Hệ đào tạo')} isDisabled name="heDaoTao" />
        <InputForm1 formik={formik} xs={6} label={t('Hình thức đào tạo')} isDisabled name="hinhThucDaoTao" />
      </Grid>
      <Grid xs={12} item container spacing={isXs ? 0 : 2} columnSpacing={isXs ? 1 : 0}>
        <InputForm1 formik={formik} xs={isXs ? 6 : 4} label={t('hocsinh.field.soHieu')} isDisabled name="soHieu" />
        <InputForm1 formik={formik} xs={isXs ? 6 : 4} label={t('hocsinh.field.soCapBang')} isDisabled name="soVaoSo" />
        <InputForm1 formik={formik} xs={isXs ? 6 : 4} label={t('Năm tốt nghiệp')} isDisabled name="namTotNghiep" />
        {isXs ? <InputForm1 formik={formik} xs={isXs ? 6 : 4} label={t('Ngày ký')} name="ngayKy" isDisabled type="date" /> : ''}
      </Grid>
      <Grid xs={12} item container spacing={isXs ? 0 : 2} columnSpacing={isXs ? 1 : 0}>
        {isXs ? '' : <InputForm1 formik={formik} xs={isXs ? 6 : 4} label={t('Ngày ký')} name="ngayKy" isDisabled type="date" />}
        <InputForm1 formik={formik} xs={isXs ? 6 : 4} label={t('Người ký')} name="nguoiKy" isDisabled />
        <InputForm1 formik={formik} xs={isXs ? 6 : 4} label={t('Ngày cấp bằng')} name="ngayCap" isDisabled type="date" />
      </Grid>
      <Grid item container spacing={1} xs={12} mt={isXs ? 2 : 4} alignItems={'center'}>
        <Grid item>
          <IconUserCircle />
        </Grid>
        <Grid item>
          <Typography variant="h4">{t('Thông tin người nhận')}</Typography>
        </Grid>
      </Grid>
      <Grid item xs={12}>
        <Divider />
      </Grid>
      <Grid container my={1}>
        <Grid item xs={isXs ? 12 : 6} container>
          <Grid item container spacing={1}>
            <InputForm1 xs={5} formik={formik} label={t('Ngày nhận')} name="ngayNhan" type="date" isDisabled />
            <InputForm1 xs={7} formik={formik} name="cccdNguoiNhanBang" placeholder={t('CCCD')} label={t('CCCD')} isDisabled />
          </Grid>
          <InputForm1 xs={12} formik={formik} label={t('Quan hệ với người được cấp bằng')} name="moiQuanHe" isDisabled />
          <InputForm1 xs={12} formik={formik} label={t('Ghi chú')} name="ghiChu" isMulltiline maxRows={3} isDisabled />
          <Grid item container>
            <FormControlComponent xsLabel={0} xsForm={12} label={t('File giấy ủy quyền')}>
              {/* <Importfile name="giayUyQuyen" formik={formik} nameFile="FileUyQuyen" lable={t('button.upload')} /> */}
              <a href={urlFile}>{formik.values.giayUyQuyen}</a>
            </FormControlComponent>
          </Grid>
        </Grid>
        <Grid item container xs={isXs ? 12 : 6} mt={'28px'} justifyContent={'center'}>
          <Grid item>
            <img src={urlImage} alt="" width={300} height={180} style={{ borderRadius: '5px' }} />
          </Grid>
        </Grid>
      </Grid>
      <Grid item container justifyContent={'flex-end'} mt={2}>
        <Grid item>
          <ExitButton />
        </Grid>
      </Grid>
    </form>
  );
};

export default PhatBang;
