import React from 'react';
import { Grid, Button, Tooltip } from '@mui/material';
import AnimateButton from 'components/extended/AnimateButton';
import { useTranslation } from 'react-i18next';
import { IconX } from '@tabler/icons';
import { setOpenInstruct, setOpenPopup, setOpenProfile, setOpenSubPopup, setOpenSubSubPopup } from 'store/actions';
import { useDispatch } from 'react-redux';

const ResetButton = ({ type }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const handleCancelClick = () => {
    if (type === 'subpopup') {
      dispatch(setOpenSubPopup(false));
    } else if (type === 'subsubpopup') {
      dispatch(setOpenSubSubPopup(false));
    } else if (type === 'profile') {
      dispatch(setOpenProfile(false));
    } else if (type === 'instruct') {
      dispatch(setOpenInstruct(false));
    } else {
      dispatch(setOpenPopup(false));
    }
  };

  return (
    <Grid container spacing={2} alignItems="center">
      <Grid item xs={12}>
        <AnimateButton>
          <Tooltip title={t('button.exit')} placement="bottom">
            <Button color="error" variant="contained" size="medium" onClick={handleCancelClick} startIcon={<IconX />}>
              {t('button.exit')}
            </Button>
          </Tooltip>
        </AnimateButton>
      </Grid>
    </Grid>
  );
};

export default ResetButton;
