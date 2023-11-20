import * as React from 'react';
import { IconFileExport, IconSearch } from '@tabler/icons';
import {
  Button,
  Divider,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  // Tooltip,
  Typography,
  useMediaQuery
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { donviSelector, reloadDataSelector, userLoginSelector } from 'store/selectors';
import { setLoading, setReloadData } from 'store/actions';
import { useTranslation } from 'react-i18next';
import { createSearchParams } from 'utils/createSearchParams';
import { handleResponseStatus } from 'utils/handleResponseStatus';
import { convertISODateToFormattedDate, formatDate } from 'utils/formatDate';
import MainCard from 'components/cards/MainCard';
import { getAllDanhmucTN } from 'services/sharedService';
import BackToTop from 'components/scroll/BackToTop';
import { styled } from '@mui/system';
// import AnimateButton from 'components/extended/AnimateButton';
import { useFormik } from 'formik';
import { generateDocument } from './ExportWord';
import ExportExcel from './ExportExcel';
import { GetHocSinhTheoSoBanSao } from 'services/sobansaoService';
// import ButtonSuccess from 'components/buttoncolor/ButtonSuccess';
import { getAllTruong } from 'services/sharedService';
import { getAllKhoathiByDMTN } from 'services/khoathiService';
import GroupButtons from 'components/button/GroupButton';

export default function SoBanSao() {
  const isXs = useMediaQuery('(max-width:600px)');
  const { t } = useTranslation();
  const [search, setSearch] = useState(false);
  const reloadData = useSelector(reloadDataSelector);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [dMTN, setDMTN] = useState([]);
  const [donvis, setDonvis] = useState([]);
  const [selectDonvi, setSelectDonvi] = useState('');
  const [selectDanhmuc, setSelectDanhmuc] = useState('');
  const [disable, setDisable] = useState(false);
  const donvi = useSelector(donviSelector);
  const [selectKhoaThi, setSelectKhoaThi] = useState([]);
  const TableCell2 = styled(TableCell)(
    () => `
      border: 1px solid #ddd;
      font-size: 13px;
      padding: 8px;
    `
  );

  const TableCell1 = styled(TableCell)(
    () => `
      border: 1px solid #ddd;
      font-size: 13px;
      text-align: center;
      vertical-align: middle;
      padding: 5px;
    `
  );

  const [pageState, setPageState] = useState({
    isLoading: false,
    data: [],
    total: 0,
    order: 1,
    orderDir: 'ASC',
    startIndex: 0,
    pageSize: -1,
    DMTN: '',
    donVi: '',
    khoaThi: ''
  });

  const [pageState1, setPageState1] = useState({
    isLoading: false,
    data: [],
    total: 0,
    order: 1,
    orderDir: 'ASC',
    startIndex: 0,
    pageSize: -1,
    DMTN: '',
    donVi: '',
    khoaThi: ''
  });
  const [khoaThis, setKhoaThis] = useState([]);

  const handleSearch = () => {
    setSearch(true);
    const donviSelect = pageState.donVi;
    const selectedDonviInfo = donvis.find((donvi) => donvi.id === donviSelect);
    setSelectDonvi(selectedDonviInfo);
    const danhmucSelect = pageState.DMTN;
    const selectedDanhmucInfo = dMTN.find((dmtn) => dmtn.id === danhmucSelect);
    setSelectDanhmuc(selectedDanhmucInfo.id);
    const khoaThiSelect = pageState.khoaThi;
    const selectedKhoaThiInfo = khoaThis.find((khoathi) => khoathi.id === khoaThiSelect);
    setSelectKhoaThi(selectedKhoaThiInfo.id);
  };

  const handleExport = async () => {
    // e.preventDefault();
    dispatch(setLoading(true));
    await ExportExcel(formik, pageState1, selectDanhmuc, selectDonvi, selectKhoaThi, donvi);
    dispatch(setLoading(false));
  };

  const handleExportWord = async () => {
    // e.preventDefault();
    setLoading(true);
    generateDocument(pageState1.data, additionalData, donvi);
    setLoading(false);
    console.log('123');
  };

  const xuatTep = [
    {
      type: 'exportExcel',
      handleClick: handleExport
    },
    {
      type: 'exportWord',
      handleClick: handleExportWord
    }
  ];

  const handleChange = (e, value) => {
    e.preventDefault();
    setPageState((old) => ({ ...old, startIndex: value }));
  };

  const handleChangeRowsPerPage = (e) => {
    const newPageSize = e.target.value;
    setPageState((old) => ({ ...old, pageSize: newPageSize }));
  };

  const user = useSelector(userLoginSelector);

  useEffect(() => {
    const fetchDataDL = async () => {
      dispatch(setLoading(true));
      const donvi = await getAllTruong(user.username);
      if (donvi.data && donvi.data.length > 0) {
        setDonvis(donvi.data);
        setPageState((old) => ({ ...old, donVi: donvi.data[0].id }));
        setSelectDonvi(donvi.data[0]);
        setDisable(false);
      } else {
        setDonvis([]);
        setPageState((old) => ({ ...old, donVi: '' }));
        setSelectDonvi('');
        setDisable(true);
      }
    };
    fetchDataDL();
  }, []);

  useEffect(() => {
    const fetchDataDL = async () => {
      const danhmuc = await getAllDanhmucTN(user ? user.username : '');
      if (danhmuc.data && danhmuc.data.length > 0) {
        setDMTN(danhmuc.data);
        setPageState((old) => ({ ...old, DMTN: danhmuc.data[0].id }));
        setSelectDanhmuc(danhmuc.data[0].id);
        setDisable(false);
      } else {
        setDMTN([]);
        setPageState((old) => ({ ...old, DMTN: '' }));
        setSelectDanhmuc('');
        setDisable(true);
      }
      dispatch(setLoading(false));
    };
    fetchDataDL();
  }, []);

  useEffect(() => {
    const fetchDataDL = async () => {
      const response = await getAllKhoathiByDMTN(selectDanhmuc);
      console.log(response);
      console.log(selectDanhmuc);
      if (response.data && response.data.length > 0) {
        setKhoaThis(response.data);
        setPageState((old) => ({ ...old, khoaThi: response.data[0].id }));
        setSelectKhoaThi(response.data[0].id);
      } else {
        setKhoaThis([]);
      }
      dispatch(setLoading(false));
    };
    if (selectDanhmuc) {
      fetchDataDL();
    }
  }, [selectDanhmuc]);

  const formik = useFormik({
    initialValues: {
      UyBanNhanDan: '',
      CoQuanCapBang: '',
      QuyetDinh: '',
      NguoiKyBang: '',
      DiaPhuongCapBang: '',
      HeDaoTao: '',
      HinhThucDaoTao: '',
      NgayCapBang: '',
      TenKyThi: '',
      KhoaThi: ''
    }
  });

  useEffect(() => {
    const fetchData = async () => {
      setPageState((old) => ({ ...old, isLoading: true }));
      const params = await createSearchParams(pageState);
      params.append('idDanhMucTotNghiep', pageState.DMTN);
      params.append('idTruong', pageState.donVi);
      params.append('IdKhoaThi', pageState.khoaThi ? pageState.khoaThi : khoaThis && khoaThis.length > 0 ? khoaThis[0].id : '');

      const response = await GetHocSinhTheoSoBanSao(params);
      const data = response.data;
      formik.setValues({
        UyBanNhanDan: data.donViQuanLy.tenUyBanNhanDan || '',
        CoQuanCapBang: data.donViQuanLy.tenCoQuanCapBang || '',
        NamThi: data.danhMucTotNghiep.namThi || '',
        QuyetDinh: data.danhMucTotNghiep.soQuyetDinh || '',
        NguoiKyBang: data.donViQuanLy.hoTenNguoiKySoGoc || '',
        DiaPhuongCapBang: data.donViQuanLy.tenDiaPhuongCapBang || '',
        HeDaoTao: data.truong.heDaoTao.toUpperCase() || '',
        HinhThucDaoTao: data.truong.hinhThucDaoTao || '',
        NgayCapBang: formatDate(data.danhMucTotNghiep.ngayCapBang) || '',
        TenKyThi: data.danhMucTotNghiep.tenKyThi || '',
        KhoaThi: convertISODateToFormattedDate(data.khoaThi.ngay) || ''
      });
      const check = handleResponseStatus(response, navigate);
      if (check) {
        const data = await response.data.donYeuCaus;
        const dataWithIds = data.map((row, index) => ({
          idx: pageState.startIndex * pageState.pageSize + index + 1,
          gioiTinh_fm: row.hocSinh.gioiTinh ? t('gender.male') : t('gender.female'),
          ngaySinh_fm: convertISODateToFormattedDate(row.hocSinh.ngaySinh),
          hoTen_fm: row.hocSinh.hoTen,
          noiSinh_fm: row.hocSinh.noiSinh,
          danToc_fm: row.hocSinh.danToc,
          hoiDong_fm: row.hocSinh.hoiDong,
          xepLoai_fm: row.hocSinh.xepLoai,
          soHieuVanBang_fm: row.hocSinh.soHieuVanBang,
          soVaoSoBanSao_fm: row.soVaoSoBanSao,
          ...row
        }));
        dispatch(setReloadData(false));
        setPageState((old) => ({
          ...old,
          isLoading: false,
          data: dataWithIds,
          total: data.totalRow || 0
        }));
      } else {
        setIsAccess(false);
      }
    };
    if (search || reloadData) {
      fetchData();
      setSearch(false);
    }
  }, [pageState.search, pageState.order, pageState.orderDir, pageState.startIndex, pageState.pageSize, reloadData, search]);

  useEffect(() => {
    const fetchData = async () => {
      const params = await createSearchParams(pageState1);
      params.append('idDanhMucTotNghiep', pageState.DMTN);
      params.append('idTruong', pageState.donVi);
      params.append('IdKhoaThi', pageState.khoaThi ? pageState.khoaThi : khoaThis && khoaThis.length > 0 ? khoaThis[0].id : '');

      const response = await GetHocSinhTheoSoBanSao(params);
      const check = handleResponseStatus(response, navigate);
      if (check) {
        const data = await response.data.donYeuCaus;
        console.log(data);
        const dataWithIds = data.map((row, index) => ({
          idx: index + 1,
          gioiTinh_fm: row.hocSinh.gioiTinh ? t('gender.male') : t('gender.female'),
          ngaySinh_fm: convertISODateToFormattedDate(row.hocSinh.ngaySinh),
          hoTen_fm: row.hocSinh.hoTen,
          noiSinh_fm: row.hocSinh.noiSinh,
          danToc_fm: row.hocSinh.danToc,
          hoiDong_fm: row.hocSinh.hoiDong,
          xepLoai_fm: row.hocSinh.xepLoai,
          soHieuVanBang_fm: row.hocSinh.soHieuVanBang,
          soVaoSoBanSao_fm: row.soVaoSoBanSao,
          ...row
        }));
        dispatch(setReloadData(false));
        setPageState1((old) => ({
          ...old,
          isLoading: false,
          data: dataWithIds,
          total: data.totalRow || 0
        }));
      } else {
        setIsAccess(false);
      }
    };
    if (search || reloadData) {
      fetchData();
    }
  }, [pageState.search, pageState.order, pageState.orderDir, pageState.startIndex, pageState.pageSize, reloadData, search]);

  const handleDanhMucChange = (event) => {
    const selectedValue = event.target.value;
    setPageState((old) => ({ ...old, DMTN: selectedValue }));
    setSelectDanhmuc(selectedValue);
  };

  const handleSchoolChange = (event) => {
    const selectedValue = event.target.value;
    setPageState((old) => ({ ...old, donVi: selectedValue }));
  };
  const handleKhoaThiChange = (event) => {
    const selectedValue = event.target.value;
    setPageState((old) => ({ ...old, khoaThi: selectedValue }));
    setSelectKhoaThi(selectedValue);
  };
  const additionalData = {
    uyBanNhanDan: formik.values.UyBanNhanDan.toUpperCase(),
    coQuanCapBang: formik.values.CoQuanCapBang.toUpperCase(),
    quyetDinh: formik.values.QuyetDinh,
    donVi: selectDonvi ? selectDonvi.ten : '',
    namThi: formik.values.NamThi,
    heDaoTao: formik.values.HeDaoTao.toUpperCase(),
    hinhThucDaoTao: formik.values.HinhThucDaoTao,
    diaPhuong: formik.values.DiaPhuongCapBang,
    ngayCap: formik.values.NgayCapBang,
    nguoiKy: formik.values.NguoiKyBang,
    khoaThi: formik.values.KhoaThi,
    tenKyThi: formik.values.TenKyThi
  };

  return (
    <>
      <MainCard
        title={t('sobansao.title')}
        secondary={
          <Grid item>
            <GroupButtons buttonConfigurations={xuatTep} icon={IconFileExport} title={t('button.export')} />
          </Grid>
        }
      >
        <Grid item container mb={1} spacing={1} mt={1} justifyContent={'center'} alignItems="center">
          <Grid item xs={isXs ? 12 : 4}>
            <FormControl fullWidth variant="outlined">
              <InputLabel>{t('danhmuc.title')}</InputLabel>
              <Select size="small" name="id" value={pageState.DMTN} onChange={handleDanhMucChange} label={t('danhmuc.title')}>
                {dMTN && dMTN.length > 0 ? (
                  dMTN.map((dmtn) => (
                    <MenuItem key={dmtn.id} value={dmtn.id}>
                      {dmtn.tieuDe}
                    </MenuItem>
                  ))
                ) : (
                  <MenuItem value="">No data available</MenuItem>
                )}
              </Select>
            </FormControl>
          </Grid>
          <Grid item container xs={isXs ? 12 : 2}>
            <FormControl fullWidth variant="outlined">
              <InputLabel>{t('Khóa thi')}</InputLabel>
              <Select label={t('Khóa thi')} size="small" name="khoaThi" value={selectKhoaThi} onChange={handleKhoaThiChange}>
                {khoaThis && khoaThis.length > 0 ? (
                  khoaThis.map((data) => (
                    <MenuItem key={data.id} value={data.id}>
                      {data && data.ngay ? convertISODateToFormattedDate(data.ngay) : ''}
                    </MenuItem>
                  ))
                ) : (
                  <MenuItem value="">{t('selected.nodata')}</MenuItem>
                )}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={isXs ? 12 : 4}>
            <FormControl fullWidth variant="outlined">
              <InputLabel>{t('donvitruong.title')}</InputLabel>
              <Select size="small" name="truongId" value={pageState.donVi} onChange={handleSchoolChange} label={t('donvitruong.title')}>
                {donvis && donvis.length > 0 ? (
                  donvis.map((donvi) => (
                    <MenuItem key={donvi.id} value={donvi.id}>
                      {donvi.ten}
                    </MenuItem>
                  ))
                ) : (
                  <MenuItem value="">No data available</MenuItem>
                )}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={isXs ? 6 : 2}>
            <Button
              variant="contained"
              title={t('button.search')}
              fullWidth
              onClick={handleSearch}
              color="info"
              startIcon={<IconSearch />}
              disabled={disable}
            >
              {t('button.search')}
            </Button>
          </Grid>
        </Grid>
        {pageState.data.length > 0 ? (
          <>
            <Grid container justifyContent={'flex-start'}>
              <Grid item>
                {/* <Pagination count={count || 0} page={pageState.startIndex + 1 || 0} onChange={handleChange} /> */}
                <TablePagination
                  component="div"
                  count={pageState.total || 0}
                  page={pageState.startIndex || 0}
                  onPageChange={handleChange}
                  rowsPerPage={pageState.pageSize || 0}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                  labelRowsPerPage={t('Số dòng hiển thị')}
                  labelDisplayedRows={({ from, to, count }) => `${from}-${to} trên ${count}`}
                />
              </Grid>
            </Grid>
          </>
        ) : (
          ''
        )}
        <Grid item mt={pageState.data.length > 0 ? 0 : 2}>
          <Divider />
        </Grid>
        <Grid item container spacing={1} mt={6}>
          <Grid
            item
            container
            lg={3}
            md={4}
            sm={4}
            xs={5}
            justifyContent={'center'}
            textAlign={'center'}
            flexDirection="column"
            alignItems="center"
          >
            <Typography variant="body1" fontSize={14}>
              {formik.values.UyBanNhanDan.toUpperCase()}
            </Typography>
            <Typography variant="h5" fontSize={15} fontWeight={'bold'}>
              {formik.values.CoQuanCapBang.toUpperCase()}
            </Typography>
            <Grid item mt={0}>
              <Divider width={120} />
            </Grid>
          </Grid>
          <Grid item lg={3} md={0.1} sm={1} xs={1}></Grid>
          <Grid item container lg={6} md={7.8} sm={7} xs={6} justifyContent={'center'} textAlign={'center'}>
            <Typography variant="h4" fontSize={18}>
              SỔ BẢN SAO BẰNG TỐT NGHIỆP {formik.values.HeDaoTao.toUpperCase()}
            </Typography>
          </Grid>
        </Grid>
        {donvi.donViQuanLy == 1 ? (
          <Grid item container mb={3} spacing={1} mt={3}>
            <Grid item lg={8} md={8} sm={8} xs={7} flexDirection={'column'}>
              <Typography variant="body1" fontSize={14}>
                Quyết định công nhận tốt nghiệp số {formik.values.QuyetDinh}
              </Typography>
              <Typography variant="body1" fontSize={14}>
                Kỳ thi: {formik.values.TenKyThi}
              </Typography>
              <Typography variant="body1" fontSize={14}>
                Năm tốt nghiệp: {formik.values.NamThi}
              </Typography>
            </Grid>
            <Grid item lg={4} md={4} sm={4} xs={5} flexDirection={'column'}>
              <Typography variant="body1" fontSize={14}>
                Khóa thi: {formik.values.KhoaThi}
              </Typography>
              <Typography variant="body1" fontSize={14}>
                Học sinh trường: {selectDonvi ? selectDonvi.ten : ''}
              </Typography>
              {/* <Typography variant="body1" fontSize={14}>
              Hình thức học: {formik.values.HinhThucDaoTao}
            </Typography> */}
            </Grid>
          </Grid>
        ) : (
          <Grid item container mb={3} spacing={1} mt={3}>
            <Grid item lg={8} md={8} sm={8} xs={7} flexDirection={'column'}>
              <Typography variant="body1" fontSize={14}>
                Quyết định công nhận tốt nghiệp số {formik.values.QuyetDinh}
              </Typography>
              <Typography variant="body1" fontSize={14}>
                Học sinh trường: {selectDonvi ? selectDonvi.ten : ''}
              </Typography>
            </Grid>
            <Grid item lg={4} md={4} sm={4} xs={5} flexDirection={'column'}>
              <Typography variant="body1" fontSize={14}>
                Năm tốt nghiệp: {formik.values.NamThi}
              </Typography>
              <Typography variant="body1" fontSize={14}>
                Hình thức học: {formik.values.HinhThucDaoTao}
              </Typography>
            </Grid>
          </Grid>
        )}
        <TableContainer component={Paper} style={{ border: '1px solid #ddd', borderRadius: 0 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell1 style={{ width: '30px' }}>STT</TableCell1>
                <TableCell1 style={{ width: 'auto' }}>Họ và tên</TableCell1>
                <TableCell1 style={{ width: '83px' }}>Ngày tháng năm sinh</TableCell1>
                <TableCell1 style={{ width: 'auto' }}>Nơi sinh</TableCell1>
                <TableCell1 style={{ width: '45px' }}>Giới tính</TableCell1>
                <TableCell1 style={{ width: 'auto' }}>Dân tộc</TableCell1>
                {donvi.donViQuanLy == 1 && <TableCell1 style={{ width: 'auto' }}>Điểm thi</TableCell1>}
                <TableCell1 style={{ width: '80px' }}>Xếp loại tốt nghiệp</TableCell1>
                <TableCell1 style={{ width: '100px' }}>Số hiệu văn bằng</TableCell1>
                <TableCell1 style={{ width: 'auto' }}>Số vào sổ bản sao</TableCell1>
                <TableCell1 style={{ width: '87px' }}>Chữ ký người nhận</TableCell1>
                <TableCell1 style={{ width: '35px' }}>Ghi chú</TableCell1>
              </TableRow>
            </TableHead>
            <TableBody>
              {pageState.data.map((row) => (
                <TableRow key={row.id}>
                  <TableCell2>{row.idx}</TableCell2>
                  <TableCell2>{row.hoTen_fm}</TableCell2>
                  <TableCell2>{row.ngaySinh_fm}</TableCell2>
                  <TableCell2>{row.noiSinh_fm}</TableCell2>
                  <TableCell2>{row.gioiTinh_fm}</TableCell2>
                  <TableCell2>{row.danToc_fm}</TableCell2>
                  {donvi.donViQuanLy == 1 && <TableCell2>{row.hoiDong_fm}</TableCell2>}
                  <TableCell2>{row.xepLoai_fm}</TableCell2>
                  <TableCell2>{row.soHieuVanBang_fm}</TableCell2>
                  <TableCell2 style={{ textAlign: 'center' }}>{row.soVaoSoBanSao_fm}</TableCell2>
                  <TableCell2></TableCell2>
                  <TableCell2></TableCell2>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Grid item container spacing={1} mt={1}>
          <Grid item lg={8} md={7} sm={7} xs={6}></Grid>
          <Grid
            item
            container
            lg={4}
            md={5}
            sm={5}
            xs={6}
            flexDirection="column"
            alignItems="center"
            justifyContent={'center'}
            textAlign={'center'}
          >
            <Grid item>
              <Typography variant="body1" fontSize={14} style={{ fontStyle: 'italic' }}>
                {formik.values.DiaPhuongCapBang}, {formik.values.NgayCapBang}
              </Typography>
            </Grid>
            <Grid item mt={0.4}>
              <Typography variant="body1" fontSize={15} style={{ fontWeight: 'bold' }}>
                {donvi.donViQuanLy == 1 ? 'GIÁM ĐỐC' : 'TRƯỞNG PHÒNG'}
              </Typography>
            </Grid>
            <Grid item mt={10}>
              <Typography variant="body1" fontSize={15} style={{ fontWeight: 'bold' }}>
                {formik.values.NguoiKyBang}
              </Typography>
            </Grid>
          </Grid>
        </Grid>
      </MainCard>
      <BackToTop />
    </>
  );
}
