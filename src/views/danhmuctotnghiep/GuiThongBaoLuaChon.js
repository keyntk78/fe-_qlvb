import { Grid, TextField } from '@mui/material';
import { IconSend } from '@tabler/icons';
import NoButton from 'components/button/NoButton';
import YesButton from 'components/button/YesButton';
import MuiTypography from '@mui/material/Typography';
import { useTranslation } from 'react-i18next';
import { openSubSubPopupSelector } from 'store/selectors';
import { useDispatch, useSelector } from 'react-redux';
import { useState } from 'react';
import { useEffect } from 'react';
import { setOpenSubSubPopup, setReloadData, showAlert } from 'store/actions';
import { GuiThongBaoTungNguoi } from 'services/danhmuctotnghiepService';

function GuiThongBaoLuaChon({ dataIdTruong }) {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const openSubSubPopup = useSelector(openSubSubPopupSelector);
  const [notifyReason, setNotifyReason] = useState('');
  const data = [...dataIdTruong].join(',');
  const hanldeGuiThongBao = async () => {
    try {
      const response = await GuiThongBaoTungNguoi(notifyReason, data);
      if (response.isSuccess == false) {
        dispatch(showAlert(new Date().getTime().toString(), 'error', response.message.toString()));
      } else {
        dispatch(setOpenSubSubPopup(false));
        dispatch(setReloadData(true));
        dispatch(showAlert(new Date().getTime().toString(), 'success', response.message.toString()));
      }
    } catch (error) {
      console.error('error' + error);
      dispatch(showAlert(new Date().getTime().toString(), 'error', error.toString()));
    }
  };

  useEffect(() => {
    if (openSubSubPopup) {
      setNotifyReason('');
    }
  }, [openSubSubPopup]);
  return (
    <div style={{ textAlign: 'center' }}>
      <IconSend size={100} color="#2196F3" />
      <MuiTypography variant="h4" gutterBottom m={2}>
        {t('Bạn có muốn gửi thông báo đến các trường đã chọn ?')}
      </MuiTypography>
      <MuiTypography variant="h5" gutterBottom m={1}>
        {`${t('Tổng số trường: ')} ${dataIdTruong && dataIdTruong.length}`}
      </MuiTypography>
      <Grid item container xs={12} mt={1} justifyContent={'center'}>
        <TextField
          label={t('Nội dung thông báo')}
          variant="outlined"
          fullWidth
          maxRows={5}
          minRows={4}
          value={notifyReason}
          onChange={(e) => setNotifyReason(e.target.value)}
          required
        />
      </Grid>
      <Grid container spacing={1} direction="row" justifyContent="center" my={2}>
        <Grid item>
          <YesButton handleClick={hanldeGuiThongBao} />
        </Grid>
        <Grid item>
          <NoButton type="subsubpopup" />
        </Grid>
      </Grid>
    </div>
  );
}
export default GuiThongBaoLuaChon;
