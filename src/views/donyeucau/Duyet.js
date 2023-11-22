import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setOpenSubPopup, setReloadData, showAlert } from 'store/actions';
import { useTranslation } from 'react-i18next';
import { capBangBansaoSelector, openSubPopupSelector, userLoginSelector } from 'store/selectors';
import MuiTypography from '@mui/material/Typography';
import { FormControl, Grid, TextField } from '@mui/material';
import { IconCheck } from '@tabler/icons';
import YesButton from 'components/button/YesButton';
import NoButton from 'components/button/NoButton';
import { DuyetDon, getDonyeucauById } from 'services/capbangbansaoService';
import { useState } from 'react';
import FormControlComponent from 'components/form/FormControlComponent ';
import { useEffect } from 'react';

const Duyet = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [ngayNhan, setNgayNhan] = useState('');
  const [lePhi, setLePhi] = useState('');
  const capBangBansao = useSelector(capBangBansaoSelector);
  const user = useSelector(userLoginSelector);
  const openSubPopup = useSelector(openSubPopupSelector);
  const [donYeuCau, setDonYeuCau] = useState('');

  useEffect(() => {
    if (openSubPopup) {
      setNgayNhan('');
      setLePhi('');
    }
  }, [openSubPopup]);

  useEffect(() => {
    const fetchData = async () => {
      const Donyeucau = await getDonyeucauById(capBangBansao.id);
      const DataDonyeucau = Donyeucau.data;
      setDonYeuCau(DataDonyeucau);
    };
    fetchData();
  }, []);

  // Lấy ngày hiện tại và chuyển đổi sang chuỗi ngày tháng hợp lệ cho thuộc tính min
  const currentDate = new Date();
  const currentDateString = currentDate.toISOString().split('T')[0];
  const handleDeleteClick = async () => {
    try {
      const data = new FormData();
      data.append('IdDonYeuCauCapBanSao', donYeuCau.id);
      data.append('IdHocSinh', donYeuCau.hocSinh.id);
      data.append('NguoiThucHien', user.username);
      data.append('NgayNhan', ngayNhan);
      data.append('LePhi', lePhi);

      const duyetDon = await DuyetDon(data);

      if (duyetDon.isSuccess == false) {
        dispatch(showAlert(new Date().getTime().toString(), 'error', duyetDon.message.toString()));
      } else {
        dispatch(setOpenSubPopup(false));
        dispatch(setReloadData(true));
        dispatch(showAlert(new Date().getTime().toString(), 'success', duyetDon.message.toString()));
      }
    } catch (error) {
      console.error('Error updating Function:', error);
      dispatch(showAlert(new Date().getTime().toString(), 'error', error.toString()));
    }
  };
  return (
    <>
      <Grid container>
        <Grid item container xs={12} mt={3} mb={2} justifyContent={'center'}>
          <IconCheck size={100} color="green" />
        </Grid>
        <Grid item container xs={12} justifyContent={'center'} textAlign={'center'}>
          <MuiTypography variant="h4" gutterBottom>
            {`${t('form.duyet.warning1')} [${capBangBansao.HoTen}] ?`}
          </MuiTypography>
        </Grid>
        <Grid item container xs={12} mt={2} justifyContent={'center'}>
          <MuiTypography variant="h5" gutterBottom>
            Thông tin kèm theo
          </MuiTypography>
        </Grid>
        <Grid item container justifyContent={'center'}>
          <Grid item container sm={7} xs={12} mt={1} mb={1}>
            <Grid item xs={12}>
              {' '}
              <FormControlComponent xsLabel={6} xsForm={6} isRequire label={t('Ngày nhận')}>
                <FormControl fullWidth variant="outlined">
                  <TextField
                    size="small"
                    name="ngayNhan"
                    type="date"
                    // label={t('Ngày Nhận')}
                    onChange={(e) => setNgayNhan(e.target.value)}
                    value={ngayNhan}
                    InputLabelProps={{
                      shrink: true
                    }}
                    inputProps={{
                      min: currentDateString
                    }}
                  />
                </FormControl>
              </FormControlComponent>
            </Grid>
          </Grid>
          <Grid container sm={7} xs={12}>
            <Grid item container xs={12}>
              <FormControlComponent xsLabel={6} xsForm={6} isRequire label={t('Lệ phí (đồng/bản)')} sx={{ width: '150px' }}>
                <FormControl fullWidth variant="outlined">
                  <TextField
                    id="outlined-basic"
                    //label={t('Lệ phí')}
                    variant="outlined"
                    size="small"
                    onChange={(e) => setLePhi(e.target.value)}
                    value={lePhi ? lePhi : ''}
                  />
                </FormControl>
              </FormControlComponent>
            </Grid>
          </Grid>
        </Grid>
        <Grid item container spacing={1} direction="row" justifyContent="center" my={2}>
          <Grid item>
            <YesButton handleClick={handleDeleteClick} />
          </Grid>
          <Grid item>
            <NoButton type="subpopup" />
          </Grid>
        </Grid>
      </Grid>
    </>
  );
};

export default Duyet;
