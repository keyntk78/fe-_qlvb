import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';

// material-ui
// import { useTheme } from '@mui/material/styles';
import { Box, Button, FormHelperText, Grid, Typography } from '@mui/material';

// third party
import { Formik } from 'formik';

// project imports
import useScriptRef from 'hooks/useScriptRef';
import AnimateButton from 'components/extended/AnimateButton';

// assets
// import Visibility from '@mui/icons-material/Visibility';
// import VisibilityOff from '@mui/icons-material/VisibilityOff';

// import Google from 'assets/images/icons/social-google.svg';
import { checkLoginSSO, saveDeviceToken } from 'services/authService';
import Alert from 'components/controls/alert';
import { useTranslation } from 'react-i18next';
import { showAlertSelector } from 'store/selectors';
import InputFormOutlined from 'components/form/InputFormOutlined';
import { setOpenPopup, showAlert } from 'store/actions';
import { useEffect } from 'react';
import { getToken } from 'firebase/messaging';
import { messaging } from 'utils/firebase';
import useAuthenticationValidationSchema from 'components/validations/authenticationValidation';
import { useTheme } from '@emotion/react';

// ============================|| FIREBASE - LOGIN ||============================ //

const Authentication = ({ user, email, ...others }) => {
  const { t } = useTranslation();
  const authenticationValidation = useAuthenticationValidationSchema();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const showAlertLogin = useSelector(showAlertSelector);
  const scriptedRef = useScriptRef();
  const [errorBE, setErrorBE] = useState([]);
  const [deviceToken, setDeviceToken] = useState('');
  const token = localStorage.getItem('token');
  const theme = useTheme();

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
  }, [token]);

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
          otp: '',
          submit: null
        }}
        validationSchema={authenticationValidation}
        onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
          try {
            const loggedInUser = await checkLoginSSO({ username: user, otp: values.otp });
            if (loggedInUser.isSuccess) {
              const user = {
                id: loggedInUser.data.responseLogin.userId,
                username: loggedInUser.data.responseLogin.username,
                fullname: loggedInUser.data.responseLogin.fullName,
                avatar: loggedInUser.data.responseLogin.avatar,
                token: loggedInUser.data.responseLogin.token
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
              localStorage.setItem('token', loggedInUser.data.responseLogin.token);
              localStorage.setItem('user', JSON.stringify(user));
              localStorage.setItem('menu', menu);
              localStorage.setItem('reports', reports);
              dispatch(showAlert(new Date().getTime().toString(), 'success', loggedInUser.message.toString()));
              dispatch(setOpenPopup(false));
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
            <Grid container justifyContent={'center'} mt={3}>
              <Grid container justifyContent="center" spacing={1}>
                <Grid item>
                  <Typography variant="h4">Xin chào: </Typography>
                </Grid>
                <Grid item>
                  <Typography variant="h4" color={theme.palette.primary.main}>
                    {user}
                  </Typography>
                </Grid>
              </Grid>
              <Grid item xs={12} textAlign={'center'} mt={2}>
                <Typography variant="body1">Mã xác thực của bạn đã được gửi đến email: {email}</Typography>
                <Typography variant="body1">Vui lòng nhập mã xác thực của bạn bên dưới để tiến hành truy cập</Typography>
              </Grid>
              <Grid item xs={8} mt={2}>
                <InputFormOutlined
                  name="otp"
                  touched={touched?.otp}
                  errors={errors?.otp}
                  label={t('Mã xác thực')}
                  handleBlur={handleBlur}
                  value={values?.otp}
                  type="text"
                  handleChange={handleChange}
                  errorBE={errorBE}
                />
                {errors.submit && (
                  <Box sx={{ mt: 1 }}>
                    <FormHelperText error>{errors.submit}</FormHelperText>
                  </Box>
                )}
              </Grid>
              <Grid item xs={8} mt={1} mb={2}>
                <AnimateButton>
                  <Button disableElevation disabled={isSubmitting} fullWidth size="large" type="submit" variant="contained" color="primary">
                    {t('Truy cập')}
                  </Button>
                </AnimateButton>
              </Grid>
            </Grid>
          </form>
        )}
      </Formik>
      {showAlertLogin && <Alert />}
    </>
  );
};

export default Authentication;
