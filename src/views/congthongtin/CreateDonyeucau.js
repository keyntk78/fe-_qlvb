import { Button, FormControl, FormControlLabel, Grid, Radio, RadioGroup, useMediaQuery } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import FormControlComponent from 'components/form/FormControlComponent ';
import InputForm from 'components/form/InputForm';
import InputForm1 from 'components/form/InputForm1';
import SelectList from 'components/form/SelectList';
import { useFormik } from 'formik';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { openPopupSelector, reloadDataSelector, showAlertSelector } from 'store/selectors';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import Importfile from 'components/form/ImportFile';
import { showAlert } from 'store/actions';
import { convertJsonToFormData } from 'utils/convertJsonToFormData';
import { IconDownload } from '@tabler/icons';
import FileMau_YCCBS from '../FileMau/MauDonYCCapBanSao.docx';
import useDonyeucauValidationSchema from 'components/validations/donyeucauValidation';
import { Container, useTheme } from '@mui/system';
import { IconArrowLeft, IconSend } from '@tabler/icons';
import { createDonyeucau, getAllDanToc, getAllNam, getAllTruong, getPhong } from 'services/congthongtinService';
import Alert from 'components/controls/alert';
import SelectForm from 'components/form/SelectForm';
import BackToTop from 'components/scroll/BackToTop';

const CreateDonyeucau = () => {
  // const [uploadedFiles, setUploadedFiles] = useState([]);
  const theme = useTheme();
  const navigate = useNavigate();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const [donvitruong, setDonvi] = useState([]);
  const [namthi, setNamthi] = useState([]);
  const [danToc, setDanToc] = useState([]);
  const openPopup = useSelector(openPopupSelector);
  const reloadData = useSelector(reloadDataSelector);
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const showAlertLogin = useSelector(showAlertSelector);

  const hocLucOptions = [
    { value: 'Giỏi', label: 'Giỏi' },
    { value: 'Khá', label: 'Khá' },
    { value: 'Trung Bình', label: 'Trung Bình' }
  ];
  const handleHocLucChange = (event) => {
    const selectedValue = event.target.value;
    formik.setFieldValue('XepLoai', selectedValue);
  };
  const handleDanTocChange = (event) => {
    const selectedValue = event.target.value;
    formik.setFieldValue('DanToc', selectedValue);
  };

  const formik = useFormik({
    initialValues: {
      IdTruong: '',
      IdNamThi: '',
      HoTen: '',
      GioiTinh: true,
      CCCD: '',
      DanToc: '',
      NgaySinh: '',
      NoiSinh: '',
      XepLoai: '',
      SoLuongBanSao: '',
      HoTenNguoiYeuCau: '',
      EmailNguoiYeuCau: '',
      CCCDNguoiYeuCau: '',
      SoDienThoaiNguoiYeuCau: '',
      DiaChiNguoiYeuCau: '',
      LyDo: '',
      NguoiThucHien: 'sss',
      FileHinhAnhCCCD: '',
      FileDonYeuCau: '',
      DonYeuCau: '',
      HinhAnhCCCD: '',
      PhuongThucNhan: '',
      DiaChiNhan: ''
    },
    validationSchema: useDonyeucauValidationSchema(),
    onSubmit: async (values) => {
      if (formik.values.FileHinhAnhCCCD === '' || formik.values.FileDonYeuCau === '') {
        dispatch(showAlert(new Date().getTime().toString(), 'error', t('hocsinhtotnghiep.emptyfile')));
        return;
      }
      if (!formik.values.FileDonYeuCau.name.endsWith('.docx') && !formik.values.FileDonYeuCau.name.endsWith('.pdf')) {
        dispatch(showAlert(new Date().getTime().toString(), 'error', t('Định dạng file đơn yêu cầu không hợp lệ')));
        return;
      }
      if (
        !formik.values.FileHinhAnhCCCD.name.endsWith('.png') &&
        !formik.values.FileHinhAnhCCCD.name.endsWith('.jpg') &&
        !formik.values.FileHinhAnhCCCD.name.endsWith('.jpeg')
      ) {
        dispatch(showAlert(new Date().getTime().toString(), 'error', t('Định dạng file giấy tờ tùy thân không hợp lệ')));
        return;
      }
      try {
        //
        // formik.setValues((prevValues) => ({
        //   ...prevValues,
        //   ngaySinh: '2001-04-25T17:00:00.000+00:00'
        // }));
        //
        const formData = await convertJsonToFormData(values);
        const addDonyeucau = await createDonyeucau(formData);

        if (addDonyeucau.isSuccess == false) {
          dispatch(showAlert(new Date().getTime().toString(), 'error', addDonyeucau.message.toString()));
        } else {
          navigate('/tracuu-donyeucau');
          dispatch(showAlert(new Date().getTime().toString(), 'success', addDonyeucau.message.toString()));
        }
      } catch (error) {
        console.error('Error updating donyeucau:', error);
        dispatch(showAlert(new Date().getTime().toString(), 'error', error.toString()));
      }
    }
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const donViResponse = await getAllTruong();
        setDonvi(donViResponse.data);

        const dantoc = await getAllDanToc();
        setDanToc(dantoc.data);

        const namthiData = await getAllNam();
        setNamthi(namthiData.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [reloadData]);

  useEffect(() => {
    const fetchData = async () => {
      const donvibyid = await getPhong();
      const dataphong = donvibyid.data;

      formik.setFieldValue('DiaChiNhan', dataphong.diaChi);
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (openPopup) {
      formik.resetForm();
    }
  }, [openPopup]);
  useEffect(() => {});
  return (
    <div>
      <div
        style={{
          width: '100%',
          backgroundColor: '#F7F7F7',
          minHeight: `calc(100vh - 285px)`
        }}
      >
        <Container
          sx={{
            width: isSmallScreen ? '100%' : '60%',
            backgroundColor: 'White',
            paddingBottom: 1
            // boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.3)'
          }}
        >
          <form onSubmit={formik.handleSubmit}>
            <div style={{ borderBottom: '2px solid black', fontWeight: 'bold', paddingTop: 3 }}>
              <p>{t('thongtindangky')}</p>
            </div>
            <Grid container xs={12} spacing={1} mt={1}>
              <Grid item xs={12} container spacing={2}>
                <Grid item xs={12} sm={12} md={12} lg={6}>
                  <FormControlComponent xsLabel={isSmallScreen ? 0 : 3} xsForm={isSmallScreen ? 12 : 9} isRequire label={t('Tên trường')}>
                    <SelectList
                      data={donvitruong}
                      name="IdTruong"
                      value="id"
                      request={'id'}
                      optionName="ten"
                      placeholder={t('donvitruong.field.tentruongtotnghiep')}
                      formik={formik}
                      openPopup
                    />
                  </FormControlComponent>
                </Grid>
                <Grid item xs={12} sm={12} md={12} lg={6}>
                  <FormControlComponent
                    xsLabel={isSmallScreen ? 0 : 3}
                    xsForm={isSmallScreen ? 12 : 9}
                    isRequire
                    label={t('user.label.fullname')}
                  >
                    <InputForm formik={formik} name="HoTen" type="text" placeholder={t('user.label.fullname')} />
                  </FormControlComponent>
                </Grid>
              </Grid>
              <Grid item xs={12} spacing={2} container>
                <Grid item xs={6} sm={12} md={12} lg={6}>
                  <FormControlComponent xsLabel={isSmallScreen ? 0 : 3} xsForm={isSmallScreen ? 12 : 9} isRequire label={t('dantoc')}>
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
                <Grid item xs={6} sm={12} md={12} lg={6}>
                  <FormControlComponent
                    xsLabel={isSmallScreen ? 0 : 3}
                    xsForm={isSmallScreen ? 12 : 9}
                    isRequire
                    label={t('user.label.birthday')}
                  >
                    <InputForm formik={formik} name="NgaySinh" type="date" placeholder={t('user.label.birthday')} />
                  </FormControlComponent>
                </Grid>
              </Grid>
              <Grid item xs={12} container spacing={2}>
                <Grid item xs={6} sm={12} md={12} lg={6}>
                  <FormControlComponent
                    xsLabel={isSmallScreen ? 0 : 3}
                    xsForm={isSmallScreen ? 12 : 9}
                    isRequire
                    label={t('user.label.gender')}
                  >
                    <RadioGroup
                      style={{ display: 'flex', justifyContent: 'flex-start' }}
                      row
                      name="GioiTinh"
                      value={formik.values.GioiTinh ? formik.values.GioiTinh : 'true'}
                      onChange={formik.handleChange}
                    >
                      <FormControlLabel value={true} control={<Radio />} label={t('gender.male')} />
                      <FormControlLabel value={false} control={<Radio />} label={t('gender.female')} />
                    </RadioGroup>
                  </FormControlComponent>
                </Grid>
                <Grid item xs={6} sm={12} md={12} lg={6}>
                  <FormControlComponent
                    xsLabel={isSmallScreen ? 0 : 3}
                    xsForm={isSmallScreen ? 12 : 9}
                    isRequire
                    label={t('hocsinh.field.cccd')}
                  >
                    <InputForm formik={formik} name="CCCD" type="text" placeholder={t('hocsinh.field.cccd')} />
                  </FormControlComponent>
                </Grid>
              </Grid>
              <Grid item xs={12} container spacing={2}>
                <Grid item xs={6} sm={12} md={12} lg={6}>
                  <FormControlComponent
                    xsLabel={isSmallScreen ? 0 : 3}
                    xsForm={isSmallScreen ? 12 : 9}
                    isRequire
                    label={t('khoathi.title')}
                  >
                    <SelectList
                      data={namthi}
                      name="IdNamThi"
                      value="id"
                      request={'id'}
                      optionName="ten"
                      placeholder={t('khoathi.title')}
                      formik={formik}
                      openPopup
                    />
                  </FormControlComponent>
                </Grid>
                <Grid item xs={6} sm={12} md={12} lg={6}>
                  <FormControlComponent xsLabel={isSmallScreen ? 0 : 3} xsForm={isSmallScreen ? 12 : 9} isRequire label={t('Xếp loại')}>
                    <FormControl fullWidth variant="outlined">
                      <SelectForm
                        formik={formik}
                        keyProp="value"
                        valueProp="label"
                        item={hocLucOptions}
                        name="XepLoai"
                        value={formik.values.hocLuc}
                        onChange={handleHocLucChange}
                      />
                    </FormControl>
                    {/* <InputForm formik={formik} name="XepLoai" type="text" placeholder={t('loaitotnghiep')} /> */}
                  </FormControlComponent>
                </Grid>
              </Grid>
              <Grid item xs={12} container spacing={2}>
                <Grid item xs={12} sm={12} md={12} lg={6}>
                  <FormControlComponent
                    xsLabel={isSmallScreen ? 0 : 3}
                    xsForm={isSmallScreen ? 12 : 9}
                    isRequire
                    label={t('user.label.noisinh')}
                  >
                    <InputForm formik={formik} name="NoiSinh" type="text" placeholder={t('user.label.noisinh')} />
                  </FormControlComponent>
                </Grid>

                <Grid item xs={12} sm={12} md={12} lg={6}>
                  <FormControlComponent
                    xsLabel={isSmallScreen ? 0 : 4.5}
                    xsForm={isSmallScreen ? 12 : 7.5}
                    isRequire
                    label={t('Số Lượng bản sao')}
                  >
                    <InputForm formik={formik} name="SoLuongBanSao" type="number" placeholder={t('số lượng bản sao')} />
                  </FormControlComponent>
                </Grid>
              </Grid>
              <InputForm1
                isMulltiline
                isRequired
                xs={12}
                maxRows={5}
                minRows={3}
                formik={formik}
                name="LyDo"
                placeholder={t('phoivanbang.field.lydo')}
                label={t('phoivanbang.field.lydo')}
              />
            </Grid>

            <div style={{ borderBottom: '2px solid black', fontWeight: 'bold', marginTop: '30px' }}>
              <p>{t('thongtinnguoiyeucau')}</p>
            </div>
            <Grid container xs={12} spacing={2} mt={1}>
              <Grid item xs={12} container spacing={2}>
                <Grid item xs={12} sm={12} md={12} lg={6}>
                  <FormControlComponent
                    xsLabel={isSmallScreen ? 0 : 3}
                    xsForm={isSmallScreen ? 12 : 9}
                    isRequire
                    label={t('user.label.fullname')}
                  >
                    <InputForm formik={formik} name="HoTenNguoiYeuCau" type="text" placeholder={t('user.label.fullname')} />
                  </FormControlComponent>
                </Grid>
                <Grid item xs={12} sm={12} md={12} lg={6}>
                  <FormControlComponent
                    xsLabel={isSmallScreen ? 0 : 3}
                    xsForm={isSmallScreen ? 12 : 9}
                    isRequire
                    label={t('user.label.email')}
                  >
                    <InputForm formik={formik} name="EmailNguoiYeuCau" type="text" placeholder={t('user.label.email')} />
                  </FormControlComponent>
                </Grid>
              </Grid>
              <Grid item xs={12} container spacing={2}>
                <Grid item xs={6} sm={12} md={12} lg={6}>
                  <FormControlComponent
                    xsLabel={isSmallScreen ? 0 : 3}
                    xsForm={isSmallScreen ? 12 : 9}
                    isRequire
                    label={t('hocsinh.field.cccd')}
                  >
                    <InputForm formik={formik} name="CCCDNguoiYeuCau" type="text" placeholder={t('hocsinh.field.cccd')} />
                  </FormControlComponent>
                </Grid>
                <Grid item xs={6} sm={12} md={12} lg={6}>
                  <FormControlComponent
                    xsLabel={isSmallScreen ? 0 : 3.5}
                    xsForm={isSmallScreen ? 12 : 8.5}
                    isRequire
                    label={t('user.label.sdt')}
                  >
                    <InputForm formik={formik} name="SoDienThoaiNguoiYeuCau" type="text" placeholder={t('user.label.sdt')} />
                  </FormControlComponent>
                </Grid>
              </Grid>
              <Grid item xs={12} container>
                <Grid item xs={12} sm={12} md={12} lg={12}>
                  <FormControlComponent
                    xsLabel={isSmallScreen ? 0 : 1.5}
                    xsForm={isSmallScreen ? 12 : 10.5}
                    isRequire
                    label={t('user.label.address')}
                  >
                    <InputForm formik={formik} name="DiaChiNguoiYeuCau" type="text" placeholder={t('user.label.address')} />
                  </FormControlComponent>
                </Grid>
              </Grid>
            </Grid>
            <div style={{ borderBottom: '2px solid black', fontWeight: 'bold', marginTop: '30px' }}>
              <p>{t('thongtinnhanbang')}</p>
            </div>
            <Grid container spacing={2} mt={1}>
              <Grid item xs={12} sm={12} md={12} lg={6}>
                <FormControlComponent
                  xsLabel={isSmallScreen ? 0 : 4.5}
                  xsForm={isSmallScreen ? 12 : 7.5}
                  isRequire
                  label={t('user.label.methodrecevice')}
                >
                  <RadioGroup
                    style={{ display: 'flex', justifyContent: 'flex-start' }}
                    row
                    name="PhuongThucNhan"
                    value={formik.values.PhuongThucNhan ? formik.values.PhuongThucNhan : 0}
                    onChange={formik.handleChange}
                  >
                    <FormControlLabel value={0} style={{ marginTop: '-4px' }} control={<Radio />} label={t('tructiep')} />
                    <FormControlLabel value={1} style={{ marginTop: '-4px' }} control={<Radio />} label={t('dichvucong')} />
                  </RadioGroup>
                </FormControlComponent>
              </Grid>
              {formik.values.PhuongThucNhan && formik.values.PhuongThucNhan == 1 && (
                <Grid item xs={12} sm={12} md={12} lg={12}>
                  <FormControlComponent
                    xsLabel={isSmallScreen ? 0 : 2}
                    xsForm={isSmallScreen ? 12 : 10}
                    isRequire
                    label={t('user.label.addressrecevice')}
                  >
                    <InputForm formik={formik} name="DiaChiNhan" type="text" placeholder={t('user.label.addressrecevice')} />
                  </FormControlComponent>
                </Grid>
              )}
            </Grid>

            <div style={{ borderBottom: '2px solid black', fontWeight: 'bold', marginTop: '30px' }}>
              <p>
                {t('hosodinhkem')}
                <Button
                  color="secondary"
                  variant="outlined"
                  style={{ marginLeft: 3 }}
                  href={FileMau_YCCBS}
                  download="File_Mau"
                  target="_blank"
                  rel="noreferrer"
                  startIcon={<IconDownload />}
                >
                  {t('button.download')}
                </Button>
              </p>
            </div>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableCell style={{ width: '22.5%' }}>{t('tentep')}</TableCell>
                  <TableCell style={{ width: '55%' }}>{t('donyeucau.title.tenfile')}</TableCell>
                  <TableCell style={{ width: '22.5%' }}>{t('donyeucau.title.ghichu')}</TableCell>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell>{t('donxincapbang')}</TableCell>
                    <TableCell>
                      <Importfile name="DonYeuCau" formik={formik} nameFile="FileDonYeuCau" lable={t('button.upload')} />
                    </TableCell>
                    <TableCell>{t('ghichuguidon')}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>{t('yeucauCCCD')}</TableCell>
                    <TableCell>
                      <Importfile name="HinhAnhCCCD" formik={formik} nameFile="FileHinhAnhCCCD" lable={t('button.upload')} />
                    </TableCell>
                    <TableCell>{t('ghichuCCCD')}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
            <Grid item xs={12} container spacing={2} justifyContent="flex-end" mt={1}>
              <Grid item>
                <Button type="submit" color="info" variant="contained" size="medium">
                  <IconSend /> {t('button.senddon')}
                </Button>
              </Grid>
              <Grid item>
                <Button color="error" variant="contained" size="medium" onClick={() => navigate(-1)}>
                  <IconArrowLeft /> {t('button.back')}
                </Button>
              </Grid>
            </Grid>
          </form>
        </Container>
        <BackToTop />
      </div>
      {showAlertLogin && <Alert />}
    </div>
  );
};
export default CreateDonyeucau;
