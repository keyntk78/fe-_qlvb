import { Grid } from '@mui/material';
import { IconChecks } from '@tabler/icons';
import YesButton from 'components/button/YesButton';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { selectedDanhmucSelector, selectedDonvitruongSelector } from 'store/selectors';
import MuiTypography from '@mui/material/Typography';
import NoButton from 'components/button/NoButton';
import { XacNhanInBang, XacNhanInBangTatCa, getHocSinhCapBang } from 'services/capbangbanchinhService';
import { setLoading, setOpenPopup, setReloadData, showAlert } from 'store/actions';
import { useState } from 'react';
import { useEffect } from 'react';

const XacNhanIn = ({ dataCCCD }) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const donvi = useSelector(selectedDonvitruongSelector);
  const danhmuc = useSelector(selectedDanhmucSelector);
  const data = [...dataCCCD];
  const [countHS, setCountHS] = useState('');
  const [reload, setReload] = useState(true);

  useEffect(() => {
    const fetchDataDL = async () => {
      const params = new URLSearchParams();
      params.append('pageSize', -1);
      params.append('idDanhMucTotNghiep', danhmuc.id);
      params.append('idTruong', donvi.id);
      params.append('trangThai', 4);
      const response = await getHocSinhCapBang(params);
      setCountHS(response.data.totalRow);
      setReload(false);
    };
    if (reload) {
      fetchDataDL();
    }
  }, [donvi, danhmuc, reload]);

  const hanldeXacNhanIn = async () => {
    dispatch(setLoading(true));
    try {
      let response;
      if (dataCCCD && dataCCCD.length > 0) {
        response = await XacNhanInBang(donvi.id, danhmuc.id, data);
      } else {
        response = await XacNhanInBangTatCa(donvi.id, danhmuc.id);
      }
      if (response.isSuccess == false) {
        dispatch(showAlert(new Date().getTime().toString(), 'error', response.message.toString()));
        dispatch(setLoading(false));
      } else {
        dispatch(setOpenPopup(false));
        dispatch(setReloadData(true));
        dispatch(showAlert(new Date().getTime().toString(), 'success', response.message.toString()));
        dispatch(setLoading(false));
        setReload(true);
      }
    } catch (error) {
      console.error('error' + error);
      dispatch(showAlert(new Date().getTime().toString(), 'error', error.toString()));
      dispatch(setLoading(false));
    }
  };
  return (
    <div style={{ textAlign: 'center' }}>
      <IconChecks size={100} color="#2196F3" />
      <MuiTypography variant="h4" gutterBottom m={2}>
        {t('Bạn có muốn xác nhận đã in bằng hoàn tất ?')}
      </MuiTypography>
      <MuiTypography variant="h5" gutterBottom m={1}>
        {t('hocsinh.total')} {data.length > 0 ? data.length : countHS}
      </MuiTypography>
      <Grid container spacing={1} direction="row" justifyContent="center" my={2}>
        <Grid item>
          <YesButton handleClick={hanldeXacNhanIn} />
        </Grid>
        <Grid item>
          <NoButton />
        </Grid>
      </Grid>
    </div>
  );
};

export default XacNhanIn;
