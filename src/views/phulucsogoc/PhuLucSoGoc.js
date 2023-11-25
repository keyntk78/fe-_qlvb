import * as React from 'react';
import {
  Divider,
  Grid,
  // Pagination,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
  useMediaQuery,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  TextField
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { donviSelector, reloadDataSelector, userLoginSelector } from 'store/selectors';
import { setLoading, setReloadData } from 'store/actions';
import { useTranslation } from 'react-i18next';
import { createSearchParams } from 'utils/createSearchParams';
import { handleResponseStatus } from 'utils/handleResponseStatus';
import { convertISODateToFormattedDate } from 'utils/formatDate';
import MainCard from 'components/cards/MainCard';
import BackToTop from 'components/scroll/BackToTop';
import { styled } from '@mui/system';
import { generateDocument } from './ExportWord';
import ExportExcel from './ExportExel';
import { getSearchPhuLuc } from 'services/phulucService';
import { IconDownload, IconFileExport, IconSearch } from '@tabler/icons';
import ResetButton from 'components/button/ExitButton';
import { ThayDoiChuoi } from 'utils/changeTextDownLine';
import GroupButtons from 'components/button/GroupButton';
import { getAllDanhmucTN, getAllTruong } from 'services/sharedService';
import config from 'config';

export default function PhuLucSoGoc() {
  const isXs = useMediaQuery('(max-width:600px)');
  const { t } = useTranslation();
  const [search, setSearch] = useState(false);
  const reloadData = useSelector(reloadDataSelector);
  const donvi = useSelector(donviSelector);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [dMTN, setDMTN] = useState([]);
  const [donvis, setDonvis] = useState([]);
  const user = useSelector(userLoginSelector);
  const currentDate = new Date();
  const day = currentDate.getDate();
  const month = currentDate.getMonth() + 1; // Tháng bắt đầu từ 0
  const year = currentDate.getFullYear();

  const NgayHientai = `ngày ${day} tháng ${month} năm ${year}`;
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
    donVi: '',
    hoTen: '',
    CCCD: ''
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
    hoTen: '',
    CCCD: ''
  });

  const handleSearch = () => {
    setSearch(true);
  };
  const handleExport = async () => {
    dispatch(setLoading(true));
    await ExportExcel(donvi, pageState1);
    dispatch(setLoading(false));
  };

  const handleExportWord = async () => {
    setLoading(true);
    generateDocument(pageState1.data, additionalData);
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
      dispatch(setLoading(true));
      const donvi = await getAllTruong(user.username);
      if (donvi.data && donvi.data.length > 0) {
        setDonvis(donvi.data);
        setPageState((old) => ({ ...old, donVi: donvi.data[0].id }));
      } else {
        setDonvis([]);
        setPageState((old) => ({ ...old, donVi: '' }));
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
      } else {
        setDMTN([]);
        setPageState((old) => ({ ...old, DMTN: '' }));
      }
      dispatch(setLoading(false));
    };
    fetchDataDL();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setPageState((old) => ({ ...old, isLoading: true }));
      const params = await createSearchParams(pageState);
      params.append('IdDanhMucTotNghiep', pageState.DMTN);
      params.append('IdTruong', pageState.donVi);
      params.append('HoTen', pageState.hoTen);
      params.append('CCCD', pageState.CCCD);
      const response = await getSearchPhuLuc(params);
      const check = handleResponseStatus(response, navigate);
      if (check) {
        const data = await response.data;
        const dataWithIds = data.phuLuc.map((row, index) => ({
          idx: pageState.startIndex * pageState.pageSize + index + 1,
          gioiTinh_fm: row.gioiTinh ? t('gender.male') : t('gender.female'),
          ngaySinh_fm: convertISODateToFormattedDate(row.ngaySinh),
          NoiDung: ThayDoiChuoi(row.noiDungChinhSua),
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
      setPageState((old) => ({ ...old, isLoading: true }));
      const params = await createSearchParams(pageState);
      params.append('IdDanhMucTotNghiep', pageState.DMTN);
      params.append('IdTruong', pageState.donVi);
      params.append('HoTen', pageState.hoTen);
      params.append('CCCD', pageState.CCCD);
      const response = await getSearchPhuLuc(params);
      const check = handleResponseStatus(response, navigate);
      if (check) {
        const data = await response.data;
        const dataWithIds = data.phuLuc.map((row, index) => ({
          idx: pageState.startIndex * pageState.pageSize + index + 1,
          gioiTinh_fm: row.gioiTinh ? t('gender.male') : t('gender.female'),
          ngaySinh_fm: convertISODateToFormattedDate(row.ngaySinh),
          NoiDung: ThayDoiChuoi(row.noiDungChinhSua),
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
      setSearch(false);
    }
  }, [pageState.search, pageState.order, pageState.orderDir, pageState.startIndex, pageState.pageSize, reloadData, search]);
  const additionalData = {
    uyBanNhanDan: donvi.cauHinh.tenUyBanNhanDan.toUpperCase(),
    coQuanCapBang: donvi.cauHinh.tenCoQuanCapBang.toUpperCase(),
    title: 'PHỤ LỤC SỔ GỐC CẤP VĂN BẰNG, CHỨNG CHỈ',
    diaPhuong: donvi.cauHinh.tenDiaPhuongCapBang,
    ngayCap: NgayHientai,
    thutruong: donvi.donViQuanLy == 1 ? 'GIÁM ĐỐC' : 'TRƯỞNG PHÒNG',
    nguoiKy: donvi.cauHinh.hoTenNguoiKySoGoc
  };

  const handleDanhMucChange = (event) => {
    const selectedValue = event.target.value;
    setPageState((old) => ({ ...old, DMTN: selectedValue }));
  };

  const handleSchoolChange = (event) => {
    const selectedValue = event.target.value;
    setPageState((old) => ({ ...old, donVi: selectedValue }));
  };

  return (
    <>
      <MainCard title={t('phulucsogoc.title')} secondary={''}>
        <Grid item container spacing={1} mt={1} justifyContent={'center'}>
          <Grid item xs={isXs ? 12 : 3}>
            <FormControl fullWidth variant="outlined" size="small">
              <InputLabel>{t('danhmuc.title')}</InputLabel>
              <Select name="id" value={pageState.DMTN} onChange={handleDanhMucChange} label={t('danhmuc.title')}>
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
          <Grid item xs={isXs ? 12 : 3}>
            <FormControl fullWidth variant="outlined" size="small">
              <InputLabel>{t('donvitruong.title')}</InputLabel>
              <Select name="truongId" value={pageState.donVi} onChange={handleSchoolChange} label={t('donvitruong.title')}>
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
              label={t('CCCD')}
              variant="outlined"
              size="small"
              onChange={(e) => setPageState((old) => ({ ...old, CCCD: e.target.value }))}
              value={pageState.CCCD}
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
        <Grid item container spacing={1} mt={2}>
          <Grid
            item
            container
            lg={4}
            md={5}
            sm={5}
            xs={12}
            justifyContent={'center'}
            textAlign={'center'}
            flexDirection="column"
            alignItems="center"
          >
            <Typography variant="body1" fontSize={14}>
              {donvi.cauHinh.tenUyBanNhanDan.toUpperCase()}
            </Typography>
            <Typography variant="h5" fontSize={15} fontWeight={'bold'}>
              {donvi.cauHinh.tenCoQuanCapBang.toUpperCase()}
            </Typography>
            <Grid item mt={0}>
              <Divider width={120} />
            </Grid>
          </Grid>
        </Grid>
        <Grid container xs={12} justifyContent={'center'} textAlign={'center'} mt={5} mb={3}>
          <Typography variant="h4" fontSize={18} textAlign={'center'}>
            PHỤ LỤC SỔ GỐC CẤP VĂN BẰNG, CHỨNG CHỈ
          </Typography>
        </Grid>
        <TableContainer component={Paper} style={{ border: '1px solid #ddd', borderRadius: 0 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell1 style={{ width: '60PX' }}>STT</TableCell1>
                <TableCell1 style={{ width: 'auto' }}>Họ và tên</TableCell1>
                <TableCell1 style={{ width: '120PX' }}>CCCD</TableCell1>
                <TableCell1 style={{ width: '90PX' }}>Ngày tháng năm sinh</TableCell1>
                <TableCell1 style={{ width: '90PX' }}>Số hiệu văn bằng đã được cấp</TableCell1>
                <TableCell1 style={{ width: '90PX' }}>Số hiệu văn bằng được cấp lại (nếu có)</TableCell1>
                <TableCell1 style={{ width: '100PX' }}>Số vào sổ gốc cấp bằng mới (nếu có)</TableCell1>
                <TableCell1 style={{ width: 'auto' }}>Nội dung</TableCell1>
                <TableCell1 style={{ width: '90PX' }}>Ghi chú</TableCell1>
                <TableCell1 style={{ width: '90PX' }}>File chỉnh sửa</TableCell1>
              </TableRow>
            </TableHead>
            <TableBody>
              {pageState.data.map((row) => (
                <TableRow key={row.idx}>
                  <TableCell2 style={{ textAlign: 'center' }}>{row.idx}</TableCell2>
                  <TableCell2>{row.hoTen}</TableCell2>
                  <TableCell2>{row.cccd}</TableCell2>
                  <TableCell2>{row.ngaySinh_fm}</TableCell2>
                  <TableCell2>{row.soHieuVanBangCu}</TableCell2>
                  <TableCell2>{row.soHieuVanBangCapLai}</TableCell2>
                  <TableCell2>{row.soVaoSoCapBangCapLai}</TableCell2>
                  <TableCell2>{row.NoiDung}</TableCell2>
                  <TableCell2></TableCell2>
                  <TableCell2 style={{ textAlign: 'center' }}>
                    <a href={config.urlImages + row.pathFileVanBan} download title="Tải xuống">
                      {row.pathFileVanBan ? <IconDownload /> : ''}
                    </a>
                  </TableCell2>
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
                {donvi.cauHinh.tenDiaPhuongCapBang}, {NgayHientai}
              </Typography>
            </Grid>
            <Grid item mt={0.4}>
              <Typography variant="body1" fontSize={15} style={{ fontWeight: 'bold' }}>
                {donvi.donViQuanLy == 1 ? 'GIÁM ĐỐC' : 'TRƯỞNG PHÒNG'}
              </Typography>
            </Grid>
            <Grid item mt={10}>
              <Typography variant="body1" fontSize={15} style={{ fontWeight: 'bold' }}>
                {donvi.cauHinh.hoTenNguoiKySoGoc}
              </Typography>
            </Grid>
          </Grid>
        </Grid>
      </MainCard>
      <Grid item xs={12} container spacing={2} justifyContent="flex-end" mt={1}>
        <Grid item>
          <ResetButton />
        </Grid>
      </Grid>
      <BackToTop />
    </>
  );
}
