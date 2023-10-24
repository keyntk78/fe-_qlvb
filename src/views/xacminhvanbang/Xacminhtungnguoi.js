import { Button, Divider, Grid, Input, Tooltip, useMediaQuery } from '@mui/material';
import InputForm1 from 'components/form/InputForm1';
import { useFormik } from 'formik';
import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { donviSelector, openPopupSelector, selectedHocsinhSelector, userLoginSelector } from 'store/selectors';
import { generateDocument } from './xulyxuatword';
import { convertISODateToFormattedDate } from 'utils/formatDate';
import AnimateButton from 'components/extended/AnimateButton';
import { IconFilePlus, IconPrinter } from '@tabler/icons';
import ExitButton from 'components/button/ExitButton';
import { setLoading, setOpenPopup, showAlert } from 'store/actions';
import { useTranslation } from 'react-i18next';
import { AddLichSuXacMinh, getCauHinhXacMinhVanBang, getHocSinhXacMinhByCCCD } from 'services/xacminhvanbangService';
import '../../index.css';
import useXacMinhVanBangValidationSchema from 'components/validations/xacminhvanbangValidation';
//import { getKhoathiById } from 'services/khoathiService';
const Xacminhtungnguoi = () => {
  const isXs = useMediaQuery('(max-width:800px)');
  const { t } = useTranslation();
  const openPopup = useSelector(openPopupSelector);
  const [selectedFileName, setSelectedFileName] = useState('');
  const [selectFile, setSelectFile] = useState('');
  const selectedHocsinh = useSelector(selectedHocsinhSelector);
  const user = useSelector(userLoginSelector);
  const dispatch = useDispatch();
  const [datas, setDatas] = useState(null);
  const donvi = useSelector(donviSelector);

  const formik = useFormik({
    initialValues: {
      donViXacMinh: '',
      ngayBanHanh: '',
      congVanSo: ''
    },
    validationSchema: useXacMinhVanBangValidationSchema(),
    onSubmit: async () => {
      const values = new FormData();
      values.append('IdHocSinh', selectedHocsinh.id);
      values.append('DonViYeuCauXacMinh', formik.values.donViXacMinh);
      values.append('CongVanSo', formik.values.congVanSo);
      values.append('NgayTrenCongVan', formik.values.ngayBanHanh);
      values.append('FileYeuCau', selectFile);
      values.append('HoTenNguoiThucHien', user.username);
      await AddLichSuXacMinh(values);
      setLoading(true);
      generateDocument(DataToExportWord);
      setLoading(false);
      dispatch(setOpenPopup(false));
      dispatch(showAlert(new Date().getTime().toString(), 'success', 'In Thành Công'));
    }
  });
  const handleOnchangfile = (e) => {
    const file = e.target.files[0];
    setSelectedFileName(file.name);
    setSelectFile(file);
    e.target.value = null;
  };

  useEffect(() => {
    const fetchData = async () => {
      const response = await getHocSinhXacMinhByCCCD(selectedHocsinh.cccd);
      const datas = response.data;
      const response_cauhinh = await getCauHinhXacMinhVanBang(donvi.id);
      const data_cauhinh = response_cauhinh.data;
      console.log(data_cauhinh, datas);
      //const response_khoaThi = await getKhoathiById(datas.soGoc.idNamThi, datas.idKhoaThi);
      setDatas({
        uyBanNhanDan: data_cauhinh.uyBanNhanDan.toUpperCase(),
        coQuanCapBang: data_cauhinh.coQuanCapBang.toUpperCase(),
        diaPhuongCapBang: data_cauhinh.diaPhuongCapBang.toUpperCase(),
        hoTen: datas.hoTen.toUpperCase(),
        gioiTinh: datas.gioiTinh ? 'Nam' : 'Nữ',
        ngaySinh: convertISODateToFormattedDate(datas.ngaySinh),
        noiSinh: datas.noiSinh,
        queQuan: datas.diaChi,
        khoaThi: convertISODateToFormattedDate(datas.khoaThi),
        nguoiKy: data_cauhinh.nguoiKyBang.toUpperCase(),
        hoiDong: datas.hoiDong.toUpperCase()
      });
    };
    fetchData();
  }, [selectedHocsinh.cccd, donvi.id]);

  const DataToExportWord = {
    uyBanNhanDan: datas ? datas.uyBanNhanDan : '',
    coQuanCapBang: datas ? datas.coQuanCapBang : '',
    diaPhuongCapBang: datas ? datas.diaPhuongCapBang : '',
    donViXacMinh: formik.values.donViXacMinh ? formik.values.donViXacMinh.toUpperCase() : '',
    hoTen: datas ? datas.hoTen : '',
    gioiTinh: datas ? datas.gioiTinh : '',
    ngaySinh: datas ? datas.ngaySinh : '',
    noiSinh: datas ? datas.noiSinh : '',
    queQuan: datas ? datas.diaChi : '',
    ngay: formik.values.ngayBanHanh ? new Date(formik.values.ngayBanHanh).getDate() : 0,
    thang: formik.values.ngayBanHanh ? new Date(formik.values.ngayBanHanh).getMonth() + 1 : 0,
    nam: formik.values.ngayBanHanh ? new Date(formik.values.ngayBanHanh).getFullYear() : 0,
    congVanSo: formik.values.congVanSo ? formik.values.congVanSo.toUpperCase() : '',
    khoaThi: datas ? datas.khoaThi : '',
    nguoiKy: datas ? datas.nguoiKy : '',
    hoiDong: datas ? datas.hoiDong : ''
  };

  useEffect(() => {
    if (openPopup) {
      formik.resetForm();
      setSelectedFileName('');
    }
  }, [openPopup]);
  const { hoTen, ngaySinh, queQuan, khoaThi, hoiDong, coQuanCapBang } = datas || {};
  const result = (
    <p>
      Ông/bà:<span className="highlight"> {hoTen || ''}</span>, sinh ngày<span className="highlight"> {ngaySinh || ''} </span>
      tại
      <span className="highlight"> {queQuan || ''} </span> có tên trong danh sách tốt nghiệp Kỳ thi THPT khóa thi ngày{' '}
      <span className="highlight"> {khoaThi || ''} </span>
      tại Hội đồng thi <span className="highlight">{hoiDong || ''}</span>; có hồ sơ lưu tại
      <span className="highlight"> {coQuanCapBang || ''}</span>.
    </p>
  );
  return (
    <form onSubmit={formik.handleSubmit}>
      <div style={{ borderBottom: '2px solid black', fontWeight: 'bold', paddingTop: 3 }}>
        <p>{t('xacminhvanbang.title.thongtinbosung')}</p>
      </div>
      <Grid container spacing={1}>
        <Grid item xs={6} sm={12} md={12}>
          <InputForm1
            xs={12}
            label={t('xacminhvanbang.field.kinhgui')}
            name="donViXacMinh"
            formik={formik}
            placeholder={t('xacminhvanbang.field.kinhgui')}
          />
        </Grid>
        <Grid item xs={6} sm={4} md={4.5}>
          <InputForm1 xs={12} label={t('xacminhvanbang.field.congvanso')} name="congVanSo" formik={formik} placeholder={t('Công văn số')} />
        </Grid>
        <Grid item xs={6} sm={4} md={4.5}>
          <InputForm1 xs={12} label={t('xacminhvanbang.field.ngayracongvan')} name="ngayBanHanh" formik={formik} type="date" />
        </Grid>

        <Grid item container xs={isXs ? 5 : 3} mt={'30px'}>
          <Input type="file" accept=".xlsx, .xls" style={{ display: 'none' }} id="fileInput" onChange={handleOnchangfile} />
          <label htmlFor="fileInput">
            <Button variant="outlined" component="span" color="success" startIcon={<IconFilePlus />}>
              {t('button.upload')}
            </Button>
          </label>
        </Grid>
      </Grid>
      <Grid item xs={isXs ? 12 : 3} textAlign={'right'}>
        <Grid item>{selectedFileName && <span>{selectedFileName}</span>}</Grid>
      </Grid>
      <div style={{ borderBottom: '2px solid black', fontWeight: 'bold', paddingTop: 3 }}>
        <p>{t('xacminhvanbang.title.danhsachxacminh')}</p>
      </div>
      <Grid container spacing={1}>
        <Grid item xs={12} sm={12} md={12}>
          <p style={{ fontSize: '17px' }}>{result}</p>
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
                <Tooltip title={t('button.create')} placement="bottom">
                  <Button type="submit" color="info" variant="contained" size="medium" startIcon={<IconPrinter />}>
                    {t('button.create')}
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

export default Xacminhtungnguoi;
