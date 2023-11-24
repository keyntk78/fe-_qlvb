import { Grid } from '@mui/material';
import { IconCircleCheck } from '@tabler/icons';
import NoButton from 'components/button/NoButton';
import YesButton from 'components/button/YesButton';
import MuiTypography from '@mui/material/Typography';
import { useDispatch, useSelector } from 'react-redux';
import { setOpenPopup, setOpenSubPopup, setOpenSubSubPopup, setReloadData, showAlert } from 'store/actions';
import { useTranslation } from 'react-i18next';
import { userLoginSelector } from 'store/selectors';
import { SaveImport } from 'services/xulydulieuService';

function DuaVaoBangChinh({ selectedValue, selectedName }) {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const user = useSelector(userLoginSelector);

  const handleDuaVaoBangChinh = async () => {
    try {
      const value = new FormData();
      value.append('nguoiThucHien', user.username);
      value.append('key', selectedValue);
      const response = await SaveImport(value);
      if (response.isSuccess == false) {
        dispatch(showAlert(new Date().getTime().toString(), 'error', response.message.toString()));
      } else {
        dispatch(setOpenPopup(false));
        dispatch(setOpenSubPopup(false));
        dispatch(setOpenSubSubPopup(false));
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
      <Grid xs={12} mt={2}>
        <IconCircleCheck size={100} color="#2196F3" />
      </Grid>
      <MuiTypography variant="h4" gutterBottom m={1}>
        {`${t(`Bạn có chắc chắn lưu danh sách [${selectedName}] vào hệ thống ?`)}`}
      </MuiTypography>

      <Grid container spacing={1} direction="row" justifyContent="center" my={2}>
        <Grid item>
          <YesButton handleClick={handleDuaVaoBangChinh} />
        </Grid>
        <Grid item>
          <NoButton type="subsubpopup" />
        </Grid>
      </Grid>
    </div>
  );
}
export default DuaVaoBangChinh;
