import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { IconFileExport, IconSearch } from '@tabler/icons';
import { Button, FormControl, Grid, InputLabel, MenuItem, Select, useMediaQuery } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { reloadDataSelector, userLoginSelector } from 'store/selectors';
import { setLoading, setReloadData } from 'store/actions';
import { useTranslation } from 'react-i18next';
import { createSearchParams } from 'utils/createSearchParams';
import { handleResponseStatus } from 'utils/handleResponseStatus';
import useLocalText from 'utils/localText';
import i18n from 'i18n';
import MainCard from 'components/cards/MainCard';
import BackToTop from 'components/scroll/BackToTop';
import ButtonSuccess from 'components/buttoncolor/ButtonSuccess';
// import { getAllHedaotao } from 'services/hedaotaoService';
import { getAllNamthi } from 'services/namthiService';
import ExportExcel from './ExportExcel';
import { GetThongKePhatBang } from 'services/thongkeService';

export default function ThongKeHocSinh() {
  const isXs = useMediaQuery('(max-width:700px)');
  const language = i18n.language;
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  // const [heDaoTao, setHeDaoTao] = useState([]);
  const [namHoc, setNamHoc] = useState([]);
  const [search, setSearch] = useState(false);
  const [firstLoad, setFirstLoad] = useState(true);
  const reloadData = useSelector(reloadDataSelector);
  const localeText = useLocalText();
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
    namHoc: ''
  });

  const user = useSelector(userLoginSelector);


  const [pageState1, setPageState1] = useState({
    isLoading: false,
    data: [],
    total: 0,
    order: 1,
    orderDir: 'ASC',
    startIndex: 0,
    pageSize: 10000,
    heDaoTao: '',
    namHoc: ''
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
      field: 'ten',
      headerName: t('Tên trường'),
      flex: 2.5,
      minWidth: 180
    },
    {
      field: 'chuaPhat',
      headerName: t('Số lượng bằng chưa phát'),
      flex: 1,
      minWidth: 100
    },
    {
      field: 'daPhat',
      headerName: t('Số lượng bằng đã phát'),
      flex: 1,
      minWidth: 100
    }
  ];

  useEffect(() => {
    const fetchDataDL = async () => {
      // const response = await getAllHedaotao();
      // setHeDaoTao(response.data);
      const namhoc = await getAllNamthi();
      setNamHoc(namhoc.data);
    };
    fetchDataDL();
  }, []);

  useEffect(() => {
    if (pageState.namHoc) {
      setDisabledSearch(false);
    } else {
      setDisabledSearch(true);
    }
  }, [pageState.namHoc]);

  useEffect(() => {
    const fetchData = async () => {
      setPageState((old) => ({ ...old, isLoading: true }));
      const params = await createSearchParams(pageState);
      params.append('idNamThi', pageState.namHoc);
      params.append('nguoiThucHien', user.username);
      const response = await GetThongKePhatBang(params);
      const check = handleResponseStatus(response, navigate);
      if (check) {
        const data = await response.data;
        const dataWithIds = data.truongs.map((row, index) => ({
          idx: pageState.startIndex * pageState.pageSize + index + 1,
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
      params.append('idNamThi', pageState.namHoc);
      params.append('nguoiThucHien', user.username);
      const response = await GetThongKePhatBang(params);
      const check = handleResponseStatus(response, navigate);
      if (check) {
        const data = await response.data;
        const dataWithIds = data.truongs.map((row, index) => ({
          idx: pageState1.startIndex * pageState1.pageSize + index + 1,
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

  // const handleHeDaoTaoChange = (event) => {
  //   const selectedValue = event.target.value;
  //   setPageState((old) => ({ ...old, heDaoTao: selectedValue }));
  // };

  const handleNamHocChange = (event) => {
    const selectedValue = event.target.value;
    setPageState((old) => ({ ...old, namHoc: selectedValue }));
  };

  const handleExport = async (e) => {
    e.preventDefault();
    dispatch(setLoading(true));
    // const heDaoTaoSelect = pageState.heDaoTao;
    // const selectedHDT = heDaoTao.find((hdt) => hdt.ma === heDaoTaoSelect);
    const namhocSelect = pageState.namHoc;
    const selectedNamHoc = namHoc.find((namhoc) => namhoc.id === namhocSelect);
    await ExportExcel(selectedNamHoc.ten, selectedHDT.ten, pageState1.data);
    dispatch(setLoading(false));
  };

  return (
    <>
      <MainCard
        title={t('Thống kê phát bằng')}
        secondary={
          <ButtonSuccess title={t('button.export.excel')} onClick={handleExport} icon={IconFileExport} disabled={disabledExport} />
        }
      >
        <Grid item container spacing={1} mb={2} justifyContent={'center'}>
          <Grid item lg={2} md={3} sm={3} xs={isXs ? 4 : 2}>
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
          {/* <Grid item lg={4} md={6} sm={6} xs={isXs ? 8 : 4}>
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
          </Grid> */}
          <Grid item lg={2} md={3} sm={3} xs={isXs ? 6 : 2} minWidth={130}>
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
