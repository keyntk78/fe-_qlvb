import React from 'react';
import { Divider, FormControl, FormControlLabel, Grid, Radio, RadioGroup, Typography, useMediaQuery } from '@mui/material';
import { useFormik } from 'formik';
import { setOpenPopup, setReloadData, showAlert } from 'store/actions';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { donviSelector, openPopupSelector, selectedHocsinhSelector, userLoginSelector } from 'store/selectors';
import { useEffect } from 'react';
import FormControlComponent from 'components/form/FormControlComponent ';
import FormGroupButton from 'components/button/FormGroupButton';
import { IconBook2, IconCertificate, IconUser } from '@tabler/icons';
import { useState } from 'react';
import InputForm1 from 'components/form/InputForm1';
import { editHocSinh, getHocSinhByCCCD } from 'services/nguoihoctotnghiepService';
// import { getAllMonthi } from 'services/monthiService';
import useHocSinhValidationSchema from 'components/validations/hocsinhValidation';
import { getAllKhoathi } from 'services/khoathiService';
import InputForm from 'components/form/InputForm';
import { getAllDanhmucTN } from 'services/sharedService';
import { getAllDanToc } from 'services/dantocService';
import SelectForm from 'components/form/SelectForm';

const hocLucOptions = [
  { value: 'Giỏi', label: 'Giỏi' },
  { value: 'Khá', label: 'Khá' },
  { value: 'Trung Bình', label: 'Trung bình' }
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

const EditHocSinh = () => {
  const isXs = useMediaQuery('(max-width:600px)');
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const openPopup = useSelector(openPopupSelector);
  const user = useSelector(userLoginSelector);
  const donvi = useSelector(donviSelector);
  const selectedHocSinh = useSelector(selectedHocsinhSelector);
  const [danhMuc, setDanhMuc] = useState([]);
  // const [ monThi, setMonThi ] = useState([]);
  const [khoaThi, setKhoaThi] = useState([]);
  const [danToc, setDanToc] = useState([]);
  const hocSinhValidation = useHocSinhValidationSchema();
  // const [selectedMonHocs, setSelectedMonHocs] = useState(['', '', '', '', '', '']);
  const formik = useFormik({
    initialValues: {
      id: '',
      ho: '',
      ten: '',
      hoTen: '',
      cccd: '',
      ngaySinh: '',
      diaChi: '',
      lop: '',
      noiSinh: '',
      gioiTinh: true,
      danToc: '',
      hanhKiem: '',
      hocLuc: '',
      soHieu: '',
      soVaoSoCapBang: '',
      idKhoaThi: '',
      ghiChu: '',
      idDanhMucTotNghiep: '',
      xepLoai: '',
      ketqua: '',
      idTruong: '',
      nguoiThucHien: user.username,
      ketQuaHocTaps: []
    },

    validationSchema: hocSinhValidation,
    onSubmit: async (values) => {
      try {
        values.id = selectedHocSinh.id;
        values.idTruong = donvi.id;
        const addedHocSinh = await editHocSinh(values);
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
    const fetchData = async () => {
      const userbyid = await getHocSinhByCCCD(selectedHocSinh.cccd);
      const datauser = userbyid.data;
      if (selectedHocSinh && openPopup) {
        formik.setValues({
          ho: datauser.ho || '',
          ten: datauser.ten || '',
          hoTen: datauser.hoTen || '',
          cccd: datauser.cccd || '',
          ngaySinh: datauser.ngaySinh || '',
          diaChi: datauser.diaChi || '',
          noiSinh: datauser.noiSinh || '',
          lop: datauser.lop || '',
          gioiTinh: datauser.gioiTinh || false,
          danToc: datauser.danToc || '',
          hanhKiem: datauser.hanhKiem || '',
          hocLuc: datauser.hocLuc || '',
          soHieu: datauser.soHieuVanBang || '',
          soVaoSo: datauser.soVaoSoCapBang || '',
          idKhoaThi: datauser.idKhoaThi || '',
          ghiChu: datauser.ghiChu || '',
          idDanhMucTotNghiep: datauser.idDanhMucTotNghiep || '',
          xepLoai: datauser.xepLoai || '',
          ketqua: datauser.ketqua || '',
          nguoiThucHien: user.username,
          ketQuaHocTaps: datauser.ketQuaHocTaps || []
        });
      }
      dispatch(setReloadData(false));
    };
    if (openPopup) {
      fetchData();
    }
  }, [selectedHocSinh, openPopup]);

  useEffect(() => {
    const fetchDataDL = async () => {
      // const monthi = await getAllMonthi();
      // setMonThi(monthi.data);
      const dantoc = await getAllDanToc();
      setDanToc(dantoc.data);
      const danhmuc = await getAllDanhmucTN(user ? user.username : '');
      setDanhMuc(danhmuc.data);
      const khoathi = await getAllKhoathi();
      setKhoaThi(khoathi.data);
    };
    fetchDataDL();
  }, []);

  const handleDMTNChange = (event) => {
    const selectedValue = event.target.value;
    formik.setFieldValue('idDanhMucTotNghiep', selectedValue);
  };

  const handleKhoaThiChange = (event) => {
    const selectedValue = event.target.value;
    formik.setFieldValue('idKhoaThi', selectedValue);
  };

  const handleHocLucChange = (event) => {
    const selectedValue = event.target.value;
    formik.setFieldValue('hocLuc', selectedValue);
  };

  const handleDanTocChange = (event) => {
    const selectedValue = event.target.value;
    formik.setFieldValue('danToc', selectedValue);
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
    formik.setFieldValue('ketqua', selectedValue);
  };

  const handleGenderChange = (event) => {
    formik.setFieldValue('gioiTinh', event.target.value === 'male');
  };

  // const handleSelectChange = (event, index) => {
  //   const selectedValue = event.target.value;
  //   if (selectedValue !== '') {
  //     const newSelectedMonHocs = [...selectedMonHocs];
  //     newSelectedMonHocs[index] = selectedValue;
  //     setSelectedMonHocs(newSelectedMonHocs);
  //   }
  // };

  // const getRemainingOptions = (index) => {
  //   return monThi.filter((option) => !selectedMonHocs.includes(option.ma) || option.ma === selectedMonHocs[index]);
  // };

  // const handleRemoveSelection = (index) => {
  //   const newSelectedMonHocs = [...selectedMonHocs];
  //   newSelectedMonHocs[index] = '';
  //   setSelectedMonHocs(newSelectedMonHocs);
  //   formik.setFieldValue(`diem${index + 1}`, '');
  // };

  // const diems = selectedMonHocs.map((_, index) => formik.values[`diem${index + 1}`]);

  // useEffect(() => {
  //   const newData = selectedMonHocs
  //     .map((maMon, index) => ({
  //       maMon,
  //       diem: formik.values[`diem${index + 1}`],
  //     }))
  //     .filter((subject) => subject.maMon !== '' && subject.diem !== undefined);

  //   formik.setFieldValue('ketQuaHocTaps', newData);
  // }, [...diems]);

  return (
    <form onSubmit={formik.handleSubmit}>
      <Grid container>
        <Grid xs={12} item container spacing={isXs ? 1 : 2} mt={0}>
          <Grid item xs={isXs ? 12 : 6}>
            <FormControlComponent xsLabel={0} xsForm={12} label={t('danhmuc.title')} isRequire>
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
          {/* <InputForm1 formik={formik} xs={3} label={t('hocsinh.label.ho')} name='ho' isRequired/>
          <InputForm1 formik={formik} xs={3} label={t('hocsinh.label.ten')} name='ten' isRequired/> */}
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
          <InputForm1 formik={formik} xs={isXs ? 12 : 6} label={'Nơi sinh'} name="noiSinh" isRequired />
          <Grid item xs={isXs ? 6 : 3}>
            <FormControlComponent xsLabel={0} xsForm={12} label={t('user.label.birthday')} isRequire>
              <InputForm
                formik={formik}
                name="ngaySinh"
                type="date"
                value={formik.values.ngaySinh ? new Date(formik.values.ngaySinh).toISOString().slice(0, 10) : ''}
              />
            </FormControlComponent>
          </Grid>
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
          <InputForm1 formik={formik} xs={isXs ? 12 : 6} label={'Địa chỉ'} name="diaChi" isRequired />
        </Grid>
        <Grid item container spacing={isXs ? 0 : 1} xs={12} mt={2} alignItems={'center'}>
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
          <InputForm1 formik={formik} xs={isXs ? 12 : 6} label={'Lớp'} name="lop" isRequired />
        </Grid>
        {/* <Grid xs={12} item container spacing={2}>
          {selectedMonHocs.map((selectedMonHoc, index) => (
            <React.Fragment key={index}>
              <Grid item xs={3}>
                <FormControlComponent xsLabel={0} xsForm={12} label={`Môn học ${index + 1}`}>
                  <FormControl fullWidth>
                    <Select
                      size="small"
                      name={`maMon${index + 1}`}
                      value={selectedMonHoc}
                      onChange={(event) => handleSelectChange(event, index)}
                      endAdornment={
                        selectedMonHoc !== '' && (
                          <InputAdornment position="end">
                            <IconButton onClick={() => handleRemoveSelection(index)} size="small" sx={{ marginRight: '10px', color: 'gray' }}>
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
                    </Select>
                  </FormControl>
                </FormControlComponent>
              </Grid>
              <Grid item xs={3}>
                <InputForm1
                  formik={formik}
                  xs={12}
                  label={`Điểm môn ${index + 1}`}
                  name={`diem${index + 1}`}
                  isDisabled={selectedMonHoc === ''}
                  type='number'
                />
              </Grid>
            </React.Fragment>
          ))}
        </Grid> */}
        {/* <Grid xs={12} item container spacing={2}>
          {formik.values.ketQuaHocTaps.map((ketQua, index) => (
            <React.Fragment key={index}>
              <Grid item xs={3}>
                <FormControlComponent xsLabel={0} xsForm={12} label={`${t('subject')} ${index + 1}`}>
                  <FormControl fullWidth>
                    <Select
                      size="small"
                      name={`maMon${index + 1}`}
                      value={ketQua.maMon}
                      onChange={(event) => handleSelectChange(event, index)}
                      endAdornment={
                        ketQua.maMon !== '' && (
                          <InputAdornment position="end">
                            <IconButton onClick={() => handleRemoveSelection(index)} size="small" sx={{ marginRight: '10px', color: 'gray' }}>
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
                    </Select>
                  </FormControl>
                </FormControlComponent>
              </Grid>
              <Grid item xs={3}>
                <InputForm1
                  formik={formik}
                  xs={12}
                  label={`${t('point')} ${index + 1}`}
                  name={`diem${index + 1}`}
                  isDisabled={ketQua.maMon === ''}
                  type='number'
                  value={ketQua.diem.toString()}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </Grid>
            </React.Fragment>
          ))}
        </Grid> */}
        <Grid xs={12} item container spacing={isXs ? 0 : 2} columnSpacing={isXs ? 1 : 0} mt={0}>
          <Grid item xs={isXs ? 6 : 3}>
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
            <FormControlComponent xsLabel={0} xsForm={12} label={t('result')}>
              <FormControl fullWidth variant="outlined">
                <SelectForm
                  keyProp="value"
                  valueProp="label"
                  item={ketQuaOptions}
                  name="ketQua"
                  value={formik.values.ketQua ? formik.values.ketQua : 'x'}
                  onChange={handleKetQuaChange}
                />
              </FormControl>
            </FormControlComponent>
          </Grid>
          <Grid item xs={isXs ? 6 : 3}>
            <FormControlComponent xsLabel={0} xsForm={12} label={t('rating')} isRequire>
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
        <Grid item container spacing={isXs ? 0 : 1} xs={12} mt={2} alignItems={'center'}>
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
          <InputForm1 formik={formik} xs={isXs ? 12 : 4} label={t('hocsinh.field.soCapBang')} name="soVaoSoCapBang" isDisabled />
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
            <InputForm1 formik={formik} name="ghiChu" label={t('note')} i isMulltiline rows={3} />
          </Grid>
        </Grid>
        <Grid item xs={12} container spacing={2} justifyContent="flex-end">
          <FormGroupButton />
        </Grid>
      </Grid>
    </form>
  );
};

export default EditHocSinh;
