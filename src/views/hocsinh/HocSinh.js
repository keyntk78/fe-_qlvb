import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { IconArrowBack, IconCircleCheck, IconClick, IconDownload, IconPlus, IconSearch } from '@tabler/icons';
import { Button, Chip, FormControl, Grid, InputLabel, MenuItem, Select, TextField, Typography, useMediaQuery } from '@mui/material';
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
import {
  selectedDanhmuc,
  selectedDonvitruong,
  selectedHocsinh,
  setInfoHocSinh,
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
import { getHocSinhs } from 'services/hocsinhService';
import Detail from './Detail';
import MainCard from 'components/cards/MainCard';
import Popup from 'components/controls/popup';
import FileExcel from '../FileMau/FileMau_ThemHocSinh.xlsx';
// import { getAllDonvi } from 'services/donvitruongService';
import { getAllTruong } from 'services/sharedService';

import DuyetAll from './DuyetAll';
import { getAllDanhmucTN } from 'services/sharedService';
import BackToTop from 'components/scroll/BackToTop';
import Import from './Import';
import Duyet from './Duyet';
import CombinedActionButtons from 'components/button/CombinedActionButtons';
import ButtonSuccess from 'components/buttoncolor/ButtonSuccess';
import ButtonSecondary from 'components/buttoncolor/ButtonSecondary';

const trangThaiOptions = [{ value: '1', label: 'Chưa duyệt' }];

export default function HocSinh() {
  const isXs = useMediaQuery('(max-width:600px)');
  const language = i18n.language;
  const { t } = useTranslation();
  const openPopup = useSelector(openPopupSelector);
  const infoMessage = useSelector(selectedInfoMessageSelector);
  const [title, setTitle] = useState('');
  const [form, setForm] = useState('');
  const [dataCCCD, setDataCCCD] = useState('');
  const [dMTN, setDMTN] = useState([]);
  const [donvis, setDonvis] = useState([]);
  const [search, setSearch] = useState(false);
  const [firstLoad, setFirstLoad] = useState(true);
  const reloadData = useSelector(reloadDataSelector);
  const dispatch = useDispatch();
  const localeText = useLocalText();
  const navigate = useNavigate();
  const [selectDonvi, setSelectDonvi] = useState('');
  const [selectDanhmuc, setSelectDanhmuc] = useState('');
  const [selectedRowData, setSelectedRowData] = useState([]);
  const [disabled, setDisabled] = useState(false);
  const [disabled1, setDisabled1] = useState(false);
  const [disabledSearch, setDisabledSearch] = useState(true);
  const [loadData, setLoadData] = useState(false);
  const infoHocSinh = useSelector(infoHocSinhSelector);
  const user = useSelector(userLoginSelector);

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
    trangThai: ''
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
    setSelectDonvi(pageState.donVi);
    setSelectDanhmuc(pageState.DMTN);
    const donviSelect = pageState.donVi;
    const selectedDonviInfo = donvis.find((donvi) => donvi.id === donviSelect);
    const danhmucSelect = pageState.DMTN;
    const selectedDanhmucInfo = dMTN.find((dmtn) => dmtn.id === danhmucSelect);
    dispatch(selectedDanhmuc(selectedDanhmucInfo));
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
      const response = await getAllDanhmucTN(user ? user.username : '');
      setDMTN(response.data);
      const donvi = await getAllTruong(user.username);
      setDonvis(donvi.data);
    };
    fetchDataDL();
  }, []);

  useEffect(() => {
    if (donvis.length > 0 && dMTN.length > 0) {
      if (infoMessage) {
        setPageState((old) => ({ ...old, donVi: infoMessage.IdTruong, DMTN: infoMessage.IdDanhMucTotNghiep }));
        setSelectDanhmuc(infoMessage.IdDanhMucTotNghiep);
        setSelectDonvi(infoMessage.IdTruong);
        const selectedDonviInfo = donvis.find((donvi) => donvi.id === infoMessage.IdTruong);
        const selectedDanhmucInfo = dMTN.find((dmtn) => dmtn.id === infoMessage.IdDanhMucTotNghiep);
        dispatch(selectedDanhmuc(selectedDanhmucInfo));
        dispatch(selectedDonvitruong(selectedDonviInfo));
        setLoadData(true);
      }
    }
  }, [infoMessage, donvis, dMTN]);

  useEffect(() => {
    if (dMTN.length > 0 && donvis.length > 0 && infoHocSinh) {
      const fetchData = async () => {
        try {
          const selectDonvi = donvis.find((item) => item.ten === infoHocSinh.tenTruong);
          dispatch(selectedDonvitruong(selectDonvi));
          setPageState((old) => ({
            ...old,
            cccd: infoHocSinh.cccd,
            hoTen: infoHocSinh.hoTen,
            trangThai: infoHocSinh.trangThai,
            DMTN: infoHocSinh.idDanhMucTotNghiep,
            donVi: selectDonvi.id
          }));
          setSelectDanhmuc(infoHocSinh.idDanhMucTotNghiep);
          setSelectDonvi(selectDonvi.id);
          const selectDanhmuc = dMTN.find((item) => item.id === infoHocSinh.idDanhMucTotNghiep);
          dispatch(selectedDanhmuc(selectDanhmuc));
          setLoadData(true);
        } catch (error) {
          console.error(error);
        }
      };
      setDisabled1(true);
      fetchData();
    }
  }, [infoHocSinh, dMTN, donvis]);

  useEffect(() => {
    if (pageState.DMTN && pageState.donVi) {
      setDisabledSearch(false);
    } else {
      setDisabledSearch(true);
    }
  }, [pageState.DMTN, pageState.donVi]);

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
      params.append('trangThai', pageState.trangThai ? pageState.trangThai : '1');
      const response = await getHocSinhs(params);
      const data = response.data;
      const hasActiveHocSinh = data && data.hocSinhs.length > 0 ? data.hocSinhs.some((hocSinh) => hocSinh.trangThai === 1) : false;
      setDisabled(!hasActiveHocSinh);
      const check = handleResponseStatus(response, navigate);
      if (check) {
        if (data && data.hocSinhs.length > 0) {
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

  useEffect(() => {
    setDataCCCD(selectedRowData.map((row) => row.cccd));
  }, [selectedRowData]);

  const handleSchoolChange = (event) => {
    const selectedValue = event.target.value;
    // const maDonvi = selectedValue === 'all' ? '' : selectedValue;
    setPageState((old) => ({ ...old, donVi: selectedValue }));
  };

  const handleDanhMucChange = (event) => {
    const selectedValue = event.target.value;
    setPageState((old) => ({ ...old, DMTN: selectedValue }));
  };

  const handleTrangThaiChange = (event) => {
    const selectedValue = event.target.value;
    setPageState((old) => ({ ...old, trangThai: selectedValue }));
  };

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
                <ButtonSecondary
                  title={t('button.download')}
                  href={FileExcel}
                  download="File_Mau"
                  target="_blank"
                  rel="noreferrer"
                  icon={IconDownload}
                />
              </Grid>
              <Grid item>
                <ButtonSuccess title={t('button.import')} onClick={handleImport} icon={IconClick} />
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
              <ButtonSecondary
                title={t('button.download')}
                href={FileExcel}
                download="File_Mau"
                target="_blank"
                rel="noreferrer"
                icon={IconDownload}
              />
            </Grid>
            <Grid item>
              <ButtonSuccess
                title={t('button.import')}
                onClick={handleImport}
                icon={IconClick}
                // disabled={disableImport}
              />
            </Grid>
          </Grid>
        ) : (
          ''
        )}
        <Grid item container spacing={1} my={1} justifyContent={'center'}>
          <Grid item lg={4} md={4.5} sm={4.5} xs={isXs ? 12 : 4}>
            <FormControl fullWidth variant="outlined" size="small">
              <InputLabel>{t('donvitruong.title')}</InputLabel>
              <Select
                name="truongId"
                // value={pageState.donVi === '' ? 'all' : pageState.donVi}
                value={pageState.donVi}
                onChange={handleSchoolChange}
                label={t('donvitruong.title')}
              >
                {/* <MenuItem value="all">{t('select.all')}</MenuItem> */}
                {donvis && donvis.length > 0 ? (
                  donvis.map((donvi) => (
                    <MenuItem key={donvi.id} value={donvi.id}>
                      {donvi.ten}
                    </MenuItem>
                  ))
                ) : (
                  <MenuItem value="">No data available</MenuItem>
                )}
              </Select>
            </FormControl>
          </Grid>
          <Grid item lg={4} md={4.5} sm={4.5} xs={isXs ? 12 : 4}>
            <FormControl fullWidth variant="outlined" size="small">
              <InputLabel>{t('danhmuc.title')}</InputLabel>
              <Select name="id" value={pageState.DMTN} onChange={handleDanhMucChange} label={t('danhmuc.title')}>
                {dMTN && dMTN.length > 0 ? (
                  dMTN.map((dmtn) => (
                    <MenuItem key={dmtn.id} value={dmtn.id}>
                      {dmtn.tieuDe}
                    </MenuItem>
                  ))
                ) : (
                  <MenuItem value="">No data available</MenuItem>
                )}
              </Select>
            </FormControl>
          </Grid>
          <Grid item lg={2} md={3} sm={3} xs={isXs ? 6 : 2}>
            <FormControl fullWidth variant="outlined" size="small">
              <InputLabel>{t('status.title')}</InputLabel>
              <Select
                name="trangThai"
                value={pageState.trangThai ? pageState.trangThai : 1}
                onChange={handleTrangThaiChange}
                label={t('status.title')}
              >
                {trangThaiOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
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
          <Grid item container mb={1} spacing={1} justifyContent={'center'}>
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
            <Grid item lg={2} md={3} sm={3} xs={isXs ? 12 : 2}>
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
            <Grid item lg={2} md={3} sm={3} xs={isXs ? 6 : 2}>
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
              <TextField
                fullWidth
                id="outlined-basic"
                label={t('dantoc')}
                variant="outlined"
                size="small"
                onChange={(e) => setPageState((old) => ({ ...old, danToc: e.target.value }))}
                value={pageState.danToc}
              />
            </Grid>
            <Grid item lg={2} md={3} sm={3} xs={isXs ? 6 : 2} minWidth={130}>
              <Button
                variant="contained"
                title={t('button.search')}
                fullWidth
                onClick={handleSearch}
                color="info"
                sx={{ marginTop: '2px' }}
                startIcon={<IconSearch />}
                disabled={disabledSearch}
              >
                {t('button.search')}
              </Button>
            </Grid>
          </Grid>
        </Grid>
        <Grid item container mb={1} justifyContent="flex-end" spacing={1}>
          {selectedRowData.length !== 0 ? (
            <>
              <Grid item>
                <Button
                  color="error"
                  onClick={handleTraLaiLuaChon}
                  variant="contained"
                  startIcon={<IconArrowBack />}
                  disabled={!selectDanhmuc || !selectDonvi || disabled || disabled1}
                >
                  {t('button.tralai')}
                </Button>
              </Grid>

              <Grid item>
                <ButtonSuccess
                  title={t('button.duyet')}
                  onClick={handleDuyet}
                  icon={IconCircleCheck}
                  disabled={!selectDanhmuc || !selectDonvi || selectedRowData.some((row) => row.trangThai === 2)}
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
                  disabled={!selectDanhmuc || !selectDonvi || disabled || disabled1}
                >
                  {t('trả lại tất cả')}
                </Button>
              </Grid>
              <Grid item>
                <ButtonSuccess
                  title={t('button.duyetall')}
                  onClick={handleDuyetAll}
                  icon={IconCircleCheck}
                  disabled={!selectDanhmuc || !selectDonvi || disabled || disabled1}
                />
              </Grid>
            </>
          )}
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
