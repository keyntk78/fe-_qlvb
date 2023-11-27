import { Grid } from '@mui/material';
import { IconCircleCheck } from '@tabler/icons';
import NoButton from 'components/button/NoButton';
import YesButton from 'components/button/YesButton';
import MuiTypography from '@mui/material/Typography';
import { useDispatch, useSelector } from 'react-redux';
import { setOpenSubPopup, setReloadData, showAlert } from 'store/actions';
import { useTranslation } from 'react-i18next';
import { upDateVBCCSelector, userLoginSelector } from 'store/selectors';
import { duyetCapLai } from 'services/caplaivbccService';

function Duyet() {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const history = useSelector(upDateVBCCSelector);
  const user = useSelector(userLoginSelector);

  const hanldeDuyet = async () => {
    try {
      const params = new URLSearchParams();
      params.append('idPhuLuc', history.id);
      params.append('nguoiThucHien', user?.username);
      const response = await duyetCapLai(params);
      if (response.isSuccess == false) {
        dispatch(showAlert(new Date().getTime().toString(), 'error', response.message.toString()));
      } else {
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
      <Grid item xs={12} mt={2}>
        <IconCircleCheck size={100} color="#2196F3" />
      </Grid>
      <MuiTypography variant="h4" gutterBottom m={1}>
        {`${t('Xác nhận duyệt nội dung cấp lại văn bằng của học sinh')} [${history?.hoTen || ''}]?`}
      </MuiTypography>
      <Grid container spacing={1} direction="row" justifyContent="center" my={2}>
        <Grid item>
          <YesButton handleClick={hanldeDuyet} />
        </Grid>
        <Grid item>
          <NoButton />
        </Grid>
      </Grid>
    </div>
  );
}
export default Duyet;
