import { useState, useRef, useEffect } from 'react';

import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import config from '../../../../config';

// material-ui
import { useTheme } from '@mui/material/styles';
import {
  Avatar,
  Box,
  Chip,
  ClickAwayListener,
  Divider,
  Grid,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Paper,
  Popper,
  Stack,
  Typography
} from '@mui/material';

// project imports
import MainCard from 'components/cards/MainCard';
import Transitions from 'components/extended/Transitions';
import User1 from 'assets/images/users/user-round.svg';

// assets
import { IconEdit, IconLogout, IconSettings, IconUser } from '@tabler/icons';
import { useTranslation } from 'react-i18next';
import { setOpenProfile, userLogin } from 'store/actions';
import { logout, profile } from 'services/authService';
import ChangePassword from 'views/pages/authentication/auth/ChangePassword';
import { openProfileSelector, reloadDataSelector } from 'store/selectors';
import Popup from 'components/controls/popup';
import Profile from 'views/pages/authentication/auth/Profile';
import { handleResponseStatus } from 'utils/handleResponseStatus';

// ==============================|| PROFILE MENU ||============================== //

const ProfileSection = () => {
  const theme = useTheme();
  const customization = useSelector((state) => state.customization);
  const navigate = useNavigate();
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [title, setTitle] = useState('');
  const [form, setForm] = useState('');
  const [open, setOpen] = useState(false);
  const [avatar, setAvatar] = useState(false);
  const openProfile = useSelector(openProfileSelector);
  const reloadData = useSelector(reloadDataSelector);
  /**
   * anchorRef is used on different componets and specifying one type leads to other components throwing an error
   * */
  const anchorRef = useRef(null);
  const handleLogout = async () => {
    try {
      const formData = new FormData();
      formData.append('token', user.token);
      await logout(formData);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('menu');
      localStorage.removeItem('deviceToken');
      localStorage.removeItem('donvi');
      localStorage.removeItem('reports');
      dispatch(userLogin(null));
      // dispatch(setDonvi(null));
      navigate('/login');
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await profile();
        await handleResponseStatus(response, navigate);
        setAvatar(response.data.data.avatar);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [reloadData]);

  const handleChangePassword = () => {
    setTitle(
      <>
        <Typography variant="container" sx={{ display: 'flex', alignItems: 'center' }}>
          <span style={{ order: 1 }}>{t('changepass.title')}</span>
          <IconEdit sx={{ order: 2 }} />
        </Typography>
      </>
    );
    setForm('changepass');
    dispatch(setOpenProfile(true));
    setOpen(false);
  };

  const handleProfile = () => {
    setTitle(
      <>
        <Typography variant="container" sx={{ display: 'flex', alignItems: 'center' }}>
          <span style={{ order: 1 }}>{t('profile.title')}</span>
          <IconUser sx={{ order: 2 }} />
        </Typography>
      </>
    );
    setForm('profile');
    dispatch(setOpenProfile(true));
    setOpen(false);
    setSelectedIndex(-1);
  };

  const [user, setUser] = useState({});

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }
    setOpen(false);
  };

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const prevOpen = useRef(open);
  useEffect(() => {
    if (prevOpen.current === true && open === false) {
      anchorRef.current.focus();
    }

    prevOpen.current = open;
  }, [open]);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    dispatch(userLogin(user));
    setUser(user);
  }, []);

  return (
    <>
      <Chip
        sx={{
          height: '48px',
          alignItems: 'center',
          borderRadius: '27px',
          transition: 'all .2s ease-in-out',
          borderColor: theme.palette.primary.light,
          backgroundColor: theme.palette.primary.light,
          '&[aria-controls="menu-list-grow"], &:hover': {
            borderColor: theme.palette.info.main,
            background: `${theme.palette.info.main}!important`,
            color: theme.palette.primary.light,
            '& svg': {
              stroke: theme.palette.primary.light
            }
          },
          '& .MuiChip-label': {
            lineHeight: 0
          }
        }}
        icon={
          <Avatar
            src={user.avatar ? `${config.urlFile}Users/${avatar ? avatar : user.avatar}` : User1}
            sx={{
              ...theme.typography.mediumAvatar,
              margin: '8px 0 8px 8px !important',
              cursor: 'pointer'
            }}
            ref={anchorRef}
            aria-controls={open ? 'menu-list-grow' : undefined}
            aria-haspopup="true"
            color="inherit"
          />
        }
        label={<IconSettings stroke={1.5} size="1.5rem" color={theme.palette.primary.main} />}
        variant="outlined"
        ref={anchorRef}
        aria-controls={open ? 'menu-list-grow' : undefined}
        aria-haspopup="true"
        onClick={handleToggle}
        color="info"
      />
      <Popper
        placement="bottom-end"
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        transition
        disablePortal
        popperOptions={{
          modifiers: [
            {
              name: 'offset',
              options: {
                offset: [0, 14]
              }
            }
          ]
        }}
      >
        {({ TransitionProps }) => (
          <Transitions in={open} {...TransitionProps}>
            <Paper>
              <ClickAwayListener onClickAway={handleClose}>
                <MainCard border={false} elevation={16} content={false} boxShadow shadow={theme.shadows[16]}>
                  <Box sx={{ p: 2, pb: 0 }}>
                    <Stack>
                      <Stack direction="row" spacing={0.5} alignItems="center">
                        <Typography variant="h4">{t('user.hello')}</Typography>
                        <Typography component="span" variant="h4" sx={{ fontWeight: 400 }}>
                          {user.fullname}
                        </Typography>
                      </Stack>
                    </Stack>
                    <Divider sx={{ mt: 2 }} />
                  </Box>
                  <Box sx={{ m: 1 }}>
                    <List
                      component="nav"
                      sx={{
                        width: '100%',
                        maxWidth: 300,
                        minWidth: 250,
                        backgroundColor: theme.palette.background.paper,
                        borderRadius: '10px',
                        '& .MuiListItemButton-root': {
                          mt: 0.5
                        }
                      }}
                    >
                      <ListItemButton
                        sx={{ borderRadius: `${customization.borderRadius}px` }}
                        selected={selectedIndex === 0}
                        onClick={handleChangePassword}
                      >
                        <ListItemIcon>
                          <IconSettings stroke={1.5} size="1.3rem" />
                        </ListItemIcon>
                        <ListItemText primary={<Typography variant="body2">{t('user.changepass')}</Typography>} />
                      </ListItemButton>
                      <ListItemButton
                        sx={{ borderRadius: `${customization.borderRadius}px` }}
                        selected={selectedIndex === 1}
                        onClick={handleProfile}
                      >
                        <ListItemIcon>
                          <IconUser stroke={1.5} size="1.3rem" />
                        </ListItemIcon>
                        <ListItemText
                          primary={
                            <Grid container spacing={1} justifyContent="space-between">
                              <Grid item>
                                <Typography variant="body2">{t('user.profile')}</Typography>
                              </Grid>
                            </Grid>
                          }
                        />
                      </ListItemButton>
                      <ListItemButton
                        sx={{ borderRadius: `${customization.borderRadius}px` }}
                        selected={selectedIndex === 4}
                        onClick={handleLogout}
                      >
                        <ListItemIcon>
                          <IconLogout stroke={1.5} size="1.3rem" />
                        </ListItemIcon>
                        <ListItemText primary={<Typography variant="body2">{t('button.logout')}</Typography>} />
                      </ListItemButton>
                    </List>
                  </Box>
                </MainCard>
              </ClickAwayListener>
            </Paper>
          </Transitions>
        )}
      </Popper>
      {form !== '' ? (
        <Popup
          title={title}
          openPopup={openProfile}
          overlayVisible
          bgcolor={'#2196F3'}
          type={'profile'}
          maxWidth={form === 'profile' ? 'md' : 'sm'}
        >
          {form === 'profile' ? <Profile /> : <ChangePassword />}
        </Popup>
      ) : (
        ''
      )}
    </>
  );
};

export default ProfileSection;
