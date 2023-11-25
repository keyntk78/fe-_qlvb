import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

// material-ui
// import { useTheme } from '@mui/material/styles';
import { Box, Button, FormHelperText, IconButton, InputAdornment, Stack, Typography } from '@mui/material';

// third party
import { Formik } from 'formik';

// project imports
import useScriptRef from 'hooks/useScriptRef';
import AnimateButton from 'components/extended/AnimateButton';

// assets
// import Visibility from '@mui/icons-material/Visibility';
// import VisibilityOff from '@mui/icons-material/VisibilityOff';

// import Google from 'assets/images/icons/social-google.svg';
import { LoginSSO } from 'services/authService';
import { useTranslation } from 'react-i18next';
import useLoginValidationSchema from 'components/validations/loginValidation';
import { Link } from 'react-router-dom';
import { openPopupSelector } from 'store/selectors';
import InputFormOutlined from 'components/form/InputFormOutlined';
import { useTheme } from '@emotion/react';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { setOpenPopup } from 'store/actions';
// import { getToken } from 'firebase/messaging';
// import { messaging } from 'utils/firebase';
import Popup from 'components/controls/popup';
import Authentication from '../authentication3/Authentication';
import { IconKey } from '@tabler/icons';

// ============================|| FIREBASE - LOGIN ||============================ //

const FirebaseLogin = ({ ...others }) => {
  const { t } = useTranslation();
  const loginValidationSchema = useLoginValidationSchema();
  const dispatch = useDispatch();
  const theme = useTheme();
  const scriptedRef = useScriptRef();
  const [showPassword, setShowPassword] = useState(false);
  const [errorBE, setErrorBE] = useState([]);
  const openPopup = useSelector(openPopupSelector);
  const [user, setUser] = useState('');

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  return (
    <>
      <Formik
        initialValues={{
          username: '',
          password: '',
          submit: null
        }}
        validationSchema={loginValidationSchema}
        onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
          try {
            const loggedInUser = await LoginSSO(values);
            console.log(loggedInUser);
            if (loggedInUser.isSuccess) {
              setUser(loggedInUser.data);
              dispatch(setOpenPopup(true));
            } else {
              if (loggedInUser?.errors) {
                setErrorBE(loggedInUser?.errors);
              } else {
                setStatus({ success: false });
                setErrors({ submit: loggedInUser.message });
                setSubmitting(false);
              }
            }
            if (scriptedRef.current) {
              setStatus({ success: true });
              setSubmitting(false);
            }
          } catch (err) {
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
              name="username"
              touched={touched?.username}
              errors={errors?.username}
              label={t('login.input.label.username')}
              handleBlur={handleBlur}
              value={values?.username}
              sx={{ ...theme.typography.customInput }}
              type="text"
              handleChange={handleChange}
            />
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
            <Stack direction="row" alignItems="center" justifyContent="flex-end" spacing={1}>
              <Typography
                component={Link}
                to="/forgot-password"
                variant="subtitle1"
                color={theme.palette.info.main}
                sx={{ textDecoration: 'none', cursor: 'pointer' }}
              >
                {t('login.forgotpass')}
              </Typography>
            </Stack>
            {errors.submit && (
              <Box sx={{ mt: 3 }}>
                <FormHelperText error>{errors.submit}</FormHelperText>
              </Box>
            )}

            <Box sx={{ mt: 2 }}>
              <AnimateButton>
                <Button disableElevation disabled={isSubmitting} fullWidth size="large" type="submit" variant="contained" color="info">
                  {t('button.login')}
                </Button>
              </AnimateButton>
            </Box>
          </form>
        )}
      </Formik>
      <Popup title={'Xác thực tài khoản'} icon={IconKey} maxWidth={'sm'} openPopup={openPopup} bgcolor={'#2196F3'}>
        <Authentication user={user.username || ''} email={user.email || ''} />
      </Popup>
    </>
  );
};

export default FirebaseLogin;
