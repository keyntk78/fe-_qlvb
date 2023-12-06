import React from 'react';
import {
  Button,
  Checkbox,
  Divider,
  FormControl,
  FormControlLabel,
  Grid,
  IconButton,
  InputAdornment,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  Tooltip,
  Typography,
  styled,
  useMediaQuery
} from '@mui/material';
import { useFormik } from 'formik';
import { selectedPhoigoc, setOpenSubPopup, setReloadData } from 'store/actions';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import {
  openPopupSelector,
  openSubPopupSelector,
  selectedDanhmucSelector,
  selectedDonvitruongSelector,
  selectedHocsinhSelector,
  userLoginSelector
} from 'store/selectors';
import { useEffect } from 'react';
import FormControlComponent from 'components/form/FormControlComponent ';
import { IconBook2, IconCertificate, IconPrinter, IconUser } from '@tabler/icons';
import { useState } from 'react';
import { getAllDonvi } from 'services/donvitruongService';
import InputForm1 from 'components/form/InputForm1';
import { getAllMonthi } from 'services/monthiService';
import { getAllHedaotao } from 'services/hedaotaoService';
import { getAllHinhthucdaotao } from 'services/hinhthucdaotaoService';
import { getAllKhoathi } from 'services/khoathiService';
import InputForm from 'components/form/InputForm';
import ExitButton from 'components/button/ExitButton';
import AnimateButton from 'components/extended/AnimateButton';
import Popup from 'components/controls/popup';
import { getPhoiDangSuDung } from 'services/phoigocService';
import InThu from './InThu';
import { getHocSinhDuaVaoSoGoc } from 'services/capbangbanchinhService';
import InBangTungNguoi from './InBangTungNguoi';
import SelectForm from 'components/form/SelectForm';
import ButtonSuccess from 'components/buttoncolor/ButtonSuccess';
import { convertDateTimeToDate } from 'utils/formatDate';
import { getAllDanhmucTN } from 'services/sharedService';
import { getHocSinhByCCCD } from 'services/hocsinhService';

const hocLucOptions = [
  { value: 'Giỏi', label: 'Giỏi' },
  { value: 'Khá', label: 'Khá' },
  { value: 'Trung Bình', label: 'Trung Bình' },
  { value: 'Yếu', label: 'Yếu' },
  { value: 'Kém', label: 'Kém' }
];

const ketQuaOptions = [
  { value: 'x', label: 'Đạt' },
  { value: 'o', label: 'Không đạt' }
];

const hanhKiemOptions = [
  { value: 'Tốt', label: 'Tốt' },
  { value: 'Khá', label: 'Khá' },
  { value: 'Trung Bình', label: 'Trung bình' },
  { value: 'Yếu', label: 'Yếu' }
];

const CustomSelect = styled(Select)({
  '& .MuiSelect-select': {
    backgroundColor: 'white'
  },
  '& .MuiSelect-select.Mui-disabled': {
    backgroundColor: '#ededed',
    color: 'black'
  },
  '&.MuiOutlinedInput-root.Mui-disabled .MuiOutlinedInput-notchedOutline': {
    borderColor: '#ededed'
  }
});

const Detail = ({ type }) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const danhmuc = useSelector(selectedDanhmucSelector);
  const donvi = useSelector(selectedDonvitruongSelector);
  const isXs = useMediaQuery('(max-width:600px)');
  const openPopup = useSelector(openPopupSelector);
  const user = useSelector(userLoginSelector);
  const selectedHocSinh = useSelector(selectedHocsinhSelector);
  const [danhMuc, setDanhMuc] = useState([]);
  const [donVi, setDonVi] = useState([]);
  const [monThi, setMonThi] = useState([]);
  const [heDaoTao, setHeDaoTao] = useState([]);
  const [htdt, setHTDT] = useState([]);
  const [khoaThi, setKhoaThi] = useState([]);
  const [title, setTitle] = useState('');
  const [form, setForm] = useState('');
  const [hsSoGoc, setHsSoGoc] = useState([]);
  const openSubPopup = useSelector(openSubPopupSelector);
  const [selectedMonHocs, setSelectedMonHocs] = useState(['', '', '', '', '', '']);
  const formik = useFormik({
    initialValues: {
      ho: '',
      ten: '',
      hoTen: '',
      cccd: '',
      ngaySinh: '',
      noiSinh: '',
      diaChi: '',
      lop: '',
      gioiTinh: true,
      danToc: '',
      hanhKiem: '',
      hocLuc: '',
      soHieu: '',
      soVaoSo: '',
      khoaThi: '',
      ghiChu: '',
      idDanhMucTotNghiep: '',
      xepLoai: '',
      ketQua: '',
      idTruong: '',
      heDaoTao: '',
      hinhThucDaoTao: '',
      nguoiThucHien: user.username,
      ketQuaHocTaps: [],
      diemTB: '',
      lanDauTotNghiep: 'x',
      dienXTN: '',
      hoiDong: '',
      noiCap: '',
      nguoiKy: '',
      ngayCapBang: '',
      trangThai: ''
    }
  });

  useEffect(() => {
    const fetchData = async () => {
      const userbyid = await getHocSinhByCCCD(selectedHocSinh.cccd);
      const datauser = userbyid.data;
      if (type == 'phong') {
        if (datauser && datauser.trangThai && donvi && danhmuc && (datauser.trangThai == 3 || datauser.trangThai == 4)) {
          const hocsinhSoGocid = await getHocSinhDuaVaoSoGoc(donvi.id, danhmuc.id, selectedHocSinh.id);
          setHsSoGoc(hocsinhSoGocid.data);
          const phoidata = await getPhoiDangSuDung(donvi.id);
          dispatch(selectedPhoigoc(phoidata.data));
        }
      }

      formik.setValues({
        ho: datauser.ho || '',
        ten: datauser.ten || '',
        hoTen: datauser.hoTen || '',
        cccd: datauser.cccd || '',
        ngaySinh: datauser.ngaySinh || '',
        noiSinh: datauser.noiSinh || '',
        diaChi: datauser.diaChi || '',
        lop: datauser.lop || '',
        gioiTinh: datauser.gioiTinh || '',
        danToc: datauser.danToc || '',
        hanhKiem: datauser.hanhKiem || '',
        hocLuc: datauser.hocLuc || '',
        soHieu: datauser.soHieuVanBang || '',
        soVaoSo: datauser.soVaoSoCapBang || '',
        khoaThi: datauser.idKhoaThi || '',
        ghiChu: datauser.ghiChu || '',
        idDanhMucTotNghiep: datauser.idDanhMucTotNghiep || '',
        xepLoai: datauser.xepLoai || '',
        ketQua: datauser.ketQua || '',
        idTruong: datauser.idTruong || '',
        heDaoTao: datauser.truong.maHeDaoTao || '',
        hinhThucDaoTao: datauser.truong.maHinhThucDaoTao || '',
        nguoiThucHien: user.username || '',
        ketQuaHocTaps: datauser.ketQuaHocTaps || [],
        diemTB: datauser.diemTB || '',
        lanDauTotNghiep: datauser.lanDauTotNghiep || '',
        dienXTN: datauser.dienXTN || '',
        hoiDong: datauser.hoiDong || '',
        noiCap: datauser.soGoc.diaPhuongCapBang || '',
        nguoiKy: datauser.soGoc.nguoiKyBang || '',
        ngayCapBang: convertDateTimeToDate(datauser.danhMucTotNghiep.ngayCapBang) || '',
        trangThai: datauser.trangThai || ''
      });
      dispatch(setReloadData(false));
    };
    if (openPopup) {
      fetchData();
    }
  }, [selectedHocSinh, openPopup]);

  useEffect(() => {
    const fetchDataDL = async () => {
      // Đợi 2 giây trước khi bắt đầu cuộc gọi API
      setTimeout(async () => {
        const monthi = await getAllMonthi();
        setMonThi(monthi.data);
        const donvi = await getAllDonvi();
        setDonVi(donvi.data);
        const danhmuc = await getAllDanhmucTN(user ? user.username : '');
        setDanhMuc(danhmuc.data);
        const hedaotao = await getAllHedaotao();
        setHeDaoTao(hedaotao.data);
        const htdt = await getAllHinhthucdaotao();
        setHTDT(htdt.data);
        const khoathi = await getAllKhoathi();
        setKhoaThi(khoathi.data);
      }, 2000); // Đợi 2 giây trước khi thực hiện các cuộc gọi API
    };
    fetchDataDL();
  }, []);

  const handleSelectChange = (event, index) => {
    const selectedValue = event.target.value;
    if (selectedValue !== '') {
      const newSelectedMonHocs = [...selectedMonHocs];
      newSelectedMonHocs[index] = selectedValue;
      setSelectedMonHocs(newSelectedMonHocs);
    }
  };

  const handlePreview = () => {
    setTitle(t('In thử'));
    setForm('inbang');
    dispatch(setOpenSubPopup(true));
  };
  const handleInTungNguoi = () => {
    setTitle(t('In'));
    setForm('intungnguoi');
    dispatch(setOpenSubPopup(true));
  };
  const getRemainingOptions = (index) => {
    return monThi.filter((option) => !selectedMonHocs.includes(option.ma) || option.ma === selectedMonHocs[index]);
  };

  const handleRemoveSelection = (index) => {
    const newSelectedMonHocs = [...selectedMonHocs];
    newSelectedMonHocs[index] = '';
    setSelectedMonHocs(newSelectedMonHocs);
    formik.setFieldValue(`diem${index + 1}`, '');
  };

  const diems = selectedMonHocs.map((_, index) => formik.values[`diem${index + 1}`]);

  useEffect(() => {
    const newData = selectedMonHocs
      .map((maMon, index) => ({
        maMon,
        diem: formik.values[`diem${index + 1}`]
      }))
      .filter((subject) => subject.maMon !== '' && subject.diem !== undefined);

    formik.setFieldValue('ketQuaHocTaps', newData);
  }, [...diems]);
  return (
    <form onSubmit={formik.handleSubmit}>
      <Grid container>
        <Grid xs={12} item container spacing={isXs ? 1 : 2} mt={0}>
          <Grid item xs={6}>
            <FormControlComponent xsLabel={0} xsForm={12} label={t('danhmuc.title')}>
              <FormControl fullWidth variant="outlined">
                <SelectForm
                  keyProp="id"
                  valueProp="tieuDe"
                  item={danhMuc}
                  name="truonidDanhMucTotNghiepgId"
                  value={formik.values.idDanhMucTotNghiep}
                  disabled
                />
              </FormControl>
            </FormControlComponent>
          </Grid>
        </Grid>
        <Grid item container spacing={isXs ? 0 : 1} xs={12} mt={2} alignItems={'center'}>
          <Grid item>
            <IconUser />
          </Grid>
          <Grid item>
            <Typography variant="h4">{t('user.profile')}</Typography>
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <Divider />
        </Grid>
        <Grid xs={12} item container spacing={isXs ? 0 : 2} mt={0}>
          <InputForm1 formik={formik} xs={isXs ? 12 : 6} label={t('hocsinh.field.fullname')} name="hoTen" isDisabled />
          <InputForm1 formik={formik} xs={isXs ? 6 : 3} label={t('hocsinh.field.cccd')} name="cccd" isDisabled />
          <Grid item xs={isXs ? 6 : 3}>
            <FormControlComponent xsLabel={0} xsForm={12} label={t('user.label.gender')}>
              <FormControl fullWidth variant="outlined">
                <RadioGroup name="gioiTinh" value={formik.values.gioiTinh ? 'male' : 'female'} onBlur={formik.handleBlur}>
                  <Grid container>
                    <FormControlLabel size="small" value="male" control={<Radio size="small" />} label={t('gender.male')} />
                    <FormControlLabel size="small" value="female" control={<Radio size="small" />} label={t('gender.female')} />
                  </Grid>
                </RadioGroup>
              </FormControl>
            </FormControlComponent>
          </Grid>
        </Grid>
        <Grid xs={12} item container spacing={isXs ? 0 : 2}>
          <InputForm1 formik={formik} xs={isXs ? 12 : 6} label={'Nơi sinh'} name="noiSinh" isDisabled />
          <Grid item xs={isXs ? 6 : 3}>
            <FormControlComponent xsLabel={0} xsForm={12} label={t('user.label.birthday')}>
              <InputForm
                isDisabled
                formik={formik}
                name="ngaySinh"
                type="date"
                value={formik.values.ngaySinh ? convertDateTimeToDate(formik.values.ngaySinh) : ''}
              />
            </FormControlComponent>
          </Grid>
          <InputForm1 formik={formik} xs={isXs ? 6 : 3} label={t('hocsinh.field.nation')} name="danToc" isDisabled />
        </Grid>
        <Grid xs={12} item container spacing={2}>
          <InputForm1 formik={formik} xs={isXs ? 12 : 6} label={'Địa chỉ'} name="diaChi" isDisabled />
        </Grid>
        <Grid item container spacing={1} xs={12} mt={4} alignItems={'center'}>
          <Grid item>
            <IconBook2 />
          </Grid>
          <Grid item>
            <Typography variant="h4">{t('hocsinh.studyinfo')}</Typography>
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <Divider />
        </Grid>
        <Grid xs={12} item container spacing={2} mt={0}>
          <Grid item xs={isXs ? 12 : 6}>
            <FormControlComponent xsLabel={0} xsForm={12} label={t('donvitruong.title')}>
              <FormControl fullWidth variant="outlined">
                <SelectForm keyProp="id" valueProp="ten" item={donVi} name="idTruong" value={formik.values.idTruong} disabled />
              </FormControl>
            </FormControlComponent>
          </Grid>
          <InputForm1 formik={formik} xs={isXs ? 6 : 3} label={t('Lớp')} name="lop" isDisabled />
          <InputForm1 formik={formik} xs={isXs ? 6 : 3} label={t('Hội đồng thi')} name="hoiDong" isDisabled />
        </Grid>
        <Grid xs={12} item container spacing={2}>
          {formik.values.ketQuaHocTaps.map((ketQua, index) => (
            <React.Fragment key={index}>
              <Grid item xs={3}>
                <FormControlComponent xsLabel={0} xsForm={12} label={`${t('subject')} ${index + 1}`}>
                  <FormControl fullWidth>
                    <CustomSelect
                      disabled
                      size="small"
                      name={`maMon${index + 1}`}
                      value={ketQua.maMon}
                      onChange={(event) => handleSelectChange(event, index)}
                      endAdornment={
                        ketQua.maMon !== '' && (
                          <InputAdornment position="end">
                            <IconButton
                              disabled
                              onClick={() => handleRemoveSelection(index)}
                              size="small"
                              sx={{ marginRight: '10px', color: 'gray' }}
                            ></IconButton>
                          </InputAdornment>
                        )
                      }
                    >
                      {getRemainingOptions(index).map((option) => (
                        <MenuItem key={option.id} value={option.ma}>
                          {option.ten}
                        </MenuItem>
                      ))}
                    </CustomSelect>
                  </FormControl>
                </FormControlComponent>
              </Grid>
              <Grid item xs={3}>
                <InputForm1
                  formik={formik}
                  xs={12}
                  label={`${t('point')} ${index + 1}`}
                  name={`diem${index + 1}`}
                  isDisabled
                  type="number"
                  value={ketQua.diem.toString()}
                />
              </Grid>
            </React.Fragment>
          ))}
        </Grid>
        <Grid xs={12} item container spacing={isXs ? 0 : 2} mt={0} columnSpacing={isXs ? 1 : 0}>
          <Grid item xs={isXs ? 6 : 3}>
            <FormControlComponent xsLabel={0} xsForm={12} label={t('hocsinh.label.hanhkiem')} isRequire>
              <FormControl fullWidth variant="outlined">
                <SelectForm
                  formik={formik}
                  keyProp="value"
                  valueProp="label"
                  item={hanhKiemOptions}
                  name="hanhKiem"
                  value={formik.values.hanhKiem}
                  disabled
                />
              </FormControl>
            </FormControlComponent>
          </Grid>
          <Grid item xs={isXs ? 6 : 3}>
            <InputForm1 formik={formik} xs={12} label={t('Điểm trung bình')} name="diemTB" isRequired isDisabled />
          </Grid>
          <Grid item xs={isXs ? 6 : 3}>
            <InputForm1 formik={formik} xs={12} label={t('Diện xét tốt nghiệp')} name="dienXTN" isDisabled />
          </Grid>
          <Grid item xs={isXs ? 6 : 3} sx={{ display: 'flex', alignItems: 'flex-end' }}>
            <FormControlLabel
              control={<Checkbox checked={formik.values.lanDauTotNghiep === 'x'} />}
              label="Lần đầu xét tốt nghiệp"
              disabled
            />
          </Grid>
        </Grid>
        <Grid xs={12} item container spacing={isXs ? 0 : 2} mt={0} columnSpacing={isXs ? 1 : 0}>
          <Grid item xs={isXs ? 6 : 4}>
            <FormControlComponent xsLabel={0} xsForm={12} label={t('hocsinh.label.hocluc')}>
              <FormControl fullWidth variant="outlined">
                <SelectForm
                  formik={formik}
                  keyProp="value"
                  valueProp="label"
                  item={hocLucOptions}
                  name="hocLuc"
                  value={formik.values.hocLuc}
                  disabled
                />
              </FormControl>
            </FormControlComponent>
          </Grid>
          <Grid item xs={isXs ? 6 : 4}>
            <FormControlComponent xsLabel={0} xsForm={12} label={t('Kết quả tốt nghiệp')}>
              <FormControl fullWidth variant="outlined">
                <SelectForm
                  formik={formik}
                  keyProp="value"
                  valueProp="label"
                  item={ketQuaOptions}
                  name="ketQua"
                  value={formik.values.ketQua ? formik.values.ketQua : 'o'}
                  disabled
                />
              </FormControl>
            </FormControlComponent>
          </Grid>
          <Grid item xs={isXs ? 6 : 4}>
            <FormControlComponent xsLabel={0} xsForm={12} label={t('Xếp loại tốt nghiệp')}>
              <FormControl fullWidth variant="outlined">
                <SelectForm
                  formik={formik}
                  keyProp="value"
                  valueProp="label"
                  item={hocLucOptions}
                  name="xepLoai"
                  value={formik.values.xepLoai}
                  disabled
                />
              </FormControl>
            </FormControlComponent>
          </Grid>
        </Grid>
        <Grid item container spacing={1} xs={12} mt={4} alignItems={'center'}>
          <Grid item>
            <IconCertificate />
          </Grid>
          <Grid item>
            <Typography variant="h4">{t('hocsinh.degreeinfo')}</Typography>
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <Divider />
        </Grid>
        <Grid xs={12} item container spacing={2} mt={0}>
          <Grid item xs={isXs ? 12 : 6}>
            <FormControlComponent xsLabel={0} xsForm={12} label={t('hedaotao.title')}>
              <FormControl fullWidth variant="outlined">
                <SelectForm keyProp="ma" valueProp="ten" item={heDaoTao} name="heDaoTao" value={formik.values.heDaoTao} disabled />
              </FormControl>
            </FormControlComponent>
          </Grid>
          <Grid item xs={isXs ? 12 : 6}>
            <FormControlComponent xsLabel={0} xsForm={12} label={t('hinhthucdaotao.title')}>
              <FormControl fullWidth variant="outlined">
                <SelectForm keyProp="ma" valueProp="ten" item={htdt} name="hinhThucDaoTao" value={formik.values.hinhThucDaoTao} disabled />
              </FormControl>
            </FormControlComponent>
          </Grid>
        </Grid>
        <Grid xs={12} item container spacing={2}>
          <InputForm1 formik={formik} xs={isXs ? 12 : 4} label={t('hocsinh.field.soHieu')} name="soHieu" isDisabled />
          <InputForm1 formik={formik} xs={isXs ? 12 : 4} label={t('hocsinh.field.soCapBang')} name="soVaoSo" isDisabled />
          <Grid item xs={isXs ? 12 : 4}>
            <FormControlComponent xsLabel={0} xsForm={12} label={t('khoathi.title')}>
              <FormControl fullWidth variant="outlined">
                <SelectForm convert keyProp="id" valueProp="ngay" item={khoaThi} name="khoaThi" value={formik.values.khoaThi} disabled />
              </FormControl>
            </FormControlComponent>
          </Grid>
        </Grid>
        <Grid xs={12} item container spacing={2}>
          <InputForm1 formik={formik} xs={isXs ? 12 : 4} label={t('Nơi cấp')} name="noiCap" isDisabled />
          <InputForm1 formik={formik} xs={isXs ? 12 : 4} label={t('Người ký')} name="nguoiKy" isDisabled />
          <Grid item xs={isXs ? 12 : 4}>
            <FormControlComponent xsLabel={0} xsForm={12} label={t('Ngày cấp bằng')}>
              <InputForm
                fullWidth
                isDisabled
                formik={formik}
                name="ngayCapBang"
                type="date"
                value={formik.values.ngayCapBang ? convertDateTimeToDate(formik.values.ngayCapBang) : ''}
              />
            </FormControlComponent>
          </Grid>{' '}
        </Grid>
        <Grid item xs={12} mt={1}>
          <Divider />
        </Grid>
        <Grid xs={12} item container spacing={2} mt={1}>
          <Grid item xs={12}>
            <InputForm1 formik={formik} name="ghiChu" label={t('note')} isMulltiline rows={3} isDisabled />
          </Grid>
        </Grid>
        <Grid container item xs={12} mt={2} justifyContent="flex-end">
          {danhmuc && donvi && (formik.values.trangThai == 3 || formik.values.trangThai == 4) && (
            <Grid item sx={{ mr: '5px' }}>
              <ButtonSuccess onClick={handlePreview} icon={IconPrinter} title={t('In thử')} />
            </Grid>
          )}
          {danhmuc && donvi && (formik.values.trangThai == 3 || formik.values.trangThai == 4) && (
            <Grid item sx={{ mr: '5px' }}>
              <AnimateButton>
                <Tooltip title={t('In Bằng')} placement="bottom">
                  <Button variant="contained" size="medium" onClick={handleInTungNguoi}>
                    <IconPrinter /> {t('In Bằng')}
                  </Button>
                </Tooltip>
              </AnimateButton>
            </Grid>
          )}
          <Grid item>
            <ExitButton />
          </Grid>
        </Grid>
      </Grid>
      {form !== '' && (
        <Popup
          title={title}
          form={form}
          type="subpopup"
          openPopup={openSubPopup}
          maxWidth={form === 'inbang' || form === 'intungnguoi' ? 'md' : 'sm'}
          bgcolor={form === 'delete' ? '#F44336' : '#2196F3'}
        >
          {form === 'inbang' ? (
            <InThu duLieuHocSinh={hsSoGoc} />
          ) : form === 'intungnguoi' ? (
            <InBangTungNguoi duLieuHocSinh={hsSoGoc} />
          ) : (
            ''
          )}
        </Popup>
      )}
    </form>
  );
};

export default Detail;
