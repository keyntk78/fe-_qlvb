import { Button, Divider, FormControl, Grid, MenuItem, Select, Tooltip, Typography, useMediaQuery } from '@mui/material';
import InputForm1 from 'components/form/InputForm1';
import useInGiayChungNhanValidationSchema from 'components/validations/ingiaychungnhanValidation';
import { useFormik } from 'formik';
import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { GetAllHocSinhDaDuyet, TongHocSinhDaDuyet } from 'services/nguoihoctotnghiepService';
import { donviSelector, openPopupSelector, selectedDanhmucSelector, userLoginSelector } from 'store/selectors';
import { generateDocument } from './XuLyXuatWord';
import { convertISODateToFormattedDate } from 'utils/formatDate';
import AnimateButton from 'components/extended/AnimateButton';
import { IconPrinter } from '@tabler/icons';
import ExitButton from 'components/button/ExitButton';
import { setOpenPopup, showAlert } from 'store/actions';
import FormControlComponent from 'components/form/FormControlComponent ';
import { useTranslation } from 'react-i18next';
import { GetCauHinhByIdDonVi } from 'services/sharedService';
const InGCNAll = () => {
  const isXs = useMediaQuery('(max-width:800px)');
  const openPopup = useSelector(openPopupSelector);
  const donvi = useSelector(donviSelector);
  const danhmuc = useSelector(selectedDanhmucSelector);
  const dispatch = useDispatch();
  const [datas, setDatas] = useState([]);
  const { t } = useTranslation();
  const [countHS, setCountHS] = useState('');
  const user = useSelector(userLoginSelector);
  const formik = useFormik({
    initialValues: {
      tenDiaPhuong: '',
      ngayBanHanh: '',
      tenHieuTruong: ''
    },
    validationSchema: useInGiayChungNhanValidationSchema(),
    onSubmit: () => {
      generateDocument(DataToExportWord, paperSize, donvi.donViQuanLy);
      dispatch(setOpenPopup(false));
      dispatch(showAlert(new Date().getTime().toString(), 'success', 'In Thành Công'));
    }
  });
  useEffect(() => {
    const fetchData = async () => {
      const response = await GetCauHinhByIdDonVi(user.username);
      const data = await response.data;
      console.log(data);
      const date = new Date(data.ngayBanHanh);
      const formattedDateForInput = date.toISOString().split('T')[0];
      formik.setValues({
        tenDiaPhuong: data.tenDiaPhuong || '',
        ngayBanHanh: formattedDateForInput || '',
        tenHieuTruong: data.hieuTruong || ''
      });
    };
    if (openPopup) {
      fetchData();
    }
  }, [openPopup]);
  const khogiayOptions = [
    { value: 'A4', label: 'Khổ giấy A4' },
    { value: 'A5', label: 'Khổ giấy A5' }
  ];
  const [paperSize, setPaperSize] = useState('A4');
  const handlePaperSizeChange = (event) => {
    setPaperSize(event.target.value);
  };

  useEffect(() => {
    const fetchDataDL = async () => {
      const response = await TongHocSinhDaDuyet(donvi.id, danhmuc.id);
      console.log(response);
      setCountHS(response.data);
    };
    fetchDataDL();
  }, [donvi, danhmuc]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await GetAllHocSinhDaDuyet(donvi.id, danhmuc.id);
      setDatas(response.data);
    };
    fetchData();
  }, [donvi.id, danhmuc.id]);

  useEffect(() => {
    if (openPopup) {
      formik.resetForm();
    }
  }, [openPopup]);

  const DataToExportWord = datas.map((data) => ({
    diaPhuong: formik.values.tenDiaPhuong.toUpperCase(),
    tenTruong: data.truong.ten.toUpperCase(),
    hoTen: data.hoTen.toUpperCase(),
    gioiTinh: data.gioiTinh ? 'Nam' : 'Nữ',
    ngaySinh: convertISODateToFormattedDate(data.ngaySinh),
    noiSinh: data.noiSinh,
    lop: data.lop,
    queQuan: data.diaChi,
    ngay: new Date(formik.values.ngayBanHanh).getDate(),
    thang: new Date(formik.values.ngayBanHanh).getMonth() + 1,
    nam: new Date(formik.values.ngayBanHanh).getFullYear(),
    xepLoaiTotNghiep: data.xepLoai,
    hieuTruong: formik.values.tenHieuTruong.toUpperCase()
  }));

  return (
    <form onSubmit={formik.handleSubmit}>
      <Grid container spacing={1}>
        <Grid item xs={12}>
          <FormControlComponent xsLabel={isXs ? 8 : 4.5} xsForm={isXs ? 4 : 5} label={t('Tổng số học sinh in giấy CNTT:')}>
            <Typography variant="h5" mt={0.7} sx={{ fontSize: 17, fontWeight: 'bold' }}>
              {countHS || 0}
            </Typography>
          </FormControlComponent>
        </Grid>
        <Grid item xs={6} sm={3} md={12}>
          <InputForm1 xs={12} label={'Tên Địa Phương'} name="tenDiaPhuong" formik={formik} />
        </Grid>
        <Grid item xs={6} sm={3} md={6}>
          <InputForm1 xs={12} label={'Ngày Ban Hành'} name="ngayBanHanh" formik={formik} type="date" />
        </Grid>
        <Grid item xs={6} sm={3} md={6}>
          <InputForm1 xs={12} label={'Tên Hiệu Trưởng'} name="tenHieuTruong" formik={formik} />
        </Grid>
        <Grid item xs={isXs ? 6 : 4} mt={isXs ? 3.5 : 1.5}>
          <FormControl fullWidth variant="outlined">
            <Select size="small" value={paperSize} onChange={handlePaperSizeChange}>
              {khogiayOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
      </Grid>
      <Grid item mt={2}>
        <Divider />
      </Grid>
      <Grid item xs={12} container spacing={2} justifyContent="flex-end" mt={1}>
        <Grid item xs={12} container spacing={2} justifyContent="flex-end">
          <Grid item xs={12} container spacing={2} justifyContent="flex-end" mt={1}>
            <Grid item>
              <AnimateButton>
                <Tooltip title={'Xác nhận in'} placement="bottom">
                  <Button type="submit" color="info" variant="contained" size="medium" startIcon={<IconPrinter />}>
                    Xuất tệp
                  </Button>
                </Tooltip>
              </AnimateButton>
            </Grid>
            <Grid item>
              <ExitButton />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </form>
  );
};

export default InGCNAll;
