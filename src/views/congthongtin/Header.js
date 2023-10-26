import { Box, Container, useTheme } from '@mui/system';
import React, { useState } from 'react';
import {
  Grid,
  List,
  ListItemText,
  useMediaQuery,
  Drawer,
  IconButton,
  Typography,
  ListItemButton,
  ListItemIcon,
  Avatar
} from '@mui/material';
import { useNavigate } from 'react-router';
import { IconMenu2, IconHome, IconCertificate, IconFileCertificate, IconPencil } from '@tabler/icons';
import { Splide, SplideSlide } from '@splidejs/react-splide';
import moment from 'moment';
import 'moment/locale/vi';
import { useEffect } from 'react';
import { AutoScroll } from '@splidejs/splide-extension-auto-scroll';
import '@splidejs/splide/dist/css/splide.min.css';
import { getPhong } from 'services/congthongtinService';
import config from 'config';
import { useTranslation } from 'react-i18next';

export default function Header() {
  const [currentDateTime, setCurrentDateTime] = useState('');
  const { t } = useTranslation();
  const navigate = useNavigate();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const [menuOpen, setMenuOpen] = useState(false);
  const [urlImage, setUrlImage] = useState('');
  const [phong, setPhong] = useState([]);
  const [selectedItem, setSelectedItem] = useState('/congthongtin');
  const [isHeaderFixed, setIsHeaderFixed] = useState(false);
  const menuItems = [
    { path: '/congthongtin', icon: <IconHome />, text: 'Trang chủ' },
    { path: '/tracuu-vanbang', icon: <IconCertificate />, text: 'Tra cứu văn bằng' },
    { path: '/tracuu-donyeucau', icon: <IconFileCertificate />, text: 'Tra cứu đơn cấp bản sao' },
    { path: '/dangky-donyeucau', icon: <IconPencil />, text: 'Đăng ký cấp bản sao' }
  ];

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 85) {
        setIsHeaderFixed(true);
      } else {
        setIsHeaderFixed(false);
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const fixedHeaderStyles = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 999
  };

  const headerStyles = {
    transition: 'background-color 0.3s' // Add a transition for smooth color change
  };

  const handleChange = (path) => {
    navigate(path);
    setSelectedItem(path);
  };

  const isItemSelected = (path) => {
    return path === selectedItem;
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const listItemStyles = {
    '&:hover': {
      backgroundColor: '#006da3',
      '& .MuiListItemIcon-root': {
        color: 'white'
      }
    },
    '& .MuiListItemIcon-root': {
      color: 'white'
    },
    '& .MuiListItemText-primary': {
      color: 'white !important',
      fontSize: 14,
      fontWeight: 'medium'
    }
  };

  const listItemSelectStyles = {
    backgroundColor: '#006da3',
    '&:hover': {
      backgroundColor: '#006da3',
      '& .MuiListItemIcon-root': {
        color: 'white'
      }
    },
    '& .MuiListItemIcon-root': {
      color: 'white'
    },
    '& .MuiListItemText-primary': {
      color: 'white !important',
      fontSize: 14,
      fontWeight: 'medium'
    }
  };

  function capitalizeFirstLetter(string) {
    if (!string) return '';
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  useEffect(() => {
    const interval = setInterval(() => {
      moment.locale('vi'); // Đặt ngôn ngữ cho moment
      const formattedDateTime = moment().format('dddd, DD/MM/YYYY - HH:mm');
      const capitalizedDateTime = capitalizeFirstLetter(formattedDateTime);
      setCurrentDateTime(capitalizedDateTime);
    }, 1000); // Cập nhật mỗi giây

    return () => {
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const donvibyid = await getPhong();
      const dataphong = donvibyid.data.cauHinh;
      setTimeout(async () => {
        try {
          setPhong(donvibyid.data.ten);
          setUrlImage(dataphong.logoDonvi ? config.urlFile + 'Logo/' + dataphong.logoDonvi : '');
        } catch (error) {
          console.error(error);
        }
      }, 300);
    };
    fetchData();
  }, []);

  return (
    <>
      <Box
        sx={{
          width: '100%',
          borderBottom: '0.5px solid lightgrey',
          backgroundColor: '#EBFAFE',
          minHeight: isSmallScreen ? '100px' : '180px'
        }}
      >
        <Container
          sx={{
            display: 'flex',
            alignItems: 'center',
            width: '100%',
            margin: 'auto'
          }}
        >
          <Grid container my={isSmallScreen ? 2 : 1} alignItems={'center'}>
            <Grid item xs={isSmallScreen ? 12 : 8.5} justifyContent={'flex-start'} sx={{ display: 'flex', alignItems: 'center' }}>
              <Avatar alt="Logo" src={urlImage} sx={{ width: 80, height: 'auto', border: 'none', marginRight: 2 }} />
              <Typography variant={isSmallScreen ? 'h6' : 'h4'} component="h1" ml={1}>
                {phong}
              </Typography>
            </Grid>
          </Grid>
          {isSmallScreen && (
            <IconButton onClick={toggleMenu} sx={{ marginTop: '1px' }}>
              <IconMenu2 />
            </IconButton>
          )}
        </Container>
        {!isSmallScreen ? (
          <>
            <Box
              sx={{
                textAlign: 'center',
                backgroundColor: '#0287d0',
                ...(isHeaderFixed ? fixedHeaderStyles : headerStyles)
              }}
            >
              <Container>
                <List component="nav">
                  <Grid container my={-1} item xs={12} justifyContent="center">
                    {menuItems.map((menuItem) => (
                      <Grid item key={menuItem.path}>
                        <ListItemButton
                          onClick={() => handleChange(menuItem.path)}
                          sx={isItemSelected(menuItem.path) ? listItemSelectStyles : listItemStyles}
                        >
                          <ListItemIcon>{menuItem.icon}</ListItemIcon>
                          <ListItemText primary={menuItem.text} />
                        </ListItemButton>
                      </Grid>
                    ))}
                  </Grid>
                </List>
              </Container>
            </Box>
          </>
        ) : (
          <>
            <Drawer anchor="right" open={menuOpen} onClose={() => setMenuOpen(false)}>
              <Box sx={{ width: 230, backgroundColor: '#0287d0' }}>
                {menuItems.map((menuItem) => (
                  <Grid item key={menuItem.path}>
                    <ListItemButton
                      onClick={() => handleChange(menuItem.path)}
                      sx={isItemSelected(menuItem.path) ? listItemSelectStyles : listItemStyles}
                    >
                      <ListItemIcon>{menuItem.icon}</ListItemIcon>
                      <ListItemText primary={menuItem.text} />
                    </ListItemButton>
                  </Grid>
                ))}
              </Box>
            </Drawer>
          </>
        )}
        {!isSmallScreen && (
          <>
            <Container
              sx={{
                display: 'flex',
                alignItems: 'center',
                height: '40px',
                width: '100%',
                margin: 'auto'
              }}
            >
              <Box sx={{ width: '25%' }}>
                <Typography variant="h5" component="h3">
                  {currentDateTime}
                </Typography>
              </Box>
              <Box sx={{ width: '100%' }}>
                <Splide
                  options={{
                    type: 'loop',

                    drag: 'free',
                    arrows: false,
                    pagination: false,
                    perPage: 1,
                    autoScroll: {
                      pauseOnHover: false,
                      pauseOnFocus: false,
                      rewind: false,
                      speed: 1
                    },
                    width: '100%'
                  }}
                  extensions={{ AutoScroll }}
                >
                  <SplideSlide style={{ fontSize: isSmallScreen ? '12px' : '', textAlign: isSmallScreen ? 'center' : '' }}>
                    {t('chaomung') + ' ' + phong}
                  </SplideSlide>
                </Splide>
              </Box>
            </Container>
          </>
        )}
      </Box>
    </>
  );
}
