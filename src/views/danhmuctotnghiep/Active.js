import React from 'react';
import { Grid } from '@mui/material';
import MuiTypography from '@mui/material/Typography';
import { useDispatch, useSelector } from 'react-redux';
import { IconChecks } from '@tabler/icons';
import { setOpenPopup, setReloadData, showAlert } from 'store/actions';
import { selectedDanhmuctotnghiepSelector, userLoginSelector } from 'store/selectors';
import { useTranslation } from 'react-i18next';
import YesButton from 'components/button/YesButton';
import NoButton from 'components/button/NoButton';
import PrimaryColorIcon from 'components/icons/PrimaryColorIcon';
import { unlock } from 'services/danhmuctotnghiepService';
import { useNavigate } from 'react-router';
import { handleResponseStatus } from 'utils/handleResponseStatus';

const Active = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const danhmucTN = useSelector(selectedDanhmuctotnghiepSelector);
  const user = useSelector(userLoginSelector);
  const handleDeleteClick = async () => {
    try {
      const danhmucTNActive = await unlock(danhmucTN.id, user.username);
      const check = handleResponseStatus(danhmucTNActive, navigate);
      if (!check) {
        dispatch(showAlert(new Date().getTime().toString(), 'error', danhmucTNActive.message.toString()));
      } else {
        if (danhmucTNActive.isSuccess == false) {
          dispatch(showAlert(new Date().getTime().toString(), 'error', danhmucTNActive.message.toString()));
        } else {
          dispatch(setReloadData(true));
          dispatch(setOpenPopup(false));
          dispatch(showAlert(new Date().getTime().toString(), 'success', danhmucTNActive.message.toString()));
        }
      }
    } catch (error) {
      console.error('Error updating role:', error);
      dispatch(showAlert(new Date().getTime().toString(), 'error', error.toString()));
    }
  };

  return (
    <div style={{ textAlign: 'center' }}>
      <PrimaryColorIcon icon={IconChecks} size={100} />
      <MuiTypography variant="h4" gutterBottom m={2}>
        {`${t('danhmuctotnghiep.form.Active')} [${danhmucTN.tieuDe}]?`}
      </MuiTypography>
      <Grid container spacing={1} direction="row" justifyContent="center" my={2}>
        <Grid item>
          <YesButton handleClick={handleDeleteClick} color={'info'} />
        </Grid>
        <Grid item>
          <NoButton color={'error'} />
        </Grid>
      </Grid>
    </div>
  );
};

export default Active;
