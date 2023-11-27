import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { IconArrowBack, IconCircleCheck, IconFileExport, IconFileImport, IconPlus, IconSearch, IconList } from '@tabler/icons';
import { Button, Chip, FormControl, Grid, InputLabel, MenuItem, Select, TextField, Typography, useMediaQuery } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { openPopupSelector, reloadDataSelector, selectedInfoMessageSelector, userLoginSelector } from 'store/selectors';
import {
  selectedDanhmuc,
  selectedDonvitruong,
  selectedHocsinh,
  setLoading,
  setOpenPopup,
  setReloadData,
  setSelectedInfoMessage
} from 'store/actions';
import { useTranslation } from 'react-i18next';
import Add from './Add';
import Edit from './Edit';
import TraLai from './TraLai';
import TraLaiLuaChon from './TraLaiLuaChon';
import { createSearchParams } from 'utils/createSearchParams';
import { handleResponseStatus } from 'utils/handleResponseStatus';
import useLocalText from 'utils/localText';
import i18n from 'i18n';
import { convertISODateToFormattedDate } from 'utils/formatDate';
import { getHocSinhs, getThongkeByPhong } from 'services/hocsinhService';
import Detail from './Detail';
import MainCard from 'components/cards/MainCard';
import Popup from 'components/controls/popup';
import FileExcel from '../FileMau/FileMauTuDong.xlsx';
import FileExcel_thucong from '../FileMau/FileMauKhongTuDong.xlsx';
import { getAllDanToc, getCauHinhTuDongXepLoai } from 'services/sharedService';
import SapXepSTTHocSinh from './SapXepSTTHocSinh';
import DuyetAll from './DuyetAll';
import { getAllDanhmucTN } from 'services/sharedService';
import BackToTop from 'components/scroll/BackToTop';
import Import from './Import';
import Duyet from './Duyet';
import CombinedActionButtons from 'components/button/CombinedActionButtons';
import ButtonSuccess from 'components/buttoncolor/ButtonSuccess';
import ExportHocSinh from './ExportHocSinh';
import GroupButtons from 'components/button/GroupButton';
import { GetTruongHasPermision } from 'services/danhmuctotnghiepService';

const trangThaiOptions = [
  { value: '1', label: 'Chưa duyệt' },
  { value: '2', label: 'Đã duyệt' }
];
const ketQuaOptions = [
  { value: 'x', label: 'Đạt' },
  { value: 'o', label: 'Không đạt' }
];

export default function HocSinh() {
  const isXs = useMediaQuery('(max-width:600px)');
  const isMd = useMediaQuery('(max-width:1200px)');
  const language = i18n.language;
  const { t } = useTranslation();
  const openPopup = useSelector(openPopupSelector);
  const infoMessage = useSelector(selectedInfoMessageSelector);
  const [title, setTitle] = useState('');
  const [form, setForm] = useState('');
  const [dataCCCD, setDataCCCD] = useState('');
  const [dMTN, setDMTN] = useState([]);
  const [donvis, setDonvis] = useState([]);
  const [danToc, setDanToc] = useState([]);
  const [search, setSearch] = useState(false);
  const [firstLoad, setFirstLoad] = useState(true);
  const reloadData = useSelector(reloadDataSelector);
  const dispatch = useDispatch();
  const localeText = useLocalText();
  const navigate = useNavigate();
  const [selectDonvi, setSelectDonvi] = useState('');
  const [selectTrangThai, setSelectTrangThai] = useState('');
  const [selectDanhmuc, setSelectDanhmuc] = useState('');
  const [tenDMTN, setSelectTenDMTN] = useState('');
  const [selectedRowData, setSelectedRowData] = useState([]);
  const [disabled, setDisabled] = useState(false);
  const [disabledApprov, setDisabledApprov] = useState(false);
  const [loadData, setLoadData] = useState(false);
  const [configAuto, setConfigAuto] = useState(false);
  const user = useSelector(userLoginSelector);
  const [firstLoad3, setFirstLoad3] = useState(true);
  const [data, setData] = useState([]);

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
    DMTN: '',
    danToc: '',
    donVi: '',
    trangThai: '',
    ketQua: ''
  });

  const handleDetail = (hocsinh) => {
    setTitle(t('hocsinh.title.info'));
    setForm('detail');
    dispatch(selectedHocsinh(hocsinh));
    dispatch(setOpenPopup(true));
  };

  const handleAdd = () => {
    setTitle(t('hocsinh.title.add'));
    setForm('add');
    dispatch(setOpenPopup(true));
  };

  const handleEdit = (hocsinh) => {
    setTitle(t('hocsinh.title.edit'));
    setForm('edit');
    dispatch(selectedHocsinh(hocsinh));
    dispatch(setOpenPopup(true));
  };

  const handleDuyet = () => {
    setTitle(t('button.duyet'));
    setForm('duyet');
    dispatch(setOpenPopup(true));
  };

  const handleDuyetAll = () => {
    setTitle(t('button.duyetall'));
    setForm('duyetall');
    dispatch(setOpenPopup(true));
  };

  const handleTraLai = () => {
    setTitle(t('hocsinh.title.return'));
    setForm('tralai');
    dispatch(setOpenPopup(true));
  };
  const handleTraLaiLuaChon = () => {
    setTitle(t('Trả lại theo lựa chọn'));
    setForm('tralailuachon');
    dispatch(setOpenPopup(true));
  };

  const handleImport = () => {
    setTitle(t('hocsinh.title.import'));
    setForm('import');
    dispatch(setOpenPopup(true));
  };

  const handleSearch = () => {
    setSearch(!search);
    setSelectDanhmuc(pageState.DMTN);
    setSelectDonvi(pageState.donVi);
    setSelectTrangThai(pageState.trangThai);
    const danhmucSelect = pageState.DMTN;
    const selectedDanhmucInfo = dMTN.find((dmtn) => dmtn.id === danhmucSelect);
    dispatch(selectedDanhmuc(selectedDanhmucInfo));
    const donviSelect = pageState.donVi;
    const selectedDonviInfo = donvis.find((donvi) => donvi.idTruong === donviSelect);
    dispatch(selectedDonvitruong(selectedDonviInfo));
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

  console.log(pageState.trangThai);

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
            <Grid item xs={12} mt={0.2}>
              <Chip
                // variant='outlined'
                size="small"
                label={params.row.trangThai_fm}
                color={params.row.trangThai_fm === 'Chưa duyệt' ? 'info' : 'success'}
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
      flex: 1.3,
      minWidth: 100
    },
    {
      field: 'ketQua_fm',
      headerName: t('Kết quả'),
      flex: 1.2,
      minWidth: 100
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
            <CombinedActionButtons params={params.row} buttonConfigurations={buttonConfigurations} />
          </Grid>
        </>
      )
    }
  ];

  useEffect(() => {
    const fetchDataDL = async () => {
      const dantoc = await getAllDanToc();
      setDanToc(dantoc.data);
      const configAuto = await getCauHinhTuDongXepLoai();
      setConfigAuto(configAuto.data.configValue);
    };
    fetchDataDL();
  }, []);

  useEffect(() => {
    const fetchDataDL = async () => {
      setTimeout(
        async () => {
          try {
            setLoading(true);
            const response = await getAllDanhmucTN(user ? user.username : '');
            setDMTN(response.data);
            setFirstLoad3(false);
            setLoading(false);
          } catch (error) {
            console.error(error);
            setLoading(false);
          }
        },
        firstLoad3 ? 0 : 0
      );
    };
    fetchDataDL();
  }, [user]);

  useEffect(() => {
    const fetchDataDL = async () => {
      const params = new URLSearchParams();
      params.append('pageSize', -1);
      const donvi = await GetTruongHasPermision(selectDanhmuc, params);
      if (donvi?.data?.truongs?.length > 0) {
        setDonvis(donvi.data.truongs);
      } else {
        setDonvis([]);
      }
    };
    if (selectDanhmuc) {
      fetchDataDL();
    }
  }, [selectDanhmuc]);

  useEffect(() => {
    if (dMTN?.length > 0 && infoMessage) {
      setPageState((old) => ({ ...old, DMTN: infoMessage.IdDanhMucTotNghiep }));
      setSelectDanhmuc(infoMessage.IdDanhMucTotNghiep);
      const selectedDanhmucInfo = dMTN.find((dmtn) => dmtn.id === infoMessage.IdDanhMucTotNghiep);
      dispatch(selectedDanhmuc(selectedDanhmucInfo));
    }
  }, [infoMessage, dMTN]);

  useEffect(() => {
    if (infoMessage && selectDanhmuc && donvis?.length > 0) {
      setPageState((old) => ({ ...old, donVi: infoMessage.IdTruong }));
      setSelectDonvi(infoMessage.IdTruong);
      const selectedDonviInfo = donvis.find((donvi) => donvi.idTruong === infoMessage.IdTruong);
      dispatch(selectedDonvitruong(selectedDonviInfo));
      setLoadData(true);
    }
  }, [infoMessage, selectDanhmuc, donvis]);

  useEffect(() => {
    const fetchData = async () => {
      setPageState((old) => ({ ...old, isLoading: true }));
      const params = await createSearchParams(pageState);
      params.append('cccd', pageState.cccd);
      params.append('hoTen', pageState.hoTen);
      params.append('noiSinh', pageState.noiSinh);
      params.append('danToc', pageState.danToc);
      params.append('idDanhMucTotNghiep', pageState.DMTN);
      params.append('idTruong', pageState.donVi);
      params.append('trangThai', pageState.trangThai);
      params.append('ketQua', pageState.ketQua);
      const response = await getHocSinhs(params);
      const data = response.data;
      if (data?.hocSinhs) {
        const hasActiveHocSinh = data.hocSinhs.length === 0 || data.hocSinhs.some((hocSinh) => hocSinh.trangThai === 2);
        setDisabled(hasActiveHocSinh);
        const hasActiveApprov = data.hocSinhs.length > 0 ? data.hocSinhs.some((hocSinh) => hocSinh.ketQua === 'x') : false;
        setDisabledApprov(!hasActiveApprov);
      } else {
        setDisabled(true);
        setDisabledApprov(true);
      }
      const check = handleResponseStatus(response, navigate);
      if (check) {
        if (data?.hocSinhs?.length > 0) {
          const dataWithIds = data.hocSinhs.map((row, index) => ({
            idx: pageState.startIndex * pageState.pageSize + index + 1,
            soHieuVanBang: row.soHieuVanBang || 'Chưa cấp',
            soVaoSoCapBang: row.soVaoSoCapBang || 'Chưa cấp',
            gioiTinh_fm: row.gioiTinh ? t('gender.male') : t('gender.female'),
            trangThai_fm:
              row.trangThai == 1
                ? t('status.unapproved')
                : row.trangThai == 2
                ? t('status.approved')
                : row.trangThai == 3
                ? t('Đã đưa vào sổ gốc')
                : '',
            ngaySinh_fm: convertISODateToFormattedDate(row.ngaySinh),
            ketQua_fm: row.ketQua == 'x' ? t('Đạt') : t('Không đạt'),
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
      const response = await getThongkeByPhong(pageState.donVi, pageState.DMTN);
      setData(response.data);
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
  }, [reloadData, search, loadData]);

  useEffect(() => {
    setDataCCCD(selectedRowData.map((row) => row.cccd));
  }, [selectedRowData]);

  const handleSchoolChange = (event) => {
    const selectedValue = event.target.value;
    const maDonvi = selectedValue === 'all' ? '' : selectedValue;
    setPageState((old) => ({ ...old, donVi: maDonvi }));
  };

  const handleExport = async (e) => {
    e.preventDefault();
    dispatch(setLoading(true));
    await ExportHocSinh(pageState.DMTN, tenDMTN, pageState.donVi, true);
    dispatch(setLoading(false));
  };

  const arrangeStudents = async () => {
    setTitle(t('Sắp xếp học sinh'));
    setForm('arrange');
    dispatch(setOpenPopup(true));
  };

  const handleDanhMucChange = (event) => {
    const selectedValue = event.target.value;
    const selectedCategory = dMTN.find((dmtn) => dmtn.id === selectedValue);
    setSelectTenDMTN(selectedCategory ? selectedCategory.tieuDe : '');
    const danhMuc = selectedValue === 'all' ? '' : selectedValue;
    setPageState((old) => ({ ...old, DMTN: danhMuc }));
    setSelectDanhmuc(selectedValue);
  };

  const handleTrangThaiChange = (event) => {
    const selectedValue = event.target.value;
    const trangThai = selectedValue === 'all' ? '' : selectedValue;
    setPageState((old) => ({ ...old, trangThai: trangThai }));
  };
  const handleKetQuaTotNghiepChange = (event) => {
    const selectedValue = event.target.value;
    const ketQua = selectedValue === 'all' ? '' : selectedValue;
    setPageState((old) => ({ ...old, ketQua: ketQua }));
  };
  const handleDanTocChange = (event) => {
    const selectedValue = event.target.value;
    const danToc = selectedValue === 'all' ? '' : selectedValue;
    setPageState((old) => ({ ...old, danToc: danToc }));
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
        title={t('hocsinh.title.main')}
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
        <Grid item container spacing={1} my={1} justifyContent={'center'}>
          <Grid item lg={4} md={4} sm={4} xs={isXs ? 12 : 4}>
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
                  <MenuItem value="">Không có dữ liệu</MenuItem>
                )}
              </Select>
            </FormControl>
          </Grid>
          <Grid item lg={4} md={4} sm={4} xs={isXs ? 12 : 4}>
            <FormControl fullWidth variant="outlined" size="small">
              <InputLabel>{t('donvitruong.title')}</InputLabel>
              <Select name="truongId" value={pageState.donVi || 'all'} onChange={handleSchoolChange} label={t('donvitruong.title')}>
                <MenuItem value="all">{t('select.all')}</MenuItem>
                {donvis?.length > 0 ? (
                  donvis.map((donvi) => (
                    <MenuItem key={donvi.idTruong} value={donvi.idTruong}>
                      {donvi.tenTruong}
                    </MenuItem>
                  ))
                ) : (
                  <MenuItem value="">Không có dữ liệu</MenuItem>
                )}
              </Select>
            </FormControl>
          </Grid>
          <Grid item lg={2} md={2} sm={2} xs={isXs ? 6 : 2}>
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
          {pageState.trangThai != 2 && (
            <Grid item lg={2} md={2} sm={2} xs={isXs ? 6 : 2}>
              <FormControl fullWidth variant="outlined" size="small">
                <InputLabel>{t('Kết quả tốt nghiệp')}</InputLabel>
                <Select
                  name="ketQua"
                  value={pageState.ketQua || 'all'}
                  onChange={handleKetQuaTotNghiepChange}
                  label={t('Kết quả tốt nghiệp')}
                >
                  <MenuItem value="all">Tất cả</MenuItem>
                  {ketQuaOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          )}
          {isXs ? (
            <Grid item xs={isXs ? 6 : 2}>
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
          ) : (
            ''
          )}
          <Grid item container mb={1} spacing={1} justifyContent={'center'} alignItems="center">
            {isXs ? (
              ''
            ) : (
              <Grid item lg={2} md={3} sm={3} xs={isXs ? 6 : 2}>
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
            )}
            <Grid item lg={3} md={3} sm={3} xs={isXs ? 12 : 2}>
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
            <Grid item lg={3} md={3} sm={3} xs={isXs ? 6 : 2}>
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
                    <MenuItem value="">Không có dữ liệu</MenuItem>
                  )}
                </Select>
              </FormControl>
            </Grid>
            <Grid item lg={2} md={3} sm={3} xs={isXs ? 6 : 2} minWidth={130}>
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
        <Grid item container spacing={1} alignItems="center">
          {!isMd ? (
            <>
              <Grid item xs={12} sm={12} md={12} lg={5}>
                <Grid item container spacing={1}>
                  <Grid item xs={6} md={4} lg={3}>
                    <Typography variant="h5">{t('Số lượng học sinh')}</Typography>
                  </Grid>
                  <Grid item xs={6} md={4} lg={2.6}>
                    <Typography variant="h5">
                      {t('Tổng')}: {data?.totalRow || 0}
                    </Typography>
                  </Grid>
                  <Grid item xs={6} md={4} lg={3}>
                    <Typography variant="h5">
                      {t('Chưa duyệt')}: {data?.soHocSinhChuaDuyet || 0}
                    </Typography>
                  </Grid>
                  <Grid item xs={6} md={4} lg={3}>
                    <Typography variant="h5">
                      {t('Đã duyệt')}: {data?.soHocSinhDaDuyet || 0}
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
            </>
          ) : (
            ''
          )}
          <Grid item xs={12} sm={12} md={12} lg={7}>
            <Grid item container spacing={1} justifyContent="flex-end">
              <Grid item>
                <ButtonSuccess
                  title={t('button.export.excel')}
                  onClick={handleExport}
                  icon={IconFileExport}
                  disabled={!selectDanhmuc || !selectDonvi}
                />
              </Grid>
              <Grid item>
                <ButtonSuccess
                  title={t('Sắp xếp học sinh')}
                  onClick={arrangeStudents}
                  icon={IconList}
                  disabled={!selectDanhmuc || !selectDonvi || selectTrangThai !== '1'}
                />
              </Grid>
              {selectedRowData.length !== 0 ? (
                <>
                  <Grid item>
                    <Button
                      color="error"
                      onClick={handleTraLaiLuaChon}
                      variant="contained"
                      startIcon={<IconArrowBack />}
                      disabled={!selectDanhmuc || !selectDonvi || selectedRowData.some((row) => row.trangThai === 2)}
                    >
                      {t('button.tralai')}
                    </Button>
                  </Grid>

                  <Grid item>
                    <ButtonSuccess
                      title={t('button.duyet')}
                      onClick={handleDuyet}
                      icon={IconCircleCheck}
                      disabled={
                        !selectDanhmuc ||
                        !selectDonvi ||
                        selectedRowData.some((row) => row.trangThai === 2) ||
                        selectedRowData.some((row) => row.ketQua === 'o')
                      }
                    />
                  </Grid>
                </>
              ) : (
                <>
                  <Grid item>
                    <Button
                      color="error"
                      onClick={handleTraLai}
                      variant="contained"
                      startIcon={<IconArrowBack />}
                      disabled={!selectDanhmuc || !selectDonvi || disabled}
                    >
                      {t('trả lại tất cả')}
                    </Button>
                  </Grid>
                  <Grid item>
                    <ButtonSuccess
                      title={t('button.duyetall')}
                      onClick={handleDuyetAll}
                      icon={IconCircleCheck}
                      disabled={!selectDanhmuc || !selectDonvi || disabled || disabledApprov}
                    />
                  </Grid>
                </>
              )}
            </Grid>
          </Grid>
        </Grid>
        {isMd ? (
          <>
            <Grid item container spacing={1}>
              <Grid item xs={6} md={4} lg={3}>
                <Typography variant="h5">{t('Số lượng học sinh')}</Typography>
              </Grid>
              <Grid item xs={6} md={4} lg={3}>
                <Typography variant="h5">
                  {t('Tổng')}: {data?.totalRow || 0}
                </Typography>
              </Grid>
              <Grid item xs={6} md={4} lg={3}>
                <Typography variant="h5">
                  {t('Chưa duyệt')}: {data?.soHocSinhChuaDuyetDuyet || 0}
                </Typography>
              </Grid>
              <Grid item xs={6} md={4} lg={3}>
                <Typography variant="h5">
                  {t('Đã duyệt')}: {data?.soHocSinhDaDuyet || 0}
                </Typography>
              </Grid>
            </Grid>
          </>
        ) : (
          ''
        )}
        <Grid item container spacing={1} mb={1} lg={10}>
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
        <Grid item container spacing={1} mb={1} lg={10}>
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
              {t('Không đạt')}: {data?.tongKhongDat || 0}
            </Typography>
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
          maxWidth={form == 'duyet' || form === 'duyetall' || form === 'tralai' || form === 'tralailuachon' ? 'sm' : 'md'}
          bgcolor={form === 'delete' || form === 'tralai' || form === 'tralailuachon' ? '#F44336' : '#2196F3'}
        >
          {form === 'duyetall' ? (
            <DuyetAll />
          ) : form === 'duyet' ? (
            <Duyet dataCCCD={dataCCCD} />
          ) : form === 'detail' ? (
            <Detail />
          ) : form === 'import' ? (
            <Import />
          ) : form === 'edit' ? (
            <Edit />
          ) : form === 'tralai' ? (
            <TraLai />
          ) : form === 'tralailuachon' ? (
            <TraLaiLuaChon dataCCCD={dataCCCD} />
          ) : form === 'arrange' ? (
            <SapXepSTTHocSinh danhMuc={selectDanhmuc} donvi={selectDonvi} />
          ) : form === 'add' ? (
            <Add />
          ) : (
            ''
          )}
        </Popup>
      )}
      <BackToTop />
    </>
  );
}
