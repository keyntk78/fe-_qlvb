import React from 'react';
import { Grid } from '@mui/material';
import MuiTypography from '@mui/material/Typography';
import { useDispatch, useSelector } from 'react-redux';
import { IconAlertCircle } from '@tabler/icons';
import { setOpenPopup, setReloadData, showAlert } from 'store/actions'; //setReloadData
import { selectedUserSelector } from 'store/selectors';
import { useTranslation } from 'react-i18next';
import YesButton from 'components/button/YesButton';
import NoButton from 'components/button/NoButton';
import { deActiveUser } from 'services/userService';
import { useNavigate } from 'react-router';
import { handleResponseStatus } from 'utils/handleResponseStatus';

const DeActiveUser = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const selectedUser = useSelector(selectedUserSelector);
  const navigate = useNavigate();

  const handleDeleteClick = async () => {
    try {
      const userDeActive = await deActiveUser(selectedUser.userId);
      const check = handleResponseStatus(userDeActive, navigate);
      if (!check) {
        dispatch(showAlert(new Date().getTime().toString(), 'error', userDeActive.message.toString()));
      } else {
        if (userDeActive.isSuccess == false) {
          dispatch(showAlert(new Date().getTime().toString(), 'error', userDeActive.message.toString()));
        } else {
          dispatch(showAlert(new Date().getTime().toString(), 'success', userDeActive.message.toString()));
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
        <IconAlertCircle size={100} color="red"/>
      </Grid>
      <Grid item container xs={12} justifyContent={'center'}>
        <MuiTypography variant="h4" gutterBottom>
          {`${t('user.form.deActive')} [${selectedUser.userName}]?`}
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

export default DeActiveUser;
