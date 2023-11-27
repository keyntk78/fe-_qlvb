import React from 'react';
import { Grid } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { IconAlertCircle } from '@tabler/icons';
import { setOpenPopup, setReloadData, showAlert } from 'store/actions';
import { useTranslation } from 'react-i18next';
import { selectedHocsinhSelector, userLoginSelector } from 'store/selectors';

import MuiTypography from '@mui/material/Typography';
import YesButton from 'components/button/YesButton';
import NoButton from 'components/button/NoButton';
import { HuyPhatBang } from 'services/capphatbangService';

const HuyNhanBang = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const user = useSelector(userLoginSelector);
  const selectedHocSinh = useSelector(selectedHocsinhSelector);
  const handleDeleteClick = async () => {
    try {
      dispatch(setOpenPopup(false));
      const danhmucTNDeleted = await HuyPhatBang(selectedHocSinh.id, user.username);
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
        {t(' Hủy Nhận bằng của học sinh ') + selectedHocSinh.hoTen + '?'}
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

export default HuyNhanBang;
