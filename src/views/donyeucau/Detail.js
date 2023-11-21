import { Button, FormControlLabel, Grid, Radio, RadioGroup, Tooltip, useMediaQuery } from '@mui/material';
import FormControlComponent from 'components/form/FormControlComponent ';
import InputForm from 'components/form/InputForm';
import InputForm1 from 'components/form/InputForm1';
import SelectList from 'components/form/SelectList';
import { useFormik } from 'formik';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { reloadDataSelector, userLoginSelector, capBangBansaoSelector, openPopupSelector, openSubPopupSelector } from 'store/selectors';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import ExitButton from 'components/button/ExitButton';
import { createDonyeucau, getDonyeucauById } from 'services/capbangbansaoService';
import { setOpenPopup, setOpenSubPopup, setReloadData, showAlert } from 'store/actions';
import { convertJsonToFormData } from 'utils/convertJsonToFormData';
import { getAllDonvi } from 'services/donvitruongService';
import { convertFormattedDateToISODate, convertISODateToFormattedDate } from 'utils/formatDate';
import config from 'config';
import AnimateButton from 'components/extended/AnimateButton';
import { IconCheck, IconCircleOff } from '@tabler/icons';
import Popup from 'components/controls/popup';
import Duyet from './Duyet';
import Tuchoi from './Tuchoi';
import { getAllNamthi } from 'services/namthiService';
import ButtonSuccess from 'components/buttoncolor/ButtonSuccess';
import { useTheme } from '@emotion/react';

const Detail = () => {
  const theme = useTheme();

  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const openPopup = useSelector(openPopupSelector);
  const openSubPopup = useSelector(openSubPopupSelector);
  const [title, setTitle] = useState('');
  const [form, setForm] = useState('');
  const [trangThai, setTrangThai] = useState('');
  const [donvitruong, setDonvi] = useState([]);
  const [namthi, setNamthi] = useState([]);
  const [urlFileDonhuy, setUrlFileDonhuy] = useState('');
  const [urlFileCccd, setUrlFileCccd] = useState('');
  const banSao = useSelector(capBangBansaoSelector);
  const user = useSelector(userLoginSelector);
  const reloadData = useSelector(reloadDataSelector);
  const { t } = useTranslation();
  const dispatch = useDispatch();
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
      LoaiTotNghiep: '',
      SoLuongBanSao: 0,
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
    //validationSchema: donviValidationSchema,
    onSubmit: async (values) => {
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
        console.error('Error updating d0nyeucau:', error);
        dispatch(showAlert(new Date().getTime().toString(), 'error', error.toString()));
      }
    }
  });

  useEffect(() => {
    const fetchData = async () => {
      const Donyeucau = await getDonyeucauById(banSao.id);
      const DataDonyeucau = Donyeucau.data;
      const donViResponse = await getAllDonvi();
      setDonvi(donViResponse.data);
      const namthiData = await getAllNamthi();
      setNamthi(namthiData.data);
      const NgaySinh = convertISODateToFormattedDate(DataDonyeucau.hocSinh.ngaySinh);
      if (banSao) {
        formik.setValues({
          IdTruong: DataDonyeucau.idTruong,
          IdNamThi: DataDonyeucau.idNamThi,
          HoTen: DataDonyeucau.hocSinh.hoTen,
          GioiTinh: DataDonyeucau.hocSinh.gioiTinh,
          CCCD: DataDonyeucau.hocSinh.cccd,
          DanToc: DataDonyeucau.hocSinh.danToc,
          NgaySinh: convertFormattedDateToISODate(NgaySinh),
          NoiSinh: DataDonyeucau.hocSinh.noiSinh,
          LoaiTotNghiep: DataDonyeucau.hocSinh.xepLoai,
          SoLuongBanSao: DataDonyeucau.soLuongBanSao,
          HoTenNguoiYeuCau: DataDonyeucau.thongTinNguoiYeuCau.hoTenNguoiYeuCau,
          EmailNguoiYeuCau: DataDonyeucau.thongTinNguoiYeuCau.emailNguoiYeuCau,
          CCCDNguoiYeuCau: DataDonyeucau.thongTinNguoiYeuCau.cccdNguoiYeuCau,
          SoDienThoaiNguoiYeuCau: DataDonyeucau.thongTinNguoiYeuCau.soDienThoaiNguoiYeuCau,
          DiaChiNguoiYeuCau: DataDonyeucau.thongTinNguoiYeuCau.diaChiNguoiYeuCau,
          LyDo: DataDonyeucau.lyDo,
          NguoiThucHien: user.username,
          DonYeuCau: DataDonyeucau.donYeuCau,
          HinhAnhCCCD: DataDonyeucau.hinhAnhCCCD,
          PhuongThucNhan: DataDonyeucau.phuongThucNhan,
          DiaChiNhan: DataDonyeucau.diaChiNhan
        });

        setTrangThai(DataDonyeucau.trangThai);
      }
      dispatch(setReloadData(false));
      if (DataDonyeucau.donYeuCau && DataDonyeucau.hinhAnhCCCD) {
        setUrlFileDonhuy(config.urlFile + 'DonYeuCau/' + DataDonyeucau.donYeuCau);
        setUrlFileCccd(config.urlFile + 'CCCD/' + DataDonyeucau.hinhAnhCCCD);
      } else {
        setUrlFileDonhuy('');
        setUrlFileCccd('');
        // If no avatar value, reset the urlImage state to an empty string
      }
    };
    if (openPopup) {
      fetchData();
    }
  }, [banSao, openPopup, reloadData]);

  const handleDuyet = () => {
    setTitle(t('donyeucau.duyet'));
    setForm('duyet');
    dispatch(setOpenSubPopup(true));
  };

  const handleTuchoi = () => {
    setTitle(t('donyeucau.tuchoi'));
    setForm('tuchoi');
    dispatch(setOpenSubPopup(true));
  };

  return (
    <form onSubmit={formik.handleSubmit}>
      <div style={{ borderBottom: '2px solid black', fontWeight: 'bold' }}>
        <p>THÔNG TIN ĐĂNG KÝ</p>
      </div>
      <Grid container spacing={2} mt={1}>
        <Grid item xs={12} container spacing={2}>
          <Grid item xs={12} container>
            <Grid item xs={6}>
              <FormControlComponent xsLabel={3} xsForm={8.5} isRequire label={t('Tên trường')}>
                <SelectList
                  data={donvitruong}
                  name="IdTruong"
                  value="id"
                  request={'id'}
                  optionName="ten"
                  placeholder={t('donvitruong.field.tentruongtotnghiep')}
                  formik={formik}
                  isDisables
                  openPopup
                />
              </FormControlComponent>
            </Grid>
            <Grid item xs={6}>
              <FormControlComponent xsLabel={3} xsForm={8.5} isRequire label={t('namthi.title')}>
                <SelectList
                  data={namthi}
                  name="IdNamThi"
                  value="id"
                  request={'id'}
                  optionName="ten"
                  placeholder={t('namthi.title')}
                  formik={formik}
                  openPopup
                  isDisables
                />
              </FormControlComponent>
            </Grid>
          </Grid>
          <Grid item xs={12} container>
            <Grid item xs={6}>
              <FormControlComponent xsLabel={3} xsForm={8.5} isRequire label={t('user.label.fullname')}>
                <InputForm formik={formik} name="HoTen" type="text" placeholder={t('user.label.fullname')} isDisabled />
              </FormControlComponent>
            </Grid>
            <Grid item xs={6}>
              <FormControlComponent xsLabel={3} xsForm={8.5} isRequire label={t('user.label.birthday')}>
                <InputForm formik={formik} name="NgaySinh" type="date" placeholder={t('user.label.birthday')} isDisabled />
              </FormControlComponent>
            </Grid>
          </Grid>
          <Grid item xs={12} container>
            <Grid item xs={6}>
              <FormControlComponent xsLabel={3} xsForm={8.5} isRequire label={t('user.label.gender')}>
                <RadioGroup
                  style={{ display: 'flex', justifyContent: 'flex-start' }}
                  row
                  name="GioiTinh"
                  value={formik.values.GioiTinh ? formik.values.GioiTinh : 'true'}
                  onChange={formik.handleChange}
                >
                  <FormControlLabel value={true} control={<Radio />} label={t('gender.male')} disabled />
                  <FormControlLabel value={false} control={<Radio />} label={t('gender.female')} disabled />
                </RadioGroup>
              </FormControlComponent>
            </Grid>
            <Grid item xs={6}>
              <FormControlComponent xsLabel={3} xsForm={8.5} isRequire label={t('user.label.noisinh')}>
                <InputForm formik={formik} name="NoiSinh" type="text" placeholder={t('user.label.noisinh')} isDisabled />
              </FormControlComponent>
            </Grid>
          </Grid>
          <Grid item xs={12} container>
            <Grid item xs={6}>
              <FormControlComponent xsLabel={3} xsForm={8.5} isRequire label={t('hocsinh.field.cccd')}>
                <InputForm formik={formik} name="CCCD" type="text" placeholder={t('hocsinh.field.cccd')} isDisabled />
              </FormControlComponent>
            </Grid>
            <Grid item xs={6}>
              <FormControlComponent xsLabel={3} xsForm={8.5} isRequire label={t('Xếp loại')}>
                <InputForm formik={formik} name="LoaiTotNghiep" type="text" placeholder={t('loaitotnghiep')} isDisabled />
              </FormControlComponent>
            </Grid>
          </Grid>
          <Grid item xs={12} container>
            <Grid item xs={6}>
              <FormControlComponent xsLabel={3} xsForm={8.5} isRequire label={t('dantoc')}>
                <InputForm formik={formik} name="DanToc" type="text" placeholder={t('dantoc')} isDisabled />
              </FormControlComponent>
            </Grid>
            <Grid item xs={6}>
              <FormControlComponent xsLabel={4.5} xsForm={6.9} isRequire label={t('Số Lượng bản sao')}>
                <InputForm formik={formik} name="SoLuongBanSao" type="number" placeholder={t('số lượng bản sao')} isDisabled />
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
            isDisabled
          />
        </Grid>
      </Grid>
      <div style={{ borderBottom: '2px solid black', fontWeight: 'bold', marginTop: '30px' }}>
        <p>THÔNG TIN NGƯỜI YÊU CẦU</p>
      </div>
      <Grid container spacing={2} mt={1}>
        <Grid item xs={12} container>
          <Grid item xs={6}>
            <FormControlComponent xsLabel={3} xsForm={8.5} isRequire label={t('user.label.fullname')}>
              <InputForm formik={formik} name="HoTenNguoiYeuCau" type="text" placeholder={t('user.label.fullname')} isDisabled />
            </FormControlComponent>
          </Grid>
          <Grid item xs={6}>
            <FormControlComponent xsLabel={3} xsForm={8.5} isRequire label={t('user.label.sdt')}>
              <InputForm formik={formik} name="SoDienThoaiNguoiYeuCau" type="text" placeholder={t('user.label.sdt')} isDisabled />
            </FormControlComponent>
          </Grid>
        </Grid>
        <Grid item xs={12} container>
          <Grid item xs={6}>
            <FormControlComponent xsLabel={3} xsForm={8.5} isRequire label={t('user.label.email')}>
              <InputForm formik={formik} name="EmailNguoiYeuCau" type="text" placeholder={t('user.label.email')} isDisabled />
            </FormControlComponent>
          </Grid>
          <Grid item xs={6}>
            <FormControlComponent xsLabel={3} xsForm={8.3} isRequire label={t('hocsinh.field.cccd')}>
              <InputForm formik={formik} name="CCCDNguoiYeuCau" type="text" placeholder={t('hocsinh.field.cccd')} isDisabled />
            </FormControlComponent>
          </Grid>
        </Grid>
        <Grid item xs={12} container>
          <Grid item xs={6}>
            <FormControlComponent xsLabel={3} xsForm={8.5} isRequire label={t('user.label.address')}>
              <InputForm formik={formik} name="DiaChiNguoiYeuCau" type="text" placeholder={t('user.label.address')} isDisabled />
            </FormControlComponent>
          </Grid>
          <Grid item xs={6}></Grid>
        </Grid>
      </Grid>
      <Grid container item xs={6} spacing={2} mt={1}></Grid>
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
              <FormControlLabel value={0} style={{ marginTop: '-4px' }} control={<Radio />} label={t('tructiep')} disabled />
              <FormControlLabel value={1} style={{ marginTop: '-4px' }} control={<Radio />} label={t('dichvucong')} disabled />
            </RadioGroup>
          </FormControlComponent>
        </Grid>
        {formik.values.PhuongThucNhan && formik.values.PhuongThucNhan == 1 ? (
          <Grid item xs={12} sm={12} md={12} lg={12}>
            <FormControlComponent
              xsLabel={isSmallScreen ? 0 : 2}
              xsForm={isSmallScreen ? 12 : 10}
              isRequire
              label={t('user.label.addressrecevice')}
            >
              <InputForm formik={formik} name="DiaChiNhan" type="text" placeholder={t('user.label.addressrecevice')} isDisabled />
            </FormControlComponent>
          </Grid>
        ) : (
          ''
        )}
      </Grid>
      <div style={{ borderBottom: '2px solid black', fontWeight: 'bold', marginTop: '30px' }}>
        <p>HỒ SƠ ĐÍNH KÈM</p>
      </div>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableCell style={{ width: '30%' }}>Tên</TableCell>
            <TableCell style={{ width: '50%' }}>File đính kèm</TableCell>
            <TableCell style={{ width: '20%' }}>Ghi chú</TableCell>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell>Đơn xin cấp bản sao bằng tốt nghiệp có chữ ký công dân</TableCell>
              <TableCell>
                {/* File input element */}
                <a href={urlFileDonhuy}>{formik.values.DonYeuCau}</a>
              </TableCell>
              <TableCell>Gửi bản chính, dạng .docx</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>CMND/CCCD/Hộ chiếu giấy tờ tùy thân có ảnh của người được cấp bằng</TableCell>
              <TableCell>
                {/* File input element */}
                <a href={urlFileCccd} download={urlFileCccd}>
                  {formik.values.HinhAnhCCCD}
                </a>
              </TableCell>
              <TableCell>Bản sao chứng thực .png, .jpg</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
      <Grid item xs={12} container spacing={2} justifyContent="flex-end" mt={1}>
        {trangThai === 0 && (
          <>
            <Grid item>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12}>
                  <AnimateButton>
                    <Tooltip title={t('button.tuchoi')} placement="bottom">
                      <Button color="orange" variant="contained" size="medium" onClick={handleTuchoi}>
                        <IconCircleOff /> {t('button.tuchoi')}
                      </Button>
                    </Tooltip>
                  </AnimateButton>
                </Grid>
              </Grid>
            </Grid>
            <Grid item>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12}>
                  <ButtonSuccess onClick={handleDuyet} title={t('button.duyet')} icon={IconCheck} />
                </Grid>
              </Grid>
            </Grid>
          </>
        )}

        <Grid item>
          <ExitButton />
        </Grid>
      </Grid>
      {form !== '' && (
        <Popup
          title={title}
          form={form}
          openPopup={openSubPopup}
          type="subpopup"
          maxWidth={'sm'}
          bgcolor={form === 'duyet' ? '	#2196F3' : '#F44336'}
        >
          {form === 'duyet' ? <Duyet /> : <Tuchoi />}
        </Popup>
      )}
    </form>
  );
};
export default Detail;
