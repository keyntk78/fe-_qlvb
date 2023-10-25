import * as React from 'react';
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
  Tooltip,
  Typography,
  useMediaQuery
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { donviSelector, reloadDataSelector } from 'store/selectors';
import { setLoading, setReloadData } from 'store/actions';
import { useTranslation } from 'react-i18next';
import { createSearchParams } from 'utils/createSearchParams';
import { handleResponseStatus } from 'utils/handleResponseStatus';
import { convertISODateToFormattedDate } from 'utils/formatDate';
import MainCard from 'components/cards/MainCard';
import { getAllNamThi } from 'services/sharedService';
import BackToTop from 'components/scroll/BackToTop';
import { styled } from '@mui/system';
import AnimateButton from 'components/extended/AnimateButton';
import { generateDocument } from './ExportWord';
import ExportExcel from './ExportExel';
import ButtonSuccess from 'components/buttoncolor/ButtonSuccess';
import { getSearchPhuLuc } from 'services/phulucService';
import { IconFileExport } from '@tabler/icons';

export default function PhuLucSoGoc() {
  const isXs = useMediaQuery('(max-width:600px)');
  const { t } = useTranslation();
  const [search, setSearch] = useState(false);
  const reloadData = useSelector(reloadDataSelector);
  const donvi = useSelector(donviSelector);
  console.log(donvi);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [namThi, setnamThi] = useState([]);
  const [firstLoad, setFirstLoad] = useState(false);
  const [selectNamThi, setselectNamThi] = useState('');
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
    namThi: '',
    donVi: ''
  });

  const handleExport = async (e) => {
    e.preventDefault();
    dispatch(setLoading(true));
    await ExportExcel(donvi, pageState, selectNamThi);
    dispatch(setLoading(false));
  };

  const handleExportWord = async (e) => {
    e.preventDefault();
    setLoading(true);
    generateDocument(pageState.data, additionalData, selectNamThi);
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

  useEffect(() => {
    const fetchDataDL = async () => {
      const namThi = await getAllNamThi();
      if (namThi.data && namThi.data.length > 0) {
        setnamThi(namThi.data);
        setPageState((old) => ({ ...old, namThi: namThi.data[0].ten }));
        setselectNamThi(namThi.data[0].ten);
      } else {
        setnamThi([]);
        setPageState((old) => ({ ...old, namThi: '' }));
        setselectNamThi('');
      }
      dispatch(setLoading(false));
    };
    fetchDataDL();
  }, []);

  useEffect(() => {
    if (selectNamThi) {
      setFirstLoad(true);
    }
  }, [selectNamThi]);

  useEffect(() => {
    const fetchData = async () => {
      setPageState((old) => ({ ...old, isLoading: true }));
      const params = await createSearchParams(pageState);
      params.append('namThi', pageState.namThi);
      const response = await getSearchPhuLuc(pageState.namThi, params);
      const check = handleResponseStatus(response, navigate);
      if (check) {
        const data = await response.data;
        const dataWithIds = data.phuLuc.map((row, index) => ({
          idx: pageState.startIndex * pageState.pageSize + index + 1,
          gioiTinh_fm: row.gioiTinh ? t('gender.male') : t('gender.female'),
          ngaySinh_fm: convertISODateToFormattedDate(row.ngaySinh),
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
    if (firstLoad || search || reloadData) {
      fetchData();
      setSearch(false);
    }
  }, [
    pageState.search,
    pageState.order,
    pageState.orderDir,
    pageState.startIndex,
    pageState.pageSize,
    reloadData,
    firstLoad,
    search,
    pageState.namThi
  ]);

  const handleDanhMucChange = (event) => {
    const selectedValue = event.target.value;
    setselectNamThi(selectedValue);
    setPageState((old) => ({ ...old, namThi: selectedValue }));
  };

  const additionalData = {
    uyBanNhanDan: donvi.cauHinh.tenUyBanNhanDan.toUpperCase(),
    coQuanCapBang: donvi.cauHinh.tenCoQuanCapBang.toUpperCase(),
    title: 'PHỤ LỤC SỔ GỐC CẤP VĂN BẰNG, CHỨNG CHỈ',
    diaPhuong: donvi.cauHinh.tenDiaPhuongCapBang,
    ngayCap: NgayHientai,
    thutruong: donvi.donViQuanLy == 1 ? 'GIÁM ĐỐC' : 'TRƯỞNG PHÒNG',
    nguoiKy: donvi.cauHinh.hoTenNguoiKySoGoc
  };

  console.log(pageState.data);
  return (
    <>
      <MainCard
        title={t('phulucsogoc.title')}
        secondary={
          isXs ? (
            ''
          ) : (
            <Grid container justifyContent="flex-end" spacing={1}>
              <Grid item>
                <ButtonSuccess title={t('button.export.excel')} onClick={handleExport} icon={IconFileExport} />
              </Grid>
              <Grid item>
                <AnimateButton>
                  <Tooltip title={t('button.export.word')} placement="bottom">
                    <Button fullWidth color="info" variant="contained" onClick={handleExportWord} startIcon={<IconFileExport />}>
                      {t('button.export.word')}
                    </Button>
                  </Tooltip>
                </AnimateButton>
              </Grid>
            </Grid>
          )
        }
      >
        {isXs ? (
          <Grid container justifyContent="center" spacing={1}>
            <Grid item>
              <ButtonSuccess title={t('Xuất file excel')} onClick={handleExport} icon={IconFileExport} />
            </Grid>
            <Grid item>
              <AnimateButton>
                <Tooltip title={t('button.export.word')} placement="bottom">
                  <Button fullWidth color="info" variant="contained" onClick={handleExportWord} startIcon={<IconFileExport />}>
                    {t('button.export.word')}
                  </Button>
                </Tooltip>
              </AnimateButton>
            </Grid>
          </Grid>
        ) : (
          ''
        )}
        <Grid item container spacing={2} justifyContent={'flex-end'}>
          <Grid item xs={2}>
            <FormControl fullWidth variant="outlined" size="small">
              <InputLabel>{t('namhoc')}</InputLabel>
              <Select name="ten" value={pageState.namThi} onChange={handleDanhMucChange} label={t('namhoc')}>
                {namThi && namThi.length > 0 ? (
                  namThi.map((namThi) => (
                    <MenuItem key={namThi.ten} value={namThi.ten}>
                      {namThi.ten}
                    </MenuItem>
                  ))
                ) : (
                  <MenuItem value="">No data available</MenuItem>
                )}
              </Select>
            </FormControl>
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
                <TableCell1 style={{ width: '120PX' }}>Chữ ký người nhận</TableCell1>
                <TableCell1 style={{ width: 'auto' }}>Ghi chú</TableCell1>
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
                  <TableCell2>{row.noiDungChinhSua}</TableCell2>
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
      <BackToTop />
    </>
  );
}
