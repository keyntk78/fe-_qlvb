import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { IconFileExport, IconSearch } from '@tabler/icons';
import { Button, FormControl, Grid, InputLabel, MenuItem, Select, useMediaQuery } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { reloadDataSelector, donviSelector } from 'store/selectors';
import { setLoading, setReloadData } from 'store/actions';
import { useTranslation } from 'react-i18next';
import { createSearchParams } from 'utils/createSearchParams';
import { handleResponseStatus } from 'utils/handleResponseStatus';
import useLocalText from 'utils/localText';
import i18n from 'i18n';
import { getXepLoaiHocSinh } from 'services/hocsinhService';
import MainCard from 'components/cards/MainCard';
import { getAllDonvi } from 'services/donvitruongService';
import ButtonSuccess from 'components/buttoncolor/ButtonSuccess';
import { getAllNamthi } from 'services/namthiService';
import ExportExcel from './ExportExcel';

export default function ThongKeHocSinhTheoNam() {
  const isXs = useMediaQuery('(max-width:600px)');
  const language = i18n.language;
  const { t } = useTranslation();
  const [namHoc, setNamHoc] = useState([]);
  const [donvis, setDonvis] = useState([]);
  const [search, setSearch] = useState(false);
  const [firstLoad, setFirstLoad] = useState(true);
  const reloadData = useSelector(reloadDataSelector);
  const donVi = useSelector(donviSelector);
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
      field: 'tenTruong',
      headerName: t('Tên trường'),
      minWidth: 200
    },
    {
      field: 'soLuongHocSinhGioi',
      headerName: t('Giỏi'),
      minWidth: 130
    },
    {
      field: 'soLuongHocSinhKha',
      headerName: t('Khá'),
      minWidth: 130
    },
    {
      field: 'soLuongHocSinhTrungBinh',
      headerName: t('Trung Bình'),
      minWidth: 160
    },
    {
      field: 'soLuongHocSinhDatTotNghiep',
      headerName: t('Đỗ tốt nghiệp'),
      minWidth: 180
    },
    {
      field: 'soLuongHocSinhKhongDatTotNghiep',
      headerName: t('Trượt tốt nghiệp'),
      flex: 1,
      minWidth: 40
    }
  ];

  useEffect(() => {
    const fetchDataDL = async () => {
      const donvi = await getAllNamthi();
      setNamHoc(donvi.data);
    };
    fetchDataDL();
  }, []);

  useEffect(() => {
    const fetchDataDL = async () => {
      const donvi = await getAllDonvi();
      setDonvis(donvi.data);
    };
    fetchDataDL();
  }, []);

  useEffect(() => {
    if (!donVi.laPhong && pageState.namHoc) {
      setDisabledSearch(false);
    } else if (pageState.namHoc) {
      setDisabledSearch(false);
    } else {
      setDisabledSearch(true);
    }
  }, [pageState.namHoc, pageState.donVi]);

  useEffect(() => {
    const fetchData = async () => {
      setPageState((old) => ({ ...old, isLoading: true }));
      const params = await createSearchParams(pageState);
      params.append('IdNamThi', pageState.namHoc);
      params.append('IdTruong', donVi.laPhong ? (pageState.donVi === 'all' ? '' : pageState.donVi) : donVi.id);
      const response = await getXepLoaiHocSinh(params);
      const check = handleResponseStatus(response, navigate);
      if (check) {
        const data = await response.data;
        const dataWithIds = data.thongKes.map((row, i) => ({
          idx: pageState.startIndex * pageState.pageSize + i + 1,
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

  const handleSchoolChange = (event) => {
    const selectedValue = event.target.value;
    // const maDonvi = selectedValue === 'all' ? '' : selectedValue;
    setPageState((old) => ({ ...old, donVi: selectedValue }));
  };

  const handleNamHocChange = (event) => {
    const selectedValue = event.target.value;
    setPageState((old) => ({ ...old, namHoc: selectedValue }));
  };

  const handleExport = async (e) => {
    e.preventDefault();
    dispatch(setLoading(true));
    const namhocSelect = pageState.namHoc;
    const selectedNamHoc = namHoc.find((namhoc) => namhoc.id === namhocSelect);
    await ExportExcel(selectedNamHoc.ten, pageState.data);
    dispatch(setLoading(false));
  };

  return (
    <>
      <MainCard hideInstruct title={t('Thống kê học sinh theo năm')}>
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
          {donVi.laPhong ? (
            <Grid item lg={4} md={7} sm={8} xs={isXs ? 12 : 4}>
              <FormControl fullWidth variant="outlined" size="small">
                <InputLabel>{t('donvitruong.title')}</InputLabel>
                <Select
                  name="truongId"
                  // value={pageState.donVi === '' ? 'all' : pageState.donVi}
                  value={pageState.donVi ? pageState.donVi : ''}
                  onChange={handleSchoolChange}
                  label={t('donvitruong.title')}
                >
                  <MenuItem value={'all'}>Tất cả</MenuItem>
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
          ) : (
            <>
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
            </>
          )}
        </Grid>
        {donVi.laPhong ? (
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
        ) : (
          ''
        )}
        <DataGrid
          autoHeight
          columns={columns}
          rows={pageState.data}
          rowCount={pageState.total}
          loading={pageState.isLoading}
          rowsPerPageOptions={[5, 10, 25, 50, 100]}
          getRowId={(row) => row.idx}
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
