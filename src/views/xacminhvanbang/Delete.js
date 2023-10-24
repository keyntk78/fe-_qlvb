import React from 'react';
import { Grid } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { IconAlertCircle } from '@tabler/icons';
import { setOpenSubPopup, showAlert } from 'store/actions';
import { selectedHocsinhSelector } from 'store/selectors';
import MuiTypography from '@mui/material/Typography';
import { useTranslation } from 'react-i18next';
import YesButton from 'components/button/YesButton';
import NoButton from 'components/button/NoButton';

const DeleteHocSinhDuocChon = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const selectedHocsinh = useSelector(selectedHocsinhSelector);
  const handleDeleteClick = async () => {
    try {
      const existingData = JSON.parse(localStorage.getItem('hocsinhs')) || [];
      const idToDelete = selectedHocsinh.idHocSinh;
      const indexToDelete = existingData.findIndex((item) => item.id === idToDelete);
      if (indexToDelete !== -1) {
        existingData.splice(indexToDelete, 1);
        localStorage.setItem('hocsinhs', JSON.stringify(existingData));
        dispatch(setOpenSubPopup(false));
        dispatch(showAlert(new Date().getTime().toString(), 'success', t('xacminhvanbang.title.deleteSuc')));
      } else {
        dispatch(showAlert(new Date().getTime().toString(), 'error', t('xacminhvanbang.title.deleteErr')));
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

export default DeleteHocSinhDuocChon;
