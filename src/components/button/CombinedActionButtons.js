import * as React from 'react';
// import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import AnimateButton from 'components/extended/AnimateButton';
import { IconButton, Tooltip } from '@mui/material';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { useTranslation } from 'react-i18next';
import ActionButtons from './ActionButtons';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import DoneAllIcon from '@mui/icons-material/DoneAll';
const CombinedActionButtons = ({ params, buttonConfigurations, chinhsuavb, xacminhvb }) => {
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
        <Tooltip
          title={chinhsuavb ? t('button.title.chinhsua.huybo') : xacminhvb ? t('button.title.xacminh') : t('label.action')}
          placement="bottom"
        >
          <IconButton
            // color={chinhsuavb ? 'primary' : xacminhvb ? 'success' : ''}
            onClick={handleClick}
            style={{ border: '1px solid black' }}
            size="small"
          >
            {chinhsuavb ? (
              <ModeEditIcon fontSize="small" />
            ) : xacminhvb ? (
              <DoneAllIcon fontSize="small" />
            ) : (
              <MoreHorizIcon fontSize="small" />
            )}
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
        {chinhsuavb
          ? chinhsuavb.map((buttonConfig) => (
              <ActionButtons menu key={buttonConfig.type} params={params} onClose={handleClose} {...buttonConfig} />
            ))
          : xacminhvb
          ? xacminhvb.map((buttonConfig) => (
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
