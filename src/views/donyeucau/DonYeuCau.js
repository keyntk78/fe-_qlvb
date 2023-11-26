import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { IconSearch } from '@tabler/icons';
import { Button, Chip, FormControl, Grid, InputLabel, MenuItem, Select, TextField, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  infoHocSinhSelector,
  openPopupSelector,
  reloadDataSelector,
  selectedInfoMessageSelector,
  userLoginSelector
} from 'store/selectors';
import { setCapBangBanSao, setInfoHocSinh, setOpenPopup, setReloadData, setSelectedInfoMessage } from 'store/actions';
import { useTranslation } from 'react-i18next';
import { createSearchParams } from 'utils/createSearchParams';
import { handleResponseStatus } from 'utils/handleResponseStatus';
import useLocalText from 'utils/localText';
import i18n from 'i18n';
import MainCard from 'components/cards/MainCard';
import BackToTop from 'components/scroll/BackToTop';
import Popup from 'components/controls/popup';
import AddDonyeucau from './AddDonyeucau';
import Detail from './Detail';
import ActionButtons from 'components/button/ActionButtons';
import AddButton from 'components/button/AddButton';
import { convertISODateToFormattedDate } from 'utils/formatDate';
import { GetSerachDonYeuCapBanSao } from 'services/capbangbansaoService';
import { getCauHinhBatTatDangKyCapBanSao } from 'services/sharedService';

export default function DonYeuCau() {
  const openPopup = useSelector(openPopupSelector);
  const language = i18n.language;
  const { t } = useTranslation();
  const trangThaiOptions = [
    { value: 0, label: t('capbang.tranghai.chuaduyet') },
    { value: 1, label: t('capbang.tranghai.daduyet') },
    { value: -1, label: t('capbang.tranghai.tuchoi') }
  ];
  const [title, setTitle] = useState('');
  const [form, setForm] = useState('');
  const [search, setSearch] = useState(false);
  const reloadData = useSelector(reloadDataSelector);
  const dispatch = useDispatch();
  const localeText = useLocalText();
  const navigate = useNavigate();
  const [firstLoad, setFirstLoad] = useState(true);
  const infoMessage = useSelector(selectedInfoMessageSelector);
  const [loadData, setLoadData] = useState(false);
  const infoHocSinh = useSelector(infoHocSinhSelector);
  const [batTat, setbatTat] = useState('true');
  const [pageState, setPageState] = useState({
    isLoading: false,
    data: [],
    total: 0,
    order: 0,
    orderDir: 'ASC',
    startIndex: 0,
    pageSize: 10,
    cccd: '',
    Ma: '',
    hoTen: '',
    trangThai: ''
  });
  const user = useSelector(userLoginSelector);

  const handleSearch = () => {
    setSearch(!search);
  };

  const handleAddDonyeucau = () => {
    setTitle(t('capbang.title.add'));
    setForm('add');

    dispatch(setOpenPopup(true));
  };

  const handleDetail = (donyeucau) => {
    setTitle(t('hocsinh.title.info'));
    setForm('detail');
    dispatch(setCapBangBanSao(donyeucau));
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
      field: 'MaDonYeuCau',
      headerName: t('capbang.madon'),
      flex: 1.5,
      minWidth: 130,
      renderCell: (params) => (
        <>
          <Grid container>
            <Grid item xs={12}>
              <Typography variant="body1">{params.value}</Typography>
            </Grid>
            <Grid item xs={12} mt={0.2}>
              <Chip
                size="small"
                label={params.row.trangThai_fm}
                color={
                  params.row.trangThai_fm === t('capbang.tranghai.chuaduyet')
                    ? 'info'
                    : params.row.trangThai_fm === t('capbang.tranghai.daduyet')
                    ? 'success'
                    : 'error'
                }
              />
            </Grid>
          </Grid>
        </>
      )
    },
    {
      field: 'HoTen_NYC',
      headerName: t('Người yêu cầu'),
      flex: 1.8,
      minWidth: 150
    },
    {
      field: 'cccd',
      headerName: t('CCCD'),
      flex: 1.2,
      minWidth: 110
    },
    {
      field: 'HoTen',
      headerName: t('Người được cấp'),
      flex: 1.8,
      minWidth: 150
    },
    {
      field: 'NgayYeuCau',
      headerName: t('Ngày yêu cầu'),
      flex: 1.1,
      minWidth: 100
    },
    {
      field: 'SoLuong',
      headerName: t('SL bản sao'),
      flex: 1,
      minWidth: 80
    },
    {
      field: 'SoDTNguoiYeuCau',
      headerName: t('hocsinh.field.sdt'),
      flex: 1.3,
      minWidth: 100
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
    if (infoMessage) {
      setPageState((old) => ({ ...old, cccd: infoMessage.Cccd, hoTen: infoMessage.HoTen }));
      setLoadData(true);
    }
  }, [infoMessage]);

  useEffect(() => {
    if (infoHocSinh) {
      setPageState((old) => ({ ...old, cccd: infoHocSinh.cccd, hoTen: infoHocSinh.hoTen }));
      setLoadData(true);
    }
  }, [infoHocSinh]);
  useEffect(() => {
    const fetchData = async () => {
      const batTatdangkybanSao = await getCauHinhBatTatDangKyCapBanSao();
      setbatTat(batTatdangkybanSao.data.configValue);
    };
    fetchData();
  }, []);
  useEffect(() => {
    const fetchData = async () => {
      setPageState((old) => ({ ...old, isLoading: true }));
      const params = await createSearchParams(pageState);
      params.append('Ma', pageState.Ma);
      params.append('HoTen', pageState.hoTen);
      params.append('Cccd', pageState.cccd);
      params.append('TrangThai', pageState.trangThai ? pageState.trangThai : 0);
      params.append('NguoiThucHien', user ? user.username : '');

      const response = await GetSerachDonYeuCapBanSao(params);
      const check = handleResponseStatus(response, navigate);
      if (check) {
        const data = await response.data;
        if (response.data && response.data.data.length > 0) {
          const dataWithIds = data.data.map((row, index) => ({
            idx: pageState.startIndex * pageState.pageSize + index + 1,
            HoTen: row.HoTen,
            HoTen_NYC: row.hoTenNguoiYeuCau,
            CCCD: row.cccd,
            SoLuong: row.soLuongBanSao,
            SoDTNguoiYeuCau: row.soDienThoaiNguoiYeuCau,
            MaDonYeuCau: row.ma,
            NgayYeuCau: convertISODateToFormattedDate(row.ngayYeuCau),
            gioiTinh_fm: row.gioiTinh ? t('gender.male') : t('gender.female'),
            trangThai_fm:
              row.trangThai == 0
                ? t('status.unapproved')
                : row.trangThai == 1
                ? t('status.approved')
                : row.trangThai == -1
                ? t('capbang.tranghai.tuchoi')
                : '',
            // ngaySinh_fm: convertISODateToFormattedDate(row.ngaySinh),
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
    if (!firstLoad || loadData) {
      if (loadData) {
        fetchData();
        setLoadData(false);
        dispatch(setSelectedInfoMessage(''));
        dispatch(setInfoHocSinh(null));
      } else {
        fetchData();
      }
    } else {
      setFirstLoad(false);
    }
  }, [pageState.search, pageState.order, pageState.orderDir, pageState.startIndex, pageState.pageSize, reloadData, search, loadData]);

  const handleTrangThaiChange = (event) => {
    const selectedValue = event.target.value;
    const trangThai = selectedValue === 'all' ? '' : selectedValue;
    setPageState((old) => ({ ...old, trangThai: trangThai }));
  };

  return (
    <>
      <MainCard title={t('Đơn yêu cầu')} secondary={batTat === 'true' ? <AddButton handleClick={handleAddDonyeucau} /> : null}>
        <Grid item container mb={1} spacing={1} justifyContent={'center'} alignItems="center">
          <Grid item lg={2} md={2.5} sm={4.5} xs={5}>
            <TextField
              fullWidth
              id="outlined-basic"
              label={t('hocsinh.field.madon')}
              variant="outlined"
              size="small"
              onChange={(e) => setPageState((old) => ({ ...old, Ma: e.target.value }))}
              value={pageState.Ma}
            />
          </Grid>
          <Grid item lg={3.5} md={4} sm={7.5} xs={7}>
            <TextField
              fullWidth
              id="outlined-basic"
              label={t('Họ tên')}
              variant="outlined"
              size="small"
              onChange={(e) => setPageState((old) => ({ ...old, hoTen: e.target.value }))}
              value={pageState.hoTen}
            />
          </Grid>
          <Grid item lg={2.5} md={3} sm={4.5} xs={7}>
            <TextField
              fullWidth
              id="outlined-basic"
              label={t('Căn cước công dân')}
              variant="outlined"
              size="small"
              onChange={(e) => setPageState((old) => ({ ...old, cccd: e.target.value }))}
              value={pageState.cccd}
            />
          </Grid>
          <Grid item lg={2} md={2.5} sm={3.5} xs={5}>
            <FormControl fullWidth variant="outlined" size="small">
              <InputLabel>{t('status.title')}</InputLabel>
              <Select
                name="trangThai"
                value={pageState.trangThai === '' ? 'all' : pageState.trangThai}
                onChange={handleTrangThaiChange}
                label={t('status.title')}
              >
                <MenuItem value="all">Tất cả</MenuItem>
                {trangThaiOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item lg={2} md={2} sm={4} xs={5} minWidth={150}>
            <Button variant="contained" title={t('button.search')} fullWidth onClick={handleSearch} color="info" startIcon={<IconSearch />}>
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
          rowsPerPageOptions={[5, 10, 20]}
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
          // checkboxSelection
          // onSelectionModelChange={(ids) => {
          //   const selectedIDs = new Set(ids);
          //   setSelectedRowData(pageState.data.filter((row) => selectedIDs.has(row.id)));
          // }}
        />
      </MainCard>
      {form !== '' && (
        <Popup
          title={title}
          form={form}
          openPopup={openPopup}
          maxWidth={form === 'vaoso' ? 'lg' : 'md'}
          bgcolor={form === 'delete' ? '#F44336' : '#2196F3'}
        >
          {form === 'detail' ? <Detail /> : form === 'add' ? <AddDonyeucau /> : ''}
        </Popup>
      )}
      <BackToTop />
    </>
  );
}
