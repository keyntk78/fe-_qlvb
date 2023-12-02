import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setOpenSubPopup, setReloadData, showAlert } from 'store/actions';
import { useTranslation } from 'react-i18next';
import { IconAlertCircle } from '@tabler/icons';
import { Grid } from '@mui/material';
import YesButton from 'components/button/YesButton';
import NoButton from 'components/button/NoButton';
import MuiTypography from '@mui/material/Typography';
import { userLoginSelector } from 'store/selectors';
import { createPhoiCaBiet } from 'services/phoigocService';

const XacNhanHuySoHieuPhoi = ({ formik, selectFile, setSelectFile, selectedFileName, setSelectedFileName }) => {
  const dispatch = useDispatch();
  const user = useSelector(userLoginSelector);
  const { t } = useTranslation();
  const hanldeDelete = async () => {
    try {
      const { values } = formik;
      const form = new FormData();
      form.append('IdPhoiGoc', values.IdPhoiGoc);
      form.append('LyDoHuy', values.LyDoHuy);
      values.soHieus.split(',').forEach((item) => {
        form.append('ListSoHieu', item);
      });
      form.append('FileBienBanHuyPhoi', selectFile);
      form.append('PathFileBienBanHuyPhoi', selectedFileName);
      form.append('NguoiThucHien', user.username);

      const PhoiCaBiet = await createPhoiCaBiet(form);
      if (PhoiCaBiet.isSuccess == false) {
        dispatch(showAlert(new Date().getTime().toString(), 'error', PhoiCaBiet.message.toString()));
      } else {
        dispatch(setOpenSubPopup(false));
        dispatch(setReloadData(true));
        dispatch(showAlert(new Date().getTime().toString(), 'success', PhoiCaBiet.message.toString()));
        formik.resetForm();
        setSelectFile('');
        setSelectedFileName(null);
      }
    } catch (error) {
      console.error('Error updating function:', error);
      dispatch(showAlert(new Date().getTime().toString(), 'error', error.toString()));
    }
  };

  return (
    <div style={{ textAlign: 'center' }}>
      <IconAlertCircle size={100} color="red" />
      <MuiTypography variant="h4" gutterBottom m={2}>
        {t('Bạn có muốn hủy các số hiệu phôi này không?')}
      </MuiTypography>
      <MuiTypography variant="body1" gutterBottom>
        {t('form.delete.warning2')}
      </MuiTypography>
      <Grid container spacing={1} direction="row" justifyContent="center" my={2}>
        <Grid item>
          <YesButton handleClick={hanldeDelete} />
        </Grid>
        <Grid item>
          <NoButton type="subpopup" />
        </Grid>
      </Grid>
    </div>
  );
};
export default XacNhanHuySoHieuPhoi;
