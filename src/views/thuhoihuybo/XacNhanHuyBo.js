import React from 'react';
import { useDispatch } from 'react-redux';
import { setOpenPopup, setOpenSubPopup, setReloadData, showAlert } from 'store/actions';
import { useTranslation } from 'react-i18next';
import { IconAlertCircle } from '@tabler/icons';
import { Grid } from '@mui/material';
import YesButton from 'components/button/YesButton';
import NoButton from 'components/button/NoButton';
import MuiTypography from '@mui/material/Typography';
import { ThuHoiHuyBo } from 'services/thuhoihuyboService';

const XacNhanHuyBo = ({ data }) => {
  const { IdHocSinh, FileVanBan, NguoiThucHien, LyDo } = data;
  const dispatch = useDispatch();
  //const user = useSelector(userLoginSelector);
  const { t } = useTranslation();
  const hanldeDelete = async () => {
    try {
      const formData = new FormData();
      formData.append('IdHocSinh', IdHocSinh);
      formData.append('FileVanBan', FileVanBan);
      formData.append('NguoiThucHien', NguoiThucHien);
      formData.append('LyDo', LyDo);
      const response = await ThuHoiHuyBo(formData);
      if (response.isSuccess == false) {
        dispatch(showAlert(new Date().getTime().toString(), 'error', response.message.toString()));
      } else {
        dispatch(setOpenPopup(false));
        dispatch(setOpenSubPopup(false));
        dispatch(setReloadData(true));
        dispatch(showAlert(new Date().getTime().toString(), 'success', response.message.toString()));
      }
    } catch (error) {
      console.error('error' + error);
      dispatch(showAlert(new Date().getTime().toString(), 'error', error.toString()));
    }
  };

  return (
    <div style={{ textAlign: 'center' }}>
      <IconAlertCircle size={100} color="red" />
      <MuiTypography variant="h4" gutterBottom m={2}>
        {t('Bạn có muốn thu hồi/ hủy bỏ')}
      </MuiTypography>
      <MuiTypography variant="body1" gutterBottom>
        {t('form.delete.warning2')}
      </MuiTypography>
      <Grid container spacing={1} direction="row" justifyContent="center" my={2}>
        <Grid item>
          <YesButton handleClick={hanldeDelete} />
        </Grid>
        <Grid item>
          <NoButton type="subpopup" />
        </Grid>
      </Grid>
    </div>
  );
};
export default XacNhanHuyBo;
