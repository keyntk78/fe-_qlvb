import { Grid, TextField } from '@mui/material';
import { IconSend } from '@tabler/icons';
import NoButton from 'components/button/NoButton';
import YesButton from 'components/button/YesButton';
import MuiTypography from '@mui/material/Typography';
// import { TongHocSinhChuaXacNhan, comfirmAllHocSinhByTruong } from 'services/nguoihoctotnghiepService';
// import { useDispatch, useSelector } from 'react-redux';
// import { setOpenPopup, setReloadData, showAlert } from 'store/actions';
// import { donviSelector, selectedDanhmucSelector } from 'store/selectors';
import { useTranslation } from 'react-i18next';
import { openSubSubPopupSelector } from 'store/selectors';
import { useState } from 'react';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
// import { useState } from 'react';
// import { useEffect } from 'react';

function GuiThongBaoTatCa() {
  //   const dispatch = useDispatch();
  //   const donvi = useSelector(donviSelector);
  //   const danhmuc = useSelector(selectedDanhmucSelector);
  const { t } = useTranslation();
  const openSubSubPopup = useSelector(openSubSubPopupSelector);
  const [notifyReason, setNotifyReason] = useState('');
  useEffect(() => {
    if (openSubSubPopup) {
      setNotifyReason('');
    }
  }, [openSubSubPopup]);
  //   const [countHS, setCountHS] = useState('');

  //   useEffect(() => {
  //     const fetchDataDL = async () => {
  //       const response = await TongHocSinhChuaXacNhan(donvi.id, danhmuc.id);
  //       setCountHS(response.data);
  //     };
  //     fetchDataDL();
  //   }, [donvi, danhmuc]);

  //   const hanldeGuiduyetAll = async () => {
  //     try {
  //       const response = await comfirmAllHocSinhByTruong(donvi.id, danhmuc.id);
  //       if (response.isSuccess == false) {
  //         dispatch(showAlert(new Date().getTime().toString(), 'error', response.message.toString()));
  //       } else {
  //         dispatch(setOpenPopup(false));
  //         dispatch(setReloadData(true));
  //         dispatch(showAlert(new Date().getTime().toString(), 'success', response.message.toString()));
  //       }
  //     } catch (error) {
  //       console.error('error' + error);
  //       dispatch(showAlert(new Date().getTime().toString(), 'error', error.toString()));
  //     }
  //   };

  return (
    <div style={{ textAlign: 'center' }}>
      <IconSend size={100} color="#2196F3" />
      <MuiTypography variant="h4" gutterBottom m={2}>
        {t('Bạn có muốn gửi thông báo đến các trường [tất cả] ?')}
      </MuiTypography>
      <MuiTypography variant="h5" gutterBottom m={1}>
        {`${t('Tổng số trường')} 123`}
      </MuiTypography>
      <Grid item container xs={12} mt={1} justifyContent={'center'}>
        <TextField
          label={t('Nội dung thông báo')} // Replace with your translation key
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
          <YesButton />
        </Grid>
        <Grid item>
          <NoButton type="subsubpopup" />
        </Grid>
      </Grid>
    </div>
  );
}
export default GuiThongBaoTatCa;
