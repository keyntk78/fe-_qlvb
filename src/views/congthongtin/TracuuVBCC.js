import { Button, FormControl, Grid, InputLabel, MenuItem, Select, TextField, Typography, useMediaQuery } from '@mui/material';
import { Box, Container, useTheme } from '@mui/system';
import { IconSearch, IconZoomReset } from '@tabler/icons';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import i18n from 'i18n';
import useLocalText from 'utils/localText';
// import { reloadDataSelector } from 'store/selectors';
import MainCard from 'components/cards/MainCard';
import { DataGrid } from '@mui/x-data-grid';
import ReCAPTCHA from 'react-google-recaptcha';
import { getAllNam, getSearchVBCC } from 'services/congthongtinService';
// import { useSelector } from 'react-redux';
import { createSearchParams } from 'utils/createSearchParams';
import { handleResponseStatus } from 'utils/handleResponseStatus';
import { useNavigate } from 'react-router';
import { convertISODateToFormattedDate } from 'utils/formatDate';
import { setOpenPopup, setReloadData, setTracuu } from 'store/actions';
import { useDispatch, useSelector } from 'react-redux';
import ActionButtons from 'components/button/ActionButtons';
import Popup from 'components/controls/popup';
import InThu from './AnhBang';
import { openPopupSelector } from 'store/selectors';
import BackToTop from 'components/scroll/BackToTop';
export default function TracuuVBCC() {
  const openPopup = useSelector(openPopupSelector);
  const { t } = useTranslation();
  const [isChecked, setIsChecked] = useState(false);
  const [showMain, setShowmain] = useState(false);
  const theme = useTheme();
  const [namHoc, setNamHoc] = useState([]);
  const [hoTen, setHoTen] = useState('');
  const [cccd, setCCCD] = useState('');
  const [error, setError] = useState('');
  const [soHieuVanbang, setSoHieuVanbang] = useState('');
  const language = i18n.language;
  const localeText = useLocalText();
  const [ngaSinh, setNgaySinh] = useState('');
  const [selectNamHoc, setSelectNamHoc] = useState('');
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const dispatch = useDispatch();
  const [title, setTitle] = useState('');
  const [form, setForm] = useState('');
  // const reloadData = useSelector(reloadDataSelector);
  // const [search, setSearch] = useState(false);
  const navigate = useNavigate();

  const [pageState, setPageState] = useState({
    isLoading: false,
    data: [],
    total: 0,
    order: 1,
    orderDir: 'ASC',
    startIndex: 0,
    pageSize: 25
  });

  const handleChange = (value) => {
    if (value) {
      setIsChecked(true);
    } else {
      setIsChecked(false);
    }
  };
  const handleDetail = (tracuu) => {
    setTitle(t('Ảnh bằng'));
    setForm('detail');
    dispatch(setTracuu(tracuu));
    dispatch(setOpenPopup(true));
  };
  const columns = [
    {
      field: 'idx',
      headerName: t('serial'),
      width: 50,
      sortable: false,
      filterable: false,
      cellClassName: 'top-aligned-cell'
    },
    {
      field: 'hoTen',
      headerName: t('hocsinh.field.fullname'),
      flex: 3,
      minWidth: 200
    },
    {
      field: 'cccd',
      headerName: t('hocsinh.field.cccd'),
      flex: 1.5,
      minWidth: 100
    },
    {
      field: 'gioiTinh_fm',
      headerName: t('hocsinh.field.gender'),
      flex: 1
    },
    {
      field: 'ngaySinh_fm',
      headerName: t('hocsinh.field.bdate'),
      flex: 1.6
    },
    {
      field: 'soHieuVanBang',
      headerName: t('hocsinh.field.soHieu'),
      flex: 1.5
    },
    {
      field: 'soVaoSoCapBang',
      headerName: t('hocsinh.field.soCapBang'),
      flex: 2
    },
    {
      headerName: t('donvi.title'),
      flex: 2,
      renderCell: (params) => <>{params.row.truong.ten}</>
    },
    {
      field: 'actions',
      headerName: t('xemanh.title'),
      flex: 1,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <>
          <ActionButtons type="detail" handleGetbyId={handleDetail} params={params.row} />
        </>
      )
    }
  ];

  useEffect(() => {}, [pageState.search, pageState.order, pageState.orderDir, pageState.startIndex, pageState.pageSize]);
  const handleNamHocChange = (event) => {
    const selectedValue = event.target.value;
    setSelectNamHoc(selectedValue);
  };

  const handleSubmit = async () => {
    setError('');
    if (isChecked === true && namHoc && hoTen && ngaSinh) {
      setShowmain(true);
      setPageState((old) => ({ ...old, isLoading: true }));
      const params = await createSearchParams(pageState);
      params.append('Cccd', cccd);
      params.append('HoTen', hoTen);
      params.append('NgaySinh', ngaSinh);
      params.append('SoHieuVanBang', soHieuVanbang);
      const response = await getSearchVBCC(selectNamHoc, params);

      const check = handleResponseStatus(response, navigate);
      if (check) {
        const data = await response.data;
        const dataWithIds = data.hocSinhs.map((row, index) => ({
          idx: pageState.startIndex * pageState.pageSize + index + 1,
          soHieuVanBang: row.soHieuVanBang ? row.soHieu : t('chuacap'),
          soVaoSoCapBang: row.soVaoSoCapBang || t('chuacap'),
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
    } else {
      ('');
    }
  };

  const handleReset = () => {
    setHoTen('');
    setCCCD('');
    setNgaySinh('');
    setSoHieuVanbang('');
  };
  useEffect(() => {
    const fetchData = async () => {
      const namhoc = await getAllNam();

      setNamHoc(namhoc.data);
      setSelectNamHoc(namhoc && namhoc.data.length > 0 ? namhoc.data[0].id : '');
    };
    fetchData();
  }, []);
  return (
    <div>
      <div style={{ backgroundColor: '#F7F7F7', minHeight: `calc(100vh - 285px)` }}>
        <Container sx={{ paddingBottom: 1 }}>
          <Grid height={10}></Grid>
          <Box
            sx={{
              maxWidth: isSmallScreen ? '100%' : '70%',
              backgroundColor: '#FFFFFF',
              borderRadius: '5px',
              marginBottom: 3,
              paddingBottom: 3,
              margin: 'auto',
              padding: 2,
              boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.2)',
              flexDirection: 'column', // Stack children vertically
              alignItems: 'center' // Center-align items horizontally
            }}
          >
            <Typography variant={isSmallScreen ? 'h4' : 'h1'} component="h1" align="center" paddingTop={2}>
              {t('congthongtin.title.vbcc')}
            </Typography>
            <Typography variant="body1" paddingTop={5} paddingLeft={4} sx={{ lineHeight: '1.5' }}>
              {t('ghichuvbcc1')}
            </Typography>
            <Typography paddingLeft={4} variant="body1" sx={{ lineHeight: '1.5' }}>
              {t('ghichuvbcc2')}
            </Typography>
            <Grid item container xs={12} justifyContent={'center'} spacing={2} mt={2}>
              <Grid item xs={12} sm={6} md={4} lg={3}>
                <FormControl fullWidth variant="outlined">
                  <InputLabel>{t('socapbang.field.namtotnghiep')}</InputLabel>
                  <Select size="small" value={selectNamHoc} onChange={handleNamHocChange} label={t('socapbang.field.namtotnghiep')}>
                    {namHoc && namHoc.length > 0 ? (
                      namHoc.map((data) => (
                        <MenuItem key={data.id} value={data.id}>
                          {data.ten}
                        </MenuItem>
                      ))
                    ) : (
                      <MenuItem value="nodata">{t('noRowsLabel')}</MenuItem>
                    )}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item container xs={12} sm={6} md={4} lg={4}>
                <TextField
                  fullWidth
                  required
                  id="outlined-basic"
                  label={t('hocsinh.field.fullname')}
                  type="text"
                  variant="outlined"
                  size="small"
                  onChange={(e) => setHoTen(e.target.value)}
                  value={hoTen}
                />
              </Grid>
              <Grid item container xs={12} sm={6} md={4} lg={3}>
                <TextField
                  style={{ borderRadius: '0' }}
                  fullWidth
                  required
                  id="outlined-basic"
                  type="date"
                  label={t('hocsinh.field.bdate')}
                  variant="outlined"
                  size="small"
                  onChange={(e) => setNgaySinh(e.target.value)}
                  value={ngaSinh}
                  InputLabelProps={{
                    shrink: true
                  }}
                  inputProps={{
                    max: new Date().toISOString().split('T')[0]
                  }}
                />
              </Grid>
            </Grid>
            <Grid item container xs={12} justifyContent={'center'} spacing={2} mt={2}>
              <Grid Grid item xs={12} sm={6} md={4} lg={3}>
                <TextField
                  fullWidth
                  id="outlined-basic"
                  label="CCCD"
                  variant="outlined"
                  size="small"
                  onChange={(e) => setCCCD(e.target.value)}
                  value={cccd}
                />
              </Grid>
              <Grid Grid item xs={12} sm={6} md={4} lg={3}>
                <TextField
                  fullWidth
                  id="outlined-basic"
                  label={t('hocsinh.field.sohieuvb')}
                  variant="outlined"
                  size="small"
                  onChange={(e) => setSoHieuVanbang(e.target.value)}
                  value={soHieuVanbang}
                />
              </Grid>
            </Grid>

            <Grid item container xs={12} justifyContent="center" alignItems="center" mt={2}>
              <Grid item xs={12} sm={12} md={6} lg={3}>
                {/* Center the ReCAPTCHA widget vertically and horizontally */}
                <Box display="flex" justifyContent="center" alignItems="center">
                  <ReCAPTCHA
                    sitekey="6Ld5MtInAAAAAN7ECCJyndwfjGaiAaWEX9PUTLlU"
                    onChange={handleChange}
                    disabled={!hoTen && !ngaSinh}
                    size={'normal'}
                  />
                </Box>
              </Grid>
            </Grid>
            <Grid item container xs={12} justifyContent={'center'}>
              <Grid item xs={12}>
                <Typography variant="body" sx={{ color: 'red', marginLeft: 3 }}>
                  {error}
                </Typography>
              </Grid>
            </Grid>
            <Grid item container xs={12} justifyContent={'center'} spacing={2}>
              <Grid item xs={6} sm={4} md={3} lg={3}>
                <Button
                  variant="contained"
                  title={t('button.search')}
                  fullWidth
                  onClick={handleSubmit}
                  color="info"
                  sx={{ marginTop: '2px' }}
                  startIcon={<IconSearch />}
                >
                  {t('button.search')}
                </Button>
              </Grid>
              <Grid item xs={6} sm={4} md={3} lg={3}>
                <Button
                  variant="contained"
                  title={t('button.reset')}
                  fullWidth
                  onClick={handleReset}
                  color="inherit"
                  sx={{ marginTop: '2px' }}
                  startIcon={<IconZoomReset />}
                >
                  {t('button.reset')}
                </Button>
              </Grid>
            </Grid>
          </Box>
          {showMain && (
            <MainCard title={t('ketquatimkiem.title')} sx={{ width: '100%', margin: 'auto', marginTop: 3 }}>
              <DataGrid
                autoHeight
                columns={columns}
                rows={pageState.data}
                rowCount={pageState.total}
                loading={pageState.isLoading}
                rowHeight={60}
                rowsPerPageOptions={[5, 10, 25, 50, 100]}
                pagination
                page={pageState.startIndex}
                pageSize={pageState.pageSize}
                paginationMode="server"
                onPageChange={(newPage) => {
                  setPageState((old) => ({ ...old, startIndex: newPage }));
                }}
                onPageSizeChange={(newPageSize) => {
                  setPageState((old) => ({ ...old, pageSize: newPageSize }));
                }}
                onSortModelChange={(newSortModel) => {
                  const field = newSortModel[0]?.field;
                  const sort = newSortModel[0]?.sort;
                  setPageState((old) => ({ ...old, order: field, orderDir: sort }));
                }}
                onFilterModelChange={(newSearchModel) => {
                  const value = newSearchModel.items[0]?.value;
                  setPageState((old) => ({ ...old, search: value }));
                }}
                localeText={language === 'vi' ? localeText : null}
                disableSelectionOnClick={true}
                initialState={{
                  pagination: {
                    paginationModel: { page: 0, pageSize: 10 }
                  }
                }}
              />
            </MainCard>
          )}
          <Popup title={title} form={form} openPopup={openPopup} maxWidth={'md'} bgcolor={form === 'delete' ? '#F44336' : '#2196F3'}>
            {form === 'detail' ? <InThu /> : ''}
          </Popup>
        </Container>
        <BackToTop />
      </div>
    </div>
  );
}
