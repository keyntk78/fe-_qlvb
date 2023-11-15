import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { IconBookUpload, IconChecks, IconFileCertificate, IconSearch } from '@tabler/icons';
import { Button, Chip, FormControl, Grid, InputLabel, MenuItem, Select, TextField, Typography, useMediaQuery } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { infoHocSinhSelector, openPopupSelector, reloadDataSelector, userLoginSelector } from 'store/selectors';
import {
  selectedDanhmuc,
  selectedDonvitruong,
  selectedHocsinh,
  setInfoHocSinh,
  setLoading,
  setOpenPopup,
  setReloadData
} from 'store/actions';
import { useTranslation } from 'react-i18next';
import { createSearchParams } from 'utils/createSearchParams';
import { handleResponseStatus } from 'utils/handleResponseStatus';
import useLocalText from 'utils/localText';
import i18n from 'i18n';
import { convertISODateToFormattedDate } from 'utils/formatDate';
import Edit from 'views/hocsinh/Edit';
import MainCard from 'components/cards/MainCard';
import BackToTop from 'components/scroll/BackToTop';
import Popup from 'components/controls/popup';
import { getAllNamthi } from 'services/namthiService';
import CapBang from './CapBang';
import VaoSoGoc from './VaoSoGoc';
import Detail from './Detail';
import XacNhanIn from './XacNhanIn';
import { getHocSinhCapBang } from 'services/capbangbanchinhService';
import { getAllHinhthucdaotao } from 'services/hinhthucdaotaoService';
import ActionButtons from 'components/button/ActionButtons';
import CombinedActionButtons from 'components/button/CombinedActionButtons';
import CapBangAll from './CapBangAll';
import ButtonSecondary from 'components/buttoncolor/ButtonSecondary';
import ButtonSuccess from 'components/buttoncolor/ButtonSuccess';
import { getAllTruong, getByIdNamThi } from 'services/sharedService';

const trangThaiOptions = [
  // { value: '1', label: 'Chưa duyệt' },
  { value: '2', label: 'Đã duyệt' },
  { value: '3', label: 'Đã đưa vào sổ gốc' },
  { value: '4', label: 'Đã cấp bằng' },
  { value: '5', label: 'Đã in bằng' },
  { value: '6', label: 'Đã phát bằng' }
];

export default function CapBangGoc() {
  const isXs = useMediaQuery('(max-width:800px)');
  const openPopup = useSelector(openPopupSelector);
  const language = i18n.language;
  const { t } = useTranslation();
  const [title, setTitle] = useState('');
  const [form, setForm] = useState('');
  const [dMTN, setDMTN] = useState([]);
  const [donvis, setDonvis] = useState([]);
  const [namHoc, setNamHoc] = useState([]);
  const [htdt, setHTDT] = useState([]);
  const [trangThai, setTrangThai] = useState('');
  const [search, setSearch] = useState(false);
  const [firstLoad, setFirstLoad] = useState(true);
  const [firstLoad1, setFirstLoad1] = useState(true);
  const reloadData = useSelector(reloadDataSelector);
  const [selectDonvi, setSelectDonvi] = useState('');
  const [selectDanhmuc, setSelectDanhmuc] = useState('');
  const [selectNamHoc, setSelectNamHoc] = useState('');
  const [selectHTDT, setSelectHTDT] = useState('');
  const dispatch = useDispatch();
  const localeText = useLocalText();
  const navigate = useNavigate();
  const [disabledCapBang, setDisabledCapBang] = useState(true);
  const [disabledInBang, setDisabledInBang] = useState(true);
  const [disabledVaoSo, setDisabledVaoSo] = useState(true);
  const [disabled, setDisabled] = useState(false);
  const [selectedRowData, setSelectedRowData] = useState([]);
  const [dataCCCD, setDataCCCD] = useState('');
  const [loadData, setLoadData] = useState(false);
  const infoHocSinh = useSelector(infoHocSinhSelector);
  const user = useSelector(userLoginSelector);
  const [firstLoad3, setFirstLoad3] = useState(true);
  const [pageState, setPageState] = useState({
    isLoading: false,
    data: [],
    total: 0,
    order: 0,
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

  const handleCapBang = () => {
    setTitle(t('Cấp bằng tốt nghiệp'));
    setForm('capbang');
    dispatch(setOpenPopup(true));
  };

  const handleCapBangAll = () => {
    setTitle(t('Cấp bằng tốt nghiệp'));
    setForm('capbangall');
    dispatch(setOpenPopup(true));
  };

  const handleXacNhanIn = () => {
    setTitle(t('Xác nhận in thành công'));
    setForm('xacnhanin');
    dispatch(setOpenPopup(true));
  };

  const handleVaoSo = () => {
    setTitle(t('Vào sổ gốc'));
    setForm('vaoso');
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
    setDisabled(false);
    const donviSelect = pageState.donVi;
    const selectedDonviInfo = donvis.find((donvi) => donvi.id === donviSelect);
    const danhmucSelect = pageState.DMTN;
    const selectedDanhmucInfo = dMTN.find((dmtn) => dmtn.id === danhmucSelect);
    setSelectDonvi(pageState.donVi);
    setSelectDanhmuc(pageState.DMTN);
    dispatch(selectedDanhmuc(selectedDanhmucInfo));
    dispatch(selectedDonvitruong(selectedDonviInfo));
    setTrangThai(pageState.trangThai);
  };

  const handleDetail = (hocsinh) => {
    setTitle(t('hocsinh.title.info'));
    setForm('detail');
    dispatch(selectedHocsinh(hocsinh));
    dispatch(setOpenPopup(true));
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

  const initialColumns = [
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
                color={
                  params.row.trangThai == 2
                    ? 'success'
                    : params.row.trangThai == 3
                    ? 'info'
                    : params.row.trangThai == 4
                    ? 'success'
                    : params.row.trangThai == 5
                    ? 'primary'
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
      field: 'soVaoSoCapBang',
      headerName: t('hocsinh.field.soCapBang'),
      flex: 2,
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
            {params.row.trangThai == 2 ? (
              <CombinedActionButtons params={params.row} buttonConfigurations={buttonConfigurations} />
            ) : (
              <ActionButtons type="detail" handleGetbyId={handleDetail} params={params.row} />
            )}
          </Grid>
        </>
      )
    }
  ];

  if (trangThai === '4') {
    initialColumns.splice(7, 0, {
      field: 'soLanIn',
      headerName: t('Số lần in'),
      flex: 1
    });
  }

  const columns = [...initialColumns];

  useEffect(() => {
    const fetchDataDL = async () => {
      const namhoc = await getAllNamthi();
      setNamHoc(namhoc.data);
    };
    fetchDataDL();
  }, []);
  useEffect(() => {
    const fetchDataDL = async () => {
      setTimeout(
        async () => {
          try {
            setLoading(true);
            const htdt = await getAllHinhthucdaotao();
            setHTDT(htdt.data);
            const donvi = await getAllTruong(user ? user.username : '');
            if (donvi.data && donvi.data.length > 0) {
              setDonvis(donvi.data);
            } else {
              setDonvis([]);
            }
            setFirstLoad3(false);
            setLoading(false);
          } catch (error) {
            console.error(error);
            setLoading(false);
          }
        },
        firstLoad3 ? 2500 : 0
      );
    };
    fetchDataDL();
  }, [user]);

  useEffect(() => {
    if (namHoc.length > 0 && htdt.length > 0 && donvis.length > 0 && infoHocSinh) {
      const fetchData = async () => {
        try {
          const selectDonvi = donvis.find((item) => item.ten === infoHocSinh.tenTruong);
          dispatch(selectedDonvitruong(selectDonvi));
          setPageState((old) => ({
            ...old,
            trangThai: infoHocSinh.trangThai,
            donVi: selectDonvi.id,
            hoTen: infoHocSinh.hoTen,
            cccd: infoHocSinh.cccd
          }));
          setSelectNamHoc(infoHocSinh.idNamThi);
          setSelectHTDT(infoHocSinh.maHinhThucDaoTao);
          const danhmuc = await getByIdNamThi(infoHocSinh.idNamThi, infoHocSinh.maHinhThucDaoTao, user.username);
          if (danhmuc.data && danhmuc.data.length > 0) {
            const selectDanhmuc = danhmuc.data.find((item) => item.id === infoHocSinh.idDanhMucTotNghiep);
            setDMTN(danhmuc.data);
            setPageState((old) => ({
              ...old,
              DMTN: infoHocSinh.idDanhMucTotNghiep
            }));
            dispatch(selectedDanhmuc(selectDanhmuc));
          } else {
            setDMTN([]);
            setPageState((old) => ({ ...old, DMTN: '' }));
          }
          setLoadData(true);
        } catch (error) {
          console.error(error);
        }
      };
      setDisabled(true);
      fetchData();
    }
  }, [infoHocSinh, namHoc, htdt, donvis]);

  useEffect(() => {
    const fetchDataDL = async () => {
      const danhmuc = await getByIdNamThi(selectNamHoc, selectHTDT, user.username);
      if (danhmuc.data && danhmuc.data.length > 0) {
        setDMTN(danhmuc.data);
      } else {
        setDMTN([]);
        setPageState((old) => ({ ...old, DMTN: '' }));
      }
    };
    if (selectNamHoc && selectHTDT) {
      fetchDataDL();
    }
  }, [selectNamHoc, selectHTDT]);

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
      params.append('trangThai', pageState.trangThai ? pageState.trangThai : '2');
      const response = await getHocSinhCapBang(params);
      const check = handleResponseStatus(response, navigate);
      if (check) {
        const data = await response.data;
        const dataWithIds = data.hocSinhs.map((row, index) => ({
          idx: pageState.startIndex * pageState.pageSize + index + 1,
          soHieuVanBang: row.soHieuVanBang ? row.soHieuVanBang : 'Chưa cấp',
          soVaoSoCapBang: row.soVaoSoCapBang || 'Chưa cấp',
          gioiTinh_fm: row.gioiTinh ? t('gender.male') : t('gender.female'),
          trangThai_fm:
            row.trangThai == 1
              ? t('status.unapproved')
              : row.trangThai == 2
              ? t('status.approved')
              : row.trangThai == 3
              ? t('Đã đưa vào sổ gốc')
              : row.trangThai == 4
              ? t('Đã cấp bằng')
              : row.trangThai == 5
              ? t('Đã in bằng')
              : row.trangThai == 6
              ? t('Đã phát bằng')
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
        setIsAccess(false);
      }
    };
    if (!firstLoad || loadData) {
      if (loadData) {
        fetchData();
        setLoadData(false);
        dispatch(setInfoHocSinh(null));
      } else {
        fetchData();
      }
    } else {
      setFirstLoad(false);
    }
  }, [pageState.search, pageState.order, pageState.orderDir, pageState.startIndex, pageState.pageSize, reloadData, search, loadData]);

  const handleNamHocChange = (event) => {
    const selectedValue = event.target.value;
    setSelectNamHoc(selectedValue);
  };

  const handleHTDTChange = (event) => {
    const selectedValue = event.target.value;
    setSelectHTDT(selectedValue);
  };

  const handleDanhMucChange = (event) => {
    const selectedValue = event.target.value;
    setPageState((old) => ({ ...old, DMTN: selectedValue }));
  };

  const handleSchoolChange = (event) => {
    const selectedValue = event.target.value;
    setPageState((old) => ({ ...old, donVi: selectedValue }));
  };

  const handleTrangThaiChange = (event) => {
    const selectedValue = event.target.value;
    setPageState((old) => ({ ...old, trangThai: selectedValue }));
  };
  useEffect(() => {
    setDataCCCD(selectedRowData.map((row) => row.cccd));
  }, [selectedRowData]);

  useEffect(() => {
    const fetchDataDL = async () => {
      const updatedPageState = { ...pageState, pageSize: -1 };
      const params = await createSearchParams(updatedPageState);
      params.append('idTruong', selectDonvi);
      params.append('idDanhMucTotNghiep', selectDanhmuc);
      params.append('trangThai', pageState.trangThai ? pageState.trangThai : 2);
      const response = await getHocSinhCapBang(params);
      const hocSinhs = response.data.hocSinhs;
      const hasActiveVaoSo = hocSinhs.length > 0 && hocSinhs.every((hocSinh) => hocSinh.trangThai === 2);
      const hasActiveCapBang = hocSinhs.length > 0 && hocSinhs.every((hocSinh) => hocSinh.trangThai === 3);
      const hasActiveInBang = hocSinhs.length > 0 && hocSinhs.every((hocSinh) => hocSinh.trangThai === 4);
      setDisabledVaoSo(!hasActiveVaoSo);
      setDisabledCapBang(!hasActiveCapBang);
      setDisabledInBang(!hasActiveInBang);
    };
    if (!firstLoad1 || loadData) {
      if (loadData) {
        fetchDataDL();
        setLoadData(false);
        dispatch(setInfoHocSinh(null));
      } else {
        fetchDataDL();
      }
    } else {
      setFirstLoad1(false);
    }
  }, [search, reloadData, loadData]);

  return (
    <>
      <MainCard title={t('capbanggoc.title')}>
        <Grid item container mb={1} spacing={1} justifyContent={'center'}>
          <Grid item md={3} sm={3} lg={1.4} xs={isXs ? 5 : 1.5}>
            <FormControl fullWidth variant="outlined" size="small">
              <InputLabel>{t('namhoc')}</InputLabel>
              <Select name="truongId" value={selectNamHoc} onChange={handleNamHocChange} label={t('Năm học')}>
                {namHoc && namHoc.length > 0 ? (
                  namHoc.map((data) => (
                    <MenuItem key={data.id} value={data.id}>
                      {data.ten}
                    </MenuItem>
                  ))
                ) : (
                  <MenuItem value="nodata">{t('noRowsLabel')}</MenuItem>
                )}
              </Select>
            </FormControl>
          </Grid>
          <Grid item md={3} sm={3} lg={2} xs={isXs ? 7 : 1.5}>
            <FormControl fullWidth variant="outlined" size="small">
              <InputLabel>{t('hinhthucdaotao.title')}</InputLabel>
              <Select name="truongId" value={selectHTDT} onChange={handleHTDTChange} label={t('hinhthucdaotao.title')}>
                {htdt && htdt.length > 0 ? (
                  htdt.map((data) => (
                    <MenuItem key={data.ma} value={data.ma}>
                      {data.ten}
                    </MenuItem>
                  ))
                ) : (
                  <MenuItem value="nodata">{t('noRowsLabel')}</MenuItem>
                )}
              </Select>
            </FormControl>
          </Grid>
          <Grid item md={6} sm={6} lg={3} xs={isXs ? 12 : 3}>
            <FormControl fullWidth variant="outlined" size="small">
              <InputLabel>{t('danhmuc.title')}</InputLabel>
              <Select name="id" value={pageState.DMTN ? pageState.DMTN : ''} onChange={handleDanhMucChange} label={t('danhmuc.title')}>
                {dMTN && dMTN.length > 0 ? (
                  dMTN.map((data) => (
                    <MenuItem key={data.id} value={data.id}>
                      {data.tieuDe}
                    </MenuItem>
                  ))
                ) : (
                  <MenuItem value="nodata">Không có dữ liệu</MenuItem>
                )}
              </Select>
            </FormControl>
          </Grid>
          <Grid item md={6} sm={6} lg={3.6} xs={isXs ? 8 : 4}>
            <FormControl fullWidth variant="outlined" size="small">
              <InputLabel>{t('donvitruong.title')}</InputLabel>
              <Select
                name="truongId"
                value={pageState.donVi ? pageState.donVi : ''}
                onChange={handleSchoolChange}
                label={t('donvitruong.title')}
              >
                {donvis && donvis.length > 0 ? (
                  donvis.map((data) => (
                    <MenuItem key={data.id} value={data.id}>
                      {data.ten}
                    </MenuItem>
                  ))
                ) : (
                  <MenuItem value="nodata">{t('noRowsLabel')}</MenuItem>
                )}
              </Select>
            </FormControl>
          </Grid>
          <Grid item md={6} sm={6} lg={2} xs={isXs ? 4 : 2}>
            <FormControl fullWidth variant="outlined" size="small">
              <InputLabel>{t('status.title')}</InputLabel>
              <Select
                name="trangThai"
                value={pageState.trangThai ? pageState.trangThai : 2}
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
          <Grid item container spacing={1} justifyContent={'center'}>
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
                sx={{ marginTop: '2px' }}
                startIcon={<IconSearch />}
              >
                {t('button.search')}
              </Button>
            </Grid>
          </Grid>
        </Grid>
        <Grid item container justifyContent="flex-end" spacing={1} mb={1}>
          <Grid item>
            {dataCCCD && dataCCCD.length > 0 ? (
              <ButtonSuccess
                title={t('button.xacnhanin')}
                fullWidth
                onClick={handleXacNhanIn}
                icon={IconChecks}
                disabled={disabledInBang || !selectDanhmuc || !selectDonvi || !selectNamHoc || !selectHTDT}
              />
            ) : (
              <ButtonSuccess
                title={t('button.xacnhanintatca')}
                fullWidth
                onClick={handleXacNhanIn}
                icon={IconChecks}
                disabled={disabledInBang || disabled || !selectDanhmuc || !selectDonvi || !selectNamHoc || !selectHTDT}
              />
            )}
          </Grid>
          <Grid item>
            {dataCCCD && dataCCCD.length > 0 ? (
              <ButtonSecondary
                fullWidth
                title={t('button.capbang')}
                onClick={handleCapBang}
                icon={IconFileCertificate}
                disabled={disabledCapBang || !selectDanhmuc || !selectDonvi || !selectNamHoc || !selectHTDT}
              />
            ) : (
              <ButtonSecondary
                fullWidth
                title={t('button.capbangtatca')}
                onClick={handleCapBangAll}
                icon={IconFileCertificate}
                disabled={disabledCapBang || disabled || !selectDanhmuc || !selectDonvi || !selectNamHoc || !selectHTDT}
              />
            )}
          </Grid>
          <Grid item>
            <Button
              fullWidth
              color="info"
              onClick={handleVaoSo}
              variant="contained"
              startIcon={<IconBookUpload />}
              disabled={disabledVaoSo || !selectDanhmuc || !selectDonvi || !selectNamHoc || !selectHTDT}
            >
              {t('button.vaoso')}
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
          maxWidth={form === 'vaoso' ? 'lg' : 'md'}
          bgcolor={form === 'delete' ? '#F44336' : '#2196F3'}
        >
          {form === 'detail' ? (
            <Detail type={'phong'} />
          ) : form === 'edit' ? (
            <Edit />
          ) : form === 'capbangall' ? (
            <CapBangAll />
          ) : form === 'capbang' ? (
            <CapBang dataCCCD={dataCCCD} />
          ) : form == 'vaoso' ? (
            <VaoSoGoc />
          ) : form == 'xacnhanin' ? (
            <XacNhanIn dataCCCD={dataCCCD} />
          ) : (
            ''
          )}
        </Popup>
      )}
      <BackToTop />
    </>
  );
}
