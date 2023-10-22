import * as React from 'react';
import { IconFileExport, IconSearch } from '@tabler/icons';
import {
  Button,
  Divider,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Pagination,
  // PaginationItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
  useMediaQuery
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { reloadDataSelector } from 'store/selectors';
import { setLoading, setReloadData } from 'store/actions';
import { useTranslation } from 'react-i18next';
import { createSearchParams } from 'utils/createSearchParams';
import { handleResponseStatus } from 'utils/handleResponseStatus';
import { convertISODateToFormattedDate, formatDate } from 'utils/formatDate';
import MainCard from 'components/cards/MainCard';
import { getAllDonvi } from 'services/donvitruongService';
import { getAllDanhmucTN } from 'services/danhmuctotnghiepService';
import BackToTop from 'components/scroll/BackToTop';
import { styled } from '@mui/system';
import AnimateButton from 'components/extended/AnimateButton';
import { useFormik } from 'formik';
import { generateDocument } from './ExportWord';
import { getHocSinhTheoSoGoc } from 'services/sogocService';
import ExportExcel from './ExportExcel';
import ButtonSuccess from 'components/buttoncolor/ButtonSuccess';

export default function ViewSo() {
  const isXs = useMediaQuery('(max-width:600px)');
  const { t } = useTranslation();
  const [search, setSearch] = useState(false);
  const reloadData = useSelector(reloadDataSelector);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [dMTN, setDMTN] = useState([]);
  const [donvis, setDonvis] = useState([]);
  const [firstLoad, setFirstLoad] = useState(false);
  const [selectDonvi, setSelectDonvi] = useState('');
  const [selectDanhmuc, setSelectDanhmuc] = useState('');
  const [disable, setDisable] = useState(false);

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
    cccd: '',
    hoTen: '',
    noiSinh: '',
    DMTN: '',
    danToc: '',
    donVi: ''
  });

  const handleSearch = () => {
    setSearch(true);
    const donviSelect = pageState.donVi;
    const selectedDonviInfo = donvis.find((donvi) => donvi.id === donviSelect);
    setSelectDonvi(selectedDonviInfo);
    const danhmucSelect = pageState.DMTN;
    const selectedDanhmucInfo = dMTN.find((dmtn) => dmtn.id === danhmucSelect);
    setSelectDanhmuc(selectedDanhmucInfo);
  };

  const handleExport = async (e) => {
    e.preventDefault();
    dispatch(setLoading(true));
    await ExportExcel(formik, pageState, selectDanhmuc, selectDonvi, 'sogoc');
    dispatch(setLoading(false));
  };

  const handleExportWord = async (e) => {
    e.preventDefault();
    setLoading(true);
    generateDocument(pageState.data, additionalData, 'sogoc');
    setLoading(false);
  };

  const handleChange = (e, value) => {
    e.preventDefault();
    setPageState((old) => ({ ...old, startIndex: value - 1 }));
  };

  useEffect(() => {
    const fetchDataDL = async () => {
      dispatch(setLoading(true));
      const donvi = await getAllDonvi();
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
      const danhmuc = await getAllDanhmucTN();
      if (danhmuc.data && danhmuc.data.length > 0) {
        setDMTN(danhmuc.data);
        setPageState((old) => ({ ...old, DMTN: danhmuc.data[0].id }));
        setSelectDanhmuc(danhmuc.data[0]);
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
    if (selectDanhmuc && selectDonvi) {
      setFirstLoad(true);
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
      NgayCapBang: ''
    }
  });

  useEffect(() => {
    const fetchData = async () => {
      setPageState((old) => ({ ...old, isLoading: true }));
      const params = await createSearchParams(pageState);
      params.append('idDanhMucTotNghiep', pageState.DMTN);
      params.append('idTruong', pageState.donVi);
      const response = await getHocSinhTheoSoGoc(params);
      const data = response.data;
      formik.setValues({
        UyBanNhanDan: data.SoGoc.UyBanNhanDan || '',
        CoQuanCapBang: data.SoGoc.CoQuanCapBang || '',
        NamThi: data.DanhMucTotNghiep.NamThi || '',
        QuyetDinh: data.DanhMucTotNghiep.SoQuyetDinh || '',
        NguoiKyBang: data.SoGoc.NguoiKyBang || '',
        DiaPhuongCapBang: data.SoGoc.DiaPhuongCapBang || '',
        HeDaoTao: data.Truong.HeDaoTao.toUpperCase() || '',
        HinhThucDaoTao: data.Truong.HinhThucDaoTao || '',
        NgayCapBang: formatDate(data.DanhMucTotNghiep.NgayCapBang) || ''
      });
      const check = handleResponseStatus(response, navigate);
      if (check) {
        const data = await response.data.SoGoc;
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
    if (firstLoad || search || reloadData) {
      fetchData();
      setSearch(false);
    }
  }, [pageState.search, pageState.order, pageState.orderDir, pageState.startIndex, pageState.pageSize, reloadData, firstLoad, search]);

  const handleDanhMucChange = (event) => {
    const selectedValue = event.target.value;
    setPageState((old) => ({ ...old, DMTN: selectedValue }));
  };

  const handleSchoolChange = (event) => {
    const selectedValue = event.target.value;
    setPageState((old) => ({ ...old, donVi: selectedValue }));
  };

  const additionalData = {
    uyBanNhanDan: formik.values.UyBanNhanDan.toUpperCase(),
    coQuanCapBang: formik.values.CoQuanCapBang.toUpperCase(),
    quyetDinh: formik.values.QuyetDinh,
    donVi: selectDonvi ? selectDonvi.ten : '',
    namThi: formik.values.NamThi,
    title: `Sổ gốc cấp bằng ${formik.values.HeDaoTao}`,
    hinhThucDaoTao: formik.values.HinhThucDaoTao,
    diaPhuong: formik.values.DiaPhuongCapBang,
    ngayCap: formik.values.NgayCapBang,
    nguoiKy: formik.values.NguoiKyBang
  };

  const count = pageState.total ? Math.floor(parseInt(pageState.total) / parseInt(pageState.pageSize)) + 1 : 0;

  return (
    <>
      <MainCard
        title={t('sogoc.title')}
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
                <Tooltip title={t('Xuất file word')} placement="bottom">
                  <Button fullWidth color="info" variant="contained" onClick={handleExportWord} startIcon={<IconFileExport />}>
                    {t('Xuất file word')}
                  </Button>
                </Tooltip>
              </AnimateButton>
            </Grid>
          </Grid>
        ) : (
          ''
        )}
        <Grid item container spacing={2} mt={1} justifyContent={'center'}>
          <Grid item xs={isXs ? 12 : 4}>
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
          <Grid item xs={isXs ? 12 : 4}>
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
          <Grid item xs={isXs ? 6 : 2}>
            <Button
              variant="contained"
              title={t('button.search')}
              fullWidth
              onClick={handleSearch}
              color="info"
              sx={{ marginTop: '2px', minWidth: 130 }}
              startIcon={<IconSearch />}
              disabled={disable}
            >
              {t('button.search')}
            </Button>
          </Grid>
        </Grid>
        {pageState.data.length > 0 ? (
          <>
            <Grid item mt={3}>
              <Pagination count={count || 0} page={pageState.startIndex + 1 || 0} onChange={handleChange} />
            </Grid>
          </>
        ) : (
          ''
        )}
        <Grid item mt={2}>
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
              SỔ GỐC CẤP BẰNG TỐT NGHIỆP {formik.values.HeDaoTao.toUpperCase()}
            </Typography>
          </Grid>
        </Grid>
        <Grid item container mb={3} spacing={1} mt={3}>
          <Grid item lg={9} md={8.8} sm={8} xs={7} flexDirection={'column'}>
            <Typography variant="body1" fontSize={14}>
              Quyết định công nhận tốt nghiệp số {formik.values.QuyetDinh}
            </Typography>
            <Typography variant="body1" fontSize={14}>
              Học sinh trường: {selectDonvi ? selectDonvi.ten : ''}
            </Typography>
          </Grid>
          <Grid item lg={3} md={3.2} sm={4} xs={5} flexDirection={'column'}>
            <Typography variant="body1" fontSize={14}>
              Năm tốt nghiệp: {formik.values.NamThi}
            </Typography>
            <Typography variant="body1" fontSize={14}>
              Hình thức học: {formik.values.HinhThucDaoTao}
            </Typography>
          </Grid>
        </Grid>
        <TableContainer component={Paper} style={{ border: '1px solid #ddd', borderRadius: 0 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell1 style={{ width: '30px' }}>STT</TableCell1>
                <TableCell1 style={{ width: 'auto' }}>Họ và tên</TableCell1>
                <TableCell1 style={{ width: '110px' }}>CCCD</TableCell1>
                <TableCell1 style={{ width: '83px' }}>Ngày tháng năm sinh</TableCell1>
                <TableCell1 style={{ width: 'auto' }}>Nơi sinh</TableCell1>
                <TableCell1 style={{ width: '45px' }}>Giới tính</TableCell1>
                <TableCell1 style={{ width: 'auto' }}>Dân tộc</TableCell1>
                <TableCell1 style={{ width: '80px' }}>Xếp loại tốt nghiệp</TableCell1>
                <TableCell1 style={{ width: '100px' }}>Số hiệu văn bằng</TableCell1>
                <TableCell1 style={{ width: 'auto' }}>Số vào sổ gốc</TableCell1>
                <TableCell1 style={{ width: '87px' }}>Chữ ký người nhận</TableCell1>
                <TableCell1 style={{ width: '35px' }}>Ghi chú</TableCell1>
              </TableRow>
            </TableHead>
            <TableBody>
              {pageState.data.map((row) => (
                <TableRow key={row.id}>
                  <TableCell2 style={{ textAlign: 'center' }}>{row.idx}</TableCell2>
                  <TableCell2>{row.HoTen}</TableCell2>
                  <TableCell2>{row.CCCD}</TableCell2>
                  <TableCell2>{row.ngaySinh_fm}</TableCell2>
                  <TableCell2>{row.NoiSinh}</TableCell2>
                  <TableCell2>{row.gioiTinh_fm}</TableCell2>
                  <TableCell2>{row.DanToc}</TableCell2>
                  <TableCell2>{row.XepLoai}</TableCell2>
                  <TableCell2>{row.SoHieuVanBang}</TableCell2>
                  <TableCell2 style={{ textAlign: 'center' }}>{row.SoVaoSoCapBang}</TableCell2>
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
                TRƯỞNG PHÒNG
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
