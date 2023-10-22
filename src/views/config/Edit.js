import { React } from 'react';
import { Grid, useMediaQuery } from '@mui/material';
import { useFormik } from 'formik';
import { useConfigValidationSchema } from '../../components/validations/configValidation';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { editConfig, getConfigById } from 'services/configService';
import { showAlert, setOpenPopup, setReloadData } from 'store/actions';
import { openPopupSelector, reloadDataSelector, selectedConfigSelector, userLoginSelector } from 'store/selectors';
import InputForm from 'components/form/InputForm';
import { useTranslation } from 'react-i18next';
import FormControlComponent from 'components/form/FormControlComponent ';
import FormGroupButton from 'components/button/FormGroupButton';

const EditConfig = () => {
  const isXs = useMediaQuery('(max-width:800px)');
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const selectedConfig = useSelector(selectedConfigSelector);
  const reloadData = useSelector(reloadDataSelector);
  const configValidationSchema = useConfigValidationSchema();
  const openPopup = useSelector(openPopupSelector);
  const userLogin = useSelector(userLoginSelector);

  const formik = useFormik({
    initialValues: {
      configKey: '',
      configValue: '',
      configDesc: '',
      lastModifiedBy: ''
    },
    validationSchema: configValidationSchema,
    onSubmit: async (values) => {
      try {
        const configUpdated = await editConfig({
          ...values,
          configId: selectedConfig.configId,
          lastModifiedBy: userLogin.username
        });
        if (configUpdated.isSuccess == false) {
          dispatch(showAlert(new Date().getTime().toString(), 'error', configUpdated.message.toString()));
        } else {
          dispatch(setOpenPopup(false));
          dispatch(setReloadData(true));
          dispatch(showAlert(new Date().getTime().toString(), 'success', configUpdated.message.toString()));
        }
      } catch (error) {
        console.error('Error updating config:', error);
        dispatch(showAlert(new Date().getTime().toString(), 'error', error.toString()));
      }
    }
  });

  useEffect(() => {
    const fetchData = async () => {
      const configbyid = await getConfigById(selectedConfig.configId);
      const dataconfig = configbyid.data;
      if (selectedConfig || openPopup) {
        formik.setValues({
          configKey: dataconfig.configKey || '',
          configValue: dataconfig.configValue || '',
          configDesc: dataconfig.configDesc || ''
        });
      }
      dispatch(setReloadData(false));
    };
    if (openPopup) {
      fetchData();
    }
  }, [selectedConfig, openPopup, reloadData]);

  return (
    <form onSubmit={formik.handleSubmit}>
      <Grid container>
        <Grid item container xs={11} spacing={isXs ? 0 : 2} my={1} ml={isXs ? 0 : 4}>
          <FormControlComponent xsLabel={isXs ? 0 : 2} xsForm={isXs ? 12 : 8} label={t('config.input.label.key')}>
            <InputForm formik={formik} name="configKey" type="text" isDisabled />
          </FormControlComponent>
          <FormControlComponent xsLabel={isXs ? 0 : 2} xsForm={isXs ? 12 : 8} isRequire label={t('config.input.label.value')}>
            <InputForm formik={formik} name="configValue" type="text" />
          </FormControlComponent>
          <FormControlComponent xsLabel={isXs ? 0 : 2} xsForm={isXs ? 12 : 8} label={t('config.input.label.description')}>
            <InputForm formik={formik} name="configDesc" isMulltiline minRows={2} type="text" />
          </FormControlComponent>
        </Grid>
        <Grid item xs={12} container spacing={2} justifyContent="flex-end">
          <FormGroupButton />
        </Grid>
      </Grid>
    </form>
  );
};

export default EditConfig;
