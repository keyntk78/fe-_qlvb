import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { IconFileExport, IconSearch } from '@tabler/icons';
import {
  Button,
  Chip,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Tooltip,
  Typography,
  useMediaQuery
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { openPopupSelector, reloadDataSelector, userLoginSelector } from 'store/selectors';
import { setCapBangBanSao, setLoading, setOpenPopup, setReloadData } from 'store/actions';
import { useTranslation } from 'react-i18next';
import { createSearchParams } from 'utils/createSearchParams';
import { handleResponseStatus } from 'utils/handleResponseStatus';
import useLocalText from 'utils/localText';
import i18n from 'i18n';
import MainCard from 'components/cards/MainCard';
import BackToTop from 'components/scroll/BackToTop';
import Popup from 'components/controls/popup';
import Detail from './Detail';
import { getSearchDonYeuCauDaDuyet } from 'services/capbangbansaoService';
import InBanSao from './InBanSao';
import XacNhanIn from './XacNhanIn';
import CombinedActionButtons from 'components/button/CombinedActionButtons';
import XacNhanDaPhat from './XacNhanDaPhat';
import ThuocYeuCauBanSao from './ThuocYeuCauBanSao';
import LichSuCapBanSao from './LichSuCapBanSao';
import { convertISODateToFormattedDate, formatDate } from 'utils/formatDate';
import AnimateButton from 'components/extended/AnimateButton';
import { GetCauHinhByIdDonVi } from 'services/sharedService';
import { generateDocument } from './ExportWord';
import { format } from 'date-fns';

export default function CapBangBanSao() {
  const isXs = useMediaQuery('(max-width:800px)');
  const openPopup = useSelector(openPopupSelector);
  const language = i18n.language;
  const { t } = useTranslation();
  const trangThaiOptions = [
    // { value: 0, label: t('Chưa in bản sao') },
    { value: 1, label: t('Chưa in bản sao') },
    { value: 2, label: t('Đã in bản sao') },
    { value: 3, label: t('Đã phát') }
  ];
  const [title, setTitle] = useState('');
  const [form, setForm] = useState('');
  const [search, setSearch] = useState(false);
  const reloadData = useSelector(reloadDataSelector);
  const dispatch = useDispatch();
  const localeText = useLocalText();
  const navigate = useNavigate();
  const [firstLoad, setFirstLoad] = useState(true);
  const [dataExport, setDataExport] = useState([]);
  const [dataConfig, setDataConfig] = useState([]);

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
    soDienThoaiNguoiYeuCau: '',
    ngayDuyet: '',
    trangThai: ''
  });
  const user = useSelector(userLoginSelector);

  const handleSearch = () => {
    setSearch(!search);
  };

  const handleDetail = (donyeucau) => {
    setTitle(t('hocsinh.title.info'));
    setForm('detail');
    dispatch(setCapBangBanSao(donyeucau));
    dispatch(setOpenPopup(true));
  };
  const handleDetailDonYeuCau = (donyeucau) => {
    setTitle(t('hocsinh.title.info'));
    setForm('detaildonyeucau');
    dispatch(setCapBangBanSao(donyeucau));
    dispatch(setOpenPopup(true));
  };
  const handlePreview = (donyeucau) => {
    setTitle(t('In Bản sao '));
    setForm('inbang');
    dispatch(setCapBangBanSao(donyeucau));
    dispatch(setOpenPopup(true));
  };
  const handleXacNhanIn = (donyeucau) => {
    setTitle(t('Xác Nhận In'));
    setForm('xacnhanin');
    dispatch(setCapBangBanSao(donyeucau));
    dispatch(setOpenPopup(true));
  };
  const handleXacNhanDaPhat = (donyeucau) => {
    setTitle(t('Xác Nhận Đã Phát Bản Sao'));
    setForm('xacnhanphatbansao');
    dispatch(setCapBangBanSao(donyeucau));
    dispatch(setOpenPopup(true));
  };
  const handleLichSuPhatBanSao = (donyeucau) => {
    setTitle(t('Lịch sử cấp bản sao'));
    setForm('xemlichsu');
    dispatch(setCapBangBanSao(donyeucau));
    dispatch(setOpenPopup(true));
  };
  const buttonConfigurations1 = [
    {
      type: 'xacnhanin',
      handleClick: handleXacNhanIn
    },
    {
      type: 'inbang',
      handleClick: handlePreview
    },
    {
      type: 'detail',
      handleGetbyId: handleDetail
    },
    {
      type: 'detailDonYeuCau',
      handleGetbyId: handleDetailDonYeuCau
    },
    {
      type: 'xemlichsu',
      handleClick: handleLichSuPhatBanSao
    }
  ];
  const buttonConfigurations2 = [
    {
      type: 'xacnhanphatbansao',
      handleClick: handleXacNhanDaPhat
    },
    {
      type: 'detail',
      handleGetbyId: handleDetail
    },
    {
      type: 'detailDonYeuCau',
      handleGetbyId: handleDetailDonYeuCau
    },
    {
      type: 'xemlichsu',
      handleClick: handleLichSuPhatBanSao
    }
  ];
  const buttonConfigurations3 = [
    {
      type: 'detail',
      handleGetbyId: handleDetail
    },
    {
      type: 'detailDonYeuCau',
      handleGetbyId: handleDetailDonYeuCau
    },
    {
      type: 'xemlichsu',
      handleClick: handleLichSuPhatBanSao
    }
  ];
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
              <Chip size="small" label={params.row.trangThai_fm} color={params.row.trangThai === 1 ? 'info' : 'success'} />
            </Grid>
          </Grid>
        </>
      )
    },
    {
      field: 'NgayDuyet_fm',
      headerName: t('Ngày duyệt'),
      flex: 1,
      minWidth: 100
    },
    {
      field: 'HoTen',
      headerName: t('Họ Tên'),
      flex: 1.8,
      minWidth: 150
    },
    {
      field: 'CCCD',
      headerName: t('CCCD'),
      flex: 1.8,
      minWidth: 100
    },
    {
      field: 'SoHieu',
      headerName: t('Số Hiệu'),
      flex: 1.5,
      minWidth: 130
    },
    {
      field: 'SoVaoSoBanSao',
      headerName: t('Số bản sao'),
      flex: 2,
      minWidth: 130
    },
    {
      field: 'SoLuong',
      headerName: t('SL bản sao'),
      flex: 1,
      minWidth: 80
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
            {params.row.trangThai === 1 ? (
              <CombinedActionButtons params={params.row} buttonConfigurations={buttonConfigurations1} />
            ) : params.row.trangThai == 2 ? (
              <CombinedActionButtons params={params.row} buttonConfigurations={buttonConfigurations2} />
            ) : (
              <CombinedActionButtons params={params.row} buttonConfigurations={buttonConfigurations3} />
            )}
          </Grid>
        </>
      )
    }
  ];

  useEffect(() => {
    const fetchData = async () => {
      setPageState((old) => ({ ...old, isLoading: true }));
      const params = await createSearchParams(pageState);
      params.append('Ma', pageState.Ma);
      params.append('TrangThai', pageState.trangThai || '');
      params.append('CCCD', pageState.cccd);
      params.append('HoTen', pageState.hoTen);
      params.append('NguoiThucHien', user ? user.username : '');
      params.append('SoDienThoaiNguoiYeuCau', pageState.soDienThoaiNguoiYeuCau);
      params.append('NgayDuyet', pageState.ngayDuyet);

      const response = await getSearchDonYeuCauDaDuyet(params);
      const check = handleResponseStatus(response, navigate);
      if (check) {
        const data = await response.data;
        const dataWithIds = data.donYeuCaus.map((row, index) => ({
          idx: pageState.startIndex * pageState.pageSize + index + 1,
          HoTen: row.hocSinh.hoTen,
          SoHieu: row.hocSinh.soHieuVanBang,
          CCCD: row.hocSinh.cccd,
          SoVaoSoBanSao: row.soVaoSoBanSao,
          SoLuong: row.soLuongBanSao,
          MaDonYeuCau: row.ma,
          NgayDuyet_fm: convertISODateToFormattedDate(row.ngayDuyet),
          trangThai_fm:
            row.trangThai == 1 ? t('Chưa in bản sao') : row.trangThai == 2 ? t('Đã in bản sao') : row.trangThai == 3 ? t('Đã phát') : '',
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
      const params = new URLSearchParams();
      params.append('Order', 1);
      params.append('OrderDir', 'ASC');
      params.append('StartIndex', '0');
      params.append('PageSize', 1000);
      params.append('NgayDuyet', pageState.ngayDuyet == '' ? format(new Date(), 'yyyy-MM-dd') : pageState.ngayDuyet);
      params.append('NguoiThucHien', user.username ? user.username : '');
      params.append('TrangThai', pageState.trangThai || '');
      const response = await getSearchDonYeuCauDaDuyet(params);
      const response1 = await GetCauHinhByIdDonVi(user.username ? user.username : '');
      setDataExport(response.data.donYeuCaus);
      setDataConfig(response1.data);
    };
    if (!firstLoad) {
      fetchData();
    } else {
      setFirstLoad(false);
    }
  }, [pageState.search, search]);

  const SoBanSao_word =
    dataExport &&
    dataExport.map((data, index) => ({
      idx: index + 1,
      hoTen_fm: data.hocSinh.hoTen,
      ngaySinh_fm: convertISODateToFormattedDate(data.hocSinh.ngaySinh),
      noiSinh_fm: data.hocSinh.noiSinh,
      gioiTinh_fm: data.hocSinh.gioiTinh ? 'Nam' : 'Nữ',
      danToc_fm: data.hocSinh.danToc,
      xepLoai_fm: data.hocSinh.xepLoai,
      soHieuVanBang_fm: data.hocSinh.soHieuVanBang,
      soVaoSoBanSao_fm: data.soVaoSoBanSao
    }));
  const BienBanBanGiao_word =
    dataExport &&
    dataExport.map((data, index) => ({
      idx: index + 1,
      maDon_fm: data.ma,
      hoTen_fm: data.hocSinh.hoTen,
      hoTenNYC_fm: data.thongTinNguoiYeuCau.hoTenNguoiYeuCau,
      cccd_fm: data.hocSinh.cccd,
      soVaoSoBanSao_fm: data.soVaoSoBanSao,
      soLuong_fm: data.soLuongBanSao
    }));
  const SoBanSao_cf = {
    uyBanNhanDan: (dataConfig.tenUyBanNhanDan && dataConfig.tenUyBanNhanDan.toUpperCase()) || '',
    coQuanCapBang: (dataConfig.tenCoQuanCapBang && dataConfig.tenCoQuanCapBang.toUpperCase()) || '',
    diaPhuong: dataConfig.tenDiaPhuongCapBang || '',
    ngayCap: pageState.ngayDuyet == '' ? formatDate(format(new Date(), 'yyyy-MM-dd')) : formatDate(pageState.ngayDuyet),
    nguoiKy: dataConfig.hoTenNguoiKySoGoc || '',
    nam: pageState.ngayDuyet == '' ? new Date(format(new Date(), 'yyyy-MM-dd')).getFullYear() : new Date(pageState.ngayDuyet).getFullYear(),
    ngay: pageState.ngayDuyet == '' ? new Date(format(new Date(), 'yyyy-MM-dd')).getDate() : new Date(pageState.ngayDuyet).getDate(),
    thang:
      pageState.ngayDuyet == '' ? new Date(format(new Date(), 'yyyy-MM-dd')).getMonth() + 1 : new Date(pageState.ngayDuyet).getMonth() + 1
  };
  const handleExportWord = async (e) => {
    e.preventDefault();
    setLoading(true);
    generateDocument(SoBanSao_word, SoBanSao_cf, true);
    setLoading(false);
  };
  const handleExportBienBan = async (e) => {
    e.preventDefault();
    setLoading(true);
    generateDocument(BienBanBanGiao_word, SoBanSao_cf, false);
    setLoading(false);
  };

  const handleTrangThaiChange = (event) => {
    const selectedValue = event.target.value;
    const trangthai = selectedValue === 'all' ? '' : selectedValue;
    setPageState((old) => ({ ...old, trangThai: trangthai }));
  };

  return (
    <>
      <MainCard title={t('Cấp bằng bản sao')}>
        <Grid item container mb={1} spacing={1} justifyContent={'center'} alignItems="center">
          <Grid item container lg={2} md={6} sm={6} xs={isXs ? 6 : 2}>
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
          <Grid item lg={2} container md={6} sm={6} xs={isXs ? 6 : 2}>
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
          <Grid item lg={4} container md={12} sm={12} xs={isXs ? 12 : 3}>
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
          <Grid item lg={2} md={6} sm={6} xs={isXs ? 6 : 2}>
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
          <Grid item lg={3} container md={6} sm={6} xs={isXs ? 6 : 2}>
            <TextField
              fullWidth
              id="outlined-basic"
              label={t('Số điện thoại')}
              variant="outlined"
              size="small"
              onChange={(e) => setPageState((old) => ({ ...old, soDienThoaiNguoiYeuCau: e.target.value }))}
              value={pageState.soDienThoaiNguoiYeuCau}
            />
          </Grid>
          <Grid item lg={3} container md={6} sm={6} xs={isXs ? 6 : 2}>
            <FormControl fullWidth variant="outlined">
              <TextField
                size="small"
                name="ngayDuyet"
                type="date"
                label={t('Ngày duyệt')}
                onChange={(e) => setPageState((old) => ({ ...old, ngayDuyet: e.target.value }))}
                value={pageState.ngayDuyet}
                InputLabelProps={{
                  shrink: true
                }}
              />
            </FormControl>
          </Grid>

          <Grid item lg={2} md={6} sm={6} xs={isXs ? 6 : 4}>
            <Button variant="contained" title={t('button.search')} fullWidth onClick={handleSearch} color="info" startIcon={<IconSearch />}>
              {t('button.search')}
            </Button>
          </Grid>
        </Grid>
        <Grid item container justifyContent="flex-end" spacing={1} mb={1}>
          <Grid item>
            <AnimateButton>
              <Tooltip title={t('button.export.word')} placement="bottom">
                <Button
                  fullWidth
                  color="info"
                  variant="contained"
                  onClick={handleExportBienBan}
                  startIcon={<IconFileExport />}
                  disabled={dataExport && dataExport.length == 0}
                >
                  {t('Xuất biên bản bàn giao')}
                </Button>
              </Tooltip>
            </AnimateButton>
          </Grid>
          <Grid item>
            <AnimateButton>
              <Tooltip title={t('button.export.word')} placement="bottom">
                <Button
                  fullWidth
                  color="info"
                  variant="contained"
                  onClick={handleExportWord}
                  startIcon={<IconFileExport />}
                  disabled={dataExport && dataExport.length == 0}
                >
                  {t('Xuất sổ bản sao')}
                </Button>
              </Tooltip>
            </AnimateButton>
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
        />
      </MainCard>
      {form !== '' && (
        <Popup
          title={title}
          form={form}
          openPopup={openPopup}
          maxWidth={form === 'vaoso' ? 'lg' : form === 'xacnhanin' ? 'sm' : 'md'}
          bgcolor={form === 'delete' ? '#F44336' : '#2196F3'}
        >
          {form === 'detail' ? (
            <Detail />
          ) : form === 'inbang' ? (
            <InBanSao />
          ) : form === 'detaildonyeucau' ? (
            <ThuocYeuCauBanSao />
          ) : form === 'xacnhanin' ? (
            <XacNhanIn />
          ) : form === 'xacnhanphatbansao' ? (
            <XacNhanDaPhat />
          ) : form === 'xemlichsu' ? (
            <LichSuCapBanSao />
          ) : (
            ''
          )}
        </Popup>
      )}
      <BackToTop />
    </>
  );
}
