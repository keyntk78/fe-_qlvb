import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { IconFileExport, IconSearch } from '@tabler/icons';
import { Button, FormControl, Grid, InputLabel, MenuItem, Select, useMediaQuery } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { donviSelector, reloadDataSelector, userLoginSelector } from 'store/selectors';
import { setLoading, setReloadData } from 'store/actions';
import { useTranslation } from 'react-i18next';
import { createSearchParams } from 'utils/createSearchParams';
import { handleResponseStatus } from 'utils/handleResponseStatus';
import useLocalText from 'utils/localText';
import i18n from 'i18n';
import { convertISODateToFormattedDate } from 'utils/formatDate';
import MainCard from 'components/cards/MainCard';
import ButtonSuccess from 'components/buttoncolor/ButtonSuccess';
import { getAllNamthi } from 'services/namthiService';
import ExportExcel from './ExportExcel';
import { GetHocSinhDTNByTruongAndNamOrDMTN } from 'services/thongkeService';
import { getAllHinhthucdaotao } from 'services/hinhthucdaotaoService';
import { getByIdNamThi } from 'services/sharedService';

export default function ThongKeHocSinhTotNghiep() {
  const isXs = useMediaQuery('(max-width:700px)');
  const language = i18n.language;
  const { t } = useTranslation();
  const [htdt, setHTDT] = useState([]);
  const [namHoc, setNamHoc] = useState([]);
  const [danhMuc, setDanhMuc] = useState([]);
  const [search, setSearch] = useState(false);
  const [firstLoad, setFirstLoad] = useState(true);
  const reloadData = useSelector(reloadDataSelector);
  const user = useSelector(userLoginSelector);
  const dispatch = useDispatch();
  const localeText = useLocalText();
  const navigate = useNavigate();
  const donvi = useSelector(donviSelector);
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
    namHoc: '',
    HTDT: '',
    danhMuc: ''
  });

  const [pageState1, setPageState1] = useState({
    isLoading: false,
    data: [],
    total: 0,
    order: 1,
    orderDir: 'ASC',
    startIndex: 0,
    pageSize: 10000,
    namHoc: '',
    HTDT: '',
    danhMuc: ''
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
      const donvi = await getAllNamthi();
      setNamHoc(donvi.data);
      const response = await getAllHinhthucdaotao();
      setHTDT(response.data);
    };
    fetchDataDL();
  }, []);

  useEffect(() => {
    const fetchDataDL = async () => {
      const danhmuc = await getByIdNamThi(pageState.namHoc, pageState.HTDT, user.username);
      if (danhmuc.data && danhmuc.data.length > 0) {
        setDanhMuc(danhmuc.data);
      } else {
        setDanhMuc(danhmuc.data);
        [];
      }
    };
    if ((pageState.namHoc, pageState.HTDT)) {
      fetchDataDL();
    }
  }, [pageState.namHoc, pageState.HTDT]);

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
      params.append('idTruong', donvi.id);
      params.append('idNamThi', pageState.namHoc);
      params.append('idDanhMucTotNghiep', pageState.danhMuc);
      const response = await GetHocSinhDTNByTruongAndNamOrDMTN(params);
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
      params.append('idTruong', donvi.id);
      params.append('idNamThi', pageState.namHoc);
      params.append('idDanhMucTotNghiep', pageState.danhMuc);
      const response = await GetHocSinhDTNByTruongAndNamOrDMTN(params);
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

  const handleDanhMucChange = (event) => {
    const selectedValue = event.target.value;
    // const maDonvi = selectedValue === 'all' ? '' : selectedValue;
    setPageState((old) => ({ ...old, danhMuc: selectedValue }));
  };

  const handleHTDTChange = (event) => {
    const selectedValue = event.target.value;
    setPageState((old) => ({ ...old, HTDT: selectedValue }));
  };

  const handleNamHocChange = (event) => {
    const selectedValue = event.target.value;
    setPageState((old) => ({ ...old, namHoc: selectedValue }));
  };

  const handleExport = async (e) => {
    e.preventDefault();
    dispatch(setLoading(true));
    const danhMucSelect = pageState.danhMuc;
    const selectedDanhMuc = danhMuc.find((danhmuc) => danhmuc.id === danhMucSelect);
    const namhocSelect = pageState.namHoc;
    const selectedNamHoc = namHoc.find((namhoc) => namhoc.id === namhocSelect);
    await ExportExcel(selectedNamHoc.ten, selectedDanhMuc ? selectedDanhMuc.tieuDe : '', donvi.ten, pageState1.data);
    dispatch(setLoading(false));
  };

  return (
    <>
      <MainCard hideInstruct title={t('Thống kê học sinh đỗ tốt nghiệp')}>
        <Grid item container spacing={1} mb={2} justifyContent={'center'} alignItems="center">
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
              <InputLabel>{t('Hình thức đào tạo')}</InputLabel>
              <Select name="HTDT" value={pageState.HTDT} onChange={handleHTDTChange} label={t('Hình thức đào tạo')}>
                {htdt && htdt.length > 0 ? (
                  htdt.map((data) => (
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
              <InputLabel>{t('Danh mục tốt nghiệp')}</InputLabel>
              <Select
                name="danhMuc"
                // value={pageState.donVi === '' ? 'all' : pageState.donVi}
                value={pageState.danhMuc}
                onChange={handleDanhMucChange}
                label={t('Danh mục tốt nghiệp')}
              >
                {/* <MenuItem value="all">{t('select.all')}</MenuItem> */}
                {danhMuc && danhMuc.length > 0 ? (
                  danhMuc.map((data) => (
                    <MenuItem key={data.id} value={data.id}>
                      {data.tieuDe}
                    </MenuItem>
                  ))
                ) : (
                  <MenuItem value="">No data available</MenuItem>
                )}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
        <Grid item xs={12} container spacing={2} justifyContent="center" mt={1} mb={2}>
          <Grid item lg={2} md={3} sm={4} xs={isXs ? 6 : 2} minWidth={130}>
            <Button
              variant="contained"
              title={t('button.search')}
              fullWidth
              onClick={handleSearch}
              color="info"
              startIcon={<IconSearch />}
              disabled={disabledSearch}
            >
              {t('button.search')}
            </Button>
          </Grid>
          <Grid item>
            <ButtonSuccess title={t('button.export.excel')} onClick={handleExport} icon={IconFileExport} disabled={disabledExport} />
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
    </>
  );
}
