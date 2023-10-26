import { Button, FormControl, FormControlLabel, Grid, Radio, RadioGroup, useMediaQuery } from '@mui/material';
import FormControlComponent from 'components/form/FormControlComponent ';
import InputForm from 'components/form/InputForm';
import InputForm1 from 'components/form/InputForm1';
import SelectList from 'components/form/SelectList';
import { useFormik } from 'formik';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
// import { getAllDonvi } from 'services/donvitruongService';
import { openPopupSelector, reloadDataSelector, userLoginSelector } from 'store/selectors';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import FormGroupButton from 'components/button/FormGroupButton';
import Importfile from 'components/form/ImportFile';
import { createDonyeucau } from 'services/capbangbansaoService';
import { setOpenPopup, setReloadData, showAlert } from 'store/actions';
import { convertJsonToFormData } from 'utils/convertJsonToFormData';
import { IconDownload } from '@tabler/icons';
import FileMau_YCCBS from '../FileMau/MauDonYCCapBanSao.docx';
import useDonyeucauValidationSchema from 'components/validations/donyeucauValidation';
import { getAllNamthi } from 'services/namthiService';
import { useTheme } from '@mui/system';
//import { getPhong } from 'services/congthongtinService';
import SelectForm from 'components/form/SelectForm';
import { getAllDanToc } from 'services/dantocService';
import { getAllTruong } from 'services/sharedService';
const AddDonyeucau = () => {
  const theme = useTheme();

  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  // const [uploadedFiles, setUploadedFiles] = useState([]);
  const [donvitruong, setDonvi] = useState([]);
  const [namthi, setNamthi] = useState([]);
  const [danToc, setDanToc] = useState([]);
  const user = useSelector(userLoginSelector);
  const openPopup = useSelector(openPopupSelector);
  const reloadData = useSelector(reloadDataSelector);
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const hocLucOptions = [
    { value: 'Giỏi', label: 'Giỏi' },
    { value: 'Khá', label: 'Khá' },
    { value: 'Trung bình', label: 'Trung bình' }
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
      NguoiThucHien: user.username,
      FileHinhAnhCCCD: '',
      FileDonYeuCau: '',
      DonYeuCau: '',
      HinhAnhCCCD: '',
      PhuongThucNhan: 0,
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
        const formData = await convertJsonToFormData(values);
        const addDonyeucau = await createDonyeucau(formData);

        if (addDonyeucau.isSuccess == false) {
          dispatch(showAlert(new Date().getTime().toString(), 'error', addDonyeucau.message.toString()));
        } else {
          dispatch(setOpenPopup(false));
          dispatch(setReloadData(true));
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
        const donViResponse = await getAllTruong(user.username);
        setDonvi(donViResponse.data);

        const dantoc = await getAllDanToc();
        setDanToc(dantoc.data);
        const namthiData = await getAllNamthi();
        setNamthi(namthiData.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [reloadData]);

  // useEffect(() => {
  //   const fetchData = async () => {
  //     const donvibyid = await getPhong();
  //     const dataphong = donvibyid.data;

  //     formik.setFieldValue('DiaChiNhan', dataphong.diaChi);
  //   };
  //   fetchData();
  // }, []);

  useEffect(() => {
    if (openPopup) {
      formik.resetForm();
    }
  }, [openPopup]);

  useEffect(() => {
    console.log(formik.values);
  });
  return (
    <form onSubmit={formik.handleSubmit}>
      <div style={{ borderBottom: '2px solid black', fontWeight: 'bold', paddingTop: 3 }}>
        <p>{t('thongtindangky')}</p>
      </div>
      <Grid container xs={12} spacing={1} mt={1}>
        <Grid item xs={12} container spacing={2}>
          <Grid item xs={isSmallScreen ? 12 : 6}>
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
          <Grid item xs={isSmallScreen ? 12 : 6}>
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
          <Grid item xs={6}>
            <FormControlComponent xsLabel={isSmallScreen ? 0 : 3} xsForm={isSmallScreen ? 12 : 9} isRequire label={t('dantoc')}>
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
          <Grid item xs={6}>
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
          <Grid item xs={isSmallScreen ? 12 : 6}>
            <FormControlComponent xsLabel={isSmallScreen ? 0 : 3} xsForm={isSmallScreen ? 12 : 9} isRequire label={t('user.label.gender')}>
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
          <Grid item xs={isSmallScreen ? 12 : 6}>
            <FormControlComponent xsLabel={isSmallScreen ? 0 : 3} xsForm={isSmallScreen ? 12 : 9} isRequire label={t('hocsinh.field.cccd')}>
              <InputForm formik={formik} name="CCCD" type="text" placeholder={t('hocsinh.field.cccd')} />
            </FormControlComponent>
          </Grid>
        </Grid>
        <Grid item xs={12} container spacing={2}>
          <Grid item xs={6}>
            <FormControlComponent xsLabel={isSmallScreen ? 0 : 3} xsForm={isSmallScreen ? 12 : 9} isRequire label={t('namthi.title')}>
              <SelectList
                data={namthi}
                name="IdNamThi"
                value="id"
                request={'id'}
                optionName="ten"
                placeholder={t('namthi.title')}
                formik={formik}
                openPopup
              />
            </FormControlComponent>
          </Grid>
          <Grid item xs={6}>
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
            </FormControlComponent>
          </Grid>
        </Grid>
        <Grid item xs={12} container spacing={2}>
          <Grid item xs={isSmallScreen ? 12 : 6}>
            <FormControlComponent xsLabel={isSmallScreen ? 0 : 3} xsForm={isSmallScreen ? 12 : 9} isRequire label={t('user.label.noisinh')}>
              <InputForm formik={formik} name="NoiSinh" type="text" placeholder={t('user.label.noisinh')} />
            </FormControlComponent>
          </Grid>
          <Grid item xs={isSmallScreen ? 12 : 6}>
            <FormControlComponent xsLabel={isSmallScreen ? 0 : 5} xsForm={isSmallScreen ? 12 : 7} isRequire label={t('Số Lượng bản sao')}>
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
          <Grid item xs={isSmallScreen ? 12 : 6}>
            <FormControlComponent
              xsLabel={isSmallScreen ? 0 : 3}
              xsForm={isSmallScreen ? 12 : 9}
              isRequire
              label={t('user.label.fullname')}
            >
              <InputForm formik={formik} name="HoTenNguoiYeuCau" type="text" placeholder={t('user.label.fullname')} />
            </FormControlComponent>
          </Grid>
          <Grid item xs={isSmallScreen ? 12 : 6}>
            <FormControlComponent xsLabel={isSmallScreen ? 0 : 3} xsForm={isSmallScreen ? 12 : 9} isRequire label={t('user.label.email')}>
              <InputForm formik={formik} name="EmailNguoiYeuCau" type="text" placeholder={t('user.label.email')} />
            </FormControlComponent>
          </Grid>
        </Grid>
        <Grid item xs={12} container spacing={2}>
          <Grid item xs={6}>
            <FormControlComponent xsLabel={isSmallScreen ? 0 : 3} xsForm={isSmallScreen ? 12 : 9} isRequire label={t('hocsinh.field.cccd')}>
              <InputForm formik={formik} name="CCCDNguoiYeuCau" type="text" placeholder={t('hocsinh.field.cccd')} />
            </FormControlComponent>
          </Grid>
          <Grid item xs={6}>
            <FormControlComponent xsLabel={isSmallScreen ? 0 : 3.5} xsForm={isSmallScreen ? 12 : 8.5} isRequire label={t('user.label.sdt')}>
              <InputForm formik={formik} name="SoDienThoaiNguoiYeuCau" type="text" placeholder={t('user.label.sdt')} />
            </FormControlComponent>
          </Grid>
        </Grid>
        <Grid item xs={12} container>
          <Grid item xs={isSmallScreen ? 12 : 6}>
            <FormControlComponent xsLabel={isSmallScreen ? 0 : 3} xsForm={isSmallScreen ? 12 : 9} isRequire label={t('user.label.address')}>
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
              value={formik.values.PhuongThucNhan ? formik.values.PhuongThucNhan : '0'}
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
            href={FileMau_YCCBS}
            download="File_Mau"
            style={{ marginLeft: 3 }}
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
            <TableCell style={{ width: '30%' }}>{t('tentep')}</TableCell>
            <TableCell style={{ width: '50%' }}>{t('donyeucau.title.tenfile')}</TableCell>
            <TableCell style={{ width: '20%' }}>{t('donyeucau.title.ghichu')}</TableCell>
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
      <FormGroupButton />
    </form>
  );
};
export default AddDonyeucau;
