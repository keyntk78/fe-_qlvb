import React from 'react';
import { Grid } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { IconAlertCircle } from '@tabler/icons';
import { deleteMenu } from 'services/menuService';
import { setOpenPopup, setReloadData, showAlert } from 'store/actions';
import { selectedMenuSelector } from 'store/selectors';
import { useTranslation } from 'react-i18next';

import MuiTypography from '@mui/material/Typography';
import YesButton from 'components/button/YesButton';
import NoButton from 'components/button/NoButton';

const DeleteMenu = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const menu = useSelector(selectedMenuSelector);

  const handleDeleteClick = async () => {
    try {
      const menuDeleted = await deleteMenu(menu.menuId);
      if (menuDeleted.isSuccess == false) {
        dispatch(showAlert(new Date().getTime().toString(), 'error', menuDeleted.message.toString()));
      } else {
        dispatch(setOpenPopup(false));
        dispatch(setReloadData(true));
        dispatch(showAlert(new Date().getTime().toString(), 'success', menuDeleted.message.toString()));
      }
    } catch (error) {
      console.error('Error updating Menu:', error);
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

export default DeleteMenu;
