import React from 'react';
import { Grid, useMediaQuery } from '@mui/material';
import { useFormik } from 'formik';
import { setOpenPopup, showAlert, setReloadData } from 'store/actions';
import { useDispatch, useSelector } from 'react-redux';
import { useConfigValidationSchema } from 'components/validations/configValidation';
import InputForm from 'components/form/InputForm';
import { useTranslation } from 'react-i18next';
import { openPopupSelector, userLoginSelector } from 'store/selectors';
import { useEffect } from 'react';
import FormControlComponent from 'components/form/FormControlComponent ';
import { createConfig } from 'services/configService';
import FormGroupButton from 'components/button/FormGroupButton';

const AddConfig = () => {
  const isXs = useMediaQuery('(max-width:800px)');
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const configValidationSchema = useConfigValidationSchema();
  const openPopup = useSelector(openPopupSelector);
  const userLogin = useSelector(userLoginSelector);

  const formik = useFormik({
    initialValues: {
      configKey: '',
      configValue: '',
      configDesc: '',
      createdBy: userLogin.username
    },
    validationSchema: configValidationSchema,
    onSubmit: async (values) => {
      try {
        const addedConfig = await createConfig(values);
        if (addedConfig.isSuccess == false) {
          dispatch(showAlert(new Date().getTime().toString(), 'error', addedConfig.message.toString()));
        } else {
          dispatch(setOpenPopup(false));
          dispatch(setReloadData(true));
          dispatch(showAlert(new Date().getTime().toString(), 'success', addedConfig.message.toString()));
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
        <Grid item container xs={11} spacing={isXs ? 0 : 2} my={1} ml={isXs ? 0 : 4}>
          <FormControlComponent xsLabel={isXs ? 0 : 2} xsForm={isXs ? 12 : 8} isRequire label={t('config.input.label.key')}>
            <InputForm formik={formik} placeholder={t('config.input.label.key')} name="configKey" type="text" />
          </FormControlComponent>
          <FormControlComponent xsLabel={isXs ? 0 : 2} xsForm={isXs ? 12 : 8} isRequire label={t('config.input.label.value')}>
            <InputForm formik={formik} placeholder={t('config.input.label.value')} name="configValue" type="text" />
          </FormControlComponent>
          <FormControlComponent xsLabel={isXs ? 0 : 2} xsForm={isXs ? 12 : 8} label={t('config.input.label.description')}>
            <InputForm formik={formik} placeholder={t('config.input.label.description')} isMulltiline minRows={2} name="configDesc" type="text" />
          </FormControlComponent>
        </Grid>
        <Grid item xs={12} container spacing={2} justifyContent="flex-end">
          <FormGroupButton />
        </Grid>
      </Grid>
    </form>
  );
};

export default AddConfig;
