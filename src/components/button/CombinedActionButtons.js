import * as React from 'react';
// import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import AnimateButton from 'components/extended/AnimateButton';
import { IconButton, Tooltip } from '@mui/material';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { useTranslation } from 'react-i18next';
import ActionButtons from './ActionButtons';
import DehazeIcon from '@mui/icons-material/Dehaze';
const CombinedActionButtons = ({ params, buttonConfigurations, buttonConfigurations2 }) => {
  const { t } = useTranslation();
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
        <Tooltip title={buttonConfigurations2 ? t('button.title.chinhsua.huybo') : t('button.title.xacminh')} placement="bottom">
          <IconButton onClick={handleClick} style={{ border: '1px solid black' }} size="small">
            {buttonConfigurations2 ? <DehazeIcon fontSize="small" /> : <MoreHorizIcon fontSize="small" />}
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
        {buttonConfigurations2
          ? buttonConfigurations2.map((buttonConfig) => (
              <ActionButtons menu key={buttonConfig.type} params={params} onClose={handleClose} {...buttonConfig} />
            ))
          : buttonConfigurations.map((buttonConfig) => (
              <ActionButtons menu key={buttonConfig.type} params={params} onClose={handleClose} {...buttonConfig} />
            ))}
      </Menu>
    </>
  );
};

export default CombinedActionButtons;
