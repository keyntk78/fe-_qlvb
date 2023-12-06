import React from 'react';
import { Grid } from '@mui/material';
import MuiTypography from '@mui/material/Typography';
import { useDispatch, useSelector } from 'react-redux';
import { IconChecks } from '@tabler/icons';
import { setOpenPopup, setReloadData, showAlert } from 'store/actions';
import { selectedPhoisaoSelector } from 'store/selectors';
import { useTranslation } from 'react-i18next';
import YesButton from 'components/button/YesButton';
import NoButton from 'components/button/NoButton';
import PrimaryColorIcon from 'components/icons/PrimaryColorIcon';
import { useNavigate } from 'react-router';
import { handleResponseStatus } from 'utils/handleResponseStatus';
import { KichHoatPhoiSao } from 'services/phoisaoService';

const ActivePhoiSao = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const selectedPhoisao = useSelector(selectedPhoisaoSelector);

  const navigate = useNavigate();

  const handleDeleteClick = async () => {
    try {
      const userActive = await KichHoatPhoiSao(selectedPhoisao.id);
      const check = handleResponseStatus(userActive, navigate);
      if (!check) {
        dispatch(showAlert(new Date().getTime().toString(), 'error', userActive.message.toString()));
      } else {
        if (userActive.isSuccess == false) {
          dispatch(showAlert(new Date().getTime().toString(), 'error', userActive.message.toString()));
        } else {
          dispatch(setReloadData(true));
          dispatch(setOpenPopup(false));
          dispatch(showAlert(new Date().getTime().toString(), 'success', userActive.message.toString()));
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
        {`${t('Bạn có muốn kích hoạt')} [${selectedPhoisao.tenPhoi}]?`}
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

export default ActivePhoiSao;
