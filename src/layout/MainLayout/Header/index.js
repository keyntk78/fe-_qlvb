import PropTypes from 'prop-types';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Avatar, Box, ButtonBase } from '@mui/material';

// project imports
import LogoSection from '../LogoSection';
// import SearchSection from './SearchSection';
import ProfileSection from './ProfileSection';
// import LanguageSetting from './LanguageSetting';

// assets
import { IconMenu2 } from '@tabler/icons';
import NotificationSection from './NotificationSection';
import { getTop10Message, getUnreadMessagesCount } from 'services/notificationService';
import { setNotificationCount, setNotifications, setReloadNotification } from 'store/actions';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { donviSelector, pageSizeSelector, reloadNotificationSelector, userLoginSelector } from 'store/selectors';
import CongThongTin from './CongThongTin';

// ==============================|| MAIN NAVBAR / HEADER ||============================== //

const Header = ({ handleLeftDrawerToggle }) => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const user = useSelector(userLoginSelector);
  const reload = useSelector(reloadNotificationSelector);
  const pageSize = useSelector(pageSizeSelector);
  const donvi = useSelector(donviSelector);

  useEffect(() => {
    const fetchDataDL = async () => {
      if (user) {
        const message = await getUnreadMessagesCount(user.id);
        const count = message.data;
        // console.log(count);
        dispatch(setNotificationCount(count));
        const response = await getTop10Message(user.id, pageSize);
        // console.log(response);
        dispatch(setNotifications(response.data));
      }
    };
    if (user || reload || pageSize) {
      fetchDataDL();
      dispatch(setReloadNotification(false));
    }
  }, [user, reload, pageSize]);

  return (
    <>
      {/* logo & toggler button */}
      <Box
        sx={{
          width: 228,
          display: 'flex',
          [theme.breakpoints.down('md')]: {
            width: 'auto'
          }
        }}
      >
        <Box component="span" sx={{ display: { xs: 'none', md: 'block' }, flexGrow: 1 }}>
          <LogoSection />
        </Box>
        <ButtonBase sx={{ borderRadius: '12px', overflow: 'hidden' }}>
          <Avatar
            variant="rounded"
            sx={{
              ...theme.typography.commonAvatar,
              ...theme.typography.mediumAvatar,
              transition: 'all .2s ease-in-out',
              background: theme.palette.primary.light,
              color: theme.palette.info.main,
              '&:hover': {
                background: theme.palette.info.main,
                color: theme.palette.primary.light
              }
            }}
            onClick={handleLeftDrawerToggle}
            color="inherit"
          >
            <IconMenu2 stroke={1.5} size="1.3rem" />
          </Avatar>
        </ButtonBase>
      </Box>
      <Box sx={{ flexGrow: 1 }} />
      {/* <LanguageSetting />  */}
      <CongThongTin />
      {donvi === 0 ? '' : <NotificationSection />}

      <ProfileSection />
    </>
  );
};

Header.propTypes = {
  handleLeftDrawerToggle: PropTypes.func
};

export default Header;
