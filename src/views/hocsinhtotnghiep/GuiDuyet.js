import { Grid } from '@mui/material';
import { IconSend } from '@tabler/icons';
import NoButton from 'components/button/NoButton';
import YesButton from 'components/button/YesButton';
import MuiTypography from '@mui/material/Typography';
import { comfirmHocSinhByTruong } from 'services/nguoihoctotnghiepService';
import { useDispatch, useSelector } from 'react-redux';
import { setOpenPopup, setReloadData, showAlert } from 'store/actions';
import { donviSelector, selectedDanhmucSelector } from 'store/selectors';
import { useTranslation } from 'react-i18next';

function GuiDuyet({ dataCCCD }) {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const donvi = useSelector(donviSelector);
  const danhmuc = useSelector(selectedDanhmucSelector);
  const data = [...dataCCCD];
  const hanldeGuiduyet = async () => {
    try {
      const response = await comfirmHocSinhByTruong(donvi.id, danhmuc.id, data);
      if (response.isSuccess == false) {
        dispatch(showAlert(new Date().getTime().toString(), 'error', response.message.toString()));
      } else {
        dispatch(setOpenPopup(false));
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
      <IconSend size={100} color="#2196F3" />
      <MuiTypography variant="h4" gutterBottom m={2}>
        {t('form.guiduyet.warning1')}
      </MuiTypography>
      <MuiTypography variant="h5" gutterBottom m={1}>
        {`${t('hocsinh.total')} ${data.length}`}
      </MuiTypography>
      <Grid container spacing={1} direction="row" justifyContent="center" my={2}>
        <Grid item>
          <YesButton handleClick={hanldeGuiduyet} />
        </Grid>
        <Grid item>
          <NoButton />
        </Grid>
      </Grid>
    </div>
  );
}
export default GuiDuyet;
