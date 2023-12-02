import * as React from 'react';
import { IconCircleCheck, IconFileImport, IconLock, IconLockOpen, IconSearch } from '@tabler/icons';
import { Button, FormControl, Grid, InputLabel, MenuItem, Select, TextField, useMediaQuery } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { openPopupSelector, reloadDataSelector, userLoginSelector } from 'store/selectors';
import { selectedDanhmuc, selectedDonvitruong, selectedHocsinh, setLoading, setOpenPopup, setReloadData } from 'store/actions';
import { useTranslation } from 'react-i18next';
import { createSearchParams } from 'utils/createSearchParams';
import { handleResponseStatus } from 'utils/handleResponseStatus';
import { convertISODateToFormattedDate } from 'utils/formatDate';
import MainCard from 'components/cards/MainCard';
import { getAllDanhmucTN, getTruongCuByTruongMoi } from 'services/sharedService';
import BackToTop from 'components/scroll/BackToTop';
import { getHocSinhBySoGocCuChuaDuyet } from 'services/sogocService';
import { getAllTruong } from 'services/sharedService';
import Popup from 'components/controls/popup';
import FileMau from '../FileMau/FileImportVanBang.xlsx';
import Import from 'views/ImportDanhSachVanBang/Import';
import GroupButtons from 'components/button/GroupButton';
import { DataGrid } from '@mui/x-data-grid';
import CombinedActionButtons from 'components/button/CombinedActionButtons';
import i18n from 'i18n';
import useLocalText from 'utils/localText';
import EditHocSinh from 'views/hocsinh/Edit';
import Detail from 'views/hocsinh/Detail';
import ButtonSuccess from 'components/buttoncolor/ButtonSuccess';
import Khoa from './Khoa';
import MoKhoa from './MoKhoa';
import Duyet from './Duyet';
import ActionButtons from 'components/button/ActionButtons';

export default function SoGocCu() {
  const language = i18n.language;
  const localeText = useLocalText();
  const isXs = useMediaQuery('(max-width:600px)');
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [search, setSearch] = useState(false);
  const reloadData = useSelector(reloadDataSelector);
  const [dMTN, setDMTN] = useState([]);
  const [donvis, setDonvis] = useState([]);
  const [donviOld, setDonviOld] = useState([]);
  const [disable, setDisable] = useState(false);
  const user = useSelector(userLoginSelector);
  const [title, setTitle] = useState('');
  const [form, setForm] = useState('');
  const [khoa, setKhoa] = useState(null);
  const [tinhTrang, setTinhTrang] = useState('');
  const openPopup = useSelector(openPopupSelector);

  const [pageState, setPageState] = useState({
    isLoading: false,
    data: [],
    total: 0,
    order: 1,
    orderDir: 'ASC',
    startIndex: 0,
    pageSize: 10,
    DMTN: '',
    donVi: '',
    donViOld: '',
    hoTen: '',
    soVaoSoGoc: ''
  });

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
      minWidth: 180
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
            {khoa ? (
              <ActionButtons type="detail" handleGetbyId={handleDetail} params={params.row} />
            ) : (
              <CombinedActionButtons params={params.row} buttonConfigurations={buttonConfigurations} />
            )}
          </Grid>
        </>
      )
    }
  ];

  const handleSearch = () => {
    setSearch(!search);
    const danhmucSelect = pageState.DMTN;
    const selectedDanhmucInfo = dMTN.find((dmtn) => dmtn.id === danhmucSelect);
    dispatch(selectedDanhmuc(selectedDanhmucInfo));
    const donviSelect = pageState.donVi;
    const selectedDonviInfo = donvis.find((donvi) => donvi.id === donviSelect);
    dispatch(selectedDonvitruong(selectedDonviInfo));
  };

  const handleKhoa = () => {
    setTitle(t('Khóa'));
    setForm('khoa');
    dispatch(setOpenPopup(true));
  };

  const handleMoKhoa = () => {
    setTitle(t('Mỏ khóa'));
    setForm('mokhoa');
    dispatch(setOpenPopup(true));
  };

  const handleDuyet = () => {
    setTitle(t('Duyệt'));
    setForm('duyet');
    dispatch(setOpenPopup(true));
  };

  const handleDowloadTemplate = async () => {
    window.location.href = FileMau;
  };

  useEffect(() => {
    const fetchDataDL = async () => {
      dispatch(setLoading(true));
      const danhmuc = await getAllDanhmucTN(user ? user.username : '');
      if (danhmuc?.data?.length > 0) {
        setDMTN(danhmuc.data);
        setDisable(false);
      } else {
        setDMTN([]);
        setPageState((old) => ({ ...old, DMTN: '' }));
        setDisable(true);
      }
      const donvi = await getAllTruong(user.username);
      if (donvi?.data?.length > 0) {
        setDonvis(donvi.data);
        setDisable(false);
      } else {
        setDonvis([]);
        setPageState((old) => ({ ...old, donVi: '' }));
        setDisable(true);
      }
    };
    fetchDataDL();
    dispatch(setLoading(false));
  }, []);

  useEffect(() => {
    const fetchDataDL = async () => {
      dispatch(setLoading(true));
      const response = await getTruongCuByTruongMoi(pageState.donVi);
      if (response?.data?.length > 0) {
        setDonviOld(response.data);
      } else {
        setDonviOld([]);
      }
      dispatch(setLoading(false));
    };
    if (pageState.donVi != '') {
      fetchDataDL();
    }
  }, [pageState.donVi]);

  const handleImport = () => {
    setTitle(t('Import sổ gốc cũ'));
    setForm('import');
    dispatch(setOpenPopup(true));
  };

  useEffect(() => {
    const fetchData = async () => {
      setPageState((old) => ({ ...old, isLoading: true }));
      const params = await createSearchParams(pageState);
      params.append('IdDanhMucTotNghiep', pageState.DMTN);
      params.append('IdTruong', pageState.donVi);
      params.append('IdTruongCu', pageState.donViOld || '');
      params.append('HoTen', pageState.hoTen);
      params.append('SoVaoSoGoc', pageState.soVaoSoGoc);
      params.append('NguoiThucHien', user.username);
      const response = await getHocSinhBySoGocCuChuaDuyet(params);
      const check = handleResponseStatus(response, navigate);
      if (check) {
        const data = await response.data;
        setKhoa(data?.khoa || null);
        setTinhTrang(data?.tinhTrang || '');
        if (data?.hocSinhs?.length > 0) {
          const dataWithIds = data.hocSinhs.map((row, index) => ({
            idx: pageState.startIndex * pageState.pageSize + index + 1,
            gioiTinh_fm: row.gioiTinh ? t('gender.male') : t('gender.female'),
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
    fetchData();
  }, [pageState.search, pageState.order, pageState.orderDir, pageState.startIndex, pageState.pageSize, reloadData, search]);

  const handleDanhMucChange = (event) => {
    const selectedValue = event.target.value;
    setPageState((old) => ({ ...old, DMTN: selectedValue }));
  };

  const handleSchoolChange = (event) => {
    const selectedValue = event.target.value;
    setPageState((old) => ({ ...old, donVi: selectedValue, donViOld: '' }));
  };

  const handleOldSchoolChange = (event) => {
    const selectedValue = event.target.value;
    setPageState((old) => ({ ...old, donViOld: selectedValue }));
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
        title={t('Sổ gốc cũ')}
        secondary={
          <Grid item>
            <GroupButtons buttonConfigurations={themTuTep} themtep icon={IconFileImport} title={t('button.import')} />
          </Grid>
        }
      >
        <Grid item container spacing={1} justifyContent={'center'}>
          <Grid item xs={isXs ? 12 : 3}>
            <FormControl fullWidth variant="outlined" size="small">
              <InputLabel>{t('danhmuc.title')}</InputLabel>
              <Select name="id" value={pageState.DMTN} onChange={handleDanhMucChange} label={t('danhmuc.title')}>
                {dMTN?.length > 0 ? (
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
          <Grid item xs={isXs ? 12 : 3}>
            <FormControl fullWidth variant="outlined" size="small">
              <InputLabel>{t('donvitruong.title')}</InputLabel>
              <Select name="truongId" value={pageState.donVi} onChange={handleSchoolChange} label={t('donvitruong.title')}>
                {donvis?.length > 0 ? (
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
          {donviOld?.length > 0 ? (
            <>
              <Grid item xs={isXs ? 12 : 3}>
                <FormControl fullWidth variant="outlined" size="small">
                  <InputLabel>{t('Đơn vị trường cũ')}</InputLabel>
                  <Select name="truongId" value={pageState.donViOld} onChange={handleOldSchoolChange} label={t('Đơn vị trường cũ')}>
                    {donviOld?.length > 0 ? (
                      donviOld.map((donvi) => (
                        <MenuItem key={donvi.idTruongCu} value={donvi.idTruongCu}>
                          {donvi.tenTruongCu}
                        </MenuItem>
                      ))
                    ) : (
                      <MenuItem value="">No data available</MenuItem>
                    )}
                  </Select>
                </FormControl>
              </Grid>
            </>
          ) : (
            ''
          )}
          <Grid item xs={isXs ? 12 : 3}>
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
          <Grid item xs={isXs ? 12 : 2}>
            <TextField
              fullWidth
              id="outlined-basic"
              label={t('Số vào sổ gốc')}
              variant="outlined"
              size="small"
              onChange={(e) => setPageState((old) => ({ ...old, soVaoSoGoc: e.target.value }))}
              value={pageState.soVaoSoGoc}
            />
          </Grid>
          <Grid item container spacing={1} mt={0} mb={2} justifyContent={'center'}>
            <Grid item>
              <Button
                variant="contained"
                title={t('button.search')}
                fullWidth
                onClick={handleSearch}
                color="info"
                startIcon={<IconSearch />}
                disabled={disable}
              >
                {t('button.search')}
              </Button>
            </Grid>
            {pageState.DMTN && pageState.donVi && khoa === false ? (
              <Grid item>
                <Button
                  variant="contained"
                  title={t('Khóa')}
                  fullWidth
                  onClick={handleKhoa}
                  color="error"
                  startIcon={<IconLock />}
                  disabled={disable}
                >
                  {t('Khóa')}
                </Button>
              </Grid>
            ) : (
              ''
            )}
            {/* Sổ đã khóa, tình trạng chưa duyệt thì hiển thị các button */}
            {pageState.DMTN && pageState.donVi && khoa && tinhTrang === -1 ? (
              <>
                <Grid item>
                  <Button
                    variant="contained"
                    title={t('Mở khóa')}
                    fullWidth
                    onClick={handleMoKhoa}
                    color="info"
                    startIcon={<IconLockOpen />}
                    disabled={disable}
                  >
                    {t('Mở khóa')}
                  </Button>
                </Grid>
                <Grid item>
                  <ButtonSuccess title={t('Duyệt')} onClick={handleDuyet} icon={IconCircleCheck} />
                </Grid>
              </>
            ) : (
              ''
            )}
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
        />
      </MainCard>
      {form !== '' && (
        <Popup
          title={title}
          form={form}
          openPopup={openPopup}
          maxWidth={form === 'khoa' || form === 'mokhoa' || form === 'duyet' ? 'sm' : 'md'}
          bgcolor={form === 'delete' || form === 'khoa' ? '#F44336' : '#2196F3'}
        >
          {form === 'detail' ? (
            <Detail />
          ) : form === 'import' ? (
            <Import />
          ) : form === 'khoa' ? (
            <Khoa donviOld={pageState.donViOld || ''} />
          ) : form === 'mokhoa' ? (
            <MoKhoa donviOld={pageState.donViOld || ''} />
          ) : form === 'duyet' ? (
            <Duyet donviOld={pageState.donViOld || ''} />
          ) : form === 'edit' ? (
            <EditHocSinh />
          ) : (
            ''
          )}
        </Popup>
      )}
      <BackToTop />
    </>
  );
}
