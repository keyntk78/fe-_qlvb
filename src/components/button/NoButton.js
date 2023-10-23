import React from 'react';
import { Grid, Button, Tooltip } from '@mui/material';
import AnimateButton from 'components/extended/AnimateButton';
import { useTranslation } from 'react-i18next';
import { IconBan } from '@tabler/icons';
import { useDispatch } from 'react-redux';
import { setOpenPopup, setOpenSubPopup, setOpenSubSubPopup } from 'store/actions';

const NoButton = ({ color, type }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const handleCancelClick = () => {
    if (type === 'subpopup') {
      dispatch(setOpenSubPopup(false));
    } else if (type === 'subsubpopup') {
      dispatch(setOpenSubSubPopup(false));
    } else {
      dispatch(setOpenPopup(false));
    }
  };

  return (
    <Grid container spacing={2} alignItems="center">
      <Grid item xs={12}>
        <AnimateButton>
          <Tooltip title={t('button.no')} placement="bottom">
            <Button color={color || 'info'} variant="contained" size="medium" onClick={handleCancelClick}>
              <IconBan /> {t('button.no')}
            </Button>
          </Tooltip>
        </AnimateButton>
      </Grid>
    </Grid>
  );
};

export default NoButton;
