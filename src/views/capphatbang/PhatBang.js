import React from 'react';
import { Divider, Grid, Typography, useMediaQuery } from '@mui/material';
import { useFormik } from 'formik';
import { showAlert, setReloadData, setOpenPopup, setLoading } from 'store/actions';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { openPopupSelector, selectedHocsinhSelector, userLoginSelector } from 'store/selectors';
import { useEffect } from 'react';
import FormGroupButton from 'components/button/FormGroupButton';
import { convertJsonToFormData } from 'utils/convertJsonToFormData';
import ImageForm1 from 'components/form/ImageForm1';
import InputForm1 from 'components/form/InputForm1';
import { IconCertificate, IconUserCircle } from '@tabler/icons';
import { capPhatBang, getByCCCD } from 'services/capphatbangService';
import { convertDateTimeToDate } from 'utils/formatDate';
import usePhatbangValidationSchema from 'components/validations/phatbangValidation';
import Importfile from 'components/form/ImportFile';
import FormControlComponent from 'components/form/FormControlComponent ';

const PhatBang = () => {
  const isXs = useMediaQuery('(max-width:800px)');
  const user = useSelector(userLoginSelector);
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const selectedHocSinh = useSelector(selectedHocsinhSelector);
  const openPopup = useSelector(openPopupSelector);
  const phatbangValidation = usePhatbangValidationSchema();

  const formik = useFormik({
    initialValues: {
      cccdNguoiNhanBang: '',
      moiQuanHe: '',
      ghiChu: '',
      giayUyQuyen: '',
      anhCCCD: '',
      fileImage: ''
    },
    validationSchema: phatbangValidation,
    onSubmit: async (values) => {
      dispatch(setLoading(true));
      try {
        const formData = await convertJsonToFormData(values);
        formData.append('idHocSinh', selectedHocSinh.id);
        formData.append('NguoiThucHien', user.username);
        const response = await capPhatBang(formData);
        if (response.isSuccess == false) {
          dispatch(showAlert(new Date().getTime().toString(), 'error', response.message.toString()));
          dispatch(setLoading(false));
        } else {
          dispatch(setOpenPopup(false));
          dispatch(setReloadData(true));
          dispatch(showAlert(new Date().getTime().toString(), 'success', response.message.toString()));
          dispatch(setLoading(false));
        }
      } catch (error) {
        console.error('error' + error);
        dispatch(showAlert(new Date().getTime().toString(), 'error', error.toString()));
      }
    }
  });

  useEffect(() => {
    const fetchData = async () => {
      const userbyid = await getByCCCD(selectedHocSinh.cccd);
      const datauser = userbyid.data;
      if (selectedHocSinh && openPopup) {
        const updatedValues = {
          soHieu: datauser.soHieuVanBang || '',
          soVaoSo: datauser.soVaoSoCapBang || '',
          heDaoTao: datauser.heDaoTao || '',
          hinhThucDaoTao: datauser.hinhThucDaoTao || '',
          ngayCap: convertDateTimeToDate(datauser.ngayCapBang) || '',
          nguoiKy: datauser.soGoc.nguoiKyBang || '',
          ngayKy: convertDateTimeToDate(datauser.ngayCapBang) || '',
          namTotNghiep: datauser.namThi || '',
          ngayNhan: convertDateTimeToDate(new Date())
        };

        formik.setValues((prevValues) => ({
          ...prevValues,
          ...updatedValues
        }));
      }
      dispatch(setReloadData(false));
    };

    if (openPopup) {
      fetchData();
    }
  }, [selectedHocSinh, openPopup]);

  useEffect(() => {
    if (openPopup) {
      formik.resetForm();
    }
  }, [openPopup]);

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
            {/* <InputForm1 xs={5} formik={formik} label={t('Ngày nhận')} name="ngayNhan" type='date' isDisabled/> */}
            <InputForm1 xs={5} formik={formik} name="cccdNguoiNhanBang" placeholder={t('CCCD')} label={t('CCCD')} isRequired />
            <InputForm1 xs={7} formik={formik} label={t('Quan hệ với người được cấp bằng')} name="moiQuanHe" isRequired />
          </Grid>
          <InputForm1 xs={12} formik={formik} label={t('Ghi chú')} name="ghiChu" isMulltiline maxRows={3} />
          <Grid item container>
            <FormControlComponent xsLabel={0} xsForm={12} label={t('Chọn tệp giấy ủy quyền')}>
              <Importfile name="giayUyQuyen" formik={formik} nameFile="FileUyQuyen" lable={t('button.upload')} />
            </FormControlComponent>
          </Grid>
        </Grid>
        <Grid item container xs={isXs ? 12 : 6}>
          <Grid item xs={12} mt={'28px'}>
            <ImageForm1 formik={formik} name="anhCCCD" nameFile="FileAnhCCCD" width={'300'} height={'180'} isImagePreview={openPopup} />
          </Grid>
        </Grid>
      </Grid>
      <FormGroupButton />
    </form>
  );
};

export default PhatBang;
