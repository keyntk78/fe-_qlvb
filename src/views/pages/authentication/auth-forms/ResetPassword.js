// material-ui
import { useTheme } from '@mui/material/styles';
import { Box, Button, FormHelperText, IconButton, InputAdornment } from '@mui/material';

// third party
import { Formik } from 'formik';

// project imports
import AnimateButton from 'components/extended/AnimateButton';

import { useTranslation } from 'react-i18next';
// import Alert from 'components/controls/alert';
import { useState } from 'react';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import useResetPassValidationSchema from 'components/validations/resetPasswordValidation';
import { useEffect } from 'react';
import { resetpass } from 'services/authService';
import Alert from 'components/controls/alert';
import { useDispatch } from 'react-redux';
import useScriptRef from 'hooks/useScriptRef';
import { showAlert } from 'store/actions';
import InputFormOutlined from 'components/form/InputFormOutlined';
import { useNavigate } from 'react-router';

// ============================|| FIREBASE - LOGIN ||============================ //

const ResetPassword = ({ ...others }) => {
  const { t } = useTranslation();
  const resetPassValidationSchema = useResetPassValidationSchema();
  const theme = useTheme();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const scriptedRef = useScriptRef();
  const [email, setEmail] = useState('');
  const [token, setToken] = useState('');
  const dispatch = useDispatch();
  const [showAlertResetpass, setShowAlertResetpass] = useState(false);
  const [errorBE, setErrorBE] = useState([]);

  const navigate = useNavigate();

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleClickShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const email = searchParams.get('email');
    const token = searchParams.get('token');
    setEmail(email);
    setToken(token);
  }, []);

  return (
    <>
      <Formik
        initialValues={{
          email: '',
          token: '',
          password: '',
          confirmPassword: '',
          submit: null
        }}
        validationSchema={resetPassValidationSchema}
        onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
          try {
            values.email = email;
            values.token = token;
            const response = await resetpass(values);
            if (response.isSuccess) {
              dispatch(showAlert(new Date().getTime().toString(), 'success', response.message.toString()));
              navigate('/login');
            } else {
              if (response?.errors) {
                setErrorBE(response?.errors);
              } else {
                dispatch(showAlert(new Date().getTime().toString(), 'error', response.message.toString()));
                setShowAlertResetpass(true);
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
            <InputFormOutlined
              name="password"
              value={values.password}
              type={showPassword ? 'text' : 'password'}
              touched={touched.password}
              errors={errors.password}
              handleBlur={handleBlur}
              handleChange={handleChange}
              label={t('login.input.label.password')}
              sx={{ ...theme.typography.customInput }}
              errorBE={errorBE}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                    edge="end"
                    size="large"
                  >
                    {showPassword ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              }
            />
            <InputFormOutlined
              name="confirmPassword"
              value={values.confirmPassword}
              type={showConfirmPassword ? 'text' : 'password'}
              touched={touched.confirmPassword}
              errors={errors.confirmPassword}
              handleBlur={handleBlur}
              handleChange={handleChange}
              label={t('forgotpass.input.label.confirmpass')}
              sx={{ ...theme.typography.customInput }}
              errorBE={errorBE}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowConfirmPassword}
                    onMouseDown={handleMouseDownPassword}
                    edge="end"
                    size="large"
                  >
                    {showConfirmPassword ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              }
            />
            {errors.submit && (
              <Box sx={{ mt: 3 }}>
                <FormHelperText error>{errors.submit}</FormHelperText>
              </Box>
            )}

            <Box sx={{ mt: 2 }}>
              <AnimateButton>
                <Button disableElevation disabled={isSubmitting} fullWidth size="large" type="submit" variant="contained" color="info">
                  {t('reset.password.title')}
                </Button>
              </AnimateButton>
            </Box>
          </form>
        )}
      </Formik>
      {showAlertResetpass && <Alert />}
    </>
  );
};

export default ResetPassword;
