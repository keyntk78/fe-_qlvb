import { DataGrid } from '@mui/x-data-grid';
import Add from './Add';
import Edit from './Edit';
import Delete from './Delete';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setOpenPopup, setReloadData, selectedPhoisao } from 'store/actions';
import { openPopupSelector, reloadDataSelector } from 'store/selectors';
import { getSearchPhoisao } from 'services/phoisaoService';
import { useNavigate } from 'react-router-dom';
import { handleResponseStatus } from 'utils/handleResponseStatus';
import { useTranslation } from 'react-i18next';
import useLocalText from 'utils/localText';
import { createSearchParams } from 'utils/createSearchParams';
import Popup from 'components/controls/popup';
import CombinedActionButtons from 'components/button/CombinedActionButtons';
import i18n from 'i18n';
import AddButton from 'components/button/AddButton';
// import { Grid } from '@mui/material';
import { convertISODateToFormattedDate } from 'utils/formatDate';
import MainCard from 'components/cards/MainCard';
import Config from './Config';
import DestroyPhoi from './Destroy';
import Detail from './Detail';
import { Button, Chip, FormControl, Grid, InputLabel, MenuItem, Select } from '@mui/material';
import QuickSearch from 'components/form/QuickSearch';
import ActivePhoiSao from './Active';
import { IconSearch } from '@tabler/icons';
import PhoiCaBiet from './PhoiCaBiet';

const PhoiBanSao = () => {
  const { t } = useTranslation();
  const language = i18n.language;
  const localeText = useLocalText();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const openPopup = useSelector(openPopupSelector);
  const [title, setTitle] = useState('');
  const [form, setForm] = useState('');
  const [isAccess, setIsAccess] = useState(true);
  const [search, setSearch] = useState(false);
  const [quickSearch, setQuickSearch] = useState(false);
  const reloadData = useSelector(reloadDataSelector);
  const tinhTrangOptions = [
    { value: '-1', label: 'Chưa hoạt động' },
    { value: '0', label: 'Hoạt động' }
  ];
  const [pageState, setPageState] = useState({
    isLoading: false,
    data: [],
    total: 0,
    order: 0,
    orderDir: 'ASC',
    startIndex: 0,
    pageSize: 10,
    TinhTrang: ''
  });

  const handleAddPhoi = () => {
    setTitle(t('phoivanbang.title.addsao'));
    setForm('add');
    dispatch(setOpenPopup(true));
  };
  // const handleDestroy = (phoisao) => {
  //   setTitle(t('phoivanbang.title.destroysao'));
  //   setForm('huyphoi');
  //   dispatch(selectedPhoisao(phoisao));
  //   dispatch(setOpenPopup(true));
  // };
  const handleConfig = (phoisao) => {
    setTitle(t('cauhinhphoivanbang.title'));
    setForm('config');
    dispatch(selectedPhoisao(phoisao));
    dispatch(setOpenPopup(true));
  };
  const handleEditPhoi = (phoisao) => {
    setTitle(t('phoivanbang.title.editsao'));
    setForm('edit');
    dispatch(selectedPhoisao(phoisao));
    dispatch(setOpenPopup(true));
  };
  const handleDetailPhoi = (phoisao) => {
    setTitle(t('Xem chi tiết'));
    setForm('detail');
    dispatch(selectedPhoisao(phoisao));
    dispatch(setOpenPopup(true));
  };

  const handleDeletePhoi = (phoisao) => {
    setTitle(t('phoivanbang.title.deletesao'));
    setForm('delete');
    dispatch(selectedPhoisao(phoisao));
    dispatch(setOpenPopup(true));
  };

  const handleKichHoat = (phoisao) => {
    setTitle(t('Kích hoạt phôi'));
    setForm('active');
    dispatch(selectedPhoisao(phoisao));
    dispatch(setOpenPopup(true));
  };
  const handlePhoiCaBiet = (phoisao) => {
    setTitle(t('Phôi cá biệt'));
    setForm('phoicabiet');
    dispatch(selectedPhoisao(phoisao));
    dispatch(setOpenPopup(true));
  };
  const handleTrangThaiChange = (event) => {
    const selectedValue = event.target.value;
    const trangThai = selectedValue === 'all' ? '' : selectedValue;
    setPageState((old) => ({ ...old, TinhTrang: trangThai }));
  };
  const handleSearch = () => {
    setSearch(!search);
  };
  const buttonConfigurations = [
    {
      type: 'config',
      handleClick: handleConfig
    },
    {
      type: 'detail',
      handleGetbyId: handleDetailPhoi
    },
    {
      type: 'edit',
      handleEdit: handleEditPhoi
    },
    {
      type: 'phoicabiet',
      handleClick: handlePhoiCaBiet
    },
    // {
    //   type: 'huyphoi',
    //   handleClick: handleDestroy
    // },
    {
      type: 'delete',
      handleDelete: handleDeletePhoi
    }
  ];
  const buttonConfigurations_DaKhoa = [
    // {
    //   type: 'config',
    //   handleClick: handleConfig
    // },
    {
      type: 'detail',
      handleGetbyId: handleDetailPhoi
    },

    {
      type: 'phoicabiet',
      handleClick: handlePhoiCaBiet
    },
    {
      type: 'edit',
      handleEdit: handleEditPhoi
    },
    // {
    //   type: 'huyphoi',
    //   handleClick: handleDestroy
    // },
    {
      type: 'delete',
      handleDelete: handleDeletePhoi
    }
  ];
  const buttonConfigurations1 = [
    { type: 'config', handleClick: handleConfig },
    {
      type: 'phoicabiet',
      handleClick: handlePhoiCaBiet
    },
    // {
    //   type: 'detail',
    //   handleGetbyId: handleDetailPhoi
    // },
    {
      type: 'detail',
      handleGetbyId: handleDetailPhoi
    },
    {
      type: 'edit',
      handleEdit: handleEditPhoi
    },
    {
      type: 'active',
      handleActive: handleKichHoat
    },
    {
      type: 'delete',
      handleDelete: handleDeletePhoi
    }
  ];
  const buttonConfigurations1_DaKhoa = [
    // { type: 'config', handleClick: handleConfig },
    {
      type: 'detail',
      handleGetbyId: handleDetailPhoi
    },
    {
      type: 'phoicabiet',
      handleClick: handlePhoiCaBiet
    },
    {
      type: 'edit',
      handleEdit: handleEditPhoi
    },
    {
      type: 'active',
      handleActive: handleKichHoat
    },
    {
      type: 'delete',
      handleDelete: handleDeletePhoi
    }
  ];
  const columns = [
    {
      field: 'idx',
      headerName: t('serial'),
      width: 50,
      sortable: false,
      filterable: false
    },
    {
      flex: 1,
      field: 'tenPhoi',
      headerName: t('phoivanbang.field.tenphoi'),
      minWidth: 130
    },
    {
      flex: 1,
      field: 'SoBatDau',
      headerName: t('Số hiệu bắt đầu'),
      minWidth: 80
    },
    {
      flex: 1,
      field: 'SoKetThuc',
      headerName: t('Số hiệu kết thúc'),
      minWidth: 80
    },
    {
      flex: 1,
      field: 'soLuongPhoi',
      headerName: t('Số Lượng'),
      minWidth: 80
    },
    {
      flex: 1,
      field: 'soLuongPhoiDaSuDung',
      headerName: t('Đã sử dụng'),
      minWidth: 80
    },
    {
      flex: 1,
      field: 'soLuongPhoiCaBiet',
      headerName: t('Đã hủy'),
      minWidth: 80
    },
    {
      flex: 1,
      field: 'NgayMua',
      headerName: t('phoivanbang.field.ngaymua'),
      minWidth: 100
    },
    {
      flex: 1,
      field: 'tinhTrang',
      minWidth: 120,
      headerName: t('phoivanbang.field.tinhtrang'),
      renderCell: (params) => (
        <Grid container>
          <Grid item xs={12} mt={0.2}>
            <div style={{ width: '200%' }}>
              <Chip
                // variant='outlined'
                size="small"
                label={params.row.tinhTrang === 0 ? 'Hoạt động' : 'Chưa hoạt động'}
                color={params.row.tinhTrang === 0 ? 'success' : 'primary'}
              />
            </div>
          </Grid>
        </Grid>
      )
    },
    {
      field: 'actions',
      headerName: t('action'),
      width: 90,
      sortable: false,
      filterable: false,
      renderCell: (params) =>
        params.row.tinhTrang == 0 ? (
          params.row.tuDongKhoa ? (
            <>
              <Grid container justifyContent="center">
                <CombinedActionButtons params={params.row} buttonConfigurations={buttonConfigurations_DaKhoa} />
              </Grid>
            </>
          ) : (
            <>
              <Grid container justifyContent="center">
                <CombinedActionButtons params={params.row} buttonConfigurations={buttonConfigurations} />
              </Grid>
            </>
          )
        ) : params.row.tuDongKhoa ? (
          <>
            <Grid container justifyContent="center">
              <CombinedActionButtons params={params.row} buttonConfigurations={buttonConfigurations1_DaKhoa} />
            </Grid>
          </>
        ) : (
          <>
            <Grid container justifyContent="center">
              <CombinedActionButtons params={params.row} buttonConfigurations={buttonConfigurations1} />
            </Grid>
          </>
        )
    }
  ];
  useEffect(() => {
    const fetchData = async () => {
      setPageState((old) => ({ ...old, isLoading: true }));
      const params = await createSearchParams(pageState, navigate);
      params.append('TinhTrang', pageState.TinhTrang);
      const response = await getSearchPhoisao(params);
      const check = handleResponseStatus(response, navigate);
      if (check) {
        const data = await response.data;
        const dataWithIds = data.phoiGocs.map((row, index) => ({
          id: index + 1,
          idx: pageState.startIndex * pageState.pageSize + index + 1,
          NgayMua: convertISODateToFormattedDate(row.ngayMua),
          SoKetThuc:
            row.soHieuPhoi +
            (+row.soBatDau + row.soLuongPhoi + row.soLuongPhoiDaSuDung + row.soLuongPhoiCaBiet - 1)
              .toString()
              .padStart(row.soBatDau.length, '0'),
          SoBatDau: row.soHieuPhoi + row.soBatDau,
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
    fetchData();
  }, [search, pageState.order, pageState.orderDir, pageState.startIndex, pageState.pageSize, reloadData, quickSearch]);

  return (
    <>
      <MainCard title={t('phoivanbang.title.bansao')} secondary={<AddButton handleClick={handleAddPhoi} />}>
        <Grid container spacing={2} justifyContent={'center'} alignItems={'center'} my={1}>
          <Grid item xs={2.5} minWidth={120}>
            <FormControl fullWidth variant="outlined" size="small">
              <InputLabel>{t('Tình trạng phôi')}</InputLabel>
              <Select name="TinhTrang" value={pageState.TinhTrang || 'all'} onChange={handleTrangThaiChange} label={t('Tình trạng phôi')}>
                <MenuItem value="all">Tất cả</MenuItem>
                {tinhTrangOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item md={4} sm={4} lg={2} xs={6}>
            <Button variant="contained" title={t('button.search')} fullWidth onClick={handleSearch} color="info" startIcon={<IconSearch />}>
              {t('button.search')}
            </Button>
          </Grid>
        </Grid>
        <Grid container justifyContent="flex-end" mb={1} sx={{ marginTop: '-15px' }}>
          <Grid item lg={3} md={4} sm={5} xs={7}>
            <QuickSearch
              value={pageState.search}
              onChange={(value) => setPageState((old) => ({ ...old, search: value }))}
              onSearch={() => setQuickSearch(!quickSearch)}
            />
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
        {form !== '' && (
          <Popup
            title={title}
            form={form}
            openPopup={openPopup}
            maxWidth={
              form === 'add' || form === 'edit' || form === 'huyphoi' || form === 'detail'
                ? 'sm'
                : form === 'config' || form === 'phoicabiet'
                ? 'xl'
                : ''
            }
            bgcolor={form === 'delete' ? '#F44336' : '#2196F3'}
          >
            {form === 'add' ? (
              <Add />
            ) : form === 'edit' ? (
              <Edit />
            ) : form === 'huyphoi' ? (
              <DestroyPhoi />
            ) : form === 'config' ? (
              <Config />
            ) : form === 'detail' ? (
              <Detail />
            ) : form === 'active' ? (
              <ActivePhoiSao />
            ) : form === 'phoicabiet' ? (
              <PhoiCaBiet />
            ) : (
              <Delete />
            )}
          </Popup>
        )}
      </MainCard>
    </>
  );
};

export default PhoiBanSao;
