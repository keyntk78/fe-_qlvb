import { DataGrid } from '@mui/x-data-grid';
import MainCard from 'components/cards/MainCard';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectedCCCD, setLoading, setOpenSubPopup, setReloadData } from 'store/actions';
import { openSubPopupSelector, reloadDataSelector, selectedHocsinhSelector } from 'store/selectors';
import { useNavigate } from 'react-router-dom';
import { handleResponseStatus } from 'utils/handleResponseStatus';
import { useTranslation } from 'react-i18next';
import useLocalText from 'utils/localText';
import { createSearchParams } from 'utils/createSearchParams';
import i18n from 'i18n';
import React from 'react';
import { convertISODateToFormattedDate } from 'utils/formatDate';
import { Button, FormControl, Grid, TextField } from '@mui/material';
import { IconDownload, IconFileExport, IconSearch } from '@tabler/icons';
import * as XLSX from 'xlsx';
import BackToTop from 'components/scroll/BackToTop';
import ButtonSuccess from 'components/buttoncolor/ButtonSuccess';
import { getHistoryXacMinh } from 'services/xacminhvanbangService';
import ActionButtons from 'components/button/ActionButtons';
import Popup from 'components/controls/popup';
import Detaillichsu from './Detaillichsu';
import config from 'config';
//import config from 'config';
const LichSuXacMinh = () => {
  const language = i18n.language;
  const { t } = useTranslation();
  const localeText = useLocalText();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isAccess, setIsAccess] = useState(true);
  const reloadData = useSelector(reloadDataSelector);
  const selectHocsinh = useSelector(selectedHocsinhSelector);
  const openSubPopup = useSelector(openSubPopupSelector);
  const [dataExport, setDataExport] = useState({});
  const [search, setSearch] = useState(false);
  const [title, setTitle] = useState('');
  const [form, setForm] = useState('');
  // const [data, setData] = useState([]);
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
    //idHocSinh: ''
    //userName: ''
  });
  const handleDetail = (hocsinh) => {
    setTitle(t('Xem chi tiết'));
    setForm('detail');
    dispatch(selectedCCCD(hocsinh));
    dispatch(setOpenSubPopup(true));
  };
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
      field: 'donViYeuCauXacMinh',
      headerName: t('Đơn vị yêu cầu xác minh'),
      minWidth: 180
    },
    {
      flex: 1,
      field: 'congVanSo',
      headerName: t('Công văn số'),
      minWidth: 100
    },
    {
      flex: 1,
      field: 'NgayXacMinh_fm',
      headerName: t('Ngày xác minh'),
      minWidth: 100
    },
    {
      flex: 1,
      field: 'nguoiTao',
      headerName: t('Người xác minh'),
      minWidth: 100
    },
    {
      flex: 0.1,
      field: 'pathFileYeuCau',
      headerName: t('File xác minh'),
      minWidth: 100,
      align: 'center',
      renderCell: (params) => {
        const pathFileYeuCau = config.urlImages + params.row.pathFileYeuCau;

        return (
          <a href={pathFileYeuCau} download title="Tải xuống">
            {params.row.pathFileYeuCau ? <IconDownload /> : ''}
          </a>
        );
      }
    },

    {
      field: 'actions',
      headerName: t('action'),
      width: 90,
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

  useEffect(() => {
    const fetchData = async () => {
      setPageState((old) => ({ ...old, isLoading: true }));
      const params = await createSearchParams(pageState);
      params.append('TuNgay', pageState.fromDate);
      params.append('DenNgay', pageState.toDate);
      params.append('idHocSinh', selectHocsinh.id);
      const response = await getHistoryXacMinh(params);
      const data = await response.data;
      setDataExport(data);
      const check = handleResponseStatus(response, navigate);
      if (check) {
        //console.log(data.length);
        if (data && data.XacMinhVanBang.lichSuXacMinhVanBangs.length > 0) {
          const dataWithIds = data.XacMinhVanBang.lichSuXacMinhVanBangs.map((row, index) => ({
            idx: index + 1,
            NgayXacMinh_fm: convertISODateToFormattedDate(row.ngayTrenCongVan),
            ...row
          }));
          // Lưu trữ dữ liệu gốc vào state
          dispatch(setReloadData(false));
          setPageState((old) => ({
            ...old,
            isLoading: false,
            data: dataWithIds,
            total: data.XacMinhVanBang.totalRow || 0
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

  const handleSearch = () => {
    setSearch(true);
  };

  const handleExport = async (e) => {
    e.preventDefault();
    dispatch(setLoading(true));
    const params = new URLSearchParams();
    params.append('Order', 1);
    params.append('OrderDir', 'ASC');
    params.append('StartIndex', '0');
    params.append('PageSize', -1);
    params.append('idHocSinh', selectHocsinh.id);
    params.append('TuNgay', pageState.fromDate);
    params.append('DenNgay', pageState.toDate);
    // params.append('Username', pageState.userName);
    const response = await getHistoryXacMinh(params);
    const data = await response.data;
    const formattedData =
      data.XacMinhVanBang.lichSuXacMinhVanBangs.length > 0 &&
      data.XacMinhVanBang.lichSuXacMinhVanBangs.map((item, index) => ({
        STT: index + 1,
        'Đơn vị yêu cầu xác minh': item.donViYeuCauXacMinh,
        'Công văn số': item.congVanSo,
        'File xác minh': item.pathFileYeuCau,
        'Ngày xác minh': convertISODateToFormattedDate(item.ngayTrenCongVan),
        'Người xác minh': item.nguoiTao
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
    XLSX.writeFile(workbook, 'LichSuXacMinh_' + selectHocsinh.hoTen + '.xlsx');
    dispatch(setLoading(false));
  };
  return (
    <>
      <MainCard
        sx={{ mt: 2 }}
        title={t(`Lịch sử xác minh [${selectHocsinh.hoTen}]`)}
        secondary={
          <Grid item>
            {dataExport !== null && <ButtonSuccess title={t('button.export')} onClick={handleExport} icon={IconFileExport} />}
          </Grid>
        }
      >
        <Grid container justifyContent="center" mb={1} spacing={1}>
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
        </Grid>
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
      {form !== '' && (
        <Popup
          title={title}
          form={form}
          openPopup={openSubPopup}
          type="subpopup"
          maxWidth={'md'}
          bgcolor={form === 'delete' ? '#F44336' : '#2196F3'}
        >
          {form === 'detail' ? <Detaillichsu /> : ''}
        </Popup>
      )}
      <BackToTop />
    </>
  );
};

export default LichSuXacMinh;
