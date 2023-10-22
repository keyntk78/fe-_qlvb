import React from 'react';
import { Grid, useMediaQuery } from '@mui/material';
import { useFormik } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { openPopupSelector, selectedReportSelector } from 'store/selectors';
import { useTranslation } from 'react-i18next';
import InputForm from 'components/form/InputForm';
import FormGroupButton from 'components/button/FormGroupButton';
import FormControlComponent from 'components/form/FormControlComponent ';
import useReportValidationSchema from 'components/validations/reportValidation';
import { editReport, getReportById } from 'services/reportService';
import { setOpenPopup, setReloadData, showAlert } from 'store/actions';

const Edit = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const selectedReport = useSelector(selectedReportSelector);
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
        const response = await editReport({
          ...values,
          reportId: selectedReport.reportId
        });
        if (response.isSuccess == false) {
          dispatch(showAlert(new Date().getTime().toString(), 'error', response.message.toString()));
        } else {
          dispatch(setOpenPopup(false));
          dispatch(setReloadData(true));
          dispatch(showAlert(new Date().getTime().toString(), 'success', response.message.toString()));
        }
      } catch (error) {
        console.error('Error updating report:', error);
        dispatch(showAlert(new Date().getTime().toString(), 'error', error.toString()));
      }
    }
  });

  useEffect(() => {
    const fetchData = async () => {
      const response = await getReportById(selectedReport.reportId);
      const data = response.data;
      if (selectedReport && openPopup) {
        if (selectedReport) {
          formik.setValues({
            name: data.name || '',
            url: data.url || ''
          });
        }
      }
      dispatch(setReloadData(false));
    };
    if (openPopup) {
      fetchData();
    }
  }, [selectedReport, openPopup]);

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

export default Edit;
