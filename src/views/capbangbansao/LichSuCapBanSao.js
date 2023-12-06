import { DataGrid } from '@mui/x-data-grid';
import MainCard from 'components/cards/MainCard';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setLoading, setReloadData } from 'store/actions';
import { capBangBansaoSelector, reloadDataSelector } from 'store/selectors';
import { useNavigate } from 'react-router-dom';
import { handleResponseStatus } from 'utils/handleResponseStatus';
import { useTranslation } from 'react-i18next';
import useLocalText from 'utils/localText';
import { createSearchParams } from 'utils/createSearchParams';
import i18n from 'i18n';
import React from 'react';
import { convertISODateToFormattedDate } from 'utils/formatDate';
import { Chip, Grid } from '@mui/material';
import { IconFileExport } from '@tabler/icons';
import * as XLSX from 'xlsx';
import ButtonSuccess from 'components/buttoncolor/ButtonSuccess';
import { GetSearchLichSuDonYeuCau } from 'services/capbangbansaoService';
const LichSuCapBanSao = () => {
  const language = i18n.language;
  const { t } = useTranslation();
  const localeText = useLocalText();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isAccess, setIsAccess] = useState(true);
  const reloadData = useSelector(reloadDataSelector);
  const selectHocsinh = useSelector(capBangBansaoSelector);
  const [dataExport, setDataExport] = useState({});
  const [search, setSearch] = useState(false);
  const [pageState, setPageState] = useState({
    isLoading: false,
    data: [],
    total: 0,
    order: 1,
    orderDir: 'ASC',
    startIndex: 0,
    pageSize: 10,
    fromDate: '',
    toDate: ''
  });
  const columns = [
    {
      field: 'idx',
      headerName: t('serial'),
      width: 50,
      sortable: false,
      filterable: false
    },
    {
      flex: 1.5,
      field: 'soVaoSoBanSao',
      headerName: t('Số vào sổ bản sao'),
      minWidth: 180
    },
    {
      flex: 1,
      field: 'soLuongBanSao',
      headerName: t('Số bản cấp'),
      minWidth: 100
    },
    {
      flex: 1,
      field: 'ngayDuyet_fm',
      headerName: t('Ngày duyệt'),
      minWidth: 100
    },
    {
      flex: 1,
      field: 'nguoiDuyet',
      headerName: t('Người duyệt'),
      minWidth: 100
    },
    {
      flex: 1,
      field: 'ngayXacNhanIn_fm',
      headerName: t('Ngày xác nhận in'),
      minWidth: 100
    },
    {
      flex: 1,
      field: 'nguoiXacNhanIn',
      headerName: t('Người xác nhận in'),
      minWidth: 100
    },
    {
      flex: 1,
      field: 'trangThai_fm',
      headerName: t('Trạng thái'),
      minWidth: 100,
      renderCell: (params) => (
        <>
          <Grid container>
            <Grid item xs={12} mt={0.2}>
              <Chip
                size="small"
                label={params.row.trangThai_fm}
                color={
                  params.row.trangThai === -1
                    ? 'error'
                    : params.row.trangThai === 0
                    ? 'secondary'
                    : params.row.trangThai === 1
                    ? 'info'
                    : 'success'
                }
              />
            </Grid>
          </Grid>
        </>
      )
    }
  ];

  useEffect(() => {
    const fetchData = async () => {
      setPageState((old) => ({ ...old, isLoading: true }));
      const params = await createSearchParams(pageState);
      //   params.append('TuNgay', pageState.fromDate);
      //   params.append('DenNgay', pageState.toDate);
      params.append('idHocSinh', selectHocsinh.idHocSinh);
      const response = await GetSearchLichSuDonYeuCau(params);
      const data = await response.data;
      setDataExport(data);
      const check = handleResponseStatus(response, navigate);
      if (check) {
        if (data && data.danhMucTotNghieps.length > 0) {
          const dataWithIds = data.danhMucTotNghieps.map((row, index) => ({
            idx: index + 1,
            ngayDuyet_fm: row.ngayDuyet ? convertISODateToFormattedDate(row.ngayDuyet) : '',
            ngayXacNhanIn_fm: row.ngayXacNhanIn ? convertISODateToFormattedDate(row.ngayXacNhanIn) : '',
            trangThai_fm:
              row.trangThai == -1
                ? t('Bị từ chối')
                : row.trangThai == 0
                ? t('Chưa duyệt')
                : row.trangThai == 1
                ? t('Đã duyệt')
                : row.trangThai == 2
                ? t('Đã in')
                : row.trangThai == 3
                ? t('Đã phát')
                : '',
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
          setPageState((old) => ({
            ...old,
            isLoading: false,
            data: [],
            total: 0
          }));
        }
      } else {
        setIsAccess(false);
      }
    };
    fetchData();
    setSearch(false);
  }, [
    pageState.search,
    pageState.order,
    pageState.orderDir,
    pageState.startIndex,
    pageState.pageSize,
    reloadData,
    search,
    selectHocsinh.id
  ]);

  // const handleSearch = () => {
  //   setSearch(true);
  // };

  const handleExport = async (e) => {
    e.preventDefault();
    dispatch(setLoading(true));
    const params = new URLSearchParams();
    params.append('Order', 1);
    params.append('OrderDir', 'ASC');
    params.append('StartIndex', '0');
    params.append('PageSize', 1000);
    params.append('idHocSinh', selectHocsinh.idHocSinh);
    // params.append('TuNgay', pageState.fromDate);
    // params.append('DenNgay', pageState.toDate);
    // params.append('Username', pageState.userName);
    const response = await GetSearchLichSuDonYeuCau(params);
    const data = await response.data;
    const formattedData =
      data.danhMucTotNghieps.length > 0 &&
      data.danhMucTotNghieps.map((item, index) => ({
        STT: index + 1,
        'Số vào sổ bản sao': item.soVaoSoBanSao,
        'Số lượng bản sao': item.soLuongBanSao,
        'Ngày duyệt': convertISODateToFormattedDate(item.ngayDuyet),
        'Người duyệt': item.nguoiDuyet,
        'Ngày xác nhận in': item.ngayXacNhanIn ? convertISODateToFormattedDate(item.ngayXacNhanIn) : '',
        'Người xác nhận in': item.nguoiXacNhanIn,
        'Trạng thái':
          item.trangThai == -1
            ? t('Bị từ chối')
            : item.trangThai == 0
            ? t('Chưa duyệt')
            : item.trangThai == 1
            ? t('Đã duyệt')
            : item.trangThai == 2
            ? t('Đã in')
            : item.trangThai == 3
            ? t('Đã phát')
            : ''
      }));
    const worksheet = XLSX.utils.json_to_sheet(formattedData);

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'HistoryAccessData');
    // Điều chỉnh chiều rộng của các cột trong file xuất ra
    const columnsWidth = [
      { wch: 10 }, // Chiều rộng cột 'serial'
      { wch: 30 }, // Chiều rộng cột 'user.field.fullname'
      { wch: 20 }, // Chiều rộng cột 'user.field.username'
      { wch: 30 }, // Chiều rộng cột 'user.field.username'
      { wch: 20 }, // Chiều rộng cột 'user.field.username'
      { wch: 20 } // Chiều rộng cột 'LoginOn'
    ];

    worksheet['!cols'] = columnsWidth;
    XLSX.writeFile(workbook, 'LichSuCapBanSao_' + selectHocsinh.hoTen + '.xlsx');
    dispatch(setLoading(false));
  };
  return (
    <>
      <MainCard
        hideInstruct
        sx={{ mt: 2 }}
        title={t(`Lịch sử cấp bản sao [${selectHocsinh.HoTen}]`)}
        secondary={
          <Grid item>
            {dataExport !== null && <ButtonSuccess title={t('button.export')} onClick={handleExport} icon={IconFileExport} />}
          </Grid>
        }
      >
        {/* <Grid container justifyContent="center" mb={1} spacing={1}>
          <Grid item maxWidth={140}>
            <FormControl fullWidth variant="outlined">
              <TextField
                size="small"
                name="fromDate"
                type="date"
                label={t('fromDate')}
                onChange={(e) => setPageState((old) => ({ ...old, fromDate: e.target.value }))}
                onBlur={() => {
                  if (pageState.toDate < pageState.fromDate) {
                    setPageState({ ...pageState, toDate: pageState.fromDate });
                  }
                }}
                value={pageState.fromDate}
                InputLabelProps={{
                  shrink: true
                }}
              />
            </FormControl>
          </Grid>
          <Grid item maxWidth={140}>
            <FormControl fullWidth variant="outlined">
              <TextField
                size="small"
                name="toDate"
                type="date"
                label={t('toDate')}
                onChange={(e) => setPageState((old) => ({ ...old, toDate: e.target.value }))}
                inputProps={{
                  min: pageState.fromDate
                }}
                value={pageState.toDate}
                InputLabelProps={{
                  shrink: true
                }}
              />
            </FormControl>
          </Grid>
          <Grid item mt={'1px'} mb={1}>
            <Button variant="contained" title="Tìm kiếm" color="info" onClick={handleSearch} startIcon={<IconSearch />}>
              {t('button.search')}
            </Button>
          </Grid>
        </Grid> */}
        {isAccess ? (
          <DataGrid
            autoHeight
            columns={columns}
            rows={pageState.data}
            rowCount={pageState.total}
            loading={pageState.isLoading}
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
          />
        ) : (
          <h1>{t('not.allow.access')}</h1>
        )}
      </MainCard>
    </>
  );
};

export default LichSuCapBanSao;
