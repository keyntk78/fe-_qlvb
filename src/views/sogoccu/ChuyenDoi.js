import { Grid } from '@mui/material';
import { IconCircleCheck } from '@tabler/icons';
import NoButton from 'components/button/NoButton';
import YesButton from 'components/button/YesButton';
import MuiTypography from '@mui/material/Typography';
import { useDispatch, useSelector } from 'react-redux';
import { setOpenPopup, setReloadData, showAlert } from 'store/actions';
import { useTranslation } from 'react-i18next';
import { userLoginSelector } from 'store/selectors';
import { chuyenDoiSoGoc } from 'services/sogocService';

function ChuyenDoi({ truongCu, truongMoi }) {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const user = useSelector(userLoginSelector);

  const hanldeChuyenDoi = async () => {
    try {
      const params = new URLSearchParams();
      params.append('idTruongMoi', truongMoi);
      params.append('idTruongCu', truongCu);
      params.append('nguoiThucHien', user.username);
      const response = await chuyenDoiSoGoc(params);
      console.log(response);
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
        <IconCircleCheck size={100} color="#2196F3" />
      </Grid>
      <MuiTypography variant="h4" gutterBottom m={1}>
        {`${t('Xác nhận chuyển đổi sổ gốc')}`}
      </MuiTypography>
      <Grid container spacing={1} direction="row" justifyContent="center" my={2}>
        <Grid item>
          <YesButton handleClick={hanldeChuyenDoi} />
        </Grid>
        <Grid item>
          <NoButton />
        </Grid>
      </Grid>
    </div>
  );
}
export default ChuyenDoi;
