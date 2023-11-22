import React from 'react';
import { useTheme, styled } from '@mui/material/styles';
import { Avatar, Divider, Grid, List, ListItem, ListItemAvatar, Typography } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { notificationsSelector } from 'store/selectors';
import { useNavigate } from 'react-router-dom';
import { updateReadStatus } from 'services/notificationService';
import { setReloadNotification, setSelectedInfoMessage } from 'store/actions';
import { IconArrowBack, IconCertificate, IconCheck, IconSend } from '@tabler/icons';

const ListItemWrapper = styled('div')(({ theme }) => ({
  cursor: 'pointer',
  padding: 16,
  '&:hover': {
    background: theme.palette.primary.light
  },
  '& .MuiListItem-root': {
    padding: 0
  }
}));

const colorAndIconsMapping = {
  0: { color: '#2196F3', icon: <IconSend /> }, //Gửi duyệt
  1: { color: '#00C853', icon: <IconCheck /> }, //Duyệt
  2: { color: '#F44336', icon: <IconArrowBack /> }, //Trả lại
  3: { color: '#673AB7', icon: <IconCertificate /> }, //In bằng
  4: { color: '#2196F3', icon: <IconSend /> } //Gửi đơn yêu cầu
};

const NotificationList = ({ closeMenu }) => {
  const notifications = useSelector(notificationsSelector);
  const theme = useTheme();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  function formatTimeAgo(dateTime) {
    const currentTime = new Date();
    currentTime.setTime(currentTime.getTime() - 7 * 60 * 60 * 1000);
    const parsedDateTime = new Date(dateTime);

    const timeDifference = currentTime - parsedDateTime;
    const secondsDifference = Math.floor(timeDifference / 1000);

    if (secondsDifference < 60) {
      return `${secondsDifference} giây trước`;
    }

    const minutesDifference = Math.floor(secondsDifference / 60);

    if (minutesDifference < 60) {
      return `${minutesDifference} phút trước`;
    }

    const hoursDifference = Math.floor(minutesDifference / 60);

    if (hoursDifference < 24) {
      return `${hoursDifference} giờ trước`;
    }

    const daysDifference = Math.floor(hoursDifference / 24);

    if (daysDifference < 7) {
      return `${daysDifference} ngày trước`;
    }

    const weeksDifference = Math.floor(daysDifference / 7);

    if (weeksDifference < 4) {
      return `${weeksDifference} tuần trước`;
    }

    const monthsDifference = Math.floor(daysDifference / 30);

    if (monthsDifference < 12) {
      return `${monthsDifference} tháng trước`;
    }

    const yearsDifference = Math.floor(monthsDifference / 12);

    return `${yearsDifference} năm trước`;
  }

  const handleItemClick = (data) => {
    if (data.status === 0) {
      updateReadStatus(data.idMessage);
      dispatch(setReloadNotification(true));
    }
    if (data.url) {
      navigate(data.url);
      closeMenu();
    }
    if (data.valueRedirect) {
      const jsonObject = JSON.parse(data.valueRedirect);
      dispatch(setSelectedInfoMessage(jsonObject));
    }
  };

  return (
    <List
      sx={{
        width: '100%',
        maxWidth: 330,
        py: 0,
        borderRadius: '10px',
        [theme.breakpoints.down('md')]: {
          maxWidth: 300
        },
        '& .MuiListItemSecondaryAction-root': {
          top: 22
        },
        '& .MuiDivider-root': {
          my: 0
        },
        '& .list-container': {
          pl: 7
        }
      }}
    >
      {notifications.map((data) => (
        <React.Fragment key={data.idMessage}>
          <ListItemWrapper
            sx={{
              backgroundColor: data.status === 0 ? theme.palette.primary.light : 'transparent',
              '&:hover': {
                backgroundColor: theme.palette.grey[300]
              }
            }}
            onClick={() => handleItemClick(data)}
          >
            <ListItem alignItems="center">
              <ListItemAvatar>
                <Avatar
                  style={{
                    backgroundColor: colorAndIconsMapping[data.color]?.color || theme.palette.info.main,
                    color: 'white'
                  }}
                >
                  {colorAndIconsMapping[data.color]?.icon || <IconSend />}
                </Avatar>
              </ListItemAvatar>
              <Typography variant="body1">{data.title}</Typography>
              {data.status === 0 && (
                <div
                  style={{
                    backgroundColor: theme.palette.info.main,
                    width: '10px', // Điều chỉnh độ rộng
                    height: '10px', // Điều chỉnh độ cao
                    borderRadius: '50%',
                    marginLeft: 'auto',
                    marginTop: '1px'
                  }}
                ></div>
              )}
            </ListItem>
            <Grid container direction="column" className="list-container" mb={-1}>
              <Grid item xs={12} sx={{ pb: 1 }}>
                <Typography variant="subtitle2">{data.content}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Grid container justifyContent="flex-end">
                  <Grid item xs={12}>
                    <Typography variant="caption" display="block" sx={{ color: theme.palette.info.main }} gutterBottom>
                      {formatTimeAgo(data.time)}
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </ListItemWrapper>
          <Divider />
        </React.Fragment>
      ))}
    </List>
  );
};

export default NotificationList;
