import { useState, useRef, useEffect } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import {
  Avatar,
  Box,
  Button,
  ButtonBase,
  CardActions,
  ClickAwayListener,
  Divider,
  Grid,
  Paper,
  Popper,
  Stack,
  // TextField,
  Typography,
  useMediaQuery
} from '@mui/material';

// third-party
import PerfectScrollbar from 'react-perfect-scrollbar';

// project imports
import MainCard from 'components/cards/MainCard';
import Transitions from 'components/extended/Transitions';
import NotificationList from './NotificationList';

// assets
import { IconBell, IconCheck } from '@tabler/icons';
import { messaging } from 'utils/firebase';
import { onMessage } from 'firebase/messaging';
import { useDispatch, useSelector } from 'react-redux';
import { setReloadNotification } from 'store/actions';
import { notificationCountSelector, userLoginSelector } from 'store/selectors';
import { updateAllReadStatus } from 'services/notificationService';
import { Link, useNavigate } from 'react-router-dom';
import config from 'config';

// notification status options
// const status = [
//   {
//     value: 'all',
//     label: 'All Notification'
//   },
//   {
//     value: 'new',
//     label: 'New'
//   },
//   {
//     value: 'unread',
//     label: 'Unread'
//   },
//   {
//     value: 'other',
//     label: 'Other'
//   }
// ];

// ==============================|| NOTIFICATION ||============================== //

const NotificationSection = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const count = useSelector(notificationCountSelector);
  const theme = useTheme();
  const matchesXs = useMediaQuery(theme.breakpoints.down('md'));
  const user = useSelector(userLoginSelector);

  const [open, setOpen] = useState(false);
  // const [value, setValue] = useState('');
  /**
   * anchorRef is used on different componets and specifying one type leads to other components throwing an error
   * */
  const anchorRef = useRef(null);

  onMessage(messaging, (payload) => {
    console.log('Thông báo mới:', payload);
    setTimeout(() => {
      dispatch(setReloadNotification(true));
    }, 3000);
  });

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }
    setOpen(false);
  };

  const closeMenu = () => {
    setOpen(false);
  };

  const prevOpen = useRef(open);
  useEffect(() => {
    if (prevOpen.current === true && open === false) {
      anchorRef.current.focus();
    }
    prevOpen.current = open;
  }, [open]);

  // const handleChange = (event) => {
  //   if (event?.target.value) setValue(event?.target.value);
  // };

  const handleViewMore = () => {
    setOpen(false);
    navigate(config.defaultPath + '/tinnhan');
  };

  const handleMarkAllAsRead = async () => {
    try {
      await updateAllReadStatus(user.id);
      dispatch(setReloadNotification(true));
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <>
      <Box
        sx={{
          // overflow: 'visible',
          ml: 2,
          mr: 3,
          [theme.breakpoints.down('md')]: {
            mr: 2
          }
        }}
      >
        <ButtonBase sx={{ borderRadius: '12px', position: 'relative' }}>
          <Avatar
            variant="rounded"
            sx={{
              ...theme.typography.commonAvatar,
              ...theme.typography.mediumAvatar,
              transition: 'all .2s ease-in-out',
              overflow: 'visible',
              background: theme.palette.primary.light,
              color: theme.palette.primary.dark,
              '&[aria-controls="menu-list-grow"],&:hover': {
                background: theme.palette.primary.dark,
                color: theme.palette.primary.light
              }
            }}
            ref={anchorRef}
            aria-controls={open ? 'menu-list-grow' : undefined}
            aria-haspopup="true"
            onClick={handleToggle}
            color="inherit"
          >
            <IconBell stroke={1.5} size="1.3rem" />
            {count > 0 && (
              <span
                style={{
                  position: 'absolute',
                  top: '1px',
                  right: '1px',
                  background: 'red',
                  color: 'white',
                  borderRadius: '50%',
                  padding: '2px',
                  paddingLeft: count > 9 ? '1.2px' : '4.3px',
                  paddingRight: count > 9 ? '2px' : '4.7px',
                  fontSize: '12px',
                  fontWeight: 'bold',
                  transform: 'translate(50%, -50%)',
                  zIndex: 9999
                }}
              >
                {count}
              </span>
            )}
          </Avatar>
        </ButtonBase>
      </Box>
      <Popper
        placement={matchesXs ? 'bottom' : 'bottom-end'}
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
                offset: [matchesXs ? 5 : 0, 20]
              }
            }
          ]
        }}
      >
        {({ TransitionProps }) => (
          <Transitions position={matchesXs ? 'top' : 'top-right'} in={open} {...TransitionProps}>
            <Paper style={{ minWidth: '300px' }}>
              <ClickAwayListener onClickAway={handleClose}>
                <MainCard border={false} elevation={16} content={false} boxShadow shadow={theme.shadows[16]}>
                  <Grid container direction="column" spacing={2}>
                    <Grid item xs={12}>
                      <Grid container alignItems="center" justifyContent="space-between" sx={{ pt: 2, px: 2 }}>
                        <Grid item>
                          <Stack direction="row" spacing={2}>
                            <Typography variant="subtitle1">Tất cả thông báo</Typography>
                          </Stack>
                        </Grid>
                        <Grid item>
                          <Typography component={Link} to="#" variant="subtitle2" color="primary" onClick={handleMarkAllAsRead}>
                            Đã đọc tất cả
                            <IconCheck size={'12px'} style={{ paddingTop: '3px' }} />
                          </Typography>
                        </Grid>
                      </Grid>
                    </Grid>
                    <Grid item xs={12}>
                      <PerfectScrollbar style={{ height: '100%', maxHeight: 'calc(100vh - 35vh)', overflowX: 'hidden' }}>
                        <Grid container direction="column" spacing={2}>
                          {/* <Grid item xs={12}>
                            <Box sx={{ px: 2, pt: 0.25 }}>
                              <TextField
                                id="outlined-select-currency-native"
                                select
                                fullWidth
                                value={value}
                                onChange={handleChange}
                                SelectProps={{
                                  native: true
                                }}
                              >
                                {status.map((option) => (
                                  <option key={option.value} value={option.value}>
                                    {option.label}
                                  </option>
                                ))}
                              </TextField>
                            </Box>
                          </Grid> */}
                          <Grid item xs={12} p={0}>
                            <Divider sx={{ my: 0 }} />
                          </Grid>
                        </Grid>
                        <NotificationList closeMenu={closeMenu} />
                      </PerfectScrollbar>
                    </Grid>
                  </Grid>
                  <Divider />
                  <CardActions sx={{ p: 1.25, justifyContent: 'center' }}>
                    <Button size="small" disableElevation onClick={handleViewMore}>
                      Xem thêm
                    </Button>
                  </CardActions>
                </MainCard>
              </ClickAwayListener>
            </Paper>
          </Transitions>
        )}
      </Popper>
    </>
  );
};

export default NotificationSection;
