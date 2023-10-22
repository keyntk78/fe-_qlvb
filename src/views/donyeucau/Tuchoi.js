import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setOpenPopup, setOpenSubPopup, setReloadData, showAlert } from 'store/actions';
import { useTranslation } from 'react-i18next';
import { capBangBansaoSelector, openSubPopupSelector, userLoginSelector } from 'store/selectors';
import MuiTypography from '@mui/material/Typography';
import { Grid, TextField } from '@mui/material';
import { IconCircleOff } from '@tabler/icons';
import YesButton from 'components/button/YesButton';
import NoButton from 'components/button/NoButton';
import { TuchoiDon } from 'services/capbangbansaoService';
import { useEffect } from 'react';

const Tuchoi = () => {
  const { t } = useTranslation();
  const [deletionReason, setDeletionReason] = useState('');
  const dispatch = useDispatch();
  const capBangBansao = useSelector(capBangBansaoSelector);
  const user = useSelector(userLoginSelector);
  const openSubPopup = useSelector(openSubPopupSelector);

  useEffect(() => {
    if (openSubPopup) {
      setDeletionReason('');
    }
  }, [openSubPopup]);

  const handleDeleteClick = async () => {
    try {
      const duyetDon = await TuchoiDon(capBangBansao.id, deletionReason, user.username);
      if (duyetDon.isSuccess == false) {
        dispatch(showAlert(new Date().getTime().toString(), 'error', duyetDon.message.toString()));
      } else {
        dispatch(setOpenSubPopup(false));
        dispatch(setOpenPopup(false));
        dispatch(setReloadData(true));
        dispatch(showAlert(new Date().getTime().toString(), 'success', duyetDon.message.toString()));
      }
    } catch (error) {
      console.error('Error updating Function:', error);
      dispatch(showAlert(new Date().getTime().toString(), 'error', error.toString()));
    }
  };
  return (
    <>
      <Grid container>
        <Grid item container xs={12} mt={3} mb={2} justifyContent={'center'}>
          <IconCircleOff size={100} color="red" />
        </Grid>
        <Grid item container xs={12} justifyContent={'center'}>
          <MuiTypography variant="h4" gutterBottom>
            {`${t('form.tuchoi.warning1')} [${capBangBansao.HoTen}] ?`}
          </MuiTypography>
        </Grid>
        <Grid item container xs={12} mt={1} justifyContent={'center'}>
          <TextField
            label={t('phoivanbang.field.lydo')} // Replace with your translation key
            variant="outlined"
            fullWidth
            maxRows={5}
            minRows={3}
            value={deletionReason}
            onChange={(e) => setDeletionReason(e.target.value)}
            required
          />
        </Grid>
        <Grid item container spacing={1} direction="row" justifyContent="center" my={2}>
          <Grid item>
            <YesButton handleClick={handleDeleteClick} />
          </Grid>
          <Grid item>
            <NoButton type="subpopup" />
          </Grid>
        </Grid>
      </Grid>
    </>
  );
};

export default Tuchoi;
