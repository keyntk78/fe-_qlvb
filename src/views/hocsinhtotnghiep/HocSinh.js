import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import MainCard from 'components/cards/MainCard';
import { Button, Chip, FormControl, Grid, InputLabel, MenuItem, Select, TextField, Typography, useMediaQuery } from '@mui/material';
import FileExcel from '../FileMau/FileMauTuDong.xlsx';
import FileExcel_thucong from '../FileMau/FileMauKhongTuDong.xlsx';
import Popup from 'components/controls/popup';
import GuiDuyet from './GuiDuyet';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { donviSelector, openPopupSelector, reloadDataSelector, selectedInfoMessageSelector, userLoginSelector } from 'store/selectors';
import {
  selectedCCCD,
  selectedDanhmuc,
  selectedHocsinh,
  setInfoHocSinh,
  setLoading,
  setOpenPopup,
  setReloadData,
  setSelectedInfoMessage
} from 'store/actions';
import { useTranslation } from 'react-i18next';
import Import from './Import';
import Delete from './Delete';
import { useEffect } from 'react';
import { createSearchParams } from 'utils/createSearchParams';
import { getHocSinhByTruong, getThongKeByTruong } from 'services/nguoihoctotnghiepService';
import { handleResponseStatus } from 'utils/handleResponseStatus';
import useLocalText from 'utils/localText';
import i18n from 'i18n';
import { useNavigate } from 'react-router-dom';
import GuiDuyetAll from './GuiDuyetAll';
import DeleteAll from './DeleteAll';
import { convertISODateToFormattedDate } from 'utils/formatDate';
import { IconCertificate, IconFileExport, IconFileImport, IconPlus, IconSearch, IconSend, IconTrash } from '@tabler/icons';
import Detail from './Detail';
import { getAllDanToc, getAllDanhmucTN, getCauHinhTuDongXepLoai } from 'services/sharedService';
import BackToTop from 'components/scroll/BackToTop';
import InGCNAll from './InGCNAll';
import ActionButtons from 'components/button/ActionButtons';
import Edit from '../hocsinhtotnghiep/Edit';
import Add from '../hocsinhtotnghiep/Add';
import InGCN from './InGCN';
import CombinedActionButtons from 'components/button/CombinedActionButtons';
import ButtonSuccess from 'components/buttoncolor/ButtonSuccess';
import GroupButtons from 'components/button/GroupButton';
import ExportHocSinh from 'views/hocsinh/ExportHocSinh';

const trangThaiOptions = [
  { value: '0', label: 'Chưa gửi duyệt' },
  { value: '1', label: 'Đang chờ duyệt' },
  { value: '2', label: 'Đã duyệt' },
  { value: '3', label: 'Đã đưa vào sổ gốc' }
];

export default function HocSinh() {
  const isXs = useMediaQuery('(max-width:700px)');
  const infoMessage = useSelector(selectedInfoMessageSelector);
  const openPopup = useSelector(openPopupSelector);
  const [title, setTitle] = useState('');
  const [form, setForm] = useState('');
  const [dataCCCD, setDataCCCD] = useState('');
  const donvi = useSelector(donviSelector);
  const [dMTN, setDMTN] = useState('');
  const [selectedDMTN, setSelectedDMTN] = useState('');
  const [tenDMTN, setSelectTenDMTN] = useState('');
  const [danToc, setDanToc] = useState([]);
  const { t } = useTranslation();
  const reloadData = useSelector(reloadDataSelector);
  const [firstLoad, setFirstLoad] = useState(true);
  const dispatch = useDispatch();
  const localeText = useLocalText();
  const navigate = useNavigate();
  const language = i18n.language;
  const [selectedRowData, setSelectedRowData] = useState([]);
  const [search, setSearch] = useState(false);
  const [data, setData] = useState(false);
  const [disabled, setDisabled] = useState(true);
  const [disabledInGCN, setDisabledInGCN] = useState(true);
  const [loadData, setLoadData] = useState(false);
  const user = useSelector(userLoginSelector);
  const [configAuto, setConfigAuto] = useState(false);
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
    danToc: '',
    DMTN: '',
    trangThai: ''
  });

  const handleExport = async (e) => {
    e.preventDefault();
    dispatch(setLoading(true));
    await ExportHocSinh(pageState.DMTN, tenDMTN, donvi.id, false, donvi.ten);
    dispatch(setLoading(false));
  };
  const handleInGCNAll = () => {
    setTitle(t('In giấy chứng nhận Tất cả'));
    setForm('ingcnall');
    dispatch(setOpenPopup(true));
  };

  const handleInGCN = () => {
    setTitle(t('In giấy chứng nhận'));
    setForm('inbang');
    dispatch(setOpenPopup(true));
  };

  const handleGuiDuyet = () => {
    setTitle(t('Gửi duyệt'));
    setForm('gui');
    dispatch(setOpenPopup(true));
  };

  const handleGuiDuyetAll = () => {
    setTitle(t('Gửi duyệt tất cả'));
    setForm('guiall');
    dispatch(setOpenPopup(true));
  };

  const handleImport = () => {
    setTitle(t('Thêm học sinh từ tệp'));
    setForm('import');
    dispatch(setOpenPopup(true));
  };

  const handleDelete = () => {
    setTitle(t('hocsinh.title.delete'));
    setForm('delete');
    dispatch(setOpenPopup(true));
  };

  const handleAdd = () => {
    setTitle(t('hocsinh.title.add'));
    setForm('add');
    dispatch(setOpenPopup(true));
  };

  const handleDeleteAll = () => {
    setTitle(t('Xóa tất cả học sinh'));
    setForm('deleteall');
    dispatch(setOpenPopup(true));
  };

  const handleDetail = (hocsinh) => {
    setTitle(t('hocsinh.title.info'));
    setForm('detail');
    dispatch(selectedHocsinh(hocsinh));
    dispatch(setOpenPopup(true));
  };
  const handleEdit = (hocsinh) => {
    setTitle(t('hocsinh.title.edit'));
    setForm('edit');
    dispatch(selectedHocsinh(hocsinh));
    dispatch(setOpenPopup(true));
  };

  const handleSearch = () => {
    setSearch(!search);
    setSelectedDMTN(pageState.DMTN);
    const danhmucSelect = pageState.DMTN;
    const selectedDanhmucInfo = dMTN.find((dmtn) => dmtn.id === danhmucSelect);
    dispatch(selectedDanhmuc(selectedDanhmucInfo));
  };

  const buttonConfigurations = [
    {
      type: 'detail',
      handleGetbyId: handleDetail
    },
    {
      type: 'edit',
      handleEdit: handleEdit
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
      field: 'hoTen',
      headerName: t('hocsinh.field.fullname'),
      flex: 3,
      minWidth: 180,
      renderCell: (params) => (
        <>
          <Grid container>
            <Grid item xs={12}>
              <Typography variant="body1">{params.value}</Typography>
            </Grid>
            <Grid item xs={12} mt={0.2}>
              <Chip
                // variant='outlined'
                size="small"
                label={params.row.trangThai_fm}
                color={
                  params.row.trangThai_fm === t('status.unsend')
                    ? 'info'
                    : params.row.trangThai_fm === t('Đang chờ duyệt')
                    ? 'primary'
                    : params.row.trangThai_fm === t('status.approved')
                    ? 'success'
                    : 'secondary'
                }
              />
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
      minWidth: 70
    },
    {
      field: 'ngaySinh_fm',
      headerName: t('hocsinh.field.bdate'),
      flex: 1.6,
      minWidth: 100
    },
    {
      field: 'ketQua_fm',
      headerName: t('Kết quả'),
      flex: 1,
      minWidth: 80
    },
    {
      field: 'xepLoai',
      headerName: t('Xếp loại'),
      flex: 1,
      minWidth: 80
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
            {params.row.trangThai == 0 ? (
              <CombinedActionButtons params={params.row} buttonConfigurations={buttonConfigurations} />
            ) : (
              <ActionButtons type="detail" handleGetbyId={handleDetail} params={params.row} />
            )}
          </Grid>
        </>
      )
    }
  ];

  useEffect(() => {
    const fetchDataDL = async () => {
      const danhmuc = await getAllDanhmucTN(user ? user.username : '');
      setDMTN(danhmuc.data);
      const dantoc = await getAllDanToc();
      setDanToc(dantoc.data);
      const configAuto = await getCauHinhTuDongXepLoai();
      setConfigAuto(configAuto.data.configValue);
    };
    if (user) {
      fetchDataDL();
    }
  }, [user]);

  useEffect(() => {
    if (dMTN && dMTN.length > 0) {
      if (infoMessage) {
        setPageState((old) => ({ ...old, DMTN: infoMessage.IdDanhMucTotNghiep }));
        setPageState((old) => ({ ...old, trangThai: infoMessage.TrangThai }));
        const selectedDanhmucInfo = dMTN.find((dmtn) => dmtn.id === infoMessage.IdDanhMucTotNghiep);
        dispatch(selectedDanhmuc(selectedDanhmucInfo));
        setLoadData(true);
      }
    }
  }, [infoMessage, dMTN]);

  useEffect(() => {
    const fetchData = async () => {
      setPageState((old) => ({ ...old, isLoading: true }));
      const params = await createSearchParams(pageState);
      params.append('cccd', pageState.cccd);
      params.append('hoTen', pageState.hoTen);
      params.append('noiSinh', pageState.noiSinh);
      params.append('danToc', pageState.danToc);
      params.append('idDanhMucTotNghiep', pageState.DMTN);
      params.append('trangThai', pageState.trangThai);
      const response = await getHocSinhByTruong(donvi.id, params);
      const data = response.data;
      const hasActiveHocSinh = data && data.hocSinhs.length > 0 && data.hocSinhs.every((hocSinh) => hocSinh.trangThai === 0);
      const hasActiveHocSinh_InGCN = data && data.hocSinhs.length > 0 && data.hocSinhs.every((hocSinh) => hocSinh.trangThai === 2);
      setDisabledInGCN(!hasActiveHocSinh_InGCN);
      setDisabled(!hasActiveHocSinh);
      const check = handleResponseStatus(response, navigate);
      if (check) {
        if (data && data.hocSinhs.length > 0) {
          const dataWithIds = data.hocSinhs.map((row, index) => ({
            idx: pageState.startIndex * pageState.pageSize + index + 1,
            soHieuVanBang: row.soHieuVanBang ? row.soHieu : 'Chưa cấp',
            soVaoSoCapBang: row.soVaoSoCapBang || 'Chưa cấp',
            gioiTinh_fm: row.gioiTinh ? 'Nam' : 'Nữ',
            trangThai_fm:
              row.trangThai == 0
                ? t('status.unsend')
                : row.trangThai == 1
                ? t('Đang chờ duyệt')
                : row.trangThai == 2
                ? t('status.approved')
                : row.trangThai == 3
                ? t('status.davaoso')
                : '',
            ngaySinh_fm: convertISODateToFormattedDate(row.ngaySinh),
            ketQua_fm: row.ketQua == 'x' ? t('Đạt') : row.ketQua == 'o' ? t('Chưa đạt') : '',
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
      } else {
        fetchData();
      }
    } else {
      setFirstLoad(false);
    }
  }, [pageState.search, pageState.order, pageState.orderDir, pageState.startIndex, pageState.pageSize, reloadData, search, loadData]);

  useEffect(() => {
    const fetchData = async () => {
      setPageState((old) => ({ ...old, isLoading: true }));
      const response = await getThongKeByTruong(donvi.id, pageState.DMTN);
      setData(response.data);
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
  }, [reloadData, search, loadData]);

  useEffect(() => {
    setDataCCCD(selectedRowData.map((row) => row.cccd));
  }, [selectedRowData]);

  // Lưu vào redux để in giấy GCNTT
  useEffect(() => {
    const dataCCCD = selectedRowData.map((row) => row.cccd);
    dispatch(selectedCCCD(dataCCCD)); // Gửi dữ liệu vào Redux store
  }, [selectedRowData]);

  const handleDanhMucChange = (event) => {
    const selectedValue = event.target.value;
    const selectedCategory = dMTN.find((dmtn) => dmtn.id === selectedValue);
    setSelectTenDMTN(selectedCategory ? selectedCategory.tieuDe : '');
    const danhMuc = selectedValue === 'all' ? '' : selectedValue;
    setPageState((old) => ({ ...old, DMTN: danhMuc }));
  };
  const handleDanTocChange = (event) => {
    const selectedValue = event.target.value;
    const danToc = selectedValue === 'all' ? '' : selectedValue;
    setPageState((old) => ({ ...old, danToc: danToc }));
  };
  const handleTrangThaiChange = (event) => {
    const selectedValue = event.target.value;
    const trangthai = selectedValue === 'all' ? '' : selectedValue;
    setPageState((old) => ({ ...old, trangThai: trangthai }));
  };

  const handleDowloadTemplate = async () => {
    window.location.href = configAuto === 'true' ? FileExcel : FileExcel_thucong;
  };
  const themTuTep = [
    {
      type: 'importFile',
      handleClick: handleImport
    },
    {
      type: 'dowloadTemplate',
      handleClick: handleDowloadTemplate
    }
  ];

  return (
    <>
      <MainCard
        title={t('hocsinhtotnghiep.title')}
        secondary={
          isXs ? (
            <Grid item>
              <Button onClick={handleAdd} color="info" variant="contained" startIcon={<IconPlus />}>
                {t('button.label.add')}
              </Button>
            </Grid>
          ) : (
            <Grid item container justifyContent="flex-end" spacing={1}>
              <Grid item>
                <GroupButtons buttonConfigurations={themTuTep} themtep icon={IconFileImport} title={t('button.import')} />
              </Grid>
              <Grid item>
                <Button onClick={handleAdd} color="info" variant="contained" startIcon={<IconPlus />}>
                  {t('button.label.add')}
                </Button>
              </Grid>
            </Grid>
          )
        }
      >
        {isXs ? (
          <Grid item container justifyContent="center" spacing={1}>
            <Grid item>
              <GroupButtons buttonConfigurations={themTuTep} themtep icon={IconFileImport} title={t('button.import')} />
            </Grid>
          </Grid>
        ) : (
          ''
        )}
        <Grid container justifyContent="center" spacing={1} my={1}>
          <Grid item xs={12} sm={6} md={6} lg={5}>
            <FormControl fullWidth variant="outlined" size="small">
              <InputLabel>{t('danhmuc.title')}</InputLabel>
              <Select name="id" value={pageState.DMTN || 'all'} onChange={handleDanhMucChange} label={t('danhmuc.title')}>
                <MenuItem value="all">Tất cả</MenuItem>
                {dMTN?.length > 0 ? (
                  dMTN.map((dmtn) => (
                    <MenuItem key={dmtn.id} value={dmtn.id}>
                      {dmtn.tieuDe}
                    </MenuItem>
                  ))
                ) : (
                  <MenuItem value="">{t('selected.nodata')}</MenuItem>
                )}
              </Select>
            </FormControl>
          </Grid>
          <Grid item container xs={6} sm={3} md={3} lg={2}>
            <TextField
              fullWidth
              id="outlined-basic"
              label="CCCD"
              variant="outlined"
              size="small"
              onChange={(e) => setPageState((old) => ({ ...old, cccd: e.target.value }))}
              value={pageState.cccd}
            />
          </Grid>
          <Grid item xs={6} sm={3} md={3} lg={2}>
            <FormControl fullWidth variant="outlined" size="small">
              <InputLabel>{t('status.title')}</InputLabel>
              <Select name="trangThai" value={pageState.trangThai || 'all'} onChange={handleTrangThaiChange} label={t('status.title')}>
                <MenuItem value="all">Tất cả</MenuItem>
                {trangThaiOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
        <Grid container justifyContent="center" spacing={1} mb={2}>
          <Grid item container xs={12} sm={3} md={3} lg={2.5}>
            <TextField
              fullWidth
              id="outlined-basic"
              label={t('user.input.label.fullname')}
              variant="outlined"
              size="small"
              onChange={(e) => setPageState((old) => ({ ...old, hoTen: e.target.value }))}
              value={pageState.hoTen}
            />
          </Grid>
          <Grid item container xs={6} sm={3} md={3} lg={2.5}>
            <TextField
              fullWidth
              id="outlined-basic"
              label={t('user.label.noisinh')}
              variant="outlined"
              size="small"
              onChange={(e) => setPageState((old) => ({ ...old, noiSinh: e.target.value }))}
              value={pageState.noiSinh}
            />
          </Grid>
          {/* <Grid item container xs={6} sm={3} md={3} lg={2}>
            <TextField
              fullWidth
              id="outlined-basic"
              label={t('dantoc')}
              variant="outlined"
              size="small"
              onChange={(e) => setPageState((old) => ({ ...old, danToc: e.target.value }))}
              value={pageState.danToc}
            />
          </Grid> */}
          <Grid item lg={2} md={3} sm={3} xs={isXs ? 6 : 2}>
            <FormControl fullWidth variant="outlined" size="small">
              <InputLabel>{t('hocsinh.field.nation')}</InputLabel>
              <Select name="danToc" value={pageState.danToc || 'all'} onChange={handleDanTocChange} label={t('hocsinh.field.nation')}>
                <MenuItem value="all">Tất cả</MenuItem>
                {danToc?.length > 0 ? (
                  danToc.map((dantoc) => (
                    <MenuItem key={dantoc.id} value={dantoc.ten}>
                      {dantoc.ten}
                    </MenuItem>
                  ))
                ) : (
                  <MenuItem value="">No data available</MenuItem>
                )}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={5} sm={3} md={3} lg={2}>
            <Button
              fullWidth
              variant="contained"
              title={t('button.search')}
              onClick={handleSearch}
              color="info"
              sx={{ marginTop: '2px', minWidth: 130 }}
              startIcon={<IconSearch />}
            >
              {t('button.search')}
            </Button>
          </Grid>
        </Grid>
        <Grid item container spacing={1} justifyContent="flex-end">
          <Grid item>
            <ButtonSuccess title={t('button.export.excel')} onClick={handleExport} icon={IconFileExport} disabled={!selectedDMTN} />
          </Grid>
          {selectedRowData.length !== 0 ? (
            <>
              <Grid item>
                <ButtonSuccess
                  title={t('button.ingcn')}
                  onClick={handleInGCN}
                  icon={IconCertificate}
                  disabled={
                    selectedRowData.some((row) => row.trangThai === 0 || row.trangThai === 1 || row.trangThai === 3) || !selectedDMTN
                  }
                />
              </Grid>
              <Grid item>
                <Button
                  color="info"
                  variant="contained"
                  onClick={handleGuiDuyet}
                  sx={{ mx: 1 }}
                  startIcon={<IconSend />}
                  disabled={selectedRowData.some((row) => row.trangThai !== 0) || !selectedDMTN}
                >
                  {t('button.send')}
                </Button>
              </Grid>
              <Grid item>
                <Button
                  variant="contained"
                  color="error"
                  onClick={handleDelete}
                  startIcon={<IconTrash />}
                  disabled={selectedRowData.some((row) => row.trangThai !== 0)}
                >
                  {t('button.delete')}
                </Button>
              </Grid>
            </>
          ) : (
            <>
              <Grid item>
                <ButtonSuccess
                  title={t('button.ingcntatca')}
                  onClick={handleInGCNAll}
                  icon={IconCertificate}
                  disabled={disabledInGCN || !selectedDMTN}
                />
              </Grid>
              <Grid item>
                <Button
                  onClick={handleGuiDuyetAll}
                  color="info"
                  variant="contained"
                  startIcon={<IconSend />}
                  disabled={disabled || !selectedDMTN}
                >
                  {t('button.sendall')}
                </Button>
              </Grid>
              <Grid item>
                <Button color="error" variant="contained" onClick={handleDeleteAll} startIcon={<IconTrash />} disabled={disabled}>
                  {t('button.deleteall')}
                </Button>
              </Grid>
            </>
          )}
        </Grid>
        <Grid item container spacing={1} my={1}>
          <Grid item xs={6} md={4} lg={1.5}>
            <Typography variant="h5">{t('Số lượng học sinh')}</Typography>
          </Grid>
          <Grid item xs={6} md={4} lg={1.3}>
            <Typography variant="h5">
              {t('Tổng')}: {data?.totalRow || 0}
            </Typography>
          </Grid>
          <Grid item xs={6} md={4} lg={1.5}>
            <Typography variant="h5">
              {t('Chưa duyệt')}: {data?.soHocSinhChuaDuyet || 0}
            </Typography>
          </Grid>
          <Grid item xs={6} md={4} lg={1.5}>
            <Typography variant="h5">
              {t('Đã duyệt')}: {data?.soHocSinhDaDuyet || 0}
            </Typography>
          </Grid>
        </Grid>
        <Grid item container spacing={1} mb={1}>
          <Grid item xs={6} md={4} lg={1.5}>
            <Typography variant="h5">{t('Xếp loại')}</Typography>
          </Grid>
          <Grid item xs={6} md={4} lg={1.3}>
            <Typography variant="h5">
              {t('Giỏi')}: {data?.tongGioi || 0}
            </Typography>
          </Grid>
          <Grid item xs={6} md={4} lg={1.5}>
            <Typography variant="h5">
              {t('Khá')}: {data?.tongKha || 0}
            </Typography>
          </Grid>
          <Grid item xs={6} md={4} lg={1.5}>
            <Typography variant="h5">
              {t('Trung bình')}: {data?.tongTB || 0}
            </Typography>
          </Grid>
        </Grid>
        <Grid item container spacing={1} mb={1}>
          <Grid item xs={6} md={4} lg={1.5}>
            <Typography variant="h5">{t('Kết quả')}</Typography>
          </Grid>
          <Grid item xs={6} md={4} lg={1.3}>
            <Typography variant="h5">
              {t('Đạt')}: {data?.tongDat || 0}
            </Typography>
          </Grid>
          <Grid item xs={6} md={4} lg={1.5}>
            <Typography variant="h5">
              {t('Chưa đạt')}: {data?.tongChuaDat || 0}
            </Typography>
          </Grid>
        </Grid>
        <DataGrid
          autoHeight
          columns={columns}
          rows={pageState.data}
          rowCount={pageState.total}
          loading={pageState.isLoading}
          rowHeight={60}
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
          initialState={{
            pagination: {
              paginationModel: { page: 0, pageSize: 10 }
            }
          }}
          checkboxSelection
          onSelectionModelChange={(ids) => {
            const selectedIDs = new Set(ids);
            setSelectedRowData(pageState.data.filter((row) => selectedIDs.has(row.id)));
          }}
        />
      </MainCard>
      {form !== '' && (
        <Popup
          title={title}
          form={form}
          openPopup={openPopup}
          maxWidth={form === 'detail' || form === 'edit' || form === 'add' ? 'md' : 'sm'}
          bgcolor={form === 'delete' || form === 'deleteall' ? '#F44336' : '#2196F3'}
        >
          {form === 'gui' ? (
            <GuiDuyet dataCCCD={dataCCCD} />
          ) : form === 'guiall' ? (
            <GuiDuyetAll />
          ) : form === 'import' ? (
            <Import />
          ) : form === 'delete' ? (
            <Delete dataCCCD={dataCCCD} />
          ) : form === 'deleteall' ? (
            <DeleteAll />
          ) : form === 'detail' ? (
            <Detail />
          ) : form === 'edit' ? (
            <Edit />
          ) : form === 'inbang' ? (
            <InGCN />
          ) : form === 'ingcnall' ? (
            <InGCNAll />
          ) : form === 'add' ? (
            <Add />
          ) : (
            ''
          )}
        </Popup>
      )}
      <BackToTop />;
    </>
  );
}
