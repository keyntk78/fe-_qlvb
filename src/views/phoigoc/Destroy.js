import { React } from 'react';
import { Grid, useMediaQuery } from '@mui/material';
import { useFormik } from 'formik';
import { showAlert, setReloadData, setOpenPopup } from 'store/actions';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { openPopupSelector, reloadDataSelector, selectedPhoigocSelector, userLoginSelector } from 'store/selectors';
import { useTranslation } from 'react-i18next';
import { Destroy, getPhoigocById } from 'services/phoigocService';
import FormGroupButton from 'components/button/FormGroupButton';
import { convertJsonToFormData } from 'utils/convertJsonToFormData';
import { convertFormattedDateToISODate, convertISODateToFormattedDate } from 'utils/formatDate';
import ImageForm from 'components/form/ImageForm';
import { useState } from 'react';
import config from 'config';
import InputForm1 from 'components/form/InputForm1';
import Importfile from 'components/form/ImportFile';
import useHuyphoiValidationSchema from 'components/validations/huyphoiValidate';
import FormControlComponent from 'components/form/FormControlComponent ';

const DestroyPhoi = () => {
  const isXs = useMediaQuery('(max-width:600px)');
  const [urlImage, setUrlImage] = useState('');
  const reloadData = useSelector(reloadDataSelector);
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const selectedPhoigoc = useSelector(selectedPhoigocSelector);
  const user = useSelector(userLoginSelector);
  const PhoiValidationSchema = useHuyphoiValidationSchema();
  const openPopup = useSelector(openPopupSelector);

  const formik = useFormik({
    initialValues: {
      LyDoHuy: '',
      FileBienBan: '',
      FileBienBanHuyPhoi: ''
    },
    validationSchema: PhoiValidationSchema,
    onSubmit: async (values) => {
      try {
        const formData = await convertJsonToFormData(values);
        const PhoigocDestroy = await Destroy(formData);
        if (PhoigocDestroy.isSuccess == false) {
          dispatch(showAlert(new Date().getTime().toString(), 'error', PhoigocDestroy.message.toString()));
        } else {
          dispatch(setOpenPopup(false));
          dispatch(setReloadData(true));
          dispatch(showAlert(new Date().getTime().toString(), 'success', PhoigocDestroy.message.toString()));
        }
      } catch (error) {
        console.error('Error updating function:', error);
        dispatch(showAlert(new Date().getTime().toString(), 'error', error.toString()));
      }
    }
  });

  useEffect(() => {
    const fetchData = async () => {
      const Phoigocbyid = await getPhoigocById(selectedPhoigoc.id);
      const dataPhoigoc = Phoigocbyid.data;
      const NgayApDung = convertISODateToFormattedDate(dataPhoigoc.ngayApDung);
      if (selectedPhoigoc) {
        formik.setValues({
          Id: selectedPhoigoc.id,
          TenPhoi: dataPhoigoc.tenPhoi,
          HieuSoPhoi: dataPhoigoc.soHieuPhoi + dataPhoigoc.soBatDau,
          AnhPhoi: dataPhoigoc.anhPhoi || '',
          NguoiHuy: user.username,
          LyDoHuy: '',
          FileBienBan: '',
          FileBienBanHuyPhoi: '',
          NgayApDung: convertFormattedDateToISODate(NgayApDung) || ''
        });
      }
      dispatch(setReloadData(false));
      if (dataPhoigoc.anhPhoi) {
        setUrlImage(config.urlFile + 'PhoiGoc/' + dataPhoigoc.anhPhoi);
      } else {
        setUrlImage(''); // If no avatar value, reset the urlImage state to an empty string
      }
    };
    if (openPopup) {
      fetchData();
    }
  }, [selectedPhoigoc, openPopup, reloadData]);

  useEffect(() => {
    if (openPopup) {
      formik.resetForm();
    }
  }, [openPopup]);

  return (
    <form onSubmit={formik.handleSubmit}>
      <Grid container spacing={1} my={2}>
        <Grid item xs={12} container spacing={1}>
          <InputForm1 formik={formik} name="TenPhoi" xs={12} label={t('phoivanbang.field.tenphoi')} isDisabled />
          <Grid item container spacing={1}>
            <InputForm1 formik={formik} xs={6} name="NgayApDung" type="date" label={t('phoivanbang.field.ngayapdung')} isDisabled />
            <InputForm1 formik={formik} xs={6} name="HieuSoPhoi" label={t('phoivanbang.field.sohieubatdau')} isDisabled />
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
          <FormControlComponent xsLabel={0} xsForm={12} isRequire label={t('phoivanbang.field.bienbanhuyphoi')}>
            <Importfile name="FileBienBanHuyPhoi" formik={formik} nameFile="FileBienBan" lable={t('button.upload')} />
          </FormControlComponent>
        </Grid>
        <InputForm1
          formik={formik}
          minRows={3}
          maxRows={10}
          xs={12}
          name="LyDoHuy"
          type="text"
          isMulltiline
          placeholder={t('phoivanbang.field.lydohuy')}
          isRequired
          label={t('phoivanbang.field.lydohuy')}
        />
        <Grid item xs={12} container spacing={2} justifyContent="flex-end">
          <FormGroupButton />
        </Grid>
      </Grid>
    </form>
  );
};

export default DestroyPhoi;
