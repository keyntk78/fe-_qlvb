import { useTheme } from '@emotion/react';
import { IconButton, Tooltip } from '@mui/material';
import { Box } from '@mui/system';
import { IconBuildingStore } from '@tabler/icons';
import React from 'react';

const CongThongTin = () => {
  const theme = useTheme();

  const handleOpenNewTab = () => {
    window.open('/', '_blank');
  };

  return (
    <Box
      sx={{
        ml: 2,
        [theme.breakpoints.down('md')]: {
          mr: 0
        }
      }}
    >
      <Tooltip title={'Cổng thông tin'} placement="bottom">
        <IconButton size="small" color="info" onClick={handleOpenNewTab}>
          <IconBuildingStore fontSize="large" />
        </IconButton>
      </Tooltip>
      {/* <ButtonBase sx={{ borderRadius: '12px', position: 'relative' }}>
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
          color="inherit"
        >
          <IconBell stroke={1.5} size="1.3rem" />
        </Avatar>
      </ButtonBase> */}
    </Box>
  );
};

export default CongThongTin;
