import { DataGrid } from '@mui/x-data-grid';
import Add from './Add';
import Edit from './Edit';
import Delete from './Delete';
import Destroy from './Destroy';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setOpenPopup, setReloadData, selectedPhoigoc } from 'store/actions';
import { openPopupSelector, reloadDataSelector } from 'store/selectors';
import { getSearchPhoigoc } from 'services/phoigocService';
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
import Detail from './Detail';
import { Button, Chip, FormControl, Grid, InputLabel, MenuItem, Select } from '@mui/material';
import ActivePhoiGoc from './Active';
import { IconDownload, IconSearch } from '@tabler/icons';
import config from 'config';
import RecoverPhoiGoc from './DeActive';
import QuickSearch from 'components/form/QuickSearch';
import PhoiCaBiet from './PhoiCaBiet';

const Phoigoc = () => {
  const { t } = useTranslation();
  const language = i18n.language;
  const localeText = useLocalText();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const openPopup = useSelector(openPopupSelector);
  const [title, setTitle] = useState('');
  const [form, setForm] = useState('');
  const [search, setSearch] = useState(false);
  const [isAccess, setIsAccess] = useState(true);
  const reloadData = useSelector(reloadDataSelector);
  const [quickSearch, setQuickSearch] = useState(false);

  const tinhTrangOptions = [
    { value: '-1', label: 'Chưa hoạt động' },
    { value: '0', label: 'Hoạt động' },
    { value: '1', label: 'Đã hủy' }
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
    setTitle(t('phoivanbang.title.addgoc'));
    setForm('add');
    dispatch(setOpenPopup(true));
  };
  const handleConfig = (phoigoc) => {
    setTitle(t('cauhinhphoivanbang.title'));
    setForm('config');
    dispatch(selectedPhoigoc(phoigoc));
    dispatch(setOpenPopup(true));
  };
  const handleEditPhoi = (phoigoc) => {
    setTitle(t('phoivanbang.title.editgoc'));
    setForm('edit');
    dispatch(selectedPhoigoc(phoigoc));
    dispatch(setOpenPopup(true));
  };
  const handlePhoiCaBiet = (phoigoc) => {
    setTitle(t('Phôi cá biệt'));
    setForm('phoicabiet');
    dispatch(selectedPhoigoc(phoigoc));
    dispatch(setOpenPopup(true));
  };
  const handleDetailPhoi = (phoigoc) => {
    setTitle(t('Xem chi tiết'));
    setForm('detail');
    dispatch(selectedPhoigoc(phoigoc));
    dispatch(setOpenPopup(true));
  };

  const handleDestroy = (phoigoc) => {
    setTitle(t('phoivanbang.title.destroygoc'));
    setForm('huyphoi');
    dispatch(selectedPhoigoc(phoigoc));
    dispatch(setOpenPopup(true));
  };

  const handleDeletePhoi = (phoigoc) => {
    setTitle(t('phoivanbang.title.deletegoc'));
    setForm('delete');
    dispatch(selectedPhoigoc(phoigoc));
    dispatch(setOpenPopup(true));
  };
  const handleKichHoat = (phoigoc) => {
    setTitle(t('Kích hoạt phôi'));
    setForm('active');
    dispatch(selectedPhoigoc(phoigoc));
    dispatch(setOpenPopup(true));
  };
  const handlePhucHoi = (phoigoc) => {
    setTitle(t('Phục hồi phôi'));
    setForm('recover');
    dispatch(selectedPhoigoc(phoigoc));
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
    {
      type: 'huyphoi',
      handleClick: handleDestroy
    },
    {
      type: 'delete',
      handleDelete: handleDeletePhoi
    }
  ];

  const buttonConfigurations_NotBB = [
    {
      type: 'detail',
      handleGetbyId: handleDetailPhoi
    },
    {
      type: 'recover',
      handleActive: handlePhucHoi
    },
    {
      type: 'phoicabiet',
      handleClick: handlePhoiCaBiet
    },
    {
      type: 'delete',
      handleDelete: handleDeletePhoi
    }
  ];
  const buttonConfigurations_BB = [
    {
      type: 'detail',
      handleGetbyId: handleDetailPhoi
    },
    {
      type: 'phoicabiet',
      handleClick: handlePhoiCaBiet
    },
    {
      type: 'delete',
      handleDelete: handleDeletePhoi
    }
  ];
  const buttonConfigurations2 = [
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
    {
      type: 'huyphoi',
      handleClick: handleDestroy
    },
    {
      type: 'delete',
      handleDelete: handleDeletePhoi
    }
  ];

  const buttonConfigurations3 = [
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
      type: 'active',
      handleActive: handleKichHoat
    },
    {
      type: 'phoicabiet',
      handleClick: handlePhoiCaBiet
    },
    {
      type: 'huyphoi',
      handleClick: handleDestroy
    },
    {
      type: 'delete',
      handleDelete: handleDeletePhoi
    }
  ];
  const buttonConfigurations4 = [
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
      type: 'phoicabiet',
      handleClick: handlePhoiCaBiet
    },
    {
      type: 'huyphoi',
      handleClick: handleDestroy
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
      minWidth: 100
    },
    {
      flex: 1,
      field: 'NgayMua',
      headerName: t('Ngày mua'),
      minWidth: 100
    },
    {
      field: 'tinhTrang',
      headerName: t('phoivanbang.field.tinhtrang'),
      minWidth: 120,
      renderCell: (params) => (
        <Grid container>
          <Grid item xs={12} mt={0.2}>
            <div style={{ width: '200%' }}>
              <Chip
                // variant='outlined'
                size="small"
                label={params.row.tinhTrang === 0 ? 'Hoạt động' : params.row.tinhTrang === -1 ? 'Chưa hoạt động' : 'Đã hủy phôi'}
                color={params.row.tinhTrang === 0 ? 'success' : params.row.tinhTrang === -1 ? 'primary' : 'error'}
              />
            </div>
          </Grid>
        </Grid>
      )
    },
    {
      flex: 0.1,
      field: 'FileBienBanHuyBo',
      headerName: t('BB Hủy Bỏ'),
      minWidth: 100,
      align: 'center',
      renderCell: (params) => {
        const pathFileYeuCau = config.urlImages + params.row.bienBanHuyPhoi.fileBienBanHuyPhoi;
        return (
          <a href={pathFileYeuCau} download title="Tải xuống">
            {params.row.bienBanHuyPhoi.fileBienBanHuyPhoi ? <IconDownload /> : ''}
          </a>
        );
      }
    },
    {
      field: 'actions',
      headerName: t('action'),
      width: 90,
      sortable: false,
      filterable: false,
      renderCell: (params) =>
        params.row.tinhTrang == 1 ? (
          params.row.bienBanHuyPhoi.fileBienBanHuyPhoi ? (
            <>
              <Grid container justifyContent="center">
                <CombinedActionButtons params={params.row} buttonConfigurations={buttonConfigurations_BB} />
              </Grid>
            </>
          ) : (
            <>
              <Grid container justifyContent="center">
                <CombinedActionButtons params={params.row} buttonConfigurations={buttonConfigurations_NotBB} />
              </Grid>
            </>
          )
        ) : params.row.tinhTrang == 0 ? (
          params.row.tuDongKhoa ? (
            <>
              <Grid container justifyContent="center">
                <CombinedActionButtons params={params.row} buttonConfigurations={buttonConfigurations2} />
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
              <CombinedActionButtons params={params.row} buttonConfigurations={buttonConfigurations4} />
            </Grid>
          </>
        ) : (
          <>
            <Grid container justifyContent="center">
              <CombinedActionButtons params={params.row} buttonConfigurations={buttonConfigurations3} />
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
      const response = await getSearchPhoigoc(params);
      const check = handleResponseStatus(response, navigate);
      if (check) {
        const data = await response.data;
        const dataWithIds = data.phoiGocs.map((row, index) => ({
          id: index + 1,
          idx: pageState.startIndex * pageState.pageSize + index + 1,
          NgayMua: convertISODateToFormattedDate(row.ngayMua),
          SoKetThuc: row.soHieuPhoi + (+row.soBatDau + row.soLuongPhoi + row.soLuongPhoiDaSuDung),
          SoBatDau: row.soHieuPhoi + row.soBatDau,
          FileBienBanHuyBo: row.bienBanHuyPhoi.fileBienBanHuyPhoi,
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
      <MainCard title={t('phoivanbang.title.bangoc')} secondary={<AddButton handleClick={handleAddPhoi} />}>
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
              form === 'add' || form === 'edit' || form === 'detail' || form === 'huyphoi'
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
              <Destroy />
            ) : form === 'config' ? (
              <Config />
            ) : form === 'detail' ? (
              <Detail />
            ) : form === 'active' ? (
              <ActivePhoiGoc />
            ) : form === 'recover' ? (
              <RecoverPhoiGoc />
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

export default Phoigoc;
