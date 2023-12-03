import { DataGrid } from '@mui/x-data-grid';
import MainCard from 'components/cards/MainCard';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setLoading, setOpenPopup, setReloadData } from 'store/actions';
import { openPopupSelector, reloadDataSelector, userLoginSelector } from 'store/selectors';
import { useNavigate } from 'react-router-dom';
import { handleResponseStatus } from 'utils/handleResponseStatus';
import { useTranslation } from 'react-i18next';
import useLocalText from 'utils/localText';
import { createSearchParams } from 'utils/createSearchParams';
import i18n from 'i18n';
import React from 'react';
import { convertISODateTimeToFormattedDateTime } from 'utils/formatDate';
import { Button, FormControl, Grid, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import { IconAddressBook, IconFileExport, IconSearch, IconTransferIn } from '@tabler/icons';
import BackToTop from 'components/scroll/BackToTop';
import ButtonSuccess from 'components/buttoncolor/ButtonSuccess';
import { format, subMonths } from 'date-fns';
import Popup from 'components/controls/popup';
import ChuyenDoi from './ChuyenDoi';
import * as XLSX from 'xlsx';
import { getAllTruong } from 'services/sharedService';
import { getLichSuChuyenDoiSoGoc } from 'services/sogocService';
import CustomButton from 'components/button/CustomButton';
import HuongDan from './HuongDan';

const ChuyenDoiSoGocCu = () => {
  const language = i18n.language;
  const { t } = useTranslation();
  const localeText = useLocalText();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isAccess, setIsAccess] = useState(true);
  const reloadData = useSelector(reloadDataSelector);
  const [search, setSearch] = useState(false);
  const [donvi, setDonVi] = useState([]);
  const [selectedDonViOld, setSelectedDonViOld] = useState('');
  const [selectedDonViNew, setSelectedDonViNew] = useState('');
  const [title, setTitle] = useState('');
  const [form, setForm] = useState('');
  const openPopup = useSelector(openPopupSelector);
  const user = useSelector(userLoginSelector);
  const [pageState, setPageState] = useState({
    isLoading: false,
    data: [],
    total: 0,
    order: 1,
    orderDir: 'ASC',
    startIndex: 0,
    pageSize: 10,
    fromDate: format(subMonths(new Date(), 1), 'yyyy-MM-dd'),
    toDate: format(new Date(), 'yyyy-MM-dd')
  });

  useEffect(() => {
    const fetchDataDL = async () => {
      const donvi = await getAllTruong(user.username);
      setDonVi(donvi.data);
    };
    fetchDataDL();
  }, []);

  const columns = [
    {
      field: 'idx',
      headerName: t('serial'),
      width: 50,
      sortable: false,
      filterable: false
    },
    {
      flex: 1,
      field: 'nguoiTao',
      headerName: t('Người tạo'),
      minWidth: 100
    },
    {
      flex: 1.5,
      field: 'tenTruongCu',
      headerName: t('Tên trường cũ'),
      minWidth: 180
    },
    {
      flex: 1.5,
      field: 'tenTruongMoi',
      headerName: t('Tên trường mới'),
      minWidth: 180
    },
    {
      flex: 1,
      field: 'transferTime',
      headerName: t('Thời gian chuyển đổi'),
      minWidth: 150
    }
  ];

  useEffect(() => {
    const fetchData = async () => {
      setPageState((old) => ({ ...old, isLoading: true }));
      const params = await createSearchParams(pageState);
      params.append('FromDate', pageState.fromDate);
      params.append('ToDate', pageState.toDate);
      const response = await getLichSuChuyenDoiSoGoc(params);
      const check = handleResponseStatus(response, navigate);
      if (check) {
        const data = await response.data;
        const dataWithIds = data.hocSinhs.map((row, index) => ({
          idx: pageState.startIndex * pageState.pageSize + index + 1,
          transferTime: row.ngayTao == null ? 'Chưa truy cập ' : convertISODateTimeToFormattedDateTime(row.ngayTao),
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
    fetchData();
    setSearch(false);
  }, [pageState.search, pageState.order, pageState.orderDir, pageState.startIndex, pageState.pageSize, reloadData, search]);

  const handleSearch = () => {
    setSearch(true);
  };

  const handleChuyenDoi = () => {
    setTitle(t('Chuyển đổi sổ gốc cũ'));
    setForm('transfer');
    dispatch(setOpenPopup(true));
  };

  const handleHuongDan = () => {
    setTitle(t('Hướng dẫn chuyển đổi sổ gốc'));
    setForm('instruct');
    dispatch(setOpenPopup(true));
  };

  const handleExport = async (e) => {
    e.preventDefault();
    dispatch(setLoading(true));
    const params = new URLSearchParams();
    params.append('Order', 1);
    params.append('OrderDir', 'ASC');
    params.append('StartIndex', '0');
    params.append('PageSize', -1);
    params.append('FromDate', pageState.fromDate);
    params.append('ToDate', pageState.toDate);
    const response = await getLichSuChuyenDoiSoGoc(params);
    const formattedData = response.data.map((item, index) => ({
      STT: index + 1,
      'Người tạo': item.nguoiTao,
      'Tên trường cũ': item.tenTruongCu,
      'Tên trường mới': item.tenTruongMoi,
      'Ngày chuyển đổi': convertISODateTimeToFormattedDateTime(item.ngayTao)
    }));
    const worksheet = XLSX.utils.json_to_sheet(formattedData);

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'HistoryAccessData');
    // Điều chỉnh chiều rộng của các cột trong file xuất ra
    const columnsWidth = [{ wch: 10 }, { wch: 20 }, { wch: 30 }, { wch: 30 }, { wch: 20 }];

    worksheet['!cols'] = columnsWidth;
    XLSX.writeFile(workbook, 'lich_su_chuyen_doi_so_goc.xlsx');
    dispatch(setLoading(false));
  };

  const handleDonViOldChange = (event) => {
    const selectValue = event.target.value;
    setSelectedDonViOld(selectValue);
  };

  const handleDonViNewChange = (event) => {
    const selectValue = event.target.value;
    setSelectedDonViNew(selectValue);
  };

  return (
    <>
      <MainCard
        title={t('Chuyển đổi sổ gốc cũ')}
        secondary={
          <CustomButton
            title={t('Hướng dẫn')}
            label={t('Hướng dẫn')}
            variant="contained"
            icon={IconAddressBook}
            handleClick={handleHuongDan}
          />
        }
      >
        <Grid item container spacing={1} mb={2} justifyContent={'center'} alignItems={'center'}>
          <Grid item lg={4} md={6} sm={6} xs={8}>
            <FormControl fullWidth variant="outlined" size="small">
              <InputLabel>{t('Đơn vị trường cũ')}</InputLabel>
              <Select
                value={selectedDonViOld || ''}
                onChange={handleDonViOldChange}
                label={t('Đơn vị trường cũ')}
                style={{ minWidth: '150px' }}
              >
                {donvi && donvi.length > 0 ? (
                  donvi.map(
                    (data) =>
                      data.id !== selectedDonViNew && (
                        <MenuItem key={data.id} value={data.id}>
                          {data.ten}
                        </MenuItem>
                      )
                  )
                ) : (
                  <MenuItem value="nodata">{t('noRowsLabel')}</MenuItem>
                )}
              </Select>
            </FormControl>
          </Grid>
          <Grid item lg={4} md={6} sm={6} xs={8}>
            <FormControl fullWidth variant="outlined" size="small">
              <InputLabel>{t('Đơn vị trường mới')}</InputLabel>
              <Select
                value={selectedDonViNew || ''}
                onChange={handleDonViNewChange}
                label={t('Đơn vị trường mới')}
                style={{ minWidth: '150px' }}
              >
                {donvi && donvi.length > 0 ? (
                  donvi.map(
                    (data) =>
                      data.id !== selectedDonViOld && (
                        <MenuItem key={data.id} value={data.id}>
                          {data.ten}
                        </MenuItem>
                      )
                  )
                ) : (
                  <MenuItem value="nodata">{t('noRowsLabel')}</MenuItem>
                )}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
        <Grid item container spacing={1} mb={2} justifyContent={'center'} alignItems={'center'}>
          <Grid item lg={2} md={3} sm={3} xs={6}>
            <Button
              variant="contained"
              fullWidth
              onClick={handleChuyenDoi}
              color="info"
              startIcon={<IconTransferIn />}
              disabled={!selectedDonViOld || !selectedDonViNew}
            >
              {t('Chuyển đổi')}
            </Button>
          </Grid>
        </Grid>
      </MainCard>
      <Grid mt={2}>
        <MainCard title={t('Lịch sử chuyển đổi')} hideInstruct>
          <Grid container justifyContent="center" mb={1} spacing={1} alignItems="center">
            <Grid item xs={2}>
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
            <Grid item xs={2}>
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
            <Grid item>
              <Button variant="contained" title="Tìm kiếm" color="info" onClick={handleSearch} startIcon={<IconSearch />}>
                {t('button.search')}
              </Button>
            </Grid>
            <Grid item>
              <ButtonSuccess title={t('button.export')} onClick={handleExport} icon={IconFileExport} />
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
      </Grid>
      {form !== '' && (
        <Popup title={title} form={form} maxWidth={'sm'} openPopup={openPopup} bgcolor={'#2196F3'}>
          {form === 'transfer' ? (
            <ChuyenDoi truongCu={selectedDonViOld} truongMoi={selectedDonViNew} />
          ) : form === 'instruct' ? (
            <HuongDan />
          ) : (
            ''
          )}
        </Popup>
      )}
      <BackToTop />
    </>
  );
};

export default ChuyenDoiSoGocCu;
