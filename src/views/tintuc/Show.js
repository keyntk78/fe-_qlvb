import React from 'react';
import { Grid } from '@mui/material';
import MuiTypography from '@mui/material/Typography';
import { useDispatch, useSelector } from 'react-redux';
import { IconAlertCircle } from '@tabler/icons';
import { setOpenPopup, setReloadData, showAlert } from 'store/actions'; //setReloadData
import { selectedTinTucSelector } from 'store/selectors';
import { useTranslation } from 'react-i18next';
import YesButton from 'components/button/YesButton';
import NoButton from 'components/button/NoButton';
import { useNavigate } from 'react-router';
import { handleResponseStatus } from 'utils/handleResponseStatus';
import { showTinTuc } from 'services/tintucService';

const ShowTinTuc = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const selectedTinTuc = useSelector(selectedTinTucSelector);
  const navigate = useNavigate();

  const handleClick = async () => {
    try {
      const response = await showTinTuc(selectedTinTuc.id);
      const check = handleResponseStatus(response, navigate);
      if (!check) {
        dispatch(showAlert(new Date().getTime().toString(), 'error', response.message.toString()));
      } else {
        if (response.isSuccess == false) {
          dispatch(showAlert(new Date().getTime().toString(), 'error', response.message.toString()));
        } else {
          dispatch(showAlert(new Date().getTime().toString(), 'success', response.message.toString()));
          dispatch(setOpenPopup(false));
          dispatch(setReloadData(true));
        }
      }
    } catch (error) {
      console.error('Error:', error);
      dispatch(showAlert(new Date().getTime().toString(), 'error', error.toString()));
    }
  };

  return (
    <Grid container>
      <Grid item container xs={12} mt={3} mb={2} justifyContent={'center'}>
        <IconAlertCircle size={100} color="red"/>
      </Grid>
      <Grid item container xs={12} justifyContent={'center'} textAlign={'center'}>
        <MuiTypography variant="h4" gutterBottom>
          {`${t('Bạn có muốn hiển thị Tin tức')} [${selectedTinTuc.tieuDe}]?`}
        </MuiTypography>
      </Grid>
      <Grid item container spacing={1} direction="row" justifyContent="center" my={2}>
        <Grid item>
          <YesButton handleClick={handleClick} />
        </Grid>
        <Grid item>
          <NoButton />
        </Grid>
      </Grid>
    </Grid>
  );
};

export default ShowTinTuc;
