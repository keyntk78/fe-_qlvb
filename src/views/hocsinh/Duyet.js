import { Grid } from '@mui/material';
import { IconCircleCheck } from '@tabler/icons';
import NoButton from 'components/button/NoButton';
import YesButton from 'components/button/YesButton';
import MuiTypography from '@mui/material/Typography';
import { useDispatch, useSelector } from 'react-redux';
import { setOpenPopup, setReloadData, showAlert } from 'store/actions';
import { useTranslation } from 'react-i18next';
import { approveHocSinh } from 'services/hocsinhService';
import { selectedDanhmucSelector, selectedDonvitruongSelector } from 'store/selectors';

function Duyet({ dataCCCD }) {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const donvi = useSelector(selectedDonvitruongSelector);
  const danhmuc = useSelector(selectedDanhmucSelector);
  const data = [...dataCCCD];

  const hanldeDuyet = async () => {
    try {
      const params = new URLSearchParams();
      params.append('idDanhMucTotNghiep', danhmuc.id);
      params.append('idTruong', donvi.idTruong);
      const response = await approveHocSinh(params, data);
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
        {`${t('form.duyetall.warning')}${t('donvitruong.title')} [${donvi ? donvi.tenTruong : ''}], ${t('danhmuc.title')} [${
          danhmuc ? danhmuc.tieuDe : ''
        }]?`}
      </MuiTypography>
      <MuiTypography variant="h5" gutterBottom m={1}>
        {t('hocsinh.total')}
        <span style={{ fontSize: '16px', fontWeight: 'bold' }}>{data.length}</span>
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
