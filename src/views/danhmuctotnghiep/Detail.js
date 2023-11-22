import React from 'react';
import { Grid, useMediaQuery } from '@mui/material';
import { useFormik } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { getById } from 'services/danhmuctotnghiepService';
import { setReloadData } from 'store/actions';
import ExitButton from 'components/button/ExitButton';
import { openPopupSelector, reloadDataSelector, selectedDanhmuctotnghiepSelector } from 'store/selectors';
import { useTranslation } from 'react-i18next';
import InputForm from 'components/form/InputForm';
import FormControlComponent from 'components/form/FormControlComponent ';
import { convertFormattedDateToISODate, convertISODateToFormattedDate } from 'utils/formatDate';

const Detail = () => {
  const isXs = useMediaQuery('(max-width:800px)');
  const openPopup = useSelector(openPopupSelector);
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const danhmucTN = useSelector(selectedDanhmuctotnghiepSelector);
  const reloadData = useSelector(reloadDataSelector);
  const formik = useFormik({
    initialValues: {
      IdNamThi: '',
      TieuDe: '',
      GhiChu: '',
      NamThi: '',
      NgayCapBang: '',
      SoQuyetDinh: '',
      HinhThucDaoTao: '',
      HeDaoTao: '',
      TenKyThi: '',
      SoTruong: 0,
      SoHocSinh: 0,
      SoTruongDaGui: 0,
      SoTruongDaDuyet: 0
    }
  });

  useEffect(() => {
    const fetchData = async () => {
      const danhmucTNbyid = await getById(danhmucTN.id);
      const datadanhmucTN = danhmucTNbyid.data;
      const ngay_fm = convertISODateToFormattedDate(datadanhmucTN.ngayCapBang);
      if (danhmucTN) {
        formik.setValues({
          id: danhmucTN.id,
          TieuDe: datadanhmucTN.tieuDe,
          GhiChu: datadanhmucTN.ghiChu,
          NamThi: datadanhmucTN.namThi,
          HinhThucDaoTao: datadanhmucTN.hinhThucDaoTao,
          HeDaoTao: datadanhmucTN.maHeDaoTao,
          TenKyThi: datadanhmucTN.tenKyThi,
          NgayCapBang: convertFormattedDateToISODate(ngay_fm),
          SoQuyetDinh: datadanhmucTN.soQuyetDinh,
          SoTruong: datadanhmucTN.tongSoTruong !== 0 ? datadanhmucTN.tongSoTruong : '0',
          SoHocSinh: datadanhmucTN.soLuongNguoiHoc !== 0 ? datadanhmucTN.soLuongNguoiHoc : '0',
          SoTruongDaGui: datadanhmucTN.tongSoTruongDaGui !== 0 ? datadanhmucTN.tongSoTruongDaGui : '0',
          SoTruongDaDuyet: datadanhmucTN.tongSoTruongDaDuyet !== 0 ? datadanhmucTN.tongSoTruongDaDuyet : '0'
        });
      }
      dispatch(setReloadData(false));
    };
    if (openPopup) {
      fetchData();
    }
  }, [danhmucTN, reloadData, openPopup]);

  return (
    <form>
      <Grid container justifyContent={'center'}>
        <Grid item container xs={12} my={1} spacing={1}>
          <Grid item container xs={12} spacing={1}>
            <Grid item xs={isXs ? 12 : 6}>
              <FormControlComponent xsLabel={0} xsForm={12} label={t('danhmuctotnghiep.field.tieude')}>
                <InputForm formik={formik} name="TieuDe" type="text" isDisabled />
              </FormControlComponent>
            </Grid>
            <Grid xs={isXs ? 12 : 6} item>
              <FormControlComponent xsLabel={0} xsForm={12} label={t('quyetdinhtotnghiep.title')}>
                <InputForm formik={formik} name="SoQuyetDinh" type="text" isDisabled />
              </FormControlComponent>
            </Grid>
          </Grid>
          <Grid item container xs={12} spacing={1}>
            <Grid item xs={isXs ? 12 : 6}>
              <FormControlComponent xsLabel={0} xsForm={12} label={t('hinhthucdaotao.title')}>
                <InputForm formik={formik} name="HinhThucDaoTao" type="text" isDisabled />
              </FormControlComponent>
            </Grid>
            <Grid item xs={isXs ? 12 : 6}>
              <FormControlComponent xsLabel={0} xsForm={12} label={t('kỳ thi')}>
                <InputForm formik={formik} name="TenKyThi" type="text" isDisabled />
              </FormControlComponent>
            </Grid>
          </Grid>
          <Grid item container xs={12} spacing={1}>
            <Grid item xs={isXs ? 12 : 4}>
              <FormControlComponent xsLabel={0} xsForm={12} label={t('danhmuctotnghiep.title.ngay')}>
                <InputForm formik={formik} name="NgayCapBang" type="date" isDisabled />
              </FormControlComponent>
            </Grid>
            <Grid item xs={isXs ? 12 : 4}>
              <FormControlComponent xsLabel={0} xsForm={12} label={t('hedaotao.title')}>
                <InputForm formik={formik} name="HeDaoTao" type="text" isDisabled />
              </FormControlComponent>
            </Grid>
            <Grid item xs={isXs ? 12 : 4}>
              <FormControlComponent xsLabel={0} xsForm={12} label={t('danhmuctotnghiep.field.namtotnghiep')}>
                <InputForm formik={formik} name="NamThi" type="text" isDisabled />
              </FormControlComponent>
            </Grid>
          </Grid>
          <Grid item container xs={12} spacing={1}>
            <Grid item xs={isXs ? 12 : 3}>
              <FormControlComponent xsLabel={0} xsForm={12} label={t('danhmuctotnghiep.title.sotruongdagui')}>
                <InputForm formik={formik} name="SoTruongDaGui" type="text" isDisabled />
              </FormControlComponent>
            </Grid>
            <Grid item xs={isXs ? 12 : 3}>
              <FormControlComponent xsLabel={0} xsForm={12} label={t('danhmuctotnghiep.title.sotruong')}>
                <InputForm formik={formik} name="SoTruong" type="text" isDisabled />
              </FormControlComponent>
            </Grid>
            <Grid item xs={isXs ? 12 : 3}>
              <FormControlComponent xsLabel={0} xsForm={12} label={t('danhmuctotnghiep.title.sotruongdaduyet')}>
                <InputForm formik={formik} name="SoTruongDaDuyet" type="text" isDisabled />
              </FormControlComponent>
            </Grid>
            <Grid item xs={isXs ? 12 : 3}>
              <FormControlComponent xsLabel={0} xsForm={12} label={t('danhmuctotnghiep.title.sohocsinh')}>
                <InputForm formik={formik} name="SoHocSinh" type="text" isDisabled />
              </FormControlComponent>
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <FormControlComponent xsLabel={0} xsForm={12} label={t('danhmuctotnghiep.field.ghichu')}>
              <InputForm formik={formik} name="GhiChu" placeholder="ghi chú" isMulltiline minRows={2} isDisabled />
            </FormControlComponent>
          </Grid>
        </Grid>
        <Grid item xs={12} container spacing={1} justifyContent="flex-end">
          <Grid item>
            <ExitButton />
          </Grid>
        </Grid>
      </Grid>
    </form>
  );
};

export default Detail;
