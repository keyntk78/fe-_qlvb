import { Box, Container, useTheme } from '@mui/system';
import React, { useState } from 'react';
import { useMediaQuery } from '@mui/material';
// import { useNavigate } from 'react-router';
import 'moment/locale/vi';
import { useEffect } from 'react';
import '@splidejs/splide/dist/css/splide.min.css';
import { getPhong } from 'services/congthongtinService';
import { Avatar, Grid, Typography } from '@mui/material';
import config from 'config';
import { useTranslation } from 'react-i18next';

export default function Footer() {
  const { t } = useTranslation();
  // const navigate = useNavigate();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const [urlImage, setUrlImage] = useState('');
  const [phong, setPhong] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const donvibyid = await getPhong();
      const dataphong = donvibyid.data.cauHinh;
      setPhong(donvibyid.data);
      setUrlImage(dataphong.logoDonvi ? config.urlFile + 'Logo/' + dataphong.logoDonvi : '');
    };
    fetchData();
  }, []);
  return (
    <Box sx={{ width: '100%', borderTop: '0.5px solid lightgrey', backgroundColor: '#EBFAFE', minHeight: '104px' }}>
      <Container>
        <Box mt={2}>
          <Typography variant="h1">
            <Grid container spacing={2} pb={2}>
              <Grid item xs={isSmallScreen ? 4 : 2} justifyContent={'center'} sx={{ display: 'flex', alignItems: 'center' }}>
                <Avatar alt="Remy Sharp" src={urlImage} sx={{ width: 70, height: 70, border: 'none' }} />
              </Grid>
              <Grid item xs={isSmallScreen ? 6 : 10}>
                <Typography variant={isSmallScreen ? 'h6' : 'h5'}>{phong.ten}</Typography>
                <Typography variant={isSmallScreen ? 'h6' : 'h5'} mt={1}>
                  {t('user.label.email') + ': ' + phong ? phong.email : ''}
                </Typography>
                <Typography variant={isSmallScreen ? 'h6' : 'h5'} mt={1}>
                  {t('user.label.address') + ': ' + phong ? phong.diaChi : ''}
                </Typography>
              </Grid>
            </Grid>
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}
