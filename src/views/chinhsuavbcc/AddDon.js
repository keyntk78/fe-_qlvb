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
import { openSubPopupSelector, selectedHocsinhSelector, userLoginSelector } from 'store/selectors';
import { setOpenSubPopup, setReloadData, showAlert } from 'store/actions';
import { useTranslation } from 'react-i18next';
import { updateVBCC } from 'services/chinhsuavbccService';
import '../../index.css';
import FormGroupButton from 'components/button/FormGroupButton';
import FormControlComponent from 'components/form/FormControlComponent ';
import Importfile from 'components/form/ImportFile';
import { getAllDanToc } from 'services/sharedService';
import { useState } from 'react';
import SelectForm from 'components/form/SelectForm';
import { convertJsonToFormData } from 'utils/convertJsonToFormData';
import useChinhSuaVanBangValidationSchema from 'components/validations/chinhsuavbccValidation';
import { getAllHinhThucDaoTao, getAllNamThi, getByCCCD, getKhoaThiByNamThi } from 'services/sharedService';
const AddDonChinhSua = () => {
  const { t } = useTranslation();
  const openSubPopup = useSelector(openSubPopupSelector);
  const selectedHocsinh = useSelector(selectedHocsinhSelector);
  const [hinhThucDaoTao, setHinhThucDaoTao] = useState([]);
  const user = useSelector(userLoginSelector);
  const dispatch = useDispatch();
  const [danToc, setDanToc] = useState([]);
  const [namThi, setNamThi] = useState([]);
  const [khoaThi, setKhoaThi] = useState([]);

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
      LyDo: '',
      SoHieuVanbang: '',
      SoVaoSoCapBang: '',
      MaHTDT: '',
      HoiDongThi: '',
      IdNamThi: '',
      IdKhoaThi: '',
      NoiDungChinhSua: '',
      XepLoai: '',
      NgayCapBang: ''
    },
    validationSchema: useChinhSuaVanBangValidationSchema(),
    onSubmit: async (values) => {
      console.log(values);
      if (!formik.values.FileVanBan.name.endsWith('.docx') && !formik.values.FileVanBan.name.endsWith('.pdf')) {
        dispatch(showAlert(new Date().getTime().toString(), 'error', t('Định dạng file không hợp lệ')));
        return;
      }
      try {
        const formData = await convertJsonToFormData(values);

        const upDateVBCC = await updateVBCC(formData);
        if (upDateVBCC.isSuccess == false) {
          dispatch(showAlert(new Date().getTime().toString(), 'error', upDateVBCC.message.toString()));
        } else {
          dispatch(setOpenSubPopup(false));
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
    formik.setFieldValue('GioiTinh', event.target.value);
  };

  const handleHinhThucDaoTaoChange = async (event) => {
    const maHTDT = event.target.value;
    formik.setFieldValue('MaHTDT', maHTDT);
  };

  const handleDanTocChange = (event) => {
    const selectedValue = event.target.value;
    formik.setFieldValue('DanToc', selectedValue);
  };

  const handleNamThiChange = async (event) => {
    const selectedValue = event.target.value;
    formik.setFieldValue('IdNamThi', selectedValue);
    const khoaThi = await getKhoaThiByNamThi(selectedValue);
    setKhoaThi(khoaThi);
  };

  const handleKhoaThiChange = (event) => {
    const selectedValue = event.target.value;
    formik.setFieldValue('IdKhoaThi', selectedValue);
  };

  useEffect(() => {
    const fetchData = async () => {
      //get dân tộc
      const dantoc = await getAllDanToc();
      //get hình thức đào tạo
      const htdt = await getAllHinhThucDaoTao();
      setHinhThucDaoTao(htdt.data);
      setDanToc(dantoc.data);
      //get năm thi
      const namThi = await getAllNamThi();
      setNamThi(namThi.data);
      const hocSinh = await getByCCCD(selectedHocsinh.cccd);
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
          SoHieuVanbang: dataHocsinh.soHieuVanBang || '',
          SoVaoSoCapBang: dataHocsinh.soVaoSoCapBang || '',
          HoiDong: dataHocsinh.hoiDong || '',
          IdNamThi: dataHocsinh.danhMucTotNghiep.idNamThi || '',
          IdKhoaThi: dataHocsinh.idKhoaThi || '',
          NgayCapBang: dataHocsinh.danhMucTotNghiep.ngayCapBang || '',
          MaHTDT: dataHocsinh.maHinhThucDaoTao || '',
          XepLoai: dataHocsinh.xepLoai || '',
          NguoiThucHien: user.username,
          LyDo: '',
          NoiDungChinhSua: ''
        });
      }
    };
    if (openSubPopup) {
      fetchData();
    }
  }, [selectedHocsinh.cccd, openSubPopup]);

  useEffect(() => {
    const fetchData1 = async () => {
      //get khóa thi theo năm thi
      const khoaThi = await getKhoaThiByNamThi(formik.values.IdNamThi);
      setKhoaThi(khoaThi.data);
    };
    fetchData1();
  }, [formik.values.IdNamThi]);

  useEffect(() => {
    if (openSubPopup) {
      formik.resetForm();
    }
  }, [openSubPopup]);
  return (
    <form onSubmit={formik.handleSubmit}>
      <div style={{ borderBottom: '2px solid black', fontWeight: 'bold', paddingTop: 3 }}>
        <p>{t('Thông tin học sinh')}</p>
      </div>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={4} md={4}>
          <InputForm1 isRequired xs={12} label={'Họ tên'} name="HoTen" formik={formik} />
        </Grid>
        <Grid item xs={12} sm={4} md={4}>
          <InputForm1 isRequired xs={12} label={'CCCD'} name="CCCD" formik={formik} />
        </Grid>
        <Grid item xs={12} sm={2.5} md={2.5}>
          <InputForm1
            xs={12}
            isRequired
            label={'Ngày sinh'}
            formik={formik}
            name="NgaySinh"
            type="date"
            value={formik.values.NgaySinh ? new Date(formik.values.NgaySinh).toISOString().slice(0, 10) : ''}
          />
        </Grid>
      </Grid>
      <Grid container spacing={2}>
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
        <Grid item xs={12} sm={2.5} md={2.5}>
          <FormControlComponent xsForm={12} isRequire label={t('dantoc')}>
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
        <p>{t('Thông tin văn bằng')}</p>
      </div>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={4} md={4}>
          <InputForm1 isRequired xs={12} label={'Số cấp bằng'} name="SoVaoSoCapBang" formik={formik} />
        </Grid>
        <Grid item xs={12} sm={4} md={4}>
          <InputForm1 isRequired xs={12} label={'Số hiệu văn bằng'} name="SoHieuVanbang" formik={formik} />
        </Grid>
        <Grid item xs={12} sm={2.5} md={2.5}>
          <InputForm1
            xs={12}
            isRequired
            label={'Ngày cấp'}
            formik={formik}
            name="NgayCapBang"
            type="date"
            value={formik.values.NgayCapBang ? new Date(formik.values.NgayCapBang).toISOString().slice(0, 10) : ''}
          />
        </Grid>
      </Grid>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={4} md={4}>
          <FormControlComponent xsForm={12} isRequire label={t('Hình thức đào tạo')}>
            <FormControl fullWidth variant="outlined">
              <SelectForm
                formik={formik}
                keyProp="ma"
                valueProp="ten"
                item={hinhThucDaoTao}
                name="MaHTDT"
                value={formik.values.MaHTDT}
                onChange={handleHinhThucDaoTaoChange}
              />
            </FormControl>
          </FormControlComponent>{' '}
        </Grid>
        <Grid item xs={12} sm={4} md={4}>
          <InputForm1 isRequired xs={12} label={'Hội đồng thi'} name="HoiDong" formik={formik} />
        </Grid>
        <Grid item xs={12} sm={2.5} md={2.5}>
          <InputForm1 isRequired xs={12} label={'Xếp loại'} name="XepLoai" formik={formik} />
        </Grid>
      </Grid>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={2.5} md={2.5}>
          <FormControlComponent xsForm={12} isRequire label={t('Năm thi')}>
            <FormControl fullWidth variant="outlined">
              <SelectForm
                formik={formik}
                keyProp="id"
                valueProp="ten"
                item={namThi}
                name="IdNamThi"
                value={formik.values.IdNamThi}
                onChange={handleNamThiChange}
              />
            </FormControl>
          </FormControlComponent>{' '}
        </Grid>
        <Grid item xs={12} sm={4} md={4}>
          <FormControlComponent xsForm={12} isRequire label={t('Khóa thi')}>
            <FormControl fullWidth variant="outlined">
              <SelectForm
                formik={formik}
                keyProp="id"
                valueProp="ngay"
                item={khoaThi}
                name="IdKhoaThi"
                value={formik.values.IdKhoaThi}
                onChange={handleKhoaThiChange}
              />
            </FormControl>
          </FormControlComponent>{' '}
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
                  <Importfile name="PathFileVanBan" formik={formik} nameFile="FileVanBan" lable={t('button.upload')} />
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
          name="NoiDungChinhSua"
          type="text"
          isMulltiline
          placeholder={t('danhmuctotnghiep.field.noidung')}
          isRequired
          label={t('danhmuctotnghiep.field.noidung')}
        />
      </Grid>
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
