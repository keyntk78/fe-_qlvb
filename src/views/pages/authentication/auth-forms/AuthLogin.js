import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';

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
import { login, saveDeviceToken } from 'services/authService';
import Alert from 'components/controls/alert';
import { useTranslation } from 'react-i18next';
import useLoginValidationSchema from 'components/validations/loginValidation';
import { Link } from 'react-router-dom';
import { showAlertSelector } from 'store/selectors';
import InputFormOutlined from 'components/form/InputFormOutlined';
import { useTheme } from '@emotion/react';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { showAlert } from 'store/actions';
import { useEffect } from 'react';
import { getToken } from 'firebase/messaging';
import { messaging } from 'utils/firebase';

// ============================|| FIREBASE - LOGIN ||============================ //

const FirebaseLogin = ({ ...others }) => {
  const { t } = useTranslation();
  const loginValidationSchema = useLoginValidationSchema();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const theme = useTheme();
  const showAlertLogin = useSelector(showAlertSelector);
  const scriptedRef = useScriptRef();
  const [showPassword, setShowPassword] = useState(false);
  const [errorBE, setErrorBE] = useState([]);
  const [deviceToken, setDeviceToken] = useState('');
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (token) {
      // Điều hướng người dùng đến trang chính hoặc trang đã đăng nhập
      navigate('/admin'); // Sử dụng react-router-dom
    } else {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('menu');
      localStorage.removeItem('deviceToken');
      localStorage.removeItem('donvi');
      localStorage.removeItem('reports');
    }
  }, []);

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  async function requestPermission() {
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      // Generate Token
      const token = await getToken(messaging, {
        vapidKey: 'BG4KudpEwieF4KEGCIwH-mprCCfUzK4Ywid30nnjoa3Wi1EU9fksRZDTA7TpeXYSbyD2J--vd5JvSVz9RxfPVUo'
      });
      // console.log(token);
      setDeviceToken(token);
      // Send this token  to server ( db)
    }
  }

  useEffect(() => {
    // Req user for notification permission
    requestPermission();
  }, []);

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
            const loggedInUser = await login(values);
            // console.log(loggedInUser);
            if (loggedInUser.isSuccess) {
              const user = {
                id: loggedInUser.data.userLogin.userId,
                username: loggedInUser.data.userLogin.username,
                fullname: loggedInUser.data.userLogin.fullName,
                avatar: loggedInUser.data.userLogin.avatar,
                token: loggedInUser.data.userLogin.token
              };

              let data;
              const donvi = JSON.stringify(loggedInUser.data.donvi);
              if (!loggedInUser.data.donvi.id) {
                localStorage.setItem('donvi', '0');
              } else {
                data = {
                  deviceToken: deviceToken,
                  token: user.token,
                  userId: user.id,
                  donViId: loggedInUser.data.donvi.id
                };
                await saveDeviceToken(data);
                localStorage.setItem('donvi', donvi);
              }

              const menu = JSON.stringify(loggedInUser.data.menu);
              const reports = JSON.stringify(loggedInUser.data.reporst);
              localStorage.setItem('token', loggedInUser.data.userLogin.token);
              localStorage.setItem('user', JSON.stringify(user));
              localStorage.setItem('menu', menu);
              localStorage.setItem('reports', reports);

              dispatch(showAlert(new Date().getTime().toString(), 'success', loggedInUser.message.toString()));
              navigate('/admin');
            } else {
              if (loggedInUser?.errors) {
                setErrorBE(loggedInUser?.errors);
              } else {
                setStatus({ success: false });
                setErrors({ submit: loggedInUser.message });
                setSubmitting(false);
                dispatch(showAlert(new Date().getTime().toString(), 'error', loggedInUser.message.toString()));
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
      {showAlertLogin && <Alert />}
    </>
  );
};

export default FirebaseLogin;
