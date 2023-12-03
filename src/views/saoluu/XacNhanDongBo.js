import { Grid } from '@mui/material';
import { IconRefresh } from '@tabler/icons';
import NoButton from 'components/button/NoButton';
import YesButton from 'components/button/YesButton';
import MuiTypography from '@mui/material/Typography';
import { useDispatch } from 'react-redux';
import { setOpenPopup, setReloadData, showAlert } from 'store/actions';
import { useTranslation } from 'react-i18next';
import { SyncCollection } from 'services/saoluuService';

function DongBo() {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const hanldeDongBo = async () => {
    try {
      const response = await SyncCollection();
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
      <Grid item xs={12} mt={2}>
        <IconRefresh size={100} color="#2196F3" />
      </Grid>
      <MuiTypography variant="h4" gutterBottom m={1}>
        {`${t('Bạn có chắc chắn đồng bộ dữ liệu ?')}`}
      </MuiTypography>
      <Grid container spacing={1} direction="row" justifyContent="center" my={2}>
        <Grid item>
          <YesButton handleClick={hanldeDongBo} />
        </Grid>
        <Grid item>
          <NoButton type="subpopup" />
        </Grid>
      </Grid>
    </div>
  );
}
export default DongBo;
