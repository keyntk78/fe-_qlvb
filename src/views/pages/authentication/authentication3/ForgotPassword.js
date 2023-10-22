import { Link } from 'react-router-dom';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Divider, Grid, Stack, Typography, useMediaQuery } from '@mui/material';

// project imports
import AuthWrapper1 from '../AuthWrapper1';
import AuthCardWrapper from '../AuthCardWrapper';
import logo from 'assets/images/icons/LogoVNPT.png';
import { useTranslation } from 'react-i18next';
import ForgotPassword from '../auth-forms/ForgotPassword';
import { IconArrowNarrowLeft, IconKey } from '@tabler/icons';

// assets

// ================================|| AUTH3 - LOGIN ||================================ //

const Login = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const matchDownSM = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <AuthWrapper1>
      <Grid container direction="column" justifyContent="flex-end" sx={{ minHeight: '100vh' }}>
        <Grid item xs={12}>
          <Grid container justifyContent="center" alignItems="center" sx={{ minHeight: '100vh' }}>
            <Grid item sx={{ m: { xs: 1, sm: 3 }, mb: 0 }}>
              <AuthCardWrapper>
                <Grid container spacing={2} alignItems="center" justifyContent="center">
                  <Grid item sx={{ mb: 3 }}>
                    <Link to="#">
                      <img src={logo} alt="Logo" width="200" />
                    </Link>
                  </Grid>
                  <Grid item xs={12}>
                    <Grid container direction={matchDownSM ? 'column-reverse' : 'row'} alignItems="center" justifyContent="center">
                      <Grid item>
                        <Stack alignItems="center" justifyContent="center" spacing={1}>
                          <Typography color={theme.palette.primary.main} gutterBottom variant={matchDownSM ? 'h3' : 'h2'}>
                            Văn bằng chứng chỉ
                          </Typography>
                        </Stack>
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography color={theme.palette.orange.dark} variant="h5" sx={{ display: 'flex', alignItems: 'center' }}>
                      <span style={{ order: 1, marginLeft: '5px' }}>{t('lable.forgotpass')}</span>
                      <IconKey sx={{ order: 2 }} />
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Divider />
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" sx={{ fontSize: '13px' }}>
                      {t('subtitle.forgotpass')}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <ForgotPassword />
                  </Grid>
                  <Grid item xs={12}>
                    <Divider />
                  </Grid>
                  <Grid item xs={12}>
                    <Grid item container direction="column" alignItems="center" xs={12}>
                      <Typography
                        color={theme.palette.info.main}
                        component={Link}
                        to="/login"
                        variant="container"
                        sx={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}
                      >
                        <span style={{ order: 1 }}>{t('link.backtologin')}</span>
                        <IconArrowNarrowLeft sx={{ order: 2 }} />
                      </Typography>
                    </Grid>
                  </Grid>
                </Grid>
              </AuthCardWrapper>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </AuthWrapper1>
  );
};

export default Login;
