import {
  FormControl,
  FormControlLabel,
  Grid,
  Paper,
  Radio,
  RadioGroup,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material';
import InputForm1 from 'components/form/InputForm1';
import { useFormik } from 'formik';
import React from 'react';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { openPopupSelector, selectedHocsinhSelector, upDateVBCCSelector } from 'store/selectors';
import { useTranslation } from 'react-i18next';
import { getByIdHistory } from 'services/chinhsuavbccService';
import '../../index.css';
import FormGroupButton from 'components/button/FormGroupButton';
import FormControlComponent from 'components/form/FormControlComponent ';
import config from 'config';
import { useState } from 'react';
const DetailHistory = () => {
  const { t } = useTranslation();
  const openPopup = useSelector(openPopupSelector);
  const selectedHocsinh = useSelector(selectedHocsinhSelector);
  const history = useSelector(upDateVBCCSelector);
  const [pathFileHistory, setPathFileHistory] = useState('');
  const formik = useFormik({
    initialValues: {
      HoTen: '',
      CCCD: '',
      NgaySinh: '',
      NoiSinh: '',
      GioiTinh: '',
      DanToc: '',
      PathFileVanBan: '',
      FileVanBan: '',
      LyDo: ''
    }
  });
  useEffect(() => {
    const fetchData = async () => {
      const hocSinh = await getByIdHistory(selectedHocsinh.cccd, history.id);
      const dataHocsinh = hocSinh.data.lichSus;
      //   setPathFileHistory(config.urlImages + dataHocsinh.pathFileVanBan);
      setPathFileHistory(config.urlFile + dataHocsinh.pathFileVanBan);
      if (history) {
        formik.setValues({
          HoTen: dataHocsinh.hoTenCu || '',
          CCCD: dataHocsinh.cccdCu || '',
          NgaySinh: dataHocsinh.ngaySinhCu || '',
          NoiSinh: dataHocsinh.noiSinhCu || '',
          GioiTinh: dataHocsinh.gioiTinhCu || '',
          DanToc: dataHocsinh.danTocCu || '',
          FileVanBan: dataHocsinh.fileVanBan || '',
          PathFileVanBan: dataHocsinh.pathFileVanBan || ''
        });
      }
    };
    fetchData();
  }, [history.id]);

  useEffect(() => {
    if (openPopup) {
      formik.resetForm();
    }
  }, [openPopup]);
  return (
    <form onSubmit={formik.handleSubmit}>
      <div style={{ borderBottom: '2px solid black', fontWeight: 'bold', paddingTop: 3 }}>
        <p>{t('Thông tin học sinh')}</p>
      </div>
      <Grid container spacing={1}>
        <Grid item xs={12} sm={4} md={4}>
          <InputForm1 xs={12} isDisabled label={'Họ tên'} name="HoTen" formik={formik} />
        </Grid>
        <Grid item xs={12} sm={4} md={4}>
          <InputForm1 isDisabled xs={12} label={'CCCD'} name="CCCD" formik={formik} />
        </Grid>
        <Grid item xs={12} sm={4} md={4}>
          <InputForm1
            isDisabled
            xs={6}
            label={'Ngày sinh'}
            formik={formik}
            name="NgaySinh"
            type="date"
            value={formik.values.NgaySinh ? new Date(formik.values.NgaySinh).toISOString().slice(0, 10) : ''}
          />
        </Grid>
      </Grid>
      <Grid container spacing={1}>
        <Grid item xs={12} sm={4} md={4}>
          <FormControlComponent xsLabel={0} xsForm={12} label={t('user.label.gender')}>
            <FormControl disabled fullWidth variant="outlined">
              <RadioGroup name="GioiTinh" value={formik.values.GioiTinh ? 'true' : 'false'} onBlur={formik.handleBlur}>
                <Grid container>
                  <FormControlLabel disabled size="small" value="true" control={<Radio size="small" />} label={t('gender.male')} />
                  <FormControlLabel disabled size="small" value="false" control={<Radio size="small" />} label={t('gender.female')} />
                </Grid>
              </RadioGroup>
            </FormControl>
          </FormControlComponent>
        </Grid>
        <Grid item xs={12} sm={4} md={4}>
          <InputForm1 isDisabled xs={12} label={'Nơi sinh'} name="NoiSinh" formik={formik} />
        </Grid>
        <Grid item xs={12} sm={4} md={4}>
          <InputForm1 isDisabled xs={6} label={'Dân tộc'} name="DanToc" formik={formik} />
        </Grid>
      </Grid>
      <div style={{ borderBottom: '2px solid black', fontWeight: 'bold', paddingTop: 3 }}>
        <p>{t('hosodinhkem')}</p>
      </div>
      <div style={{ overflowX: 'auto' }}>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableCell style={{ width: '22.5%' }}>{t('tentep')}</TableCell>
              <TableCell style={{ width: '55%' }}>{t('donyeucau.title.tenfile')}</TableCell>
              <TableCell style={{ width: '22.5%' }}>{t('donyeucau.title.ghichu')}</TableCell>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell>{t('quyetdinhchinhsuavbcc')}</TableCell>
                <TableCell>
                  <a href={pathFileHistory} download>
                    {formik.values.PathFileVanBan}
                  </a>{' '}
                </TableCell>
                <TableCell>{t('ghichuguidon')}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </div>
      <Grid item xs={12} container spacing={2}>
        <InputForm1
          isDisabled
          formik={formik}
          minRows={3}
          maxRows={10}
          xs={12}
          name="LyDo"
          type="text"
          isMulltiline
          placeholder={t('phoivanbang.field.lydo')}
          label={t('phoivanbang.field.lydo')}
        />
      </Grid>
      <Grid item xs={12} container spacing={2} justifyContent="flex-end" mt={1}>
        <FormGroupButton type="subpopup" />
      </Grid>
    </form>
  );
};

export default DetailHistory;
