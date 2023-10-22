import { React } from 'react';
import { Grid, useMediaQuery } from '@mui/material';
import { useFormik } from 'formik';
import { showAlert, setReloadData, setOpenPopup } from 'store/actions';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { openPopupSelector, reloadDataSelector, selectedPhoisaoSelector, userLoginSelector } from 'store/selectors';
import { useTranslation } from 'react-i18next';
import { Destroy, getPhoisaoById } from 'services/phoisaoService';
import FormGroupButton from 'components/button/FormGroupButton';
import { convertJsonToFormData } from 'utils/convertJsonToFormData';
import { convertFormattedDateToISODate, convertISODateToFormattedDate } from 'utils/formatDate';
// import { useHuyphoiValidationSchema } from 'components/validations/huyphoiValidate';
import ImageForm from 'components/form/ImageForm';
import { useState } from 'react';
import config from 'config';
import InputForm1 from 'components/form/InputForm1';
import Importfile from 'components/form/ImportFile';

const DestroyPhoi = () => {
  const isXs = useMediaQuery('(max-width:600px)');
  const [urlImage, setUrlImage] = useState('');
  const reloadData = useSelector(reloadDataSelector);
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const selectedphoisao = useSelector(selectedPhoisaoSelector);
  const user = useSelector(userLoginSelector);
  // const PhoiValidationSchema = useHuyphoiValidationSchema();
  const openPopup = useSelector(openPopupSelector);

  const formik = useFormik({
    initialValues: {
      FileBienBan: '',
      FileBienBanHuyPhoi: ''
    },
    //validationSchema: PhoiValidationSchema,
    onSubmit: async (values) => {
      try {
        const formData = await convertJsonToFormData(values);
        const PhoisaoDestroy = await Destroy(formData);
        if (PhoisaoDestroy.isSuccess == false) {
          dispatch(showAlert(new Date().getTime().toString(), 'error', PhoisaoDestroy.errors[0].error.toString()));
        } else {
          dispatch(setOpenPopup(false));
          dispatch(setReloadData(true));
          dispatch(showAlert(new Date().getTime().toString(), 'success', PhoisaoDestroy.message.toString()));
        }
      } catch (error) {
        console.error('Error updating function:', error);
        dispatch(showAlert(new Date().getTime().toString(), 'error', error.toString()));
      }
    }
  });

  useEffect(() => {
    const fetchData = async () => {
      const phoisaoById = await getPhoisaoById(selectedphoisao.id);
      const dataPhoisao = phoisaoById.data;
      const NgayApDung = convertISODateToFormattedDate(dataPhoisao.ngayMua);
      if (selectedphoisao) {
        formik.setValues({
          Id: selectedphoisao.id,
          TenPhoi: dataPhoisao.tenPhoi,
          NguoiHuy: user.username,
          NgayMua: convertFormattedDateToISODate(NgayApDung) || '',
          LyDoHuy: dataPhoisao.LyDoHuy || ''
        });
      }
      dispatch(setReloadData(false));
      if (dataPhoisao.anhPhoi) {
        setUrlImage(config.urlFile + 'PhoiBanSao/' + dataPhoisao.anhPhoi);
      } else {
        setUrlImage(''); // If no avatar value, reset the urlImage state to an empty string
      }
    };
    fetchData();
  }, [selectedphoisao, openPopup, reloadData]);

  return (
    <form onSubmit={formik.handleSubmit}>
      <Grid container spacing={1} my={2}>
        <Grid item xs={12} container spacing={1}>
          <InputForm1 formik={formik} name="TenPhoi" xs={12} label={t('phoivanbang.field.tenphoi')} isDisabled />
          <Grid item container spacing={1}>
            <InputForm1 formik={formik} xs={6} name="NgayMua" type="date" label={t('phoivanbang.field.ngaymua')} isDisabled />
          </Grid>

          <Grid item xs={12} sx={{ flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <ImageForm
              formik={formik}
              name="AnhPhoi"
              nameFile="FileImage"
              width={isXs ? '300' : '450'}
              urlImage={urlImage}
              height={isXs ? '190' : '290'}
              noAvata
              noInsert
              isImagePreview={openPopup}
            />
          </Grid>
          <Grid item container xs={12} mt={2}>
            <Grid item xs={12}>
              {t('phoivanbang.field.bienbanhuyphoi')}
            </Grid>
            <Grid item xs={12}>
              <Importfile name="FileBienBanHuyPhoi" formik={formik} nameFile="FileBienBan" lable={t('button.upload')} />
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} container spacing={2} justifyContent="flex-end">
          <FormGroupButton />
        </Grid>
      </Grid>
    </form>
  );
};

export default DestroyPhoi;
