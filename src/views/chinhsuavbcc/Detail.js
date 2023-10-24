import {
  Button,
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
import { useSelector } from 'react-redux';
import { openPopupSelector, selectedHocsinhSelector, upDateVBCCSelector, userLoginSelector } from 'store/selectors';
import { useTranslation } from 'react-i18next';
import { getByIdHistory } from 'services/chinhsuavbccService';
import '../../index.css';
import FormControlComponent from 'components/form/FormControlComponent ';
import config from 'config';
import { useState } from 'react';
import SelectForm from 'components/form/SelectForm';
import { getAllDanToc, getAllHinhThucDaoTao, getAllNamThi, getKhoaThiByNamThi } from 'services/sharedService';
import { IconDownload } from '@tabler/icons';
import ResetButton from 'components/button/ExitButton';
const DetailHistory = () => {
  const [hinhThucDaoTao, setHinhThucDaoTao] = useState([]);
  const user = useSelector(userLoginSelector);
  const [danToc, setDanToc] = useState([]);
  const [namThi, setNamThi] = useState([]);
  const [khoaThi, setKhoaThi] = useState([]);
  const { t } = useTranslation();
  const openPopup = useSelector(openPopupSelector);
  const selectedHocsinh = useSelector(selectedHocsinhSelector);
  const history = useSelector(upDateVBCCSelector);
  const [pathFileHistory, setPathFileHistory] = useState('');
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
    }
  });
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
      const hocSinh = await getByIdHistory(selectedHocsinh.cccd, history.id);
      const dataHocsinh = hocSinh.data.lichSus;
      //   setPathFileHistory(config.urlImages + dataHocsinh.pathFileVanBan);
      setPathFileHistory(config.urlImages + dataHocsinh.pathFileVanBan);
      if (history) {
        formik.setValues({
          HoTen: dataHocsinh.hoTen || '',
          CCCD: dataHocsinh.cccd || '',
          NgaySinh: dataHocsinh.ngaySinh || '',
          NoiSinh: dataHocsinh.noiSinh || '',
          GioiTinh: dataHocsinh.gioiTinh || '',
          DanToc: dataHocsinh.danToc || '',
          IdHocSinh: selectedHocsinh.id,
          SoHieuVanbang: dataHocsinh.soHieuVanBangCapLai ? dataHocsinh.soHieuVanBangCapLai : dataHocsinh.soHieuVanBangCu || '',
          SoVaoSoCapBang: dataHocsinh.soVaoSoCapBangCapLai ? dataHocsinh.soVaoSoCapBangCapLai : dataHocsinh.soVaoSoCapBangCu || '',
          HoiDong: dataHocsinh.hoiDongThi || '',
          IdNamThi: dataHocsinh.idNamThi || '',
          IdKhoaThi: dataHocsinh.idKhoaThi || '',
          NgayCapBang: dataHocsinh.ngayCap || '',
          MaHTDT: dataHocsinh.maHTDT || '',
          XepLoai: dataHocsinh.xepLoai || '',
          NguoiThucHien: user.username,
          NoiDungChinhSua: dataHocsinh.noiDungChinhSua || '',
          LyDo: dataHocsinh.lyDo || ''
        });
      }
    };
    fetchData();
  }, [history.id]);

  useEffect(() => {
    const fetchData1 = async () => {
      //get khóa thi theo năm thi
      const khoaThi = await getKhoaThiByNamThi(formik.values.IdNamThi);
      setKhoaThi(khoaThi.data);
    };
    fetchData1();
  }, [formik.values.IdNamThi]);

  useEffect(() => {
    if (openPopup) {
      formik.resetForm();
    }
  }, [openPopup]);
  return (
    <form onSubmit={formik.handleSubmit}>
      <div style={{ borderBottom: '2px solid black', fontWeight: 'bold', paddingTop: 3 }}>
        <p>{t('Thông tin học sinh')}</p>
      </div>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={4} md={4}>
          <InputForm1 isDisabled xs={12} label={'Họ tên'} name="HoTen" formik={formik} />
        </Grid>
        <Grid item xs={12} sm={4} md={4}>
          <InputForm1 isDisabled xs={12} label={'CCCD'} name="CCCD" formik={formik} />
        </Grid>
        <Grid item xs={12} sm={2.5} md={2.5}>
          <InputForm1
            isDisabled
            xs={12}
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
          <FormControlComponent xsLabel={0} xsForm={12} label={t('user.label.gender')}>
            <FormControl fullWidth variant="outlined">
              <RadioGroup name="GioiTinh" value={formik.values.GioiTinh ? 'true' : 'false'} onBlur={formik.handleBlur}>
                <Grid container>
                  <FormControlLabel disabled size="small" value="true" control={<Radio size="small" />} label={t('gender.male')} />
                  <FormControlLabel disabled size="small" value="false" control={<Radio size="small" />} label={t('gender.female')} />
                </Grid>
              </RadioGroup>
            </FormControl>
          </FormControlComponent>
        </Grid>
        <Grid item xs={12} sm={4} md={4}>
          <InputForm1 isDisabled xs={12} label={'Nơi sinh'} name="NoiSinh" formik={formik} />
        </Grid>
        <Grid item xs={12} sm={2.5} md={2.5}>
          <FormControlComponent xsForm={12} label={t('dantoc')}>
            <FormControl fullWidth variant="outlined">
              <SelectForm disabled formik={formik} keyProp="ten" valueProp="ten" item={danToc} name="DanToc" value={formik.values.DanToc} />
            </FormControl>
          </FormControlComponent>
        </Grid>
      </Grid>
      <div style={{ borderBottom: '2px solid black', fontWeight: 'bold', paddingTop: 3 }}>
        <p>{t('Thông tin văn bằng')}</p>
      </div>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={4} md={4}>
          <InputForm1 isDisabled xs={12} label={'Số cấp bằng'} name="SoVaoSoCapBang" formik={formik} />
        </Grid>
        <Grid item xs={12} sm={4} md={4}>
          <InputForm1 isDisabled xs={12} label={'Số hiệu văn bằng'} name="SoHieuVanbang" formik={formik} />
        </Grid>
        <Grid item xs={12} sm={2.5} md={2.5}>
          <InputForm1
            isDisabled
            xs={12}
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
          <FormControlComponent xsForm={12} label={t('Hình thức đào tạo')}>
            <FormControl fullWidth variant="outlined">
              <SelectForm
                disabled
                formik={formik}
                keyProp="ma"
                valueProp="ten"
                item={hinhThucDaoTao}
                name="MaHTDT"
                value={formik.values.MaHTDT}
              />
            </FormControl>
          </FormControlComponent>{' '}
        </Grid>
        <Grid item xs={12} sm={4} md={4}>
          <InputForm1 isDisabled xs={12} label={'Hội đồng thi'} name="HoiDong" formik={formik} />
        </Grid>
        <Grid item xs={12} sm={2.5} md={2.5}>
          <InputForm1 isDisabled xs={12} label={'Xếp loại'} name="XepLoai" formik={formik} />
        </Grid>
      </Grid>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={2.5} md={2.5}>
          <FormControlComponent xsForm={12} label={t('Năm thi')}>
            <FormControl fullWidth variant="outlined">
              <SelectForm
                formik={formik}
                disabled
                keyProp="id"
                valueProp="ten"
                item={namThi}
                name="IdNamThi"
                value={formik.values.IdNamThi}
              />
            </FormControl>
          </FormControlComponent>{' '}
        </Grid>
        <Grid item xs={12} sm={4} md={4}>
          <FormControlComponent xsForm={12} label={t('Khóa thi')}>
            <FormControl fullWidth variant="outlined">
              <SelectForm
                disabled
                formik={formik}
                keyProp="id"
                valueProp="ngay"
                item={khoaThi}
                name="IdKhoaThi"
                value={formik.values.IdKhoaThi}
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
                  <Button href={pathFileHistory} startIcon={<IconDownload />}>
                    Tải xuống
                  </Button>
                </TableCell>
                <TableCell>{t('ghichuguidon')}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </div>
      <Grid item xs={12} container spacing={2}>
        <InputForm1
          isDisabled
          formik={formik}
          minRows={3}
          maxRows={10}
          xs={12}
          name="NoiDungChinhSua"
          type="text"
          isMulltiline
          placeholder={t('danhmuctotnghiep.field.noidung')}
          label={t('danhmuctotnghiep.field.noidung')}
        />
      </Grid>
      <Grid item xs={12} container spacing={2}>
        <InputForm1
          isDisabled
          formik={formik}
          minRows={3}
          maxRows={10}
          xs={12}
          name="LyDo"
          type="text"
          isMulltiline
          placeholder={t('phoivanbang.field.lydo')}
          label={t('phoivanbang.field.lydo')}
        />
      </Grid>
      <Grid item xs={12} container spacing={2} justifyContent="flex-end" mt={1}>
        <Grid item>
          <ResetButton type="subpopup" />
        </Grid>
      </Grid>
    </form>
  );
};

export default DetailHistory;
