import React from 'react';
import { Grid } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { IconAlertCircle } from '@tabler/icons';
import { deleteDanhmucTN } from 'services/danhmuctotnghiepService';
import { setOpenPopup, setReloadData, showAlert } from 'store/actions';
import { selectedDanhmuctotnghiepSelector } from 'store/selectors';
import { useTranslation } from 'react-i18next';
import { userLoginSelector } from 'store/selectors';

import MuiTypography from '@mui/material/Typography';
import YesButton from 'components/button/YesButton';
import NoButton from 'components/button/NoButton';

const Delete = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const user = useSelector(userLoginSelector);
  const danhmucTN = useSelector(selectedDanhmuctotnghiepSelector);

  const handleDeleteClick = async () => {
    try {
      dispatch(setOpenPopup(false));
      const danhmucTNDeleted = await deleteDanhmucTN(danhmucTN.id, user.username);
      if (danhmucTNDeleted.isSuccess == false) {
        dispatch(showAlert(new Date().getTime().toString(), 'error', danhmucTNDeleted.message.toString()));
      } else {
        dispatch(setReloadData(true));
        dispatch(showAlert(new Date().getTime().toString(), 'success', danhmucTNDeleted.message.toString()));
      }
    } catch (error) {
      console.error('Error updating DanhmucTn:', error);
      dispatch(showAlert(new Date().getTime().toString(), 'error', error.toString()));
    }
  };

  return (
    <div style={{ textAlign: 'center' }}>
      <IconAlertCircle size={100} color="red" />
      <MuiTypography variant="h4" gutterBottom m={2}>
        {t('form.delete.warning1')}
      </MuiTypography>
      <MuiTypography variant="body1" gutterBottom>
        {t('form.delete.warning2')}
      </MuiTypography>
      <Grid container spacing={1} direction="row" justifyContent="center" my={2}>
        <Grid item>
          <YesButton handleClick={handleDeleteClick} />
        </Grid>
        <Grid item>
          <NoButton />
        </Grid>
      </Grid>
    </div>
  );
};

export default Delete;
