import * as React from 'react';
// import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import AnimateButton from 'components/extended/AnimateButton';
import { Button, Tooltip } from '@mui/material';
import ActionButtons from './ActionButtons';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
const GroupButtons = ({ params, buttonConfigurations, title, icon: Icon, themtep }) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <AnimateButton>
        <Tooltip title={title} placement="bottom">
          {themtep ? (
            <Button
              fullWidth
              sx={{
                bgcolor: '#00B835',
                color: 'white',
                '&:hover': {
                  bgcolor: '#00942A' // Đặt màu chữ khi hover vào nút
                }
              }}
              variant="contained"
              onClick={handleClick}
              startIcon={<Icon />}
              endIcon={<KeyboardArrowDownIcon />}
            >
              {title}
            </Button>
          ) : (
            <Button
              fullWidth
              color="info"
              variant="contained"
              onClick={handleClick}
              startIcon={<Icon />}
              endIcon={<KeyboardArrowDownIcon />}
            >
              {title}
            </Button>
          )}
        </Tooltip>
      </AnimateButton>
      <Menu
        id="demo-positioned-menu"
        aria-labelledby="demo-positioned-button"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right'
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right'
        }}
      >
        {buttonConfigurations.map((buttonConfig) => (
          <ActionButtons menu key={buttonConfig.type} params={params} onClose={handleClose} {...buttonConfig} />
        ))}
      </Menu>
    </>
  );
};

export default GroupButtons;
