import { Button, FormControl, Grid, InputLabel, MenuItem, Select, TextField, Typography, useMediaQuery } from '@mui/material';
import { Box, Container, useTheme } from '@mui/system';
import { IconCheck, IconSearch, IconZoomReset } from '@tabler/icons';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import i18n from 'i18n';
import useLocalText from 'utils/localText';
import MainCard from 'components/cards/MainCard';
import { DataGrid } from '@mui/x-data-grid';
import { getAllNam, getAllTruong, getSearchVBCC } from 'services/congthongtinService';
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
// import BackToTop from 'components/scroll/BackToTop';
import { loadCaptchaEnginge, LoadCanvasTemplate, validateCaptcha } from 'react-simple-captcha';
export default function TracuuVBCC() {
  const openPopup = useSelector(openPopupSelector);
  const { t } = useTranslation();
  const [isChecked, setIsChecked] = useState(false);
  const [showMain, setShowmain] = useState(false);
  const [successCapcha, setSuccessCapcha] = useState(false);
  const theme = useTheme();
  const [namHoc, setNamHoc] = useState([]);
  const [donVi, setDonVi] = useState([]);
  const [hoTen, setHoTen] = useState('');
  const [cccd, setCCCD] = useState('');
  const [error, setError] = useState('');
  const [soHieuVanbang, setSoHieuVanbang] = useState('');
  const language = i18n.language;
  const localeText = useLocalText();
  const [ngaySinh, setNgaySinh] = useState('');
  const [selectNamHoc, setSelectNamHoc] = useState('');
  const [selectDonVi, setSelectDonVi] = useState('');
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const dispatch = useDispatch();
  const [title, setTitle] = useState('');
  const [form, setForm] = useState('');
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
      flex: 2,
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
      flex: 3,
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
          <Grid container justifyContent="center">
            <ActionButtons type="detail" handleGetbyId={handleDetail} params={params.row} />
          </Grid>
        </>
      )
    }
  ];

  useEffect(() => {}, [pageState.search, pageState.order, pageState.orderDir, pageState.startIndex, pageState.pageSize]);

  const handleNamHocChange = (event) => {
    const selectedValue = event.target.value;
    setSelectNamHoc(selectedValue);
  };

  const handleDonViChange = (event) => {
    const selectedValue = event.target.value;
    setSelectDonVi(selectedValue);
  };

  const handleSubmit = async () => {
    if (isChecked === false) {
      setError('Vui lòng kiểm tra Recapcha');
    } else {
      setError('');
      if (isChecked === true && namHoc && hoTen && ngaySinh && selectDonVi) {
        setShowmain(true);
        setPageState((old) => ({ ...old, isLoading: true }));
        const params = await createSearchParams(pageState);
        params.append('Cccd', cccd);
        params.append('HoTen', hoTen);
        params.append('NgaySinh', ngaySinh);
        params.append('SoHieuVanBang', soHieuVanbang);
        params.append('IdTruong', selectDonVi);
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
        setError('Hãy điền đầy đủ thông tin');
      }
    }
  };

  const handleReset = () => {
    setHoTen('');
    setCCCD('');
    setNgaySinh('');
    setSoHieuVanbang('');
    setSelectDonVi('');
    setError('');
  };
  useEffect(() => {
    const fetchData = async () => {
      loadCaptchaEnginge(6);
      const namhoc = await getAllNam();
      setNamHoc(namhoc.data);
      setSelectNamHoc(namhoc.data?.length > 0 ? namhoc.data[0].id : '');
      const donvi = await getAllTruong();
      setDonVi(donvi.data);
    };
    fetchData();
  }, []);

  const doSubmit = () => {
    let user_captcha = document.getElementById('user_captcha_input').value;

    if (validateCaptcha(user_captcha) === true) {
      setIsChecked(true);
      setSuccessCapcha(true);
      setError('');
      document.getElementById('user_captcha_input').setAttribute('readonly', 'true');
      setTimeout(() => {
        try {
          setIsChecked(false);
          setSuccessCapcha(false);
          document.getElementById('user_captcha_input').setAttribute('readonly', 'false');

          loadCaptchaEnginge(6);
          document.getElementById('user_captcha_input').value = '';
          setError('Mã hết thời gian, vui lòng kiểm tra lại');
        } catch (error) {
          console.error(error);
        }
      }, 60000);
    } else {
      setIsChecked(false);
      setSuccessCapcha(false);
      document.getElementById('user_captcha_input').value = '';
      setError('Mã không chính xác, nhập lại mã mới');
      loadCaptchaEnginge(6);
    }
  };
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
              <Grid item xs={12} sm={3} md={3} lg={3}>
                <FormControl fullWidth variant="outlined" size="small">
                  <InputLabel>{t('socapbang.field.namtotnghiep')}</InputLabel>
                  <Select value={selectNamHoc} onChange={handleNamHocChange} label={t('socapbang.field.namtotnghiep')}>
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
              <Grid item xs={12} sm={6} md={6} lg={6}>
                <FormControl fullWidth variant="outlined" size="small">
                  <InputLabel>{t('Đơn vị trường *')}</InputLabel>
                  <Select value={selectDonVi} onChange={handleDonViChange} label={t('Đơn vị trường *')}>
                    {donVi && donVi.length > 0 ? (
                      donVi.map((data) => (
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
              <Grid item xs={12} sm={3} md={3} lg={3}>
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
            <Grid item container xs={12} justifyContent={'center'} spacing={2} mt={0}>
              <Grid Grid item xs={12} sm={3} md={3} lg={3}>
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
              <Grid item container xs={12} sm={6} md={6} lg={6}>
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
              <Grid item container xs={12} sm={3} md={3} lg={3}>
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
                  value={ngaySinh}
                  InputLabelProps={{
                    shrink: true
                  }}
                  inputProps={{
                    max: new Date().toISOString().split('T')[0]
                  }}
                />
              </Grid>
            </Grid>

            <Grid item container xs={12} justifyContent="center" alignItems="center" mt={2}>
              <Box display="flex" justifyContent="center" alignItems="center">
                <Grid item container spacing={1} justifyItems={'center'} alignItems={'center'} justifyContent={'center'}>
                  <Grid item>
                    <LoadCanvasTemplate />
                  </Grid>
                  <Grid item>
                    <TextField
                      fullWidth
                      required
                      name="user_captcha_input"
                      id="user_captcha_input"
                      label={t('Nhập mã')}
                      type="text"
                      variant="outlined"
                      size="small"
                    />
                  </Grid>

                  <Grid item>
                    {successCapcha ? (
                      <IconCheck />
                    ) : (
                      <Button variant="contained" onClick={() => doSubmit()}>
                        Kiểm Tra
                      </Button>
                    )}
                  </Grid>
                </Grid>
              </Box>
            </Grid>
            <Grid item container xs={12} justifyContent={'center'} alignContent={'center'} alignItems="center" mt={1} mb={1}>
              <Grid item>
                <Typography variant="body" sx={{ color: 'red' }}>
                  {error}
                </Typography>
              </Grid>
            </Grid>
            <Grid item container xs={12} justifyContent={'center'} spacing={2} alignItems="center">
              <Grid item xs={6} sm={4} md={3} lg={3}>
                <Button
                  variant="contained"
                  title={t('button.search')}
                  fullWidth
                  onClick={handleSubmit}
                  color="info"
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
                  startIcon={<IconZoomReset />}
                >
                  {t('button.reset')}
                </Button>
              </Grid>
            </Grid>
          </Box>
          {showMain && (
            <MainCard hideInstruct title={t('ketquatimkiem.title')} sx={{ width: '100%', margin: 'auto', marginTop: 3 }}>
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
      </div>
    </div>
  );
}
