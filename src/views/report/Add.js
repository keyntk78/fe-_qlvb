import React from 'react';
import { Grid, useMediaQuery } from '@mui/material';
import { useFormik } from 'formik';
import { setOpenPopup, showAlert, setReloadData } from 'store/actions';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import InputForm from 'components/form/InputForm';
import FormGroupButton from 'components/button/FormGroupButton';
import { openPopupSelector } from 'store/selectors';
import { useEffect } from 'react';
import FormControlComponent from 'components/form/FormControlComponent ';
import { createReport } from 'services/reportService';
import useReportValidationSchema from 'components/validations/reportValidation';

const Add = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const reportValidationSchema = useReportValidationSchema();
  const openPopup = useSelector(openPopupSelector);
  const isXs = useMediaQuery('(max-width:800px)');

  const formik = useFormik({
    initialValues: {
      name: '',
      url: ''
    },
    validationSchema: reportValidationSchema,
    onSubmit: async (values) => {
      try {
        const addedReports = await createReport(values);
        if (addedReports.isSuccess == false) {
          dispatch(showAlert(new Date().getTime().toString(), 'error', addedReports.message.toString()));
        } else {
          dispatch(setOpenPopup(false));
          dispatch(setReloadData(true));
          dispatch(showAlert(new Date().getTime().toString(), 'success', addedReports.message.toString()));
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
      <Grid container spacing={1} my={2}>
        <FormControlComponent xsLabel={isXs ? 0 : 3} xsForm={isXs ? 12 : 9} isRequire label={t('Tên báo cáo')}>
          <InputForm formik={formik} name="name" type="text" />
        </FormControlComponent>
        <FormControlComponent xsLabel={isXs ? 0 : 3} xsForm={isXs ? 12 : 9} isRequire label={t('Đường dẫn')}>
          <InputForm formik={formik} name="url" type="text" />
        </FormControlComponent>
        <FormGroupButton />
      </Grid>
    </form>
  );
};

export default Add;
