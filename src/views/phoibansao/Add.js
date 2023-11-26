import React from 'react';
import { Checkbox, FormControl, FormControlLabel, Grid, useMediaQuery } from '@mui/material';
import { useFormik } from 'formik';
import { createPhoisao } from 'services/phoisaoService';
import { showAlert, setReloadData, setOpenPopup } from 'store/actions';
import { useDispatch, useSelector } from 'react-redux';
import { usePhoibansaoValidationSchema } from 'components/validations/phoibansaoValidation';
import InputForm from 'components/form/InputForm';
import { useTranslation } from 'react-i18next';
import { openPopupSelector, userLoginSelector } from 'store/selectors';
import { useEffect } from 'react';
import FormControlComponent from 'components/form/FormControlComponent ';
import FormGroupButton from 'components/button/FormGroupButton';
import { convertJsonToFormData } from 'utils/convertJsonToFormData';
import ImageForm from 'components/form/ImageForm';
import { getAllHedaotao } from 'services/hedaotaoService';
import SelectForm from 'components/form/SelectForm';
import { useState } from 'react';
import InputForm1 from 'components/form/InputForm1';
import { GetCauHinhPhoiSaoKichThuoc } from 'services/sharedService';

const Add = () => {
  const isXs = useMediaQuery('(max-width:600px)');
  const user = useSelector(userLoginSelector);
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const PhoiValidationSchema = usePhoibansaoValidationSchema(true);
  const openPopup = useSelector(openPopupSelector);
  const [hdt, setHDT] = useState([]);
  const formik = useFormik({
    initialValues: {
      MaHeDaoTao: '',
      TenPhoi: '',
      SoLuongPhoi: 0,
      ChieuNgang: 0,
      ChieuDoc: 0,
      AnhPhoi: '',
      NgayMua: '',
      TuDongKhoa: false,
      MoTa: '',
      NguoiThucHien: user.username,
      FileImage: ''
    },
    validationSchema: PhoiValidationSchema,
    onSubmit: async (values) => {
      try {
        const formData = await convertJsonToFormData(values);
        const addedPhoisao = await createPhoisao(formData);
        if (addedPhoisao.isSuccess == false) {
          dispatch(showAlert(new Date().getTime().toString(), 'error', addedPhoisao.message.toString()));
        } else {
          dispatch(setOpenPopup(false));
          dispatch(setReloadData(true));
          dispatch(showAlert(new Date().getTime().toString(), 'success', addedPhoisao.message.toString()));
        }
      } catch (error) {
        console.error('error' + error);
        dispatch(showAlert(new Date().getTime().toString(), 'error', error.toString()));
      }
    }
  });
  useEffect(() => {
    if (openPopup) {
      formik.resetForm();
    }
  }, [openPopup]);

  useEffect(() => {
    const fetchDataDL = async () => {
      const response = await getAllHedaotao();
      setHDT(response.data);
      const response_cauhinhkichthuoc = await GetCauHinhPhoiSaoKichThuoc();

      const chieuDocConfig = response_cauhinhkichthuoc.data.find((item) => item.configKey === 'KT_PHOIBANSAO_CHIEUNDOC');
      const chieuNgangConfig = response_cauhinhkichthuoc.data.find((item) => item.configKey === 'KT_PHOIBANSAO_CHIEUNGANG');

      if (chieuDocConfig && chieuNgangConfig) {
        formik.setValues({
          ...formik.values,
          ChieuDoc: chieuDocConfig.configValue,
          ChieuNgang: chieuNgangConfig.configValue
        });
      }
    };
    if (openPopup) {
      fetchDataDL();
    }
  }, [openPopup]);

  return (
    <form onSubmit={formik.handleSubmit}>
      <Grid container spacing={1} my={isXs ? 0 : 2}>
        <Grid item xs={12} container spacing={1}>
          <FormControlComponent xsLabel={isXs ? 0 : 2.5} xsForm={isXs ? 12 : 9.5} isRequire label={t('hedaotao.title')}>
            <FormControl fullWidth variant="outlined">
              <SelectForm
                formik={formik}
                keyProp="ma"
                valueProp="ten"
                item={hdt}
                name="MaHeDaoTao"
                value={formik.values.MaHeDaoTao}
                onChange={(e) => formik.setFieldValue('MaHeDaoTao', e.target.value)}
              />
            </FormControl>
          </FormControlComponent>
          <FormControlComponent xsLabel={isXs ? 0 : 2.5} xsForm={isXs ? 12 : 9.5} isRequire label={t('phoivanbang.field.tenphoi')}>
            <InputForm formik={formik} name="TenPhoi" type="text" placeholder={t('phoivanbang.field.tenphoi')} />
          </FormControlComponent>
          <Grid item container spacing={1}>
            <Grid item xs={6}>
              <FormControlComponent xsLabel={isXs ? 0 : 5} xsForm={isXs ? 12 : 7} isRequire label={t('phoivanbang.field.ngaymua')}>
                <InputForm formik={formik} name="NgayMua" type="date" placeholder={t('phoivanbang.field.ngaymua')} />
              </FormControlComponent>
            </Grid>
            <Grid item xs={6}>
              <FormControlComponent xsLabel={isXs ? 0 : 4.5} xsForm={isXs ? 12 : 7.5} isRequire label={t('phoivanbang.field.soluongphoi')}>
                <InputForm formik={formik} name="SoLuongPhoi" type="number" placeholder={t('phoivanbang.field.soluongphoi')} />
              </FormControlComponent>
            </Grid>
          </Grid>
          <Grid item container spacing={isXs ? 0 : 1} columnSpacing={isXs ? 1 : 0}>
            <Grid item xs={6}>
              <FormControlComponent xsLabel={isXs ? 0 : 5} xsForm={isXs ? 12 : 7} isRequire label={t('Chiều ngang')}>
                <InputForm formik={formik} name="ChieuNgang" type="number" placeholder={t('Chiều ngang')} />
              </FormControlComponent>
            </Grid>
            <Grid item xs={6}>
              <FormControlComponent xsLabel={isXs ? 0 : 5} xsForm={isXs ? 12 : 7} isRequire label={t('Chiều dọc')}>
                <InputForm formik={formik} name="ChieuDoc" type="number" placeholder={t('Chiều dọc')} />
              </FormControlComponent>
            </Grid>
          </Grid>
          <Grid item xs={6}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={formik.values.TuDongKhoa} // Check if the value is 'x'
                  onChange={(e) => formik.setFieldValue('TuDongKhoa', e.target.checked)}
                />
              }
              label="Khóa di chuyển phôi"
            />
          </Grid>
          <Grid item xs={12} sx={{ flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <ImageForm
              formik={formik}
              name="AnhPhoi"
              nameFile="FileImage"
              width={isXs ? '300' : '450'}
              height={isXs ? '190' : '290'}
              noAvata
              isImagePreview={openPopup}
            />
          </Grid>
          <Grid item xs={12}>
            <InputForm1 formik={formik} name="MoTa" label={t('Mô tả')} isMulltiline minRows={3} maxRows={10} />
          </Grid>
        </Grid>
      </Grid>
      <FormGroupButton />
    </form>
  );
};

export default Add;
