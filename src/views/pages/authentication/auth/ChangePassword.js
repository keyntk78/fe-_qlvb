import React from 'react';
import { Grid, useMediaQuery} from '@mui/material';
import { useFormik } from 'formik';
import { showAlert, setReloadData, setOpenProfile } from 'store/actions';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import InputForm2 from 'components/form/InputForm2';
import { useChangePassValidationSchema } from 'components/validations/changePassValidation';
import { openProfileSelector } from 'store/selectors';
import { useEffect } from 'react';
import { changepass } from 'services/authService';
import SaveButton from 'components/button/SaveButton';
import ExitButton from 'components/button/ExitButton';
import FormControlComponent from 'components/form/FormControlComponent ';
import { useState } from 'react';

const ChangePassword = () => {
  const isXs = useMediaQuery('(max-width:600px)');
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const passwordValidationSchema = useChangePassValidationSchema();
  const openProfile = useSelector(openProfileSelector);
  const [errors, setErrors] = useState([]);

  const formik = useFormik({
    initialValues: {
      password: '',
      newPassword: '',
      confirmPassword: ''
    },
    validationSchema: passwordValidationSchema,
    onSubmit: async (values) => {
      try {
        const addedRoles = await changepass(values);
        if (addedRoles.isSuccess == false) {
          if (addedRoles?.errors) {
            setErrors(addedRoles?.errors);
          } else {
            dispatch(showAlert(new Date().getTime().toString(), 'error', addedRoles.message.toString()));
          }
        } else {
          dispatch(setReloadData(true));
          dispatch(setOpenProfile(false));
          dispatch(showAlert(new Date().getTime().toString(), 'success', addedRoles.message.toString()));
        }
      } catch (error) {
        console.error('error' + error);
        dispatch(showAlert(new Date().getTime().toString(), 'error', error.toString()));
      }
    }
  });

  useEffect(() => {
    if (openProfile) {
      formik.resetForm();
      setErrors([]);
    }
  }, [openProfile]);

  return (
    <form onSubmit={formik.handleSubmit}>
      <Grid container>
        <Grid item container xs={10} spacing={1} ml={3} mt={2}>
          <FormControlComponent xsLabel={isXs ? 0 : 4} xsForm={isXs ? 12 : 8} isRequire label={t('forgotpass.input.label.oldpass')}>
            <InputForm2 formik={formik} name="password" type="password" />
          </FormControlComponent>
          <FormControlComponent xsLabel={isXs ? 0 : 4} xsForm={isXs ? 12 : 8} isRequire label={t('forgotpass.input.label.newpass')}>
            <InputForm2 formik={formik} name="newPassword" type="password" errors={errors} />
          </FormControlComponent>
          <FormControlComponent xsLabel={isXs ? 0 : 4} xsForm={isXs ? 12 : 8} isRequire label={t('forgotpass.input.label.confirmpass')}>
            <InputForm2 formik={formik} name="confirmPassword" type="password" errors={errors} />
          </FormControlComponent>
        </Grid>
        <Grid item xs={12} container spacing={2} justifyContent="flex-end" mt={1}>
          <Grid item>
            <SaveButton />
          </Grid>
          <Grid item>
            <ExitButton type="profile" />
          </Grid>
        </Grid>
      </Grid>
    </form>
  );
};

export default ChangePassword;
