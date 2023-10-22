import { Button, FormControl, Grid, InputLabel, MenuItem, Select, TextField, Typography, useMediaQuery } from '@mui/material';
import { Box, Container, useTheme } from '@mui/system';
import { IconSearch } from '@tabler/icons';
import { useEffect, useState } from 'react';
import i18n from 'i18n';

import { useTranslation } from 'react-i18next';

import ReCAPTCHA from 'react-google-recaptcha';
import MainCard from 'components/cards/MainCard';
import { DataGrid } from '@mui/x-data-grid';
import useLocalText from 'utils/localText';
import Alert from 'components/controls/alert';
import { useDispatch, useSelector } from 'react-redux';
import { showAlertSelector } from 'store/selectors';
import { getAllNam, getSearchDonYeuCau } from 'services/congthongtinService';
import { createSearchParams } from 'utils/createSearchParams';
import { useNavigate } from 'react-router';
import { convertISODateToFormattedDate } from 'utils/formatDate';
import { handleResponseStatus } from 'utils/handleResponseStatus';
import { setReloadData } from 'store/actions';
import BackToTop from 'components/scroll/BackToTop';

export default function TracuuDonyeucau() {
  const showAlertLogin = useSelector(showAlertSelector);
  const dispatch = useDispatch();
  // const reloadData = useSelector(reloadDataSelector);
  // const [search, setSearch] = useState(false);
  const navigate = useNavigate();
  const { t } = useTranslation();
  const language = i18n.language;
  const [isChecked, setIsChecked] = useState(false);
  const [showMain, setShowmain] = useState(false);
  const theme = useTheme();
  const [namHoc, setNamHoc] = useState([]);
  const [hoTen, setHoTen] = useState('');
  const [cccd, setCCCD] = useState('');
  const [error, setError] = useState('');
  const [ngaSinh, setNgaySinh] = useState('');
  const [selectNamHoc, setSelectNamHoc] = useState('');
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const localeText = useLocalText();

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
    if (value && namHoc && hoTen && ngaSinh) {
      setIsChecked(true);
      setError('');
    } else {
      setError('Chưa nhập đầy đủ thông tin');
      setIsChecked(false);
    }
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
      field: 'HoTen',
      headerName: t('hocsinh.field.fullname'),
      flex: 3,
      minWidth: 200
    },
    {
      field: 'CCCD',
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
      field: 'ma',
      headerName: t('capbang.madon'),
      flex: 1.5
    },
    {
      field: 'soLuongBanSao',
      headerName: t('phoivanbang.field.soluongphoi'),
      flex: 1
    },
    {
      field: 'trangThai_fm',
      headerName: t('phoivanbang.field.tinhtrang'),
      flex: 2,
      sortable: false,
      filterable: false
    }
  ];

  useEffect(() => {
    setPageState((old) => ({
      ...old,
      isLoading: false
    }));
  }, [pageState.search, pageState.order, pageState.orderDir, pageState.startIndex, pageState.pageSize]);
  const handleNamHocChange = (event) => {
    const selectedValue = event.target.value;
    setSelectNamHoc(selectedValue);
  };
  const handleSubmit = async () => {
    setError('');
    if (isChecked === true) {
      setShowmain(true);
      setPageState((old) => ({ ...old, isLoading: true }));
      const params = await createSearchParams(pageState);
      params.append('Cccd', cccd);
      params.append('HoTen', hoTen);
      params.append('NgaySinh', ngaSinh);
      const response = await getSearchDonYeuCau(selectNamHoc, params);

      const check = handleResponseStatus(response, navigate);
      if (check) {
        const data = await response.data;
        const dataWithIds = data.donYeuCaus.map((row, index) => ({
          idx: pageState.startIndex * pageState.pageSize + index + 1,
          gioiTinh_fm: row.hocSinh.gioiTinh ? t('gender.male') : t('gender.female'),
          HoTen: row.hocSinh.hoTen,
          CCCD: row.hocSinh.cccd,
          trangThai_fm:
            row.trangThai == 0
              ? t('status.unapproved')
              : row.trangThai == 1
              ? t('status.approved')
              : row.trangThai == -1
              ? t('status.refuse')
              : t('status.delivered'),
          ngaySinh_fm: convertISODateToFormattedDate(row.hocSinh.ngaySinh),
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
  useEffect(() => {
    const fetchData = async () => {
      try {
        const namhoc = await getAllNam();
        setNamHoc(namhoc.data);
        setSelectNamHoc(namhoc.data?.length > 0 ? namhoc.data[0].id : '');
      } catch (error) {
        console.error('Error fetching data:', error);
      }
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
              margin: 'auto',
              padding: 2.4,
              boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.2)',
              flexDirection: 'column', // Stack children vertically
              alignItems: 'center' // Center-align items horizontally
            }}
          >
            <Typography variant={isSmallScreen ? 'h4' : 'h1'} component="h1" align="center" paddingTop={2}>
              {t('congthongtin.title.donyeucau')}
            </Typography>
            <Typography variant="body1" paddingTop={5} paddingLeft={4} sx={{ lineHeight: '1.5' }}>
              {t('ghichuvbcc1')}
            </Typography>
            <Typography paddingLeft={4} variant="body1" sx={{ lineHeight: '1.5' }}>
              {t('ghichuvbcc2')}
            </Typography>
            <Grid item container xs={12} justifyContent={'center'} spacing={2} mt={2}>
              <Grid item xs={12} sm={6} md={4} lg={2}>
                <FormControl fullWidth variant="outlined">
                  <InputLabel>{t('namtn.title')}</InputLabel>
                  <Select size="small" value={selectNamHoc} onChange={handleNamHocChange} label={t('namtn.title')}>
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
              <Grid item container xs={12} sm={6} md={4} lg={3.5}>
                <TextField
                  fullWidth
                  required
                  id="outlined-basic"
                  label={t('hocsinh.field.fullname')}
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
              <Grid item container xs={12} sm={6} md={4} lg={2.5}>
                <TextField
                  fullWidth
                  required
                  id="outlined-basic"
                  label="CCCD"
                  variant="outlined"
                  size="small"
                  onChange={(e) => setCCCD(e.target.value)}
                  value={cccd}
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
            <Grid item container xs={12} justifyContent={'center'}>
              <Grid item xs={12} sm={4} md={3} lg={2}>
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
        </Container>
        <BackToTop />
      </div>
      {showAlertLogin && <Alert />}
    </div>
  );
}
