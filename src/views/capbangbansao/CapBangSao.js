import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { IconSearch } from '@tabler/icons';
import { Button, Chip, FormControl, Grid, InputLabel, MenuItem, Select, TextField, Typography, useMediaQuery } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { openPopupSelector, reloadDataSelector } from 'store/selectors';
import { setCapBangBanSao, setOpenPopup, setReloadData } from 'store/actions';
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
      field: 'HoTen',
      headerName: t('Họ Tên'),
      flex: 1.8,
      minWidth: 180
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
      // console.log();
      // const phoidata = await getPhoiBanSaoDangSuDung(donvi);
      // console.log(phoidata);
      // dispatch(selectedPhoisao(phoidata.data));
      setPageState((old) => ({ ...old, isLoading: true }));
      const params = await createSearchParams(pageState);
      params.append('Ma', pageState.Ma);
      params.append('TrangThai', pageState.trangThai ? pageState.trangThai : 1);
      params.append('CCCD', pageState.cccd);
      params.append('HoTen', pageState.hoTen);
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

  const handleTrangThaiChange = (event) => {
    const selectedValue = event.target.value;
    setPageState((old) => ({ ...old, trangThai: selectedValue }));
  };

  return (
    <>
      <MainCard title={t('Cấp bằng bản sao')}>
        <Grid item container mb={1} spacing={1} justifyContent={'center'}>
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
          <Grid item lg={2} md={6} sm={6} xs={isXs ? 6 : 4}>
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
          maxWidth={form === 'vaoso' ? 'lg' : 'md'}
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
