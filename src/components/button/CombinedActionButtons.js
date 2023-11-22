import * as React from 'react';
// import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import AnimateButton from 'components/extended/AnimateButton';
import { IconButton, Tooltip } from '@mui/material';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { useTranslation } from 'react-i18next';
import ActionButtons from './ActionButtons';
const CombinedActionButtons = ({ params, buttonConfigurations, title, icon: Icon, color }) => {
  const { t } = useTranslation();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const colorMap = {
    success: '#4CAF50', // Màu xanh lá cây cho thành công
    info: '#2196F3', // Màu xanh dương cho thông tin
    error: '#FF5722', // Màu đỏ cho lỗi
    primary: '#1976D2', // Màu chính cho primary
    secondary: '#9E9E9E', // Màu phụ cho secondary
    warning: '#FFC107' // Màu cảnh báo cho warning
  };

  return (
    <>
      <AnimateButton>
        <Tooltip title={title ? title : t('label.action')} placement="bottom">
          <IconButton
            // color={chinhsuavb ? 'primary' : xacminhvb ? 'success' : ''}
            style={{
              backgroundColor: colorMap[color] || color || 'grey',
              color: 'white' // Màu chữ của icon là trắng
            }}
            onClick={handleClick}
            size="small"
          >
            {Icon ? <Icon fontSize="small" size="20px" /> : <MoreHorizIcon fontSize="small" />}
          </IconButton>
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

export default CombinedActionButtons;
