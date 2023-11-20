import React from 'react';
import {
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
  Typography,
  styled,
  useMediaQuery
} from '@mui/material';
import { useFormik } from 'formik';
import { setOpenPopup, setReloadData, showAlert } from 'store/actions';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { openPopupSelector, userLoginSelector } from 'store/selectors';
import { useEffect } from 'react';
import FormControlComponent from 'components/form/FormControlComponent ';
import FormGroupButton from 'components/button/FormGroupButton';
import { IconBook2, IconCertificate, IconUser, IconX } from '@tabler/icons';
import { useState } from 'react';
import InputForm1 from 'components/form/InputForm1';
import { createHocSinh } from 'services/hocsinhService';
import { getAllMonthi } from 'services/monthiService';
import useHocSinhValidationSchema from 'components/validations/hocsinhValidation';
import { getAllKhoathiByDMTN } from 'services/khoathiService';
import { getAllDanhmucTN, getAllTruong, getCauHinhTuDongXepLoai } from 'services/sharedService';
import { getAllDanToc } from 'services/dantocService';
import SelectForm from 'components/form/SelectForm';

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
  { value: 'Trung bình', label: 'Trung bình' },
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

const AddHocSinh = () => {
  const isXs = useMediaQuery('(max-width:600px)');
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const openPopup = useSelector(openPopupSelector);
  const user = useSelector(userLoginSelector);
  const [danhMuc, setDanhMuc] = useState([]);
  const [donVi, setDonVi] = useState([]);
  const [monThi, setMonThi] = useState([]);
  const [danToc, setDanToc] = useState([]);
  const [khoaThi, setKhoaThi] = useState([]);
  const [configAuto, setConfigAuto] = useState(false);
  const hocSinhValidation = useHocSinhValidationSchema(true, configAuto);
  const [selectDanhmuc, setSelectDanhmuc] = useState('');
  const [selectedMonHocs, setSelectedMonHocs] = useState(['', '', '', '', '', '']);
  const formik = useFormik({
    initialValues: {
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
      idKhoaThi: '',
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
      dienXetTotNghiep: '',
      hoiDong: ''
    },
    validationSchema: hocSinhValidation,
    onSubmit: async (values) => {
      try {
        const addedHocSinh = await createHocSinh(values);
        if (addedHocSinh.isSuccess == false) {
          dispatch(showAlert(new Date().getTime().toString(), 'error', addedHocSinh.message.toString()));
        } else {
          dispatch(setOpenPopup(false));
          dispatch(setReloadData(true));
          dispatch(showAlert(new Date().getTime().toString(), 'success', addedHocSinh.message.toString()));
        }
      } catch (error) {
        console.error(error);
        dispatch(showAlert(new Date().getTime().toString(), 'error', error.toString()));
      }
    }
  });
  useEffect(() => {
    console.log(formik.values);
  }, [formik]);
  useEffect(() => {
    const fetchDataDL = async () => {
      const monthi = await getAllMonthi();
      setMonThi(monthi.data);
      const dantoc = await getAllDanToc();
      setDanToc(dantoc.data);
      const danhmuc = await getAllDanhmucTN(user ? user.username : '');
      setDanhMuc(danhmuc.data);
      const donvi = await getAllTruong(user ? user.username : '');
      setDonVi(donvi.data);
      const configAuto = await getCauHinhTuDongXepLoai();
      setConfigAuto(configAuto.data.configValue);
    };
    fetchDataDL();
  }, []);

  useEffect(() => {
    const fetchDataDL = async () => {
      const response = await getAllKhoathiByDMTN(selectDanhmuc);
      if (response.data && response.data.length > 0) {
        setKhoaThi(response.data);
      } else {
        setKhoaThi([]);
      }
    };
    if (selectDanhmuc) {
      fetchDataDL();
    }
  }, [selectDanhmuc]);

  useEffect(() => {
    if (openPopup) {
      formik.resetForm();
    }
  }, [openPopup]);

  const handleSchoolChange = (event) => {
    const selectedValue = event.target.value;
    formik.setFieldValue('idTruong', selectedValue);
  };

  const handleDMTNChange = (event) => {
    const selectedValue = event.target.value;
    formik.setFieldValue('idDanhMucTotNghiep', selectedValue);
    setSelectDanhmuc(selectedValue);
  };

  const handleDanTocChange = (event) => {
    const selectedValue = event.target.value;
    formik.setFieldValue('danToc', selectedValue);
  };

  const handleKhoaThiChange = (event) => {
    const selectedValue = event.target.value;
    formik.setFieldValue('idKhoaThi', selectedValue);
  };

  const handleHocLucChange = (event) => {
    const selectedValue = event.target.value;
    formik.setFieldValue('hocLuc', selectedValue);
  };

  const handleHanhKiemChange = (event) => {
    const selectedValue = event.target.value;
    formik.setFieldValue('hanhKiem', selectedValue);
  };

  const handleXepLoaiChange = (event) => {
    const selectedValue = event.target.value;
    formik.setFieldValue('xepLoai', selectedValue);
  };

  const handleKetQuaChange = (event) => {
    const selectedValue = event.target.value;
    formik.setFieldValue('ketQua', selectedValue);
  };

  const handleGenderChange = (event) => {
    formik.setFieldValue('gioiTinh', event.target.value === 'male');
  };

  const handleSelectChange = (event, index) => {
    const selectedValue = event.target.value;
    if (selectedValue !== '') {
      const newSelectedMonHocs = [...selectedMonHocs];
      newSelectedMonHocs[index] = selectedValue;
      setSelectedMonHocs(newSelectedMonHocs);
    }
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
          <Grid item xs={isXs ? 12 : 6}>
            <FormControlComponent xsLabel={0} xsForm={12} isRequire label={t('danhmuc.title')}>
              <FormControl fullWidth variant="outlined">
                <SelectForm
                  formik={formik}
                  keyProp="id"
                  valueProp="tieuDe"
                  item={danhMuc}
                  name="idDanhMucTotNghiep"
                  value={formik.values.idDanhMucTotNghiep}
                  onChange={handleDMTNChange}
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
        <Grid xs={12} item container spacing={isXs ? 0 : 2} columnSpacing={isXs ? 1 : 0} mt={0}>
          {/* <InputForm1 formik={formik} xs={3} label={'Họ'} name='ho' isRequired/>
            <InputForm1 formik={formik} xs={3} label={'Tên'} name='ten' isRequired/> */}
          <InputForm1 formik={formik} xs={isXs ? 12 : 6} label={'Họ tên'} name="hoTen" isRequired />
          <InputForm1 formik={formik} xs={isXs ? 6 : 3} label={'CCCD'} name="cccd" isRequired />
          <Grid item xs={isXs ? 6 : 3}>
            <FormControlComponent xsLabel={0} xsForm={12} label={t('user.label.gender')}>
              <FormControl fullWidth variant="outlined">
                <RadioGroup
                  name="gioiTinh"
                  value={formik.values.gioiTinh ? 'male' : 'female'}
                  onChange={handleGenderChange}
                  onBlur={formik.handleBlur}
                >
                  <Grid container>
                    <FormControlLabel size="small" value="male" control={<Radio size="small" />} label={t('gender.male')} />
                    <FormControlLabel size="small" value="female" control={<Radio size="small" />} label={t('gender.female')} />
                  </Grid>
                </RadioGroup>
              </FormControl>
            </FormControlComponent>
          </Grid>
        </Grid>
        <Grid xs={12} item container spacing={isXs ? 0 : 2} columnSpacing={isXs ? 1 : 0}>
          <InputForm1 formik={formik} xs={isXs ? 12 : 6} label={t('hocsinh.field.address')} name="noiSinh" isRequired />
          <InputForm1 formik={formik} xs={isXs ? 6 : 3} label={t('hocsinh.field.bdate')} name="ngaySinh" type="date" isRequired />
          {/* <InputForm1 formik={formik} xs={isXs ? 6 : 3} label={t('hocsinh.field.nation')} name="danToc" isRequired /> */}
          <Grid item xs={isXs ? 6 : 3}>
            <FormControlComponent xsLabel={0} xsForm={12} label={t('hocsinh.field.nation')} isRequire>
              <FormControl fullWidth variant="outlined">
                <SelectForm
                  formik={formik}
                  keyProp="ten"
                  valueProp="ten"
                  item={danToc}
                  name="danToc"
                  value={formik.values.danToc}
                  onChange={handleDanTocChange}
                />
              </FormControl>
            </FormControlComponent>
          </Grid>
        </Grid>
        <Grid xs={12} item container spacing={isXs ? 0 : 2}>
          <InputForm1 formik={formik} xs={isXs ? 12 : 6} label={t('Địa chỉ')} name="diaChi" isRequired />
        </Grid>
        <Grid item container spacing={isXs ? 0 : 1} xs={12} mt={isXs ? 2 : 4} alignItems={'center'}>
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
        <Grid xs={12} item container spacing={isXs ? 0 : 2} mt={0}>
          <Grid item xs={isXs ? 12 : 6}>
            <FormControlComponent xsLabel={0} xsForm={12} isRequire label={t('donvitruong.title')}>
              <FormControl fullWidth variant="outlined">
                <SelectForm
                  formik={formik}
                  keyProp="id"
                  valueProp="ten"
                  item={donVi}
                  name="idTruong"
                  value={formik.values.idTruong}
                  onChange={handleSchoolChange}
                />
              </FormControl>
            </FormControlComponent>
          </Grid>
          <InputForm1 formik={formik} xs={isXs ? 6 : 3} label={t('Lớp')} name="lop" isRequired />
          <InputForm1 formik={formik} xs={isXs ? 6 : 3} label={t('Hội đồng thi')} name="hoiDong" isRequired />
        </Grid>
        <Grid xs={12} item container spacing={isXs ? 0 : 2} columnSpacing={isXs ? 1 : 0}>
          {selectedMonHocs.map((selectedMonHoc, index) => (
            <React.Fragment key={index}>
              <Grid item xs={isXs ? 6 : 3}>
                <FormControlComponent xsLabel={0} xsForm={12} label={`${t('subject')} ${index + 1}`}>
                  <FormControl fullWidth>
                    <CustomSelect
                      size="small"
                      name={`maMon${index + 1}`}
                      value={selectedMonHoc}
                      onChange={(event) => handleSelectChange(event, index)}
                      endAdornment={
                        selectedMonHoc !== '' && (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={() => handleRemoveSelection(index)}
                              size="small"
                              sx={{ marginRight: '10px', color: 'gray' }}
                            >
                              <IconX size={20} />
                            </IconButton>
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
              <Grid item xs={isXs ? 6 : 3}>
                <InputForm1
                  formik={formik}
                  xs={12}
                  label={`${t('point')} ${index + 1}`}
                  name={`diem${index + 1}`}
                  isDisabled={selectedMonHoc === ''}
                  type="number"
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
                  onChange={handleHanhKiemChange}
                />
              </FormControl>
            </FormControlComponent>
          </Grid>
          <Grid item xs={isXs ? 6 : 3}>
            <InputForm1 formik={formik} xs={12} label={t('Điểm trung bình')} name="diemTB" isRequired />
          </Grid>
          <Grid item xs={isXs ? 6 : 3}>
            <InputForm1 formik={formik} xs={12} label={t('Diện xét tốt nghiệp')} name="dienXetTotNghiep" />
          </Grid>
          <Grid item xs={isXs ? 6 : 3} sx={{ display: 'flex', alignItems: 'flex-end' }}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={formik.values.lanDauTotNghiep === 'x'} // Check if the value is 'x'
                  onChange={(e) => formik.setFieldValue('lanDauTotNghiep', e.target.checked ? 'x' : 'o')}
                />
              }
              label="Lần đầu xét tốt nghiệp"
            />
          </Grid>
        </Grid>
        {configAuto === 'false' ? (
          <Grid xs={12} item container spacing={isXs ? 0 : 2} mt={0} columnSpacing={isXs ? 1 : 0}>
            <Grid item xs={isXs ? 6 : 4}>
              <FormControlComponent xsLabel={0} xsForm={12} label={t('hocsinh.label.hocluc')} isRequire>
                <FormControl fullWidth variant="outlined">
                  <SelectForm
                    formik={formik}
                    keyProp="value"
                    valueProp="label"
                    item={hocLucOptions}
                    name="hocLuc"
                    value={formik.values.hocLuc}
                    onChange={handleHocLucChange}
                  />
                </FormControl>
              </FormControlComponent>
            </Grid>
            <Grid item xs={isXs ? 6 : 4}>
              <FormControlComponent xsLabel={0} xsForm={12} label={t('kết quả tốt nghiệp')} isRequire>
                <FormControl fullWidth variant="outlined">
                  <SelectForm
                    formik={formik}
                    keyProp="value"
                    valueProp="label"
                    item={ketQuaOptions}
                    name="ketQua"
                    value={formik.values.ketQua}
                    onChange={handleKetQuaChange}
                  />
                </FormControl>
              </FormControlComponent>
            </Grid>
            <Grid item xs={isXs ? 6 : 4}>
              <FormControlComponent xsLabel={0} xsForm={12} label={t('xếp loại tốt nghiệp')} isRequire>
                <FormControl fullWidth variant="outlined">
                  <SelectForm
                    formik={formik}
                    keyProp="value"
                    valueProp="label"
                    item={hocLucOptions}
                    name="xepLoai"
                    value={formik.values.xepLoai}
                    onChange={handleXepLoaiChange}
                  />
                </FormControl>
              </FormControlComponent>
            </Grid>
          </Grid>
        ) : (
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
                    onChange={handleHocLucChange}
                    disabled
                  />
                </FormControl>
              </FormControlComponent>
            </Grid>
            <Grid item xs={isXs ? 6 : 4}>
              <FormControlComponent xsLabel={0} xsForm={12} label={t('kết quả tốt nghiệp')}>
                <FormControl fullWidth variant="outlined">
                  <SelectForm
                    formik={formik}
                    keyProp="value"
                    valueProp="label"
                    item={ketQuaOptions}
                    name="ketQua"
                    value={formik.values.ketQua}
                    onChange={handleKetQuaChange}
                    disabled
                  />
                </FormControl>
              </FormControlComponent>
            </Grid>
            <Grid item xs={isXs ? 6 : 4}>
              <FormControlComponent xsLabel={0} xsForm={12} label={t('xếp loại tốt nghiệp')}>
                <FormControl fullWidth variant="outlined">
                  <SelectForm
                    formik={formik}
                    keyProp="value"
                    valueProp="label"
                    item={hocLucOptions}
                    name="xepLoai"
                    value={formik.values.xepLoai}
                    onChange={handleXepLoaiChange}
                    disabled
                  />
                </FormControl>
              </FormControlComponent>
            </Grid>
          </Grid>
        )}

        <Grid item container spacing={isXs ? 0 : 1} xs={12} mt={isXs ? 2 : 4} alignItems={'center'}>
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
        {/* <Grid xs={12} item container spacing={2}>
            <InputForm1 formik={formik} xs={3} label={'Đơn vị đăng ký dự thi'} name='dvdk' value='' isDisabled/>
            <InputForm1 formik={formik} xs={3} label={'Hội đồng thi'} name='hdt1' value='' isDisabled/>
        </Grid> */}
        <Grid xs={12} item container spacing={isXs ? 0 : 2}>
          <InputForm1 formik={formik} xs={isXs ? 12 : 4} label={t('hocsinh.field.soHieu')} name="soHieu" isDisabled />
          <InputForm1 formik={formik} xs={isXs ? 12 : 4} label={t('hocsinh.field.soCapBang')} name="soVaoSo" isDisabled />
          <Grid item xs={isXs ? 12 : 4}>
            <FormControlComponent xsLabel={0} xsForm={12} label={t('khoathi.title')} isRequire>
              <FormControl fullWidth variant="outlined">
                <SelectForm
                  formik={formik}
                  convert
                  keyProp="id"
                  valueProp="ngay"
                  item={khoaThi}
                  name="idKhoaThi"
                  value={formik.values.idKhoaThi}
                  onChange={handleKhoaThiChange}
                />
              </FormControl>
            </FormControlComponent>
          </Grid>
        </Grid>
        <Grid item xs={12} mt={1}>
          <Divider />
        </Grid>
        <Grid xs={12} item container spacing={isXs ? 0 : 2} mt={1}>
          <Grid item xs={12}>
            <InputForm1 formik={formik} name="ghiChu" label={t('note')} isMulltiline minRows={3} maxRows={10} />
          </Grid>
        </Grid>
        <Grid item xs={12} container spacing={2} justifyContent="flex-end">
          <FormGroupButton />
        </Grid>
      </Grid>
    </form>
  );
};

export default AddHocSinh;
