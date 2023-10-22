import React from 'react';
import { Grid, useMediaQuery } from '@mui/material';
import { useFormik } from 'formik';
import { useMonthiValidationSchema } from 'components/validations/monthiValidation';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { editMonthi, getMonthiById } from 'services/monthiService';
import { showAlert, setOpenPopup, setReloadData } from 'store/actions';
import { openPopupSelector, reloadDataSelector, selectedMonthiSelector } from 'store/selectors';
import { useTranslation } from 'react-i18next';
import { userLoginSelector } from 'store/selectors';
import { convertJsonToFormData } from 'utils/convertJsonToFormData';
import InputForm from 'components/form/InputForm';
import FormControlComponent from 'components/form/FormControlComponent ';
import FormGroupButton from 'components/button/FormGroupButton';

const EditMonthi = () => {
  const isXs = useMediaQuery('(max-width:800px)');
  const openPopup = useSelector(openPopupSelector);
  const dispatch = useDispatch();
  const reloadData = useSelector(reloadDataSelector);
  const { t } = useTranslation();
  const monthiValidationSchema = useMonthiValidationSchema();
  const user = useSelector(userLoginSelector);
  const monthi = useSelector(selectedMonthiSelector);
  const formik = useFormik({
    initialValues: {
      ma: '',
      ten: ''
    },
    validationSchema: monthiValidationSchema,
    onSubmit: async (values) => {
      try {
        const formData = await convertJsonToFormData(values);
        const monthiUpdated = await editMonthi(formData);
        if (monthiUpdated.isSuccess == false) {
          dispatch(showAlert(new Date().getTime().toString(), 'error', monthiUpdated.message.toString()));
        } else {
          dispatch(setReloadData(true));
          dispatch(setOpenPopup(false));
          dispatch(showAlert(new Date().getTime().toString(), 'success', monthiUpdated.message.toString()));
        }
      } catch (error) {
        console.error('Error updating role:', error);
        dispatch(showAlert(new Date().getTime().toString(), 'error', error.toString()));
      }
    }
  });

  useEffect(() => {
    const fetchData = async () => {
      const monthijson = await getMonthiById(monthi.id);
      const datamonthi = monthijson.data;
      if (monthi) {
        formik.setValues({
          id: monthi.id,
          ma: datamonthi.ma || '',
          ten: datamonthi.ten || '',
          nguoithuchien: user.username
        });
      }
      dispatch(setReloadData(false));
    };
    if(openPopup){
      fetchData();
    }
  }, [monthi, reloadData, openPopup]);

  return (
    <form onSubmit={formik.handleSubmit}>
      <Grid container>
        <Grid item container xs={isXs ? 12 : 10} spacing={isXs ? 1 : 2} my={1} ml={isXs ? 0 : 3}>
          <FormControlComponent xsLabel={isXs ? 0 : 4.3} xsForm={isXs ? 12 : 7.7} isRequire label={t('monthi.field.ma')}>
            <InputForm formik={formik} name="ma" type="text" />
          </FormControlComponent>
          <FormControlComponent xsLabel={isXs ? 0 : 4.3} xsForm={isXs ? 12 : 7.7} isRequire label={t('monthi.field.ten')}>
            <InputForm formik={formik} name="ten" type="text" />
          </FormControlComponent>
        </Grid>
        <Grid item xs={12} container spacing={2} justifyContent="flex-end">
          <FormGroupButton />
        </Grid>
      </Grid>
    </form>
  );
};

export default EditMonthi;
