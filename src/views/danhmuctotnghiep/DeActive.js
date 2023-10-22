import React from 'react';
import { Grid } from '@mui/material';
import MuiTypography from '@mui/material/Typography';
import { useDispatch, useSelector } from 'react-redux';
import { IconAlertCircle } from '@tabler/icons';
import { setOpenPopup, setReloadData, showAlert } from 'store/actions'; //setReloadData
import { selectedDanhmuctotnghiepSelector, userLoginSelector } from 'store/selectors';
import { useTranslation } from 'react-i18next';
import YesButton from 'components/button/YesButton';
import NoButton from 'components/button/NoButton';
import { lock } from 'services/danhmuctotnghiepService';
import { useNavigate } from 'react-router';
import { handleResponseStatus } from 'utils/handleResponseStatus';

const DeActive = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const danhmucTN = useSelector(selectedDanhmuctotnghiepSelector);
  const user = useSelector(userLoginSelector);

  const handleDeleteClick = async () => {
    try {
      const danhmucTNDeActive = await lock(danhmucTN.id, user.username);
      const check = handleResponseStatus(danhmucTNDeActive, navigate);
      if (!check) {
        dispatch(showAlert(new Date().getTime().toString(), 'error', danhmucTNDeActive.message.toString()));
      } else {
        if (danhmucTNDeActive.isSuccess == false) {
          dispatch(showAlert(new Date().getTime().toString(), 'error', danhmucTNDeActive.message.toString()));
        } else {
          dispatch(showAlert(new Date().getTime().toString(), 'success', danhmucTNDeActive.message.toString()));
          dispatch(setOpenPopup(false));
          dispatch(setReloadData(true));
        }
      }
    } catch (error) {
      console.error('Error updating role:', error);
      dispatch(showAlert(new Date().getTime().toString(), 'error', error.toString()));
    }
  };

  return (
    <Grid container textAlign={'center'}>
      <Grid item container xs={12} mt={3} mb={2} justifyContent={'center'}>
        <IconAlertCircle size={100} color="red" />
      </Grid>
      <Grid item container xs={12} justifyContent={'center'}>
        <MuiTypography variant="h4" gutterBottom>
          {`${t('danhmuctotnghiep.form.deActive')} [${danhmucTN.tieuDe}]?`}
        </MuiTypography>
      </Grid>
      <Grid item container spacing={1} direction="row" justifyContent="center" my={2}>
        <Grid item>
          <YesButton handleClick={handleDeleteClick} />
        </Grid>
        <Grid item>
          <NoButton />
        </Grid>
      </Grid>
    </Grid>
  );
};

export default DeActive;
