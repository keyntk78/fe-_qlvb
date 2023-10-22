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
import { useDispatch, useSelector } from 'react-redux';
import { openPopupSelector, selectedHocsinhSelector, userLoginSelector } from 'store/selectors';
import { setOpenPopup, showAlert } from 'store/actions';
import { useTranslation } from 'react-i18next';
import { updateVBCC } from 'services/chinhsuavbccService';
import '../../index.css';
import FormGroupButton from 'components/button/FormGroupButton';
import FormControlComponent from 'components/form/FormControlComponent ';
import Importfile from 'components/form/ImportFile';
import { getHocSinhXacMinhByCCCD } from 'services/xacminhvanbangService';
import { getAllDanToc } from 'services/congthongtinService';
import { useState } from 'react';
import SelectForm from 'components/form/SelectForm';
import { convertJsonToFormData } from 'utils/convertJsonToFormData';
const AddDonChinhSua = () => {
  const { t } = useTranslation();
  const openPopup = useSelector(openPopupSelector);
  const selectedHocsinh = useSelector(selectedHocsinhSelector);
  const user = useSelector(userLoginSelector);
  const dispatch = useDispatch();
  const [danToc, setDanToc] = useState([]);
  const handleDanTocChange = (event) => {
    const selectedValue = event.target.value;
    formik.setFieldValue('DanToc', selectedValue);
  };

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
    },
    onSubmit: async (values) => {
      if (!formik.values.PathFileVanBan.name.endsWith('.docx') && !formik.values.PathFileVanBan.name.endsWith('.pdf')) {
        dispatch(showAlert(new Date().getTime().toString(), 'error', t('Định dạng file không hợp lệ')));
        return;
      }
      try {
        const formData = await convertJsonToFormData(values);
        const upDateVBCC = await updateVBCC(formData);
        if (upDateVBCC.isSuccess == false) {
          dispatch(showAlert(new Date().getTime().toString(), 'error', upDateVBCC.message.toString()));
        } else {
          dispatch(setOpenPopup(false));
          dispatch(setReloadData(true));
          dispatch(showAlert(new Date().getTime().toString(), 'success', upDateVBCC.message.toString()));
        }
      } catch (error) {
        console.error('Error updating function:', error);
        dispatch(showAlert(new Date().getTime().toString(), 'error', error.toString()));
      }
    }
  });
  const handleGenderChange = (event) => {
    formik.setFieldValue('gioiTinh', event.target.value);
  };
  useEffect(() => {
    const fetchData = async () => {
      const dantoc = await getAllDanToc();
      setDanToc(dantoc.data);
      const hocSinh = await getHocSinhXacMinhByCCCD(selectedHocsinh.cccd);
      const dataHocsinh = hocSinh.data;
      if (selectedHocsinh) {
        formik.setValues({
          HoTen: dataHocsinh.hoTen || '',
          CCCD: dataHocsinh.cccd || '',
          NgaySinh: dataHocsinh.ngaySinh || '',
          NoiSinh: dataHocsinh.noiSinh || '',
          GioiTinh: dataHocsinh.gioiTinh || '',
          DanToc: dataHocsinh.danToc || '',
          IdHocSinh: selectedHocsinh.id,
          NguoiThucHien: user.username
        });
      }
    };
    fetchData();
  }, [selectedHocsinh.cccd]);

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
          <InputForm1 isRequired xs={12} label={'Họ tên'} name="HoTen" formik={formik} />
        </Grid>
        <Grid item xs={12} sm={4} md={4}>
          <InputForm1 isRequired xs={12} label={'CCCD'} name="CCCD" formik={formik} />
        </Grid>
        <Grid item xs={12} sm={4} md={4}>
          <InputForm1
            xs={6}
            isRequired
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
          <FormControlComponent isRequired xsLabel={0} xsForm={12} label={t('user.label.gender')}>
            <FormControl fullWidth variant="outlined">
              <RadioGroup
                name="GioiTinh"
                value={formik.values.GioiTinh ? 'true' : 'false'}
                onChange={handleGenderChange}
                onBlur={formik.handleBlur}
              >
                <Grid container>
                  <FormControlLabel size="small" value="true" control={<Radio size="small" />} label={t('gender.male')} />
                  <FormControlLabel size="small" value="false" control={<Radio size="small" />} label={t('gender.female')} />
                </Grid>
              </RadioGroup>
            </FormControl>
          </FormControlComponent>
        </Grid>
        <Grid item xs={12} sm={4} md={4}>
          <InputForm1 isRequired xs={12} label={'Nơi sinh'} name="NoiSinh" formik={formik} />
        </Grid>
        <Grid item xs={12} sm={4} md={4}>
          <FormControlComponent xsForm={6} isRequire label={t('dantoc')}>
            {/* <InputForm formik={formik} name="DanToc" type="text" placeholder={t('dantoc')} /> */}
            <FormControl fullWidth variant="outlined">
              <SelectForm
                formik={formik}
                keyProp="ten"
                valueProp="ten"
                item={danToc}
                name="DanToc"
                value={formik.values.DanToc}
                onChange={handleDanTocChange}
              />
            </FormControl>
          </FormControlComponent>
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
                  <Importfile name="FileVanBan" formik={formik} nameFile="PathFileVanBan" lable={t('button.upload')} />
                </TableCell>
                <TableCell>{t('ghichuguidon')}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </div>
      <Grid item xs={12} container spacing={2}>
        <InputForm1
          formik={formik}
          minRows={3}
          maxRows={10}
          xs={12}
          name="LyDo"
          type="text"
          isMulltiline
          placeholder={t('phoivanbang.field.lydo')}
          isRequired
          label={t('phoivanbang.field.lydo')}
        />
      </Grid>
      <Grid item xs={12} container spacing={2} justifyContent="flex-end" mt={1}>
        <FormGroupButton type="subpopup" />
      </Grid>
    </form>
  );
};

export default AddDonChinhSua;
