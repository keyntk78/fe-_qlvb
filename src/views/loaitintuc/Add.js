import React from 'react';
import { Grid, useMediaQuery } from '@mui/material';
import { useFormik } from 'formik';
import { setOpenPopup, showAlert, setReloadData } from 'store/actions';
import { useDispatch, useSelector } from 'react-redux';
import { useLoaiTinTucValidationSchema } from 'components/validations/loaitintucValidation';
import { useTranslation } from 'react-i18next';
import InputForm from 'components/form/InputForm';
import { openPopupSelector, userLoginSelector } from 'store/selectors';
import { convertJsonToFormData } from 'utils/convertJsonToFormData';
import FormGroupButton from 'components/button/FormGroupButton';
import FormControlComponent from 'components/form/FormControlComponent ';
import { useEffect } from 'react';
import { createLoaiTinTuc } from 'services/loaitintucService';

const AddLoaiTinTuc = () => {
  const isXs = useMediaQuery('(max-width:800px)');
  const openPopup = useSelector(openPopupSelector);
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const loaiTinTucValidationSchema = useLoaiTinTucValidationSchema();
  const user = useSelector(userLoginSelector);

  const formik = useFormik({
    initialValues: {
      tieuDe: '',
      ghiChu: '',
      nguoithuchien: user.username
    },
    validationSchema: loaiTinTucValidationSchema,
    onSubmit: async (values) => {
      try {
        const formData = await convertJsonToFormData(values);
        const addedMonthi = await createLoaiTinTuc(formData);
        if (addedMonthi.isSuccess == false) {
          dispatch(showAlert(new Date().getTime().toString(), 'error', addedMonthi.message.toString()));
        } else {
          dispatch(setOpenPopup(false));
          dispatch(setReloadData(true));
          dispatch(showAlert(new Date().getTime().toString(), 'success', addedMonthi.message.toString()));
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

  return (
    <form onSubmit={formik.handleSubmit}>
      <Grid container>
        <Grid item container xs={isXs ? 12 : 10} spacing={isXs ? 1 : 2} my={1} ml={isXs ? 0 : 3}>
          <FormControlComponent xsLabel={isXs ? 0 : 2} xsForm={isXs ? 12 : 10} isRequire label={t('Tiêu đề')}>
            <InputForm formik={formik} name="tieuDe" type="text" />
          </FormControlComponent>
          <FormControlComponent xsLabel={isXs ? 0 : 2} xsForm={isXs ? 12 : 10} label={t('Ghi chú')}>
            <InputForm formik={formik} name="ghiChu" type="text" />
          </FormControlComponent>
        </Grid>
        <Grid item xs={12} container spacing={2} justifyContent="flex-end">
          <FormGroupButton />
        </Grid>
      </Grid>
    </form>
  );
};

export default AddLoaiTinTuc;
