import * as React from 'react';
import { IconFileExport, IconSearch } from '@tabler/icons';
import {
  Button,
  Divider,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  // Pagination,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
  TextField,
  useMediaQuery
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { donviSelector, infoHocSinhSelector, reloadDataSelector, selectedInfoMessageSelector, userLoginSelector } from 'store/selectors';
import { selectedDanhmuc, selectedDonvitruong, setLoading, setReloadData } from 'store/actions';
import { useTranslation } from 'react-i18next';
import { createSearchParams } from 'utils/createSearchParams';
import { handleResponseStatus } from 'utils/handleResponseStatus';
import { convertISODateToFormattedDate, formatDate } from 'utils/formatDate';
import MainCard from 'components/cards/MainCard';
import { getAllDanhmucTN } from 'services/sharedService';
import BackToTop from 'components/scroll/BackToTop';
import { styled } from '@mui/system';
import { useFormik } from 'formik';
import { generateDocument } from '../sogoc/ExportWord';
import ExportExcel from '../sogoc/ExportExcel';
import { getHocSinhTheoSoCapPhatBang } from 'services/socapphatbangService';
import { getAllKhoathiByDMTN } from 'services/khoathiService';
import GroupButtons from 'components/button/GroupButton';
import { GetTruongHasPermision } from 'services/danhmuctotnghiepService';

export default function SoCapPhatBang() {
  const isXs = useMediaQuery('(max-width:600px)');
  const { t } = useTranslation();
  const [search, setSearch] = useState(false);
  const reloadData = useSelector(reloadDataSelector);
  const donvi = useSelector(donviSelector);
  const [khoaThis, setKhoaThis] = useState([]);
  const [selectKhoaThi, setSelectKhoaThi] = useState([]);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [dMTN, setDMTN] = useState([]);
  const [selectDanhmuc, setSelectDanhmuc] = useState('');
  const [donvis, setDonvis] = useState([]);
  const [selectDonvi, setSelectDonvi] = useState('');
  const [selectTenDonVi, setSelectTenDonvi] = useState('');
  const [firstLoad, setFirstLoad] = useState(true);
  const [loadData, setLoadData] = useState(false);
  const infoHocSinh = useSelector(infoHocSinhSelector);
  const infoMessage = useSelector(selectedInfoMessageSelector);
  const user = useSelector(userLoginSelector);

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
    pageSize: 25,
    DMTN: '',
    donVi: donvi.ten,
    khoaThi: '',
    hoTen: '',
    soVaoSoCapBang: '',
    DonVi: ''
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
    donVi: donvi.ten,
    khoaThi: '',
    hoTen: '',
    soVaoSoCapBang: ''
  });

  const handleSearch = () => {
    setSearch(!search);
    setSelectDanhmuc(pageState.DMTN);
    const danhmucSelect = pageState.DMTN;
    setSelectDonvi(pageState.DonVi);
    const selectedDanhmucInfo = dMTN.find((dmtn) => dmtn.id === danhmucSelect);
    setSelectDanhmuc(selectedDanhmucInfo.id);
    const khoaThiSelect = pageState.khoaThi;
    const selectedKhoaThiInfo = khoaThis.find((khoathi) => khoathi.id === khoaThiSelect);
    setSelectKhoaThi(selectedKhoaThiInfo.id);

    const donviSelect = pageState.DonVi;
    const selectedDonviInfo = donvis.find((donvi) => donvi.idTruong === donviSelect);
    dispatch(selectedDonvitruong(selectedDonviInfo));
  };

  const handleExport = async () => {
    dispatch(setLoading(true));
    await ExportExcel(formik, pageState1, selectDanhmuc, donvi, selectKhoaThi, donvi, selectDonvi);
    dispatch(setLoading(false));
  };

  const handleExportWord = async () => {
    setLoading(true);
    await generateDocument(pageState1.data, additionalData, donvi);
    setLoading(false);
  };

  const handleChange = (e, value) => {
    e.preventDefault();
    setPageState((old) => ({ ...old, startIndex: value }));
  };

  const handleChangeRowsPerPage = (e) => {
    const newPageSize = e.target.value;
    setPageState((old) => ({ ...old, pageSize: newPageSize }));
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
  useEffect(() => {
    const fetchDataDL = async () => {
      const danhmuc = await getAllDanhmucTN(user ? user.username : '');
      if (danhmuc.data && danhmuc.data.length > 0) {
        setDMTN(danhmuc.data);
      } else {
        setDMTN([]);
        setPageState((old) => ({ ...old, DMTN: '' }));
        setSelectDanhmuc('');
      }
      dispatch(setLoading(false));
    };
    fetchDataDL();
  }, [user]);

  useEffect(() => {
    const fetchDataDL = async () => {
      if (donvi != 0 && donvi.laPhong) {
        const params = new URLSearchParams();
        params.append('pageSize', -1);
        const donvi = await GetTruongHasPermision(selectDanhmuc, params);
        if (donvi && donvi.data && donvi.data.truongs && donvi.data.truongs.length > 0) {
          setDonvis(donvi.data.truongs);
        } else {
          setDonvis([]);
        }
      }
    };
    if (selectDanhmuc) {
      fetchDataDL();
    }
  }, [selectDanhmuc]);

  useEffect(() => {
    if (donvis && donvis.length > 0 && dMTN && dMTN.length > 0) {
      if (infoMessage) {
        setPageState((old) => ({ ...old, donVi: infoMessage.IdTruong, DMTN: infoMessage.IdDanhMucTotNghiep }));
        setSelectDanhmuc(infoMessage.IdDanhMucTotNghiep);
        setSelectDonvi(infoMessage.IdTruong);
        const selectedDonviInfo = donvis.find((donvi) => donvi.id === infoMessage.IdTruong);
        const selectedDanhmucInfo = dMTN.find((dmtn) => dmtn.id === infoMessage.IdDanhMucTotNghiep);
        dispatch(selectedDanhmuc(selectedDanhmucInfo));
        dispatch(selectedDonvitruong(selectedDonviInfo));
        setLoadData(true);
      }
    }
  }, [infoMessage, donvis, dMTN]);
  console.log(selectDonvi);
  useEffect(() => {
    if (dMTN.length > 0 && donvis.length > 0 && infoHocSinh) {
      const fetchData = async () => {
        try {
          const selectDonvi = donvis.find((item) => item.ten === infoHocSinh.tenTruong);
          dispatch(selectedDonvitruong(selectDonvi));
          setPageState((old) => ({
            ...old,
            cccd: infoHocSinh.cccd,
            hoTen: infoHocSinh.hoTen,
            trangThai: infoHocSinh.trangThai,
            DMTN: infoHocSinh.idDanhMucTotNghiep,
            DonVi: selectDonvi.id
          }));
          setSelectDanhmuc(infoHocSinh.idDanhMucTotNghiep);
          setSelectDonvi(selectDonvi.id);
          const selectDanhmuc = dMTN.find((item) => item.id === infoHocSinh.idDanhMucTotNghiep);
          dispatch(selectedDanhmuc(selectDanhmuc));
          setLoadData(true);
        } catch (error) {
          console.error(error);
        }
      };
      setDisabled1(true);
      fetchData();
    }
  }, [infoHocSinh, dMTN, donvis]);

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
      KhoaThi: '',
      TenKyThi: '',
      TenTruong: ''
    }
  });

  useEffect(() => {
    const fetchData = async () => {
      setPageState((old) => ({ ...old, isLoading: true }));
      const params = await createSearchParams(pageState);
      params.append('idDanhMucTotNghiep', pageState.DMTN);
      params.append('idTruong', donvi != 0 && donvi.laPhong ? pageState.DonVi : donvi.id);
      params.append('IdKhoaThi', pageState.khoaThi ? pageState.khoaThi : '');
      params.append('HoTen', pageState.hoTen);
      params.append('SoVaoSoCapBang', pageState.soVaoSoCapBang);

      console.log(pageState, donvi.id);
      const response = await getHocSinhTheoSoCapPhatBang(params);
      const data = response.data;
      formik.setValues({
        UyBanNhanDan: data.CauHinh.TenUyBanNhanDan || '',
        CoQuanCapBang: data.CauHinh.TenCoQuanCapBang || '',
        NamThi: data.DanhMucTotNghiep.NamThi || '',
        QuyetDinh: data.DanhMucTotNghiep.SoQuyetDinh || '',
        NguoiKyBang: data.CauHinh.HoTenNguoiKySoGoc || '',
        DiaPhuongCapBang: data.CauHinh.TenDiaPhuongCapBang || '',
        HeDaoTao: data.Truong.HeDaoTao.toUpperCase() || '',
        HinhThucDaoTao: data.Truong.HinhThucDaoTao || '',
        NgayCapBang: formatDate(data.DanhMucTotNghiep.NgayCapBang) || '',
        TenKyThi: data.DanhMucTotNghiep.TenKyThi || '',
        KhoaThi: convertISODateToFormattedDate(data.KhoaThi.Ngay) || '',
        TenTruong: donvi != 0 && donvi.laPhong ? selectTenDonVi : donvi.ten
      });
      const check = handleResponseStatus(response, navigate);
      if (check) {
        const data = await response.data.SoCapPhatBang;
        const dataWithIds = data.hocSinhs.map((row, index) => ({
          idx: pageState.startIndex * pageState.pageSize + index + 1,
          gioiTinh_fm: row.GioiTinh ? t('gender.male') : t('gender.female'),
          ngaySinh_fm: convertISODateToFormattedDate(row.NgaySinh),
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
    if (!firstLoad || loadData) {
      if (loadData) {
        fetchData();
        setLoadData(false);
        dispatch(setSelectedInfoMessage(''));
        dispatch(setInfoHocSinh(null));
      } else {
        fetchData();
      }
    } else {
      setFirstLoad(false);
    }
  }, [pageState.search, pageState.order, pageState.orderDir, pageState.startIndex, pageState.pageSize, reloadData, search, loadData]);

  useEffect(() => {
    const fetchData = async () => {
      const params = await createSearchParams(pageState1);
      params.append('idDanhMucTotNghiep', pageState.DMTN);
      params.append('idTruong', donvi != 0 && donvi.laPhong ? pageState.DonVi : donvi.id);
      params.append('IdKhoaThi', pageState.khoaThi ? pageState.khoaThi : '');
      params.append('HoTen', pageState.hoTen);
      params.append('SoVaoSoCapBang', pageState.soVaoSoCapBang);
      const response = await getHocSinhTheoSoCapPhatBang(params);
      const check = handleResponseStatus(response, navigate);
      if (check) {
        const data = await response.data.SoCapPhatBang;
        const dataWithIds = data.hocSinhs.map((row, index) => ({
          idx: index + 1,
          gioiTinh_fm: row.GioiTinh ? t('gender.male') : t('gender.female'),
          ngaySinh_fm: convertISODateToFormattedDate(row.NgaySinh),
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
    if (!firstLoad || loadData) {
      if (loadData) {
        fetchData();
        setLoadData(false);
        dispatch(setSelectedInfoMessage(''));
        dispatch(setInfoHocSinh(null));
      } else {
        fetchData();
      }
    } else {
      setFirstLoad(false);
    }
  }, [pageState.search, pageState.order, pageState.orderDir, pageState.startIndex, pageState.pageSize, reloadData, search, loadData]);

  useEffect(() => {
    const fetchDataDL = async () => {
      const response = await getAllKhoathiByDMTN(selectDanhmuc);
      if (response.data && response.data.length > 0) {
        setKhoaThis(response.data);
      } else {
        setKhoaThis([]);
      }
    };
    if (selectDanhmuc) {
      fetchDataDL();
    }
  }, [selectDanhmuc]);

  const handleDanhMucChange = (event) => {
    const selectedValue = event.target.value;
    const danhMuc = selectedValue === 'all' ? '' : selectedValue;
    setPageState((old) => ({ ...old, DMTN: danhMuc }));
    setSelectDanhmuc(danhMuc);
  };

  const handleSchoolChange = (event) => {
    const selectedValue = event.target.value;
    const maDonvi = selectedValue === 'all' ? '' : selectedValue;
    const selectedCategory = donvis.find((donvi) => donvi.id === selectedValue);
    setSelectTenDonvi(selectedCategory ? selectedCategory.tenTruong : '');
    setPageState((old) => ({ ...old, DonVi: maDonvi }));
  };

  const handleKhoaThiChange = (event) => {
    const selectedValue = event.target.value;
    const khoathi = selectedValue === 'all' ? '' : selectedValue;
    setPageState((old) => ({ ...old, khoaThi: khoathi }));
    setSelectKhoaThi(selectedValue);
  };

  const additionalData = {
    uyBanNhanDan: formik.values.UyBanNhanDan.toUpperCase(),
    coQuanCapBang: formik.values.CoQuanCapBang.toUpperCase(),
    quyetDinh: formik.values.QuyetDinh,
    donVi: donvi != 0 && donvi.laPhong ? selectDonvi : donvi.ten,
    namThi: formik.values.NamThi,
    title: `SỔ CẤP PHÁT BẰNG TỐT NGHIỆP ${formik.values.HeDaoTao.toUpperCase()}`,
    hinhThucDaoTao: formik.values.HinhThucDaoTao,
    diaPhuong: formik.values.DiaPhuongCapBang,
    ngayCap: formik.values.NgayCapBang,
    nguoiKy: formik.values.NguoiKyBang,
    khoaThi: formik.values.KhoaThi,
    tenKyThi: formik.values.TenKyThi
  };

  // const count = pageState.total ? Math.floor(parseInt(pageState.total) / parseInt(pageState.pageSize)) + 1 : 0;

  return (
    <>
      <MainCard title={t('socapphatbang.title')}>
        <Grid item container mb={1} spacing={1} mt={1} justifyContent={'center'} alignItems="center">
          <Grid item lg={4} md={4} sm={4} xs={isXs ? 12 : 4}>
            <FormControl fullWidth variant="outlined" size="small">
              <InputLabel>{t('danhmuc.title')}</InputLabel>
              <Select
                name="id"
                value={pageState.DMTN === '' ? 'all' : pageState.DMTN}
                onChange={handleDanhMucChange}
                label={t('danhmuc.title')}
              >
                <MenuItem value="all">Tất cả</MenuItem>
                {dMTN && dMTN.length > 0 ? (
                  dMTN.map((dmtn) => (
                    <MenuItem key={dmtn.id} value={dmtn.id}>
                      {dmtn.tieuDe}
                    </MenuItem>
                  ))
                ) : (
                  <MenuItem value="">Không có dữ liệu</MenuItem>
                )}
              </Select>
            </FormControl>
          </Grid>
          {donvi != 0 && donvi.laPhong && (
            <Grid item lg={4} md={4} sm={4} xs={isXs ? 12 : 4}>
              <FormControl fullWidth variant="outlined" size="small">
                <InputLabel>{t('donvitruong.title')}</InputLabel>
                <Select
                  name="truongId"
                  value={pageState.DonVi === '' ? 'all' : pageState.DonVi}
                  onChange={handleSchoolChange}
                  label={t('donvitruong.title')}
                >
                  <MenuItem value="all">{t('select.all')}</MenuItem>
                  {donvis && donvis.length > 0 ? (
                    donvis.map((donvi) => (
                      <MenuItem key={donvi.idTruong} value={donvi.idTruong}>
                        {donvi.tenTruong}
                      </MenuItem>
                    ))
                  ) : (
                    <MenuItem value="">Không có dữ liệu</MenuItem>
                  )}
                </Select>
              </FormControl>
            </Grid>
          )}

          <Grid item container xs={isXs ? 12 : 2}>
            <FormControl fullWidth variant="outlined" size="small">
              <InputLabel>{t('Khóa thi')}</InputLabel>

              <Select
                label={t('Khóa thi')}
                name="khoaThi"
                value={pageState.khoaThi === '' ? 'all' : pageState.khoaThi}
                onChange={handleKhoaThiChange}
              >
                <MenuItem value="all">{t('select.all')}</MenuItem>
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
          <Grid item xs={isXs ? 12 : 2}>
            <TextField
              fullWidth
              id="outlined-basic"
              label={t('Họ tên')}
              variant="outlined"
              size="small"
              onChange={(e) => setPageState((old) => ({ ...old, hoTen: e.target.value }))}
              value={pageState.hoTen}
            />
          </Grid>
          <Grid item xs={isXs ? 12 : 2}>
            <TextField
              fullWidth
              id="outlined-basic"
              label={t('Sổ cấp vào bằng')}
              variant="outlined"
              size="small"
              onChange={(e) => setPageState((old) => ({ ...old, soVaoSoCapBang: e.target.value }))}
              value={pageState.soVaoSoCapBang}
            />
          </Grid>
        </Grid>
        <Grid item xs={12} container spacing={1} justifyContent="center" mt={1}>
          <Grid item>
            <Button variant="contained" title={t('button.search')} fullWidth onClick={handleSearch} color="info" startIcon={<IconSearch />}>
              {t('button.search')}
            </Button>
          </Grid>
          <Grid item>
            <GroupButtons buttonConfigurations={xuatTep} icon={IconFileExport} title={t('button.export')} />
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
              {formik.values.UyBanNhanDan.toUpperCase() || '{ỦY BAN NHÂN DÂN}'}
            </Typography>
            <Typography variant="h5" fontSize={15} fontWeight={'bold'}>
              {formik.values.CoQuanCapBang.toUpperCase() || '{CƠ QUAN CẤP BẰNG}'}
            </Typography>
            <Grid item mt={0}>
              <Divider width={120} />
            </Grid>
          </Grid>
          <Grid item lg={3} md={0.1} sm={1} xs={1}></Grid>
          <Grid item container lg={6} md={7.8} sm={7} xs={6} justifyContent={'center'} textAlign={'center'}>
            <Typography variant="h4" fontSize={18}>
              SỔ CẤP PHÁT BẰNG TỐT NGHIỆP {formik.values.HeDaoTao.toUpperCase() || '{HỆ ĐÀO TẠO}'}
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
                Học sinh trường: {donvi ? donvi.ten : ''}
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
                Quyết định công nhận tốt nghiệp số {formik.values.QuyetDinh || '{Số quyết định}'}
              </Typography>
              <Typography variant="body1" fontSize={14}>
                Học sinh trường: {donvi ? donvi.ten : '{Tên trường}'}
              </Typography>
            </Grid>
            <Grid item lg={4} md={4} sm={4} xs={5} flexDirection={'column'}>
              <Typography variant="body1" fontSize={14}>
                Năm tốt nghiệp: {formik.values.NamThi || '{Năm tốt nghiệp}'}
              </Typography>
              <Typography variant="body1" fontSize={14}>
                Hình thức học: {formik.values.HinhThucDaoTao || '{Hình thức đào tạo}'}
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
                <TableCell1 style={{ width: 'auto' }}>Số vào sổ gốc</TableCell1>
                <TableCell1 style={{ width: '87px' }}>Chữ ký người nhận</TableCell1>
                <TableCell1 style={{ width: '35px' }}>Ghi chú</TableCell1>
              </TableRow>
            </TableHead>
            <TableBody>
              {pageState.data.length === 0 ? (
                <TableRow>
                  <TableCell2 colSpan={11} style={{ textAlign: 'center' }}>
                    Không có dữ liệu
                  </TableCell2>
                </TableRow>
              ) : (
                pageState.data.map((row) => (
                  <TableRow key={row.idx}>
                    <TableCell2 style={{ textAlign: 'center' }}>{row.idx}</TableCell2>
                    <TableCell2>{row.HoTen}</TableCell2>
                    <TableCell2>{row.ngaySinh_fm}</TableCell2>
                    <TableCell2>{row.NoiSinh}</TableCell2>
                    <TableCell2>{row.gioiTinh_fm}</TableCell2>
                    <TableCell2>{row.DanToc}</TableCell2>
                    {donvi.donViQuanLy == 1 && <TableCell2>{row.HoiDong}</TableCell2>}
                    <TableCell2>{row.XepLoai}</TableCell2>
                    <TableCell2>{row.SoHieuVanBang}</TableCell2>
                    <TableCell2 style={{ textAlign: 'center' }}>{row.SoVaoSoCapBang}</TableCell2>
                    <TableCell2></TableCell2>
                    <TableCell2></TableCell2>
                  </TableRow>
                ))
              )}
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
                {formik.values.DiaPhuongCapBang || '{Địa phương}'}, {formik.values.NgayCapBang || '{Ngày cấp bằng}'}
              </Typography>
            </Grid>
            <Grid item mt={0.4}>
              <Typography variant="body1" fontSize={15} style={{ fontWeight: 'bold' }}>
                {donvi.donViQuanLy == 1 ? 'GIÁM ĐỐC' : 'TRƯỞNG PHÒNG'}
              </Typography>
            </Grid>
            <Grid item mt={10}>
              <Typography variant="body1" fontSize={15} style={{ fontWeight: 'bold' }}>
                {formik.values.NguoiKyBang || '{Người ký bằng}'}
              </Typography>
            </Grid>
          </Grid>
        </Grid>
      </MainCard>
      <BackToTop />
    </>
  );
}
