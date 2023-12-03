import React from 'react';
import {
  Checkbox,
  Divider,
  FormControl,
  FormControlLabel,
  Grid,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  Typography,
  useMediaQuery
} from '@mui/material';
import { useFormik } from 'formik';
import { setOpenPopup, setReloadData, showAlert } from 'store/actions';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { openPopupSelector, selectedHocsinhSelector, userLoginSelector } from 'store/selectors';
import { useEffect } from 'react';
import FormControlComponent from 'components/form/FormControlComponent ';
import FormGroupButton from 'components/button/FormGroupButton';
import { IconBook2, IconCertificate, IconUser } from '@tabler/icons';
import { useState } from 'react';
import InputForm1 from 'components/form/InputForm1';
import { getHocSinhByCCCD } from 'services/hocsinhService';
import useHocSinhValidationSchema from 'components/validations/hocsinhValidation';
import { getAllKhoathiByDMTN } from 'services/khoathiService';
import InputForm from 'components/form/InputForm';
import { getAllDanhmucTN, getAllTruong } from 'services/sharedService';
import { getAllDanToc } from 'services/dantocService';
import SelectForm from 'components/form/SelectForm';
import { getAllMonthi } from 'services/monthiService';
import { convertDateTimeToDate } from 'utils/formatDate';
import { editHocSinhSoGoc } from 'services/sogocService';

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
const Edit = () => {
  const isXs = useMediaQuery('(max-width:600px)');
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const openPopup = useSelector(openPopupSelector);
  const user = useSelector(userLoginSelector);
  const selectedHocSinh = useSelector(selectedHocsinhSelector);
  const [danhMuc, setDanhMuc] = useState([]);
  const [donVi, setDonVi] = useState([]);
  const [danToc, setDanToc] = useState([]);
  const [monThi, setMonThi] = useState([]);
  const [khoaThi, setKhoaThi] = useState([]);
  const hocSinhValidation = useHocSinhValidationSchema(true);
  const [selectDanhmuc, setSelectDanhmuc] = useState('');
  const [selectedMonHocs, setSelectedMonHocs] = useState(['', '', '', '', '', '']);
  const [selectedSubjectIndex, setSelectedSubjectIndex] = useState(null);
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
      ketQua: '',
      idTruong: '',
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
        values.id = selectedHocSinh.id;
        const addedHocSinh = await editHocSinhSoGoc(values);
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
  const handleSubjectClick = (index) => {
    // Set the selected subject index when a subject is clicked
    setSelectedSubjectIndex(index);
  };
  useEffect(() => {
    const fetchData = async () => {
      const userbyid = await getHocSinhByCCCD(selectedHocSinh.cccd);
      const datauser = userbyid.data;
      setSelectDanhmuc(datauser.idDanhMucTotNghiep);
      if (selectedHocSinh && openPopup) {
        formik.setValues({
          ho: datauser.ho || '',
          ten: datauser.ten || '',
          hoTen: datauser.hoTen || '',
          cccd: datauser.cccd || '',
          ngaySinh: datauser.ngaySinh || '',
          diaChi: datauser.diaChi || '',
          lop: datauser.lop || '',
          noiSinh: datauser.noiSinh || '',
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
          ketQua: datauser.ketQua || '',
          idTruong: datauser.idTruong || '',
          nguoiThucHien: user.username,
          ketQuaHocTaps: datauser.ketQuaHocTaps || [],
          diemTB: datauser.diemTB || '',
          lanDauTotNghiep: datauser.lanDauTotNghiep || '',
          dienXetTotNghiep: datauser.dienXetTotNghiep || '',
          hoiDong: datauser.hoiDong || ''
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
      const monthi = await getAllMonthi();
      setMonThi(monthi.data);
      const dantoc = await getAllDanToc();
      setDanToc(dantoc.data);
      const danhmuc = await getAllDanhmucTN(user ? user.username : '');
      setDanhMuc(danhmuc.data);
      const donvi = await getAllTruong(user ? user.username : '');
      setDonVi(donvi.data);
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

  const handleSchoolChange = (event) => {
    const selectedValue = event.target.value;
    formik.setFieldValue('idTruong', selectedValue);
  };

  const handleDMTNChange = (event) => {
    const selectedValue = event.target.value;
    formik.setFieldValue('idDanhMucTotNghiep', selectedValue);
    setSelectDanhmuc(selectedValue);
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

  const diems = formik.values.ketQuaHocTaps.map((_, index) => formik.values[`diem${index + 1}`]);

  useEffect(() => {
    if (selectedSubjectIndex !== null) {
      const newData = formik.values.ketQuaHocTaps.map((maMon, index) => {
        if (index === selectedSubjectIndex) {
          const newDiemValue = formik.values[`diem${index + 1}`] !== undefined ? formik.values[`diem${index + 1}`] : maMon.diem;
          return {
            ...maMon,
            diem: newDiemValue
          };
        }
        return maMon;
      });

      formik.setFieldValue('ketQuaHocTaps', newData);
    }
  }, [selectedSubjectIndex, ...diems]);

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
          <InputForm1 formik={formik} xs={6} label={'Nơi sinh'} name="noiSinh" isRequired />
          <Grid item xs={isXs ? 6 : 3}>
            <FormControlComponent xsLabel={0} xsForm={12} label={t('user.label.birthday')}>
              <InputForm
                formik={formik}
                name="ngaySinh"
                type="date"
                value={formik.values.ngaySinh ? convertDateTimeToDate(formik.values.ngaySinh) : ''}
              />
            </FormControlComponent>
          </Grid>
          {/* <InputForm1 formik={formik} xs={3} label={t('hocsinh.field.nation')} name="danToc" isRequired /> */}
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
        <Grid item container spacing={isXs ? 0 : 1} xs={12} mt={4} alignItems={'center'}>
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
            <FormControlComponent xsLabel={0} xsForm={12} label={t('donvitruong.title')} isRequire>
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

        <Grid xs={12} item container spacing={2}>
          {formik.values.ketQuaHocTaps.map((ketQua, index) => (
            <React.Fragment key={index}>
              <Grid item xs={3}>
                <FormControlComponent xsLabel={0} xsForm={12} label={`${t('subject')} ${index + 1}`}>
                  <FormControl fullWidth>
                    <Select
                      disabled
                      size="small"
                      name={`maMon${index + 1}`}
                      value={ketQua.maMon}
                      onChange={(event) => handleSelectChange(event, index)}
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
                  type="number"
                  value={ketQua.diem}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  onclick={() => handleSubjectClick(index)}
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
            <FormControlComponent xsLabel={0} xsForm={12} label={t('Kết quả tốt nghiệp')} isRequire>
              <FormControl fullWidth variant="outlined">
                <SelectForm
                  formik={formik}
                  keyProp="value"
                  valueProp="label"
                  item={ketQuaOptions}
                  name="ketQua"
                  value={formik.values.ketQua ? formik.values.ketQua : 'o'}
                  onChange={handleKetQuaChange}
                />
              </FormControl>
            </FormControlComponent>
          </Grid>
          <Grid item xs={isXs ? 6 : 4}>
            <FormControlComponent xsLabel={0} xsForm={12} label={t('Xếp loại tốt nghiệp')} isRequire>
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
        <Grid item container spacing={isXs ? 0 : 1} xs={12} mt={4} alignItems={'center'}>
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
        <Grid xs={12} item container spacing={isXs ? 0 : 2}>
          <InputForm1 formik={formik} xs={isXs ? 12 : 4} label={t('hocsinh.field.soHieu')} name="soHieu" />
          <InputForm1 formik={formik} xs={isXs ? 12 : 4} label={t('hocsinh.field.soCapBang')} name="soVaoSo" />
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

export default Edit;
