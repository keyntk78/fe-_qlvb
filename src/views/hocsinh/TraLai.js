import { Grid } from '@mui/material';
import { IconArrowBack } from '@tabler/icons';
import NoButton from 'components/button/NoButton';
import YesButton from 'components/button/YesButton';
import MuiTypography from '@mui/material/Typography';
import { useDispatch, useSelector } from 'react-redux';
import { setLoading, setOpenPopup, setReloadData, showAlert } from 'store/actions';
import { useTranslation } from 'react-i18next';
import { TongHocSinhChoDuyet, giveBackAllHocSinh } from 'services/hocsinhService';
import { openPopupSelector, selectedDanhmucSelector, selectedDonvitruongSelector } from 'store/selectors';
import { useEffect, useState } from 'react';

function TraLai() {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const donvi = useSelector(selectedDonvitruongSelector);
  const danhmuc = useSelector(selectedDanhmucSelector);
  const openPopup = useSelector(openPopupSelector);
  const [countHS, setCountHS] = useState('');

  useEffect(() => {
    const fetchDataDL = async () => {
      dispatch(setLoading(true));
      const response = await TongHocSinhChoDuyet(donvi.id, danhmuc.id);
      setCountHS(response.data);
      dispatch(setLoading(false));
    };
    if (openPopup) {
      fetchDataDL();
    }
  }, [donvi, danhmuc, openPopup]);

  const hanldeTraLai = async () => {
    try {
      const response = await giveBackAllHocSinh(donvi.id, danhmuc.id);
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
      <Grid mt={1}>
        <IconArrowBack size={100} color="#F44336" />
      </Grid>
      <MuiTypography variant="h4" gutterBottom m={2}>
        {`${t('form.tralai.warning')}${t('donvitruong.title')} [${donvi ? donvi.ten : ''}], ${t('danhmuc.title')} [${
          danhmuc ? danhmuc.tieuDe : ''
        }]`}
      </MuiTypography>
      <MuiTypography variant="h5" gutterBottom m={1}>
        {`${t('hocsinh.total')}`}
        <span style={{ fontSize: '16px', fontWeight: 'bold' }}>{countHS}</span>
      </MuiTypography>
      <Grid container spacing={1} direction="row" justifyContent="center" my={2}>
        <Grid item>
          <YesButton handleClick={hanldeTraLai} />
        </Grid>
        <Grid item>
          <NoButton />
        </Grid>
      </Grid>
    </div>
  );
}
export default TraLai;
