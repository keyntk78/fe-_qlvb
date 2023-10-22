import React from 'react';
import {
  Button,
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
  styled
} from '@mui/material';
import { useFormik } from 'formik';
import { setOpenSubPopup, setReloadData } from 'store/actions';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { capBangBansaoSelector, openPopupSelector, userLoginSelector } from 'store/selectors';
import { useEffect } from 'react';
import FormControlComponent from 'components/form/FormControlComponent ';
import { IconBook2, IconCertificate, IconPrinter, IconUser } from '@tabler/icons';
import { useState } from 'react';
import { getAllDonvi } from 'services/donvitruongService';
import InputForm1 from 'components/form/InputForm1';
import { getHocSinhByCCCD } from 'services/hocsinhService';
import { getAllMonthi } from 'services/monthiService';
import { getAllHedaotao } from 'services/hedaotaoService';
import { getAllHinhthucdaotao } from 'services/hinhthucdaotaoService';
import { getAllKhoathi } from 'services/khoathiService';
import InputForm from 'components/form/InputForm';
import ExitButton from 'components/button/ExitButton';
import { getAllDanhmucTN } from 'services/danhmuctotnghiepService';
import AnimateButton from 'components/extended/AnimateButton';
import BackToTop from 'components/scroll/BackToTop';
import SelectForm from 'components/form/SelectForm';

const hocLucOptions = [
  { value: 'Giỏi', label: 'Giỏi' },
  { value: 'Khá', label: 'Khá' },
  { value: 'Trung Bình', label: 'Trung Bình' }
];

const ketQuaOptions = [
  { value: 'x', label: 'Đạt' },
  { value: 'o', label: 'Không đạt' }
];

const hanhKiemOptions = [
  { value: 'Tốt', label: 'Tốt' },
  { value: 'Khá', label: 'Khá' },
  { value: 'Trung Bình', label: 'Trung Bình' },
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

const Detail = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const openPopup = useSelector(openPopupSelector);
  const user = useSelector(userLoginSelector);
  const selectedHocSinh = useSelector(capBangBansaoSelector);
  const [danhMuc, setDanhMuc] = useState([]);
  const [donVi, setDonVi] = useState([]);
  const [monThi, setMonThi] = useState([]);
  const [heDaoTao, setHeDaoTao] = useState([]);
  const [htdt, setHTDT] = useState([]);
  const [khoaThi, setKhoaThi] = useState([]);
  const [selectedMonHocs, setSelectedMonHocs] = useState(['', '', '', '', '', '']);
  const formik = useFormik({
    initialValues: {
      ho: '',
      ten: '',
      hoTen: '',
      cccd: '',
      ngaySinh: '',
      noiSinh: '',
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
      ketqua: '',
      idTruong: '',
      heDaoTao: '',
      hinhThucDaoTao: '',
      nguoiThucHien: user.username,
      ketQuaHocTaps: [],
      noiCap: '',
      nguoiKy: '',
      ngayCapBang: '',
      trangThai: ''
    }
  });

  useEffect(() => {
    const fetchData = async () => {
      const userbyid = await getHocSinhByCCCD(selectedHocSinh.hocSinh.cccd);
      const datauser = userbyid.data;
      if (selectedHocSinh && openPopup) {
        formik.setValues({
          ho: datauser.ho || '',
          ten: datauser.ten || '',
          hoTen: datauser.hoTen || '',
          cccd: datauser.cccd || '',
          ngaySinh: datauser.ngaySinh || '',
          noiSinh: datauser.noiSinh || '',
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
          ketqua: datauser.ketqua || '',
          idTruong: datauser.idTruong || '',
          heDaoTao: datauser.truong.maHeDaoTao || '',
          hinhThucDaoTao: datauser.truong.maHinhThucDaoTao || '',
          nguoiThucHien: user.username,
          ketQuaHocTaps: datauser.ketQuaHocTaps || [],
          noiCap: datauser ? datauser.soGoc.diaPhuongCapBang : '',
          nguoiKy: datauser ? datauser.soGoc.nguoiKyBang : '',
          ngayCapBang: datauser ? datauser.danhMucTotNghiep.ngayCapBang : '',
          trangThai: datauser.trangThai || ''
        });
      }
      dispatch(setReloadData(false));
    };
    if (openPopup) {
      fetchData();
    }
  }, [selectedHocSinh.hocSinh, openPopup]);

  useEffect(() => {
    const fetchDataDL = async () => {
      const monthi = await getAllMonthi();
      setMonThi(monthi.data);
      const donvi = await getAllDonvi();
      setDonVi(donvi.data);
      const danhmuc = await getAllDanhmucTN();
      setDanhMuc(danhmuc.data);
      const hedaotao = await getAllHedaotao();
      setHeDaoTao(hedaotao.data);
      const htdt = await getAllHinhthucdaotao();
      setHTDT(htdt.data);
      const khoathi = await getAllKhoathi();
      setKhoaThi(khoathi.data);
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
    setTitle(t('In Thử'));
    setForm('inbang');
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
        <Grid xs={12} item container spacing={2} mt={0}>
          <Grid item xs={6}>
            <FormControlComponent xsLabel={0} xsForm={12} label={t('danhmuc.title')}>
              <FormControl fullWidth variant="outlined">
                <SelectForm
                  keyProp="id"
                  valueProp="tieuDe"
                  item={danhMuc}
                  name="idDanhMucTotNghiep"
                  value={formik.values.idDanhMucTotNghiep}
                  disabled
                />
              </FormControl>
            </FormControlComponent>
          </Grid>
        </Grid>
        <Grid item container spacing={1} xs={12} mt={2} alignItems={'center'}>
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
        <Grid xs={12} item container spacing={2} mt={0}>
          {/* <InputForm1 formik={formik} xs={3} label={'Họ'} name='ho' isRequired/>
          <InputForm1 formik={formik} xs={3} label={'Tên'} name='ten' isRequired/> */}
          <InputForm1 formik={formik} xs={6} label={t('hocsinh.field.fullname')} name="hoTen" isDisabled />
          <InputForm1 formik={formik} xs={3} label={t('hocsinh.field.cccd')} name="cccd" isDisabled />
          <Grid item xs={3}>
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
        <Grid xs={12} item container spacing={2}>
          <InputForm1 formik={formik} xs={6} label={'Nơi sinh'} name="noiSinh" isDisabled />
          <Grid item xs={3}>
            <FormControlComponent xsLabel={0} xsForm={12} label={t('user.label.birthday')}>
              <InputForm
                isDisabled
                formik={formik}
                name="ngaySinh"
                type="date"
                value={formik.values.ngaySinh ? new Date(formik.values.ngaySinh).toISOString().slice(0, 10) : ''}
              />
            </FormControlComponent>
          </Grid>
          <InputForm1 formik={formik} xs={3} label={t('hocsinh.field.nation')} name="danToc" isDisabled />
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
          <Grid item xs={6}>
            <FormControlComponent xsLabel={0} xsForm={12} label={t('donvitruong.title')}>
              <FormControl fullWidth variant="outlined">
                <SelectForm keyProp="id" valueProp="ten" item={donVi} name="idTruong" value={formik.values.idTruong} disabled />
              </FormControl>
            </FormControlComponent>
          </Grid>
          <Grid item xs={3}>
            <FormControlComponent xsLabel={0} xsForm={12} label={t('hocsinh.label.hocluc')}>
              <FormControl fullWidth variant="outlined">
                <SelectForm keyProp="value" valueProp="label" item={hocLucOptions} name="hocLuc" value={formik.values.hocLuc} disabled />
              </FormControl>
            </FormControlComponent>
          </Grid>
          <Grid item xs={3}>
            <FormControlComponent xsLabel={0} xsForm={12} label={t('hocsinh.label.hanhkiem')}>
              <FormControl fullWidth variant="outlined">
                <SelectForm
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

        <Grid xs={12} item container spacing={2} mt={0}>
          <Grid item xs={3}>
            <FormControlComponent xsLabel={0} xsForm={12} label={t('result')}>
              <FormControl fullWidth variant="outlined">
                <SelectForm
                  keyProp="value"
                  valueProp="label"
                  item={ketQuaOptions}
                  name="ketqua"
                  value={formik.values.ketqua ? formik.values.ketqua : 'x'}
                  disabled
                />
              </FormControl>
            </FormControlComponent>
          </Grid>
          <Grid item xs={3}>
            <FormControlComponent xsLabel={0} xsForm={12} label={t('rating')}>
              <FormControl fullWidth variant="outlined">
                <SelectForm
                  keyProp="value"
                  valueProp="label"
                  item={hocLucOptions}
                  name="xepLoai"
                  value={formik.values.xepLoai ? formik.values.xepLoai : 'Giỏi'}
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
          <Grid item xs={6}>
            <FormControlComponent xsLabel={0} xsForm={12} label={t('hedaotao.title')}>
              <FormControl fullWidth variant="outlined">
                <SelectForm keyProp="ma" valueProp="ten" item={heDaoTao} name="heDaoTao" value={formik.values.heDaoTao} disabled />
              </FormControl>
            </FormControlComponent>
          </Grid>
          <Grid item xs={6}>
            <FormControlComponent xsLabel={0} xsForm={12} label={t('hinhthucdaotao.title')}>
              <FormControl fullWidth variant="outlined">
                <SelectForm keyProp="ma" valueProp="ten" item={htdt} name="hinhThucDaoTao" value={formik.values.hinhThucDaoTao} disabled />
              </FormControl>
            </FormControlComponent>
          </Grid>
        </Grid>
        {/* <Grid xs={12} item container spacing={2}>
            <InputForm1 formik={formik} xs={3} label={'Đơn vị đăng ký dự thi'} name='dvdk' value='' isDisabled/>
            <InputForm1 formik={formik} xs={3} label={'Hội đồng thi'} name='hdt1' value='' isDisabled/>
        </Grid> */}
        <Grid xs={12} item container spacing={2}>
          <InputForm1 formik={formik} xs={4} label={t('hocsinh.field.soHieu')} name="soHieu" isDisabled />
          <InputForm1 formik={formik} xs={4} label={t('hocsinh.field.soCapBang')} name="soVaoSo" isDisabled />
          <Grid item xs={4}>
            <FormControlComponent xsLabel={0} xsForm={12} label={t('khoathi.title')}>
              <FormControl fullWidth variant="outlined">
                <SelectForm convert keyProp="id" valueProp="ngay" item={khoaThi} name="khoaThi" value={formik.values.khoaThi} disabled />
              </FormControl>
            </FormControlComponent>
          </Grid>
        </Grid>
        <Grid xs={12} item container spacing={2}>
          <InputForm1 formik={formik} xs={4} label={t('Nơi cấp')} name="noiCap" isDisabled />
          <InputForm1 formik={formik} xs={4} label={t('Người ký')} name="nguoiKy" isDisabled />
          <Grid item xs={4}>
            <FormControlComponent xsLabel={0} xsForm={12} label={t('Ngày cấp bằng')}>
              <InputForm
                fullWidth
                isDisabled
                formik={formik}
                name="ngayCapBang"
                type="date"
                value={formik.values.ngayCapBang ? new Date(formik.values.ngayCapBang).toISOString().slice(0, 10) : ''}
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
          {formik.values.trangThai == 3 && (
            <Grid item sx={{ mr: '5px' }}>
              <AnimateButton>
                <Tooltip title={t('In thử')} placement="bottom">
                  <Button variant="contained" size="medium" onClick={handlePreview}>
                    <IconPrinter /> {t('In thử')}
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
      <BackToTop />
    </form>
  );
};

export default Detail;
