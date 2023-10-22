import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { IconFileExport, IconSearch } from '@tabler/icons';
import { Button, FormControl, Grid, InputLabel, MenuItem, Select, useMediaQuery } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { reloadDataSelector } from 'store/selectors';
import { setLoading, setReloadData } from 'store/actions';
import { useTranslation } from 'react-i18next';
import { createSearchParams } from 'utils/createSearchParams';
import { handleResponseStatus } from 'utils/handleResponseStatus';
import useLocalText from 'utils/localText';
import i18n from 'i18n';
import { convertISODateToFormattedDate } from 'utils/formatDate';
import MainCard from 'components/cards/MainCard';
import { getDonViByHeDaoTao } from 'services/donvitruongService';
import BackToTop from 'components/scroll/BackToTop';
import ButtonSuccess from 'components/buttoncolor/ButtonSuccess';
import { getAllHedaotao } from 'services/hedaotaoService';
import { getAllNamthi } from 'services/namthiService';
import ExportExcel from './ExportExcel';
import { GetHocSinhDoTotNghiepByTruongAndNam } from 'services/thongkeService';

export default function ThongKeHocSinh() {
  const isXs = useMediaQuery('(max-width:600px)');
  const language = i18n.language;
  const { t } = useTranslation();
  const [heDaoTao, setHeDaoTao] = useState([]);
  const [namHoc, setNamHoc] = useState([]);
  const [donvis, setDonvis] = useState([]);
  const [search, setSearch] = useState(false);
  const [firstLoad, setFirstLoad] = useState(true);
  const reloadData = useSelector(reloadDataSelector);
  const dispatch = useDispatch();
  const localeText = useLocalText();
  const navigate = useNavigate();
  const [disabledSearch, setDisabledSearch] = useState(true);
  const [disabledExport, setDisabledExport] = useState(true);
  const [pageState, setPageState] = useState({
    isLoading: false,
    data: [],
    total: 0,
    order: 1,
    orderDir: 'ASC',
    startIndex: 0,
    pageSize: 10,
    heDaoTao: '',
    namHoc: '',
    donVi: ''
  });

  const [pageState1, setPageState1] = useState({
    isLoading: false,
    data: [],
    total: 0,
    order: 1,
    orderDir: 'ASC',
    startIndex: 0,
    pageSize: 10000,
    heDaoTao: '',
    namHoc: '',
    donVi: ''
  });

  const handleSearch = () => {
    setSearch(!search);
    setDisabledExport(false);
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
      minWidth: 180
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
      flex: 1,
      minWidth: 70
    },
    {
      field: 'ngaySinh_fm',
      headerName: t('hocsinh.field.bdate'),
      flex: 1.3,
      minWidth: 100
    },
    {
      field: 'noiSinh',
      headerName: t('Nơi sinh'),
      flex: 1.5,
      minWidth: 120
    },
    {
      field: 'soHieuVanBang',
      headerName: t('hocsinh.field.soHieu'),
      flex: 1.5,
      minWidth: 130
    },
    {
      field: 'soVaoSoCapBang',
      headerName: t('hocsinh.field.soCapBang'),
      flex: 2,
      minWidth: 130
    }
  ];

  useEffect(() => {
    const fetchDataDL = async () => {
      const response = await getAllHedaotao();
      setHeDaoTao(response.data);
      const donvi = await getAllNamthi();
      setNamHoc(donvi.data);
    };
    fetchDataDL();
  }, []);

  useEffect(() => {
    const fetchDataDL = async () => {
      const donvi = await getDonViByHeDaoTao(pageState.heDaoTao);
      setDonvis(donvi.data);
    };
    if (pageState.heDaoTao) {
      fetchDataDL();
    }
  }, [pageState.heDaoTao]);

  useEffect(() => {
    if (pageState.namHoc && pageState.donVi) {
      setDisabledSearch(false);
    } else {
      setDisabledSearch(true);
    }
  }, [pageState.namHoc, pageState.donVi]);

  useEffect(() => {
    const fetchData = async () => {
      setPageState((old) => ({ ...old, isLoading: true }));
      const params = await createSearchParams(pageState);
      params.append('idTruong', pageState.donVi);
      params.append('idNamThi', pageState.namHoc);
      const response = await GetHocSinhDoTotNghiepByTruongAndNam(params);
      const check = handleResponseStatus(response, navigate);
      if (check) {
        const data = await response.data;
        const dataWithIds = data.hocSinh.map((row, index) => ({
          idx: pageState.startIndex * pageState.pageSize + index + 1,
          soHieuVanBang: row.soHieuVanBang || 'Chưa cấp',
          soVaoSoCapBang: row.soVaoSoCapBang || 'Chưa cấp',
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
    if (!firstLoad) {
      fetchData();
    } else {
      setFirstLoad(false);
    }
  }, [pageState.search, pageState.order, pageState.orderDir, pageState.startIndex, pageState.pageSize, reloadData, search]);

  useEffect(() => {
    const fetchData = async () => {
      const params = await createSearchParams(pageState1);
      params.append('idTruong', pageState.donVi);
      params.append('idNamThi', pageState.namHoc);
      const response = await GetHocSinhDoTotNghiepByTruongAndNam(params);
      const check = handleResponseStatus(response, navigate);
      if (check) {
        const data = await response.data;
        const dataWithIds = data.hocSinh.map((row, index) => ({
          idx: pageState1.startIndex * pageState1.pageSize + index + 1,
          soHieuVanBang: row.soHieuVanBang || 'Chưa cấp',
          soVaoSoCapBang: row.soVaoSoCapBang || 'Chưa cấp',
          gioiTinh_fm: row.gioiTinh ? t('gender.male') : t('gender.female'),
          ngaySinh_fm: convertISODateToFormattedDate(row.ngaySinh),
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
    if (!firstLoad) {
      fetchData();
    } else {
      setFirstLoad(false);
    }
  }, [reloadData, search]);

  const handleSchoolChange = (event) => {
    const selectedValue = event.target.value;
    // const maDonvi = selectedValue === 'all' ? '' : selectedValue;
    setPageState((old) => ({ ...old, donVi: selectedValue }));
  };

  const handleHeDaoTaoChange = (event) => {
    const selectedValue = event.target.value;
    setPageState((old) => ({ ...old, heDaoTao: selectedValue }));
  };

  const handleNamHocChange = (event) => {
    const selectedValue = event.target.value;
    setPageState((old) => ({ ...old, namHoc: selectedValue }));
  };

  const handleExport = async (e) => {
    e.preventDefault();
    dispatch(setLoading(true));
    const donviSelect = pageState.donVi;
    const selectedDonVi = donvis.find((donvi) => donvi.id === donviSelect);
    const namhocSelect = pageState.namHoc;
    const selectedNamHoc = namHoc.find((namhoc) => namhoc.id === namhocSelect);
    await ExportExcel(selectedNamHoc.ten, selectedDonVi.ten, pageState1.data);
    dispatch(setLoading(false));
  };

  return (
    <>
      <MainCard
        title={t('Thống kê học sinh tốt nghiệp')}
        secondary={
          <ButtonSuccess title={t('button.export.excel')} onClick={handleExport} icon={IconFileExport} disabled={disabledExport} />
        }
      >
        <Grid item container spacing={1} mb={2} justifyContent={'center'}>
          <Grid item lg={2} md={3} sm={4} xs={isXs ? 4 : 2}>
            <FormControl fullWidth variant="outlined" size="small">
              <InputLabel>{t('Năm học')}</InputLabel>
              <Select name="id" value={pageState.namHoc} onChange={handleNamHocChange} label={t('Năm học')}>
                {namHoc && namHoc.length > 0 ? (
                  namHoc.map((data) => (
                    <MenuItem key={data.id} value={data.id}>
                      {data.ten}
                    </MenuItem>
                  ))
                ) : (
                  <MenuItem value="">No data available</MenuItem>
                )}
              </Select>
            </FormControl>
          </Grid>
          <Grid item lg={4} md={7} sm={8} xs={isXs ? 8 : 4}>
            <FormControl fullWidth variant="outlined" size="small">
              <InputLabel>{t('Hệ đào tạo')}</InputLabel>
              <Select name="heDaoTao" value={pageState.heDaoTao} onChange={handleHeDaoTaoChange} label={t('Hệ đào tạo')}>
                {heDaoTao && heDaoTao.length > 0 ? (
                  heDaoTao.map((data) => (
                    <MenuItem key={data.ma} value={data.ma}>
                      {data.ten}
                    </MenuItem>
                  ))
                ) : (
                  <MenuItem value="">No data available</MenuItem>
                )}
              </Select>
            </FormControl>
          </Grid>
          <Grid item lg={4} md={7} sm={8} xs={isXs ? 12 : 4}>
            <FormControl fullWidth variant="outlined" size="small">
              <InputLabel>{t('donvitruong.title')}</InputLabel>
              <Select
                name="truongId"
                // value={pageState.donVi === '' ? 'all' : pageState.donVi}
                value={pageState.donVi}
                onChange={handleSchoolChange}
                label={t('donvitruong.title')}
              >
                {/* <MenuItem value="all">{t('select.all')}</MenuItem> */}
                {donvis && donvis.length > 0 ? (
                  donvis.map((data) => (
                    <MenuItem key={data.id} value={data.id}>
                      {data.ten}
                    </MenuItem>
                  ))
                ) : (
                  <MenuItem value="">No data available</MenuItem>
                )}
              </Select>
            </FormControl>
          </Grid>
          <Grid item lg={2} md={3} sm={4} xs={isXs ? 6 : 2} minWidth={130}>
            <Button
              variant="contained"
              title={t('button.search')}
              fullWidth
              onClick={handleSearch}
              color="info"
              sx={{ marginTop: '2px' }}
              startIcon={<IconSearch />}
              disabled={disabledSearch}
            >
              {t('button.search')}
            </Button>
          </Grid>
        </Grid>
        <DataGrid
          autoHeight
          columns={columns}
          rows={pageState.data}
          rowCount={pageState.total}
          loading={pageState.isLoading}
          rowsPerPageOptions={[5, 10, 25, 50, 100]}
          rowHeight={60}
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
        />
      </MainCard>
      <BackToTop />
    </>
  );
}
