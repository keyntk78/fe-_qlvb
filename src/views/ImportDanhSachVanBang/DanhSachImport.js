import { DataGrid } from '@mui/x-data-grid';
import MainCard from 'components/cards/MainCard';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setLoading, setOpenSubSubPopup, setReloadData } from 'store/actions';
import {
  openSubPopupSelector,
  openSubSubPopupSelector,
  reloadDataSelector,
  selectedDanhmuctotnghiepSelector,
  selectedDonvitruongSelector,
  userLoginSelector
} from 'store/selectors';
import { useNavigate } from 'react-router-dom';
import { handleResponseStatus } from 'utils/handleResponseStatus';
import { useTranslation } from 'react-i18next';
import useLocalText from 'utils/localText';
import { createSearchParams } from 'utils/createSearchParams';
import i18n from 'i18n';
import React from 'react';
import { convertISODateToFormattedDate } from 'utils/formatDate';
import { Button, Grid, Paper, TextField, Typography, useMediaQuery } from '@mui/material';
import { IconCheck, IconFileExport, IconSearch, IconX } from '@tabler/icons';
import * as XLSX from 'xlsx';
import BackToTop from 'components/scroll/BackToTop';
import ButtonSuccess from 'components/buttoncolor/ButtonSuccess';
import { ThongKeDanhSachVanBangTmp, getDanhSachVanBangTmp } from 'services/xacminhvanbangService';
import { useTheme } from '@emotion/react';
import CustomButton from 'components/button/CustomButton';
import Popup from 'components/controls/popup';
import DuaVaoBangChinh from './DuaVaoBangChinh';
import XoaKhoiBangTam from './XoaKhoiBangTam';
const DanhSachImport = () => {
  const isXs = useMediaQuery('(max-width:800px)');
  const language = i18n.language;
  const { t } = useTranslation();
  const localeText = useLocalText();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isAccess, setIsAccess] = useState(true);
  const reloadData = useSelector(reloadDataSelector);
  const [search, setSearch] = useState(false);
  const donvitruong = useSelector(selectedDonvitruongSelector);
  const dmtn = useSelector(selectedDanhmuctotnghiepSelector);
  const user = useSelector(userLoginSelector);
  const [dataTK, setdataTK] = useState([]);
  const [title, setTitle] = useState('');
  const [form, setForm] = useState('');
  const openSubSubPopup = useSelector(openSubSubPopupSelector);
  const openSubPopup = useSelector(openSubPopupSelector);
  const theme = useTheme();
  const [pageState, setPageState] = useState({
    isLoading: false,
    data: [],
    total: 0,
    order: 1,
    orderDir: 'ASC',
    startIndex: 0,
    pageSize: 10,
    cccd: '',
    hoTen: '',
    noiSinh: '',
    danToc: ''
  });
  const styles = {
    paper: {
      //opacity: 0.8,
      borderRadius: '10px',
      width: '90%',
      marginBottom: '10px'
      //boxShadow: '0 4px 8px rgba(0,0,0,0.3)'
    },
    countContainer: {
      width: '56px',
      height: '56px',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    countIcon: {
      color: '#fff',
      width: '18px',
      height: '18px'
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
      field: 'hoTen',
      headerName: t('hocsinh.field.fullname'),
      flex: 2,
      minWidth: 180,
      renderCell: (params) => (
        <>
          <Grid container>
            <Grid item xs={12}>
              <Typography variant="body1">{params.value}</Typography>
            </Grid>
          </Grid>
        </>
      )
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
      minWidth: 80
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
      minWidth: 100
    },
    {
      field: 'message',
      headerName: t('Lý do lỗi'),
      flex: 3,
      minWidth: 100,
      renderCell: (
        params // Thêm tham số theme vào hàm renderCell
      ) => <div style={{ color: params.row.errorCode === -1 ? theme.palette.error.main : 'inherit' }}>{params.value}</div>
    }
  ];

  useEffect(() => {
    const fetchData = async () => {
      setPageState((old) => ({ ...old, isLoading: true }));
      const params = await createSearchParams(pageState);
      params.append('cccd', pageState.cccd);
      params.append('hoTen', pageState.hoTen);
      params.append('noiSinh', pageState.noiSinh);
      params.append('danToc', pageState.danToc);
      params.append('idDanhMucTotNghiep', dmtn);
      params.append('idTruong', donvitruong);
      params.append('NguoiThucHien', user.username);
      const response = await getDanhSachVanBangTmp(params);
      const response_Thongke = await ThongKeDanhSachVanBangTmp(donvitruong, user.username, dmtn);
      setdataTK(response_Thongke.data);
      const check = handleResponseStatus(response, navigate);
      if (check) {
        const data = await response.data;
        const dataWithIds =
          data &&
          data.hocSinhs.map((row, index) => ({
            idx: pageState.startIndex * pageState.pageSize + index + 1,
            soHieuVanBang: row.soHieuVanBang ? row.soHieuVanBang : 'Chưa cấp',
            soVaoSoCapBang: row.soVaoSoCapBang || 'Chưa cấp',
            gioiTinh_fm: row.gioiTinh ? t('gender.male') : t('gender.female'),
            ngaySinh_fm: convertISODateToFormattedDate(row.ngaySinh),
            ...row
          }));
        // Lưu trữ dữ liệu gốc vào state
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
  }, [
    pageState.search,
    pageState.order,
    pageState.orderDir,
    pageState.startIndex,
    pageState.pageSize,
    reloadData,
    search,
    openSubPopup == true
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
    params.append('cccd', pageState.cccd);
    params.append('hoTen', pageState.hoTen);
    params.append('noiSinh', pageState.noiSinh);
    params.append('danToc', pageState.danToc);
    params.append('idDanhMucTotNghiep', dmtn);
    params.append('idTruong', donvitruong);
    params.append('NguoiThucHien', user.username);
    const response = await getDanhSachVanBangTmp(params);
    const formattedData =
      response &&
      response.data.hocSinhs.map((item, index) => ({
        STT: index + 1,
        'Lý do lỗi': item.message,
        'Họ và Tên': item.hoTen,
        CCCD: item.cccd,
        'Giới Tính': item.gioiTinh ? t('gender.male') : t('gender.female'),
        'Ngày Sinh': convertISODateToFormattedDate(item.ngaySinh),
        'Nơi Sinh': item.noiSinh,
        'Dân Tộc': item.danToc,
        'Hạnh Kiểm': item.hanhKiem,
        'Học Lực': item.hocLuc,
        'Số Hiệu Văn Bằng': item.soHieuVanBang,
        'Số Vào Sổ Cấp Bằng': item.soVaoSoCapBang,
        'Địa Chỉ': item.diaChi,
        Lớp: item.lop,
        'Ghi Chú': item.ghiChu
      }));
    const worksheet = XLSX.utils.json_to_sheet(formattedData);

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'HistoryAccessData');
    // Điều chỉnh chiều rộng của các cột trong file xuất ra
    const columnsWidth = [
      { wch: 10 },
      { wch: 40 },
      { wch: 30 },
      { wch: 30 },
      { wch: 20 },
      { wch: 30 },
      { wch: 20 },
      { wch: 20 },
      { wch: 20 },
      { wch: 20 },
      { wch: 30 },
      { wch: 30 },
      { wch: 30 },
      { wch: 20 },
      { wch: 30 }
    ];

    worksheet['!cols'] = columnsWidth;
    XLSX.writeFile(workbook, 'BaoCaoVanBangImport.xlsx');
    dispatch(setLoading(false));
  };
  const openConfirm = () => {
    setTitle(t('Xác nhận'));
    setForm('addlist');
    dispatch(setOpenSubSubPopup(true));
  };
  const openDelete = () => {
    setTitle(t('Hủy '));
    setForm('delete');
    dispatch(setOpenSubSubPopup(true));
  };
  return (
    <>
      <Grid container justifyContent={'center'} mt={2}>
        <Grid item xs={11.4} container spacing={1}>
          <Grid item sm={4} xs={12}>
            <Paper variant="outlined" sx={{ ...styles.paper, background: '#6C757D' }}>
              <Typography
                variant="h4"
                component="div"
                sx={{
                  color: '#6C737F',
                  display: 'flex',
                  justifyContent: 'space-around',
                  alignItems: 'center',
                  margin: '-15px 0px'
                }}
              >
                <h4 style={{ fontSize: '15px', color: 'white', textAlign: 'center' }}>Tổng số dòng</h4>
              </Typography>
              <Typography variant="h1" component="div" sx={{ textAlign: 'center', fontSize: '30px', color: 'white' }}>
                {dataTK.totalRow}
              </Typography>
            </Paper>
          </Grid>
          <Grid item sm={4} xs={12}>
            <Paper variant="outlined" sx={{ ...styles.paper, background: '#28a745' }}>
              <Typography
                variant="h4"
                component="div"
                sx={{
                  color: '#6C737F',
                  display: 'flex',
                  justifyContent: 'space-around',
                  alignItems: 'center',
                  margin: '-15px 0px'
                }}
              >
                <h4 style={{ fontSize: '15px', color: 'white', textAlign: 'center' }}>Số dòng hợp lệ</h4>
              </Typography>
              <Typography variant="h1" component="div" sx={{ textAlign: 'center', fontSize: '30px', color: 'white' }}>
                {dataTK.notErrorRow}
              </Typography>
            </Paper>
          </Grid>
          <Grid item sm={4} xs={12}>
            <Paper variant="outlined" sx={{ ...styles.paper, background: '#dc3545' }}>
              <Typography
                variant="h4"
                component="div"
                sx={{
                  color: '#6C737F',
                  display: 'flex',
                  justifyContent: 'space-around',
                  alignItems: 'center',
                  margin: '-15px 0px'
                }}
              >
                <h4 style={{ fontSize: '15px', color: 'white', textAlign: 'center' }}>Số dòng không hợp lệ</h4>
              </Typography>
              <Typography variant="h1" component="div" sx={{ textAlign: 'center', fontSize: '30px', color: 'white' }}>
                {dataTK.errorRow}
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Grid>
      <MainCard
        hideInstruct
        title={t('Danh sách văn bằng import')}
        secondary={
          <Grid item>
            <ButtonSuccess title={t('button.export')} onClick={handleExport} icon={IconFileExport} />
          </Grid>
        }
      >
        <Grid container justifyContent="center" mb={1} spacing={1}>
          <Grid item container spacing={1} justifyContent={'center'} alignItems="center">
            <Grid item md={6} sm={6} lg={3} container xs={isXs ? 12 : 3}>
              <TextField
                fullWidth
                id="outlined-basic"
                label={t('hocsinh.field.fullname')}
                variant="outlined"
                size="small"
                onChange={(e) => setPageState((old) => ({ ...old, hoTen: e.target.value }))}
                value={pageState.hoTen}
              />
            </Grid>
            <Grid item md={6} sm={6} lg={3} container xs={isXs ? 12 : 3}>
              <TextField
                fullWidth
                id="outlined-basic"
                label={t('hocsinh.field.address')}
                variant="outlined"
                size="small"
                onChange={(e) => setPageState((old) => ({ ...old, noiSinh: e.target.value }))}
                value={pageState.noiSinh}
              />
            </Grid>
            <Grid item md={4} sm={4} lg={2} container xs={isXs ? 6 : 2}>
              <TextField
                fullWidth
                id="outlined-basic"
                label={t('hocsinh.field.cccd')}
                variant="outlined"
                size="small"
                onChange={(e) => setPageState((old) => ({ ...old, cccd: e.target.value }))}
                value={pageState.cccd}
              />
            </Grid>
            <Grid item md={4} sm={4} lg={2} container xs={isXs ? 6 : 2}>
              <TextField
                fullWidth
                id="outlined-basic"
                label={t('hocsinh.field.nation')}
                variant="outlined"
                size="small"
                onChange={(e) => setPageState((old) => ({ ...old, danToc: e.target.value }))}
                value={pageState.danToc}
              />
            </Grid>
            <Grid item md={4} sm={4} lg={2} xs={isXs ? 6 : 4}>
              <Button
                variant="contained"
                title={t('button.search')}
                fullWidth
                onClick={handleSearch}
                color="info"
                startIcon={<IconSearch />}
              >
                {t('button.search')}
              </Button>
            </Grid>
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
      </MainCard>{' '}
      <div style={{ textAlign: 'center' }}>
        <Grid container spacing={1} direction="row" justifyContent="center" my={2}>
          {dataTK && dataTK.errorRow == 0 && (
            <Grid item>
              <CustomButton icon={IconCheck} label="Import" variant="contained" color="info" handleClick={openConfirm} />
            </Grid>
          )}
          <Grid item>
            <CustomButton icon={IconX} label="Hủy" variant="contained" color="error" handleClick={openDelete} />
          </Grid>
        </Grid>
      </div>
      {form !== '' && (
        <Popup
          title={title}
          form={form}
          openPopup={openSubSubPopup}
          type="subsubpopup"
          maxWidth={'sm'}
          bgcolor={form === 'delete' ? '#F44336' : '#2196F3'}
        >
          {form === 'addlist' ? <DuaVaoBangChinh /> : form === 'delete' ? <XoaKhoiBangTam /> : ''}
        </Popup>
      )}
      <BackToTop />
    </>
  );
};

export default DanhSachImport;
