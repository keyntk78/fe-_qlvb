import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { IconSearch } from '@tabler/icons';
import { Button, Chip, FormControl, Grid, InputLabel, MenuItem, Select, TextField, Typography, useMediaQuery } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { donviSelector, openPopupSelector, reloadDataSelector, selectedInfoMessageSelector, userLoginSelector } from 'store/selectors';
import { selectedDanhmuc, selectedHocsinh, setOpenPopup, setReloadData, setSelectedInfoMessage } from 'store/actions';
import { useTranslation } from 'react-i18next';
import { createSearchParams } from 'utils/createSearchParams';
import { handleResponseStatus } from 'utils/handleResponseStatus';
import useLocalText from 'utils/localText';
import i18n from 'i18n';
import { convertISODateToFormattedDate } from 'utils/formatDate';
import DetailPhatBang from 'views/capphatbang/Detail';
import Detail from 'views/hocsinhtotnghiep/Detail';
import MainCard from 'components/cards/MainCard';
import CombinedActionButtons from 'components/button/CombinedActionButtons';
import BackToTop from 'components/scroll/BackToTop';
import Popup from 'components/controls/popup';
import { getAllNamthi } from 'services/namthiService';
import { getAllHinhthucdaotao } from 'services/hinhthucdaotaoService';
import PhatBang from './PhatBang';
import { getSearchHocSinhCapPhatBang } from 'services/capphatbangService';
import ActionButtons from 'components/button/ActionButtons';
import { getByIdNamThi } from 'services/sharedService';
import { GetTruongHasPermision } from 'services/danhmuctotnghiepService';

const trangThaiOptions = [
  // { value: '1', label: 'Chưa duyệt' },
  { value: '5', label: 'Chưa phát' },
  { value: '6', label: 'Đã phát' }
];

export default function CapPhatBang() {
  const isXs = useMediaQuery('(max-width:800px)');
  const openPopup = useSelector(openPopupSelector);
  const language = i18n.language;
  const { t } = useTranslation();
  const [title, setTitle] = useState('');
  const [form, setForm] = useState('');
  const [dMTN, setDMTN] = useState([]);
  const [namHoc, setNamHoc] = useState([]);
  const [htdt, setHTDT] = useState([]);
  const [donvis, setDonvis] = useState([]);
  const [search, setSearch] = useState(false);
  const [firstLoad, setFirstLoad] = useState(true);
  const [firstLoad1, setFirstLoad1] = useState(true);
  const reloadData = useSelector(reloadDataSelector);
  const [selectDanhmuc, setSelectDanhmuc] = useState('');
  const [selectNamHoc, setSelectNamHoc] = useState('');
  const [selectHTDT, setSelectHTDT] = useState('');
  const dispatch = useDispatch();
  const localeText = useLocalText();
  const navigate = useNavigate();
  const [daCapCount, setDaCapCount] = useState(0);
  const [chuaCapCount, setChuaCapCount] = useState(0);
  const donvi = useSelector(donviSelector);
  const user = useSelector(userLoginSelector);
  const infoMessage = useSelector(selectedInfoMessageSelector);
  const [loadData, setLoadData] = useState(false);
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
    soVaoSoCapBang: '',
    DMTN: '',
    donvi: '',
    trangThai: '',
    namHoc: '',
    hinhThucDaoDao: ''
  });

  const handleSearch = () => {
    setSearch(!search);
    const danhmucSelect = pageState.DMTN;
    const selectedDanhmucInfo = dMTN.find((dmtn) => dmtn.id === danhmucSelect);
    setSelectDanhmuc(pageState.DMTN);
    dispatch(selectedDanhmuc(selectedDanhmucInfo));
  };

  const handleDetail = (hocsinh) => {
    setTitle(t('hocsinh.title.info'));
    setForm('detail');
    dispatch(selectedHocsinh(hocsinh));
    dispatch(setOpenPopup(true));
  };

  const handleDetailPhatBang = (hocsinh) => {
    setTitle(t('hocsinh.title.info'));
    setForm('detailPhatBang');
    dispatch(selectedHocsinh(hocsinh));
    dispatch(setOpenPopup(true));
  };

  const handlePhatBang = (hocsinh) => {
    setTitle(t('Phát bằng'));
    setForm('phatbang');
    dispatch(selectedHocsinh(hocsinh));
    dispatch(setOpenPopup(true));
  };

  const buttonConfigurations = [
    {
      type: 'detail',
      handleGetbyId: handleDetail
    },
    {
      type: 'phatbang',
      handleClick: handlePhatBang
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
                color={params.row.trangThai_fm === 'Chưa phát' ? 'info' : 'success'}
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
      minWidth: 80,
      flex: 1
    },
    {
      field: 'ngaySinh_fm',
      headerName: t('hocsinh.field.bdate'),
      minWidth: 100,
      flex: 1.3
    },
    {
      field: 'soHieuVanBang',
      headerName: t('hocsinh.field.soHieu'),
      minWidth: 130,
      flex: 1.5
    },
    {
      field: 'soVaoSoCapBang',
      headerName: t('hocsinh.field.soCapBang'),
      minWidth: 130,
      flex: 2
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
            {params.row.trangThai == 6 ? (
              <ActionButtons type="detail" handleGetbyId={handleDetailPhatBang} params={params.row} />
            ) : (
              <CombinedActionButtons params={params.row} buttonConfigurations={buttonConfigurations} />
            )}
          </Grid>
        </>
      )
    }
  ];

  useEffect(() => {
    const fetchDataDL = async () => {
      const namhoc = await getAllNamthi();
      setNamHoc(namhoc.data);
      const htdtdata = await getAllHinhthucdaotao();
      setHTDT(htdtdata.data);
    };
    fetchDataDL();
  }, []);

  useEffect(() => {
    const fetchDataDL = async () => {
      const params = new URLSearchParams();
      params.append('pageSize', -1);
      const donvi = await GetTruongHasPermision(selectDanhmuc, params);
      setDonvis(donvi?.data?.truongs || []);
    };
    if (donvi.laPhong && selectDanhmuc) {
      fetchDataDL();
    }
  }, [donvi, selectDanhmuc]);

  useEffect(() => {
    if (namHoc.length > 0 && htdt.length > 0 && infoMessage) {
      const fetchData = async () => {
        try {
          setPageState((old) => ({
            ...old,
            namHoc: infoMessage.IdNamThi,
            hinhThucDaoDao: infoMessage.MaHinhThucDaoTao,
            trangThai: infoMessage.TrangThai
          }));
          setSelectNamHoc(infoMessage.IdNamThi);
          setSelectHTDT(infoMessage.MaHinhThucDaoTao);
          const danhmuc = await getByIdNamThi(infoMessage.IdNamThi, infoMessage.MaHinhThucDaoTao, user.username);
          if (danhmuc.data && danhmuc.data.length > 0) {
            setDMTN(danhmuc.data);
            setPageState((old) => ({
              ...old,
              DMTN: infoMessage.IdDanhMucTotNghiep
            }));
          } else {
            setDMTN([]);
            setPageState((old) => ({ ...old, DMTN: '' }));
          }
          setLoadData(true);
        } catch (error) {
          console.error(error);
        }
      };
      fetchData();
    }
  }, [infoMessage, namHoc, htdt]);

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
      params.append('soVaoSoCapBang', pageState.soVaoSoCapBang);
      params.append('idDanhMucTotNghiep', pageState.DMTN);
      params.append('idTruong', !donvi.laPhong ? donvi.id : pageState.donvi);
      params.append('trangThai', pageState.trangThai || '');
      const response = await getSearchHocSinhCapPhatBang(params);
      const check = handleResponseStatus(response, navigate);
      if (check) {
        const data = await response.data;
        const dataWithIds = data.hocSinhs.map((row, index) => ({
          idx: pageState.startIndex * pageState.pageSize + index + 1,
          soHieuVanBang: row.soHieuVanBang ? row.soHieuVanBang : 'Chưa cấp',
          soVaoSoCapBang: row.soVaoSoCapBang || 'Chưa cấp',
          gioiTinh_fm: row.gioiTinh ? t('gender.male') : t('gender.female'),
          trangThai_fm: row.trangThai == 5 ? t('Chưa phát') : row.trangThai == 6 ? t('Đã phát') : '',
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
        dispatch(setSelectedInfoMessage(''));
      } else {
        fetchData();
      }
    } else {
      setFirstLoad(false);
    }
  }, [pageState.search, pageState.order, pageState.orderDir, pageState.startIndex, pageState.pageSize, reloadData, search, loadData]);

  const handleNamHocChange = (event) => {
    const selectedValue = event.target.value;
    const namHoc = selectedValue === 'all' ? '' : selectedValue;
    setSelectNamHoc(namHoc);
  };

  const handleHTDTChange = (event) => {
    const selectedValue = event.target.value;
    const htdt = selectedValue === 'all' ? '' : selectedValue;
    setSelectHTDT(htdt);
  };

  const handleDanhMucChange = (event) => {
    const selectedValue = event.target.value;
    const danhMuc = selectedValue === 'all' ? '' : selectedValue;
    setPageState((old) => ({ ...old, DMTN: danhMuc }));
    setSelectDanhmuc(selectedValue);
  };

  const handleDonViChange = (event) => {
    const selectedValue = event.target.value;
    const donvi = selectedValue === 'all' ? '' : selectedValue;
    setPageState((old) => ({ ...old, donvi: donvi }));
  };

  const handleTrangThaiChange = (event) => {
    const selectedValue = event.target.value;
    const trangthai = selectedValue === 'all' ? '' : selectedValue;
    setPageState((old) => ({ ...old, trangThai: trangthai }));
  };

  useEffect(() => {
    const fetchDataDL = async () => {
      const updatedPageState = { ...pageState, pageSize: -1 };
      const params = await createSearchParams(updatedPageState);
      params.append('idDanhMucTotNghiep', selectDanhmuc);
      params.append('idTruong', !donvi.laPhong ? donvi.id : pageState.donvi);
      const response = await getSearchHocSinhCapPhatBang(params);
      const hocSinhs = response.data.hocSinhs;
      let chuaCapCount = 0;
      let daCapCount = 0;

      hocSinhs.forEach((hocSinh) => {
        if (hocSinh.trangThai === 5) {
          chuaCapCount += 1;
        } else if (hocSinh.trangThai === 6) {
          daCapCount += 1;
        }
      });

      setChuaCapCount(chuaCapCount);
      setDaCapCount(daCapCount);
    };

    if (!firstLoad1 || loadData) {
      fetchDataDL();
    } else {
      setFirstLoad1(false);
    }
  }, [reloadData, search, loadData]);

  return (
    <>
      <MainCard title={t('Cấp phát bằng')}>
        <Grid item container mb={1} spacing={1} justifyContent={'center'}>
          <Grid item lg={1.5} md={2} sm={2} xs={isXs ? 5 : 2}>
            <FormControl fullWidth variant="outlined" size="small">
              <InputLabel>{t('namhoc')}</InputLabel>
              <Select name="namhoc" value={selectNamHoc || 'all'} onChange={handleNamHocChange} label={t('Năm học')}>
                <MenuItem value="all">Tất cả</MenuItem>
                {namHoc && namHoc.length > 0 ? (
                  namHoc.map((data) => (
                    <MenuItem key={data.id} value={data.id}>
                      {data.ten}
                    </MenuItem>
                  ))
                ) : (
                  <MenuItem value="nodata">Không có dữ liệu</MenuItem>
                )}
              </Select>
            </FormControl>
          </Grid>
          <Grid item lg={2} md={3} sm={3} xs={isXs ? 7 : 2}>
            <FormControl fullWidth variant="outlined" size="small">
              <InputLabel>{t('hinhthucdaotao.title')}</InputLabel>
              <Select name="htdt" value={selectHTDT || 'all'} onChange={handleHTDTChange} label={t('Hình thức đào tạo')}>
                <MenuItem value="all">Tất cả</MenuItem>
                {htdt && htdt.length > 0 ? (
                  htdt.map((data) => (
                    <MenuItem key={data.ma} value={data.ma}>
                      {data.ten}
                    </MenuItem>
                  ))
                ) : (
                  <MenuItem value="nodata">Không có dữ liệu</MenuItem>
                )}
              </Select>
            </FormControl>
          </Grid>
          <Grid item lg={3.5} md={5} sm={5} xs={isXs ? 8 : 4}>
            <FormControl fullWidth variant="outlined" size="small">
              <InputLabel>{t('danhmuc.title')}</InputLabel>
              <Select name="id" value={pageState.DMTN || 'all'} onChange={handleDanhMucChange} label={t('danhmuc.title')}>
                <MenuItem value="all">Tất cả</MenuItem>
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
          {donvi?.laPhong && (
            <>
              <Grid item lg={3.5} md={5} sm={5} xs={isXs ? 8 : 4}>
                <FormControl fullWidth variant="outlined" size="small">
                  <InputLabel>{t('donvitruong.title')}</InputLabel>
                  <Select name="id" value={pageState.donvi || 'all'} onChange={handleDonViChange} label={t('donvitruong.title')}>
                    <MenuItem value="all">Tất cả</MenuItem>
                    {donvis && donvis.length > 0 ? (
                      donvis.map((data) => (
                        <MenuItem key={data.idTruong} value={data.idTruong}>
                          {data.tenTruong}
                        </MenuItem>
                      ))
                    ) : (
                      <MenuItem value="nodata">Không có dữ liệu</MenuItem>
                    )}
                  </Select>
                </FormControl>
              </Grid>
            </>
          )}
          <Grid item lg={1.5} md={2} sm={2} xs={isXs ? 4 : 2}>
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
          <Grid item container spacing={1} justifyContent={'center'} alignItems="center">
            <Grid item lg={4} md={5} sm={5} xs={isXs ? 12 : 4}>
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
            <Grid item lg={2.5} md={2.5} sm={2.5} xs={isXs ? 6 : 2}>
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
            <Grid item lg={2.5} md={2.5} sm={2.5} xs={isXs ? 6 : 2}>
              <TextField
                fullWidth
                id="outlined-basic"
                label={t('hocsinh.field.soVaoSo')}
                variant="outlined"
                size="small"
                onChange={(e) => setPageState((old) => ({ ...old, soVaoSoCapBang: e.target.value }))}
                value={pageState.soVaoSoCapBang}
              />
            </Grid>
            <Grid item xs={6} md={2} sm={2} lg={2}>
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
        <Grid item container spacing={1} mt={1} mb={1}>
          <Grid item xs={6} md={4} lg={3}>
            <Typography variant="h5">
              {t('soluongbang.chuaphat')} {chuaCapCount}
            </Typography>
          </Grid>
          <Grid item xs={6} md={4} lg={3}>
            <Typography variant="h5">
              {t('soluongbang.daphat')} {daCapCount}
            </Typography>
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
        <Popup title={title} form={form} openPopup={openPopup} maxWidth={'md'} bgcolor={form === 'delete' ? '#F44336' : '#2196F3'}>
          {form === 'detail' ? (
            <Detail type={'truong'} />
          ) : form === 'detailPhatBang' ? (
            <DetailPhatBang />
          ) : form === 'phatbang' ? (
            <PhatBang />
          ) : (
            ''
          )}
        </Popup>
      )}
      <BackToTop />
    </>
  );
}
