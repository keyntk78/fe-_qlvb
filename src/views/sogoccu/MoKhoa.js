import { Grid } from '@mui/material';
import { IconLockOpen } from '@tabler/icons';
import NoButton from 'components/button/NoButton';
import YesButton from 'components/button/YesButton';
import MuiTypography from '@mui/material/Typography';
import { useDispatch, useSelector } from 'react-redux';
import { setOpenPopup, setReloadData, showAlert } from 'store/actions';
import { useTranslation } from 'react-i18next';
import { selectedDanhmucSelector, selectedDonvitruongSelector, userLoginSelector } from 'store/selectors';
import { moKhoaSo } from 'services/sogocService';

export default function MoKhoa({ donviOld }) {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const donvi = useSelector(selectedDonvitruongSelector);
  const danhmuc = useSelector(selectedDanhmucSelector);
  const user = useSelector(userLoginSelector);

  const hanldeGuiduyetAll = async () => {
    try {
      const formData = new FormData();
      formData.append('IdDanhMucTotNghiep', danhmuc.id);
      formData.append('IdTruong', donvi.id);
      formData.append('IdTruongCu', donviOld);
      const response = await moKhoaSo(user.username, formData);
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
        <IconLockOpen size={100} color="#2196F3" />
      </Grid>
      <MuiTypography variant="h4" gutterBottom m={1}>
        {`${t('Xác nhận mở khóa sổ gốc của ')}${t('donvitruong.title')} [${donvi ? donvi.ten : ''}], ${t('danhmuc.title')} [${
          danhmuc ? danhmuc.tieuDe : ''
        }]?`}
      </MuiTypography>
      <Grid container spacing={1} direction="row" justifyContent="center" my={2}>
        <Grid item>
          <YesButton handleClick={hanldeGuiduyetAll} />
        </Grid>
        <Grid item>
          <NoButton />
        </Grid>
      </Grid>
    </div>
  );
}
