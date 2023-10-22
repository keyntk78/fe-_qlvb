import React from 'react';
import { Grid } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { IconAlertCircle } from '@tabler/icons';
import { setOpenSubPopup, setReloadData, showAlert } from 'store/actions';
import { selectedKhoathiSelector, selectedNamthiSelector, userLoginSelector } from 'store/selectors';
import MuiTypography from '@mui/material/Typography';
import { useTranslation } from 'react-i18next';
import YesButton from 'components/button/YesButton';
import NoButton from 'components/button/NoButton';
import { deleteKhoathi } from 'services/khoathiService';

const DeleteKhoathi = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const selectedNamthi = useSelector(selectedNamthiSelector);
  const selectedKhoathi = useSelector(selectedKhoathiSelector);
  const user = useSelector(userLoginSelector);

  const handleDeleteClick = async () => {
    try {
      const khoathiDeleted = await deleteKhoathi(selectedNamthi.id, selectedKhoathi.id, user.username);
      if (khoathiDeleted.isSuccess == false) {
        dispatch(showAlert(new Date().getTime().toString(), 'error', khoathiDeleted.message.toString()));
      } else {
        dispatch(setOpenSubPopup(false));
        dispatch(setReloadData(true));
        dispatch(showAlert(new Date().getTime().toString(), 'success', khoathiDeleted.message.toString()));
      }
    } catch (error) {
      console.error('Error updating Function:', error);
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
          <NoButton type="subpopup" />
        </Grid>
      </Grid>
    </div>
  );
};

export default DeleteKhoathi;
