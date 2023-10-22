// material-ui
import { useTheme } from '@mui/material/styles';
import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  InputAdornment,
  InputLabel,
  OutlinedInput,
} from '@mui/material';

// third party
import { Formik } from 'formik';

// project imports
import AnimateButton from 'components/extended/AnimateButton';

import { useTranslation } from 'react-i18next';
import { IconMail } from '@tabler/icons';
import useEmailValidationSchema from 'components/validations/emailValidation';
import { forgotpass } from 'services/authService';
import useScriptRef from 'hooks/useScriptRef';
import { useDispatch } from 'react-redux';
import { showAlert } from 'store/actions';
import Alert from 'components/controls/alert';
import { useState } from 'react';
import { useNavigate } from 'react-router';

// ============================|| FIREBASE - LOGIN ||============================ //

const ForgotPassword = ({ ...others }) => {
  const { t } = useTranslation();
  const emailValidationSchema = useEmailValidationSchema();
  const theme = useTheme();
  const scriptedRef = useScriptRef();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showAlertForgotpass, setShowAlertForgotpass] = useState(false);

  return (
    <>
      <Formik
        initialValues={{
          email: '',
          submit: null
        }}
        validationSchema={emailValidationSchema}
        onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
          try {
            const forgotpassword = await forgotpass(values.email);
            if (forgotpassword.isSuccess) {
              dispatch(showAlert(new Date().getTime().toString(), 'success', forgotpassword.message.toString()));
              navigate('/login')
            } else {
              if (forgotpassword?.errors) {
                console.log(forgotpassword?.errors);
              } else {
                dispatch(showAlert(new Date().getTime().toString(), 'error', forgotpassword.message.toString()));
                setShowAlertForgotpass(true);
              }
            }
            if (scriptedRef.current) {
              setStatus({ success: true });
              setSubmitting(false);
            }
          } catch (err) {
            console.error(err);
            if (scriptedRef.current) {
              setStatus({ success: false });
              setErrors({ submit: err.message });
              setSubmitting(false);
            }
          }
        }}
      >
        {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
          <form noValidate onSubmit={handleSubmit} {...others}>
            <FormControl fullWidth error={Boolean(touched.email && errors.email)} sx={{ ...theme.typography.customInput }}>
              <InputLabel htmlFor="outlined-adornment-email-forgotpass">{t('Email')}</InputLabel>
              <OutlinedInput
                id="outlined-adornment-email-forgotpass"
                type={'text'}
                value={values.email}
                name="email"
                onBlur={handleBlur}
                onChange={handleChange}
                endAdornment={
                  <InputAdornment position="end">
                    <IconMail />
                  </InputAdornment>
                }
                label="Email"
                inputProps={{}}
              />
              {touched.email && errors.email && (
                <FormHelperText error id="standard-weight-helper-text-email-forgotpass">
                  {errors.email}
                </FormHelperText>
              )}
            </FormControl>
            {errors.submit && (
              <Box sx={{ mt: 3 }}>
                <FormHelperText error>{errors.submit}</FormHelperText>
              </Box>
            )}

            <Box sx={{ mt: 2 }}>
              <AnimateButton>
                <Button disableElevation disabled={isSubmitting} fullWidth size="large" type="submit" variant="contained" color="info">
                  {t('button.continue')}
                </Button>
              </AnimateButton>
            </Box>
          </form>
        )}
      </Formik>
      {showAlertForgotpass && <Alert />}
    </>
  );
};

export default ForgotPassword;
