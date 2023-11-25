import Add from './Add';
import Edit from './Edit';
import Delete from './Delete';
import Detail from './Detail';
import Active from './Active';
// import Quanlyphoi from './Quanlyphoi';
import DeActive from './DeActive';
import useLocalText from 'utils/localText';
import { createSearchParams } from 'utils/createSearchParams';
import i18n from 'i18n';

import React from 'react';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Chip, FormControl, Grid, InputLabel, MenuItem, Select, Typography, Button } from '@mui/material';
import { getAllNamthi } from 'services/namthiService';
const language = i18n.language;
import { useTranslation } from 'react-i18next';
import { setOpenPopup, setReloadData, selectedDanhmuctotnghiep, selectedNamthi } from 'store/actions';
import { reloadDataSelector, openPopupSelector } from 'store/selectors';
import { handleResponseStatus } from 'utils/handleResponseStatus';
import { useNavigate } from 'react-router-dom';
import MainCard from 'components/cards/MainCard';
import { DataGrid } from '@mui/x-data-grid';
import Popup from 'components/controls/popup';
import CombinedActionButtons from 'components/button/CombinedActionButtons';
import AddButton from 'components/button/AddButton';

import { getSearchDanhmucTN } from 'services/danhmuctotnghiepService';
import ActionButtons from 'components/button/ActionButtons';
import BackToTop from 'components/scroll/BackToTop';
import Permission from './Permission';
import ThongBao from './ThongBao';
import QuickSearch from 'components/form/QuickSearch';
import { IconSearch } from '@tabler/icons';

const Danhmuctotnghiep = () => {
  const openPopup = useSelector(openPopupSelector);
  const reloadData = useSelector(reloadDataSelector);
  const localeText = useLocalText();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [title, setTitle] = useState('');
  const [form, setForm] = useState('');
  const { t } = useTranslation();
  const [isAccess, setIsAccess] = useState(true);
  const [search, setSearch] = useState(false);
  const [quickSearch, setQuickSearch] = useState(false);
  const [nam, setNam] = useState('');
  const [selectedNam, setSelectedNam] = useState('');
  const [pageState, setPageState] = useState({
    isLoading: false,
    danhmuctotnghiep: [],
    namThi: [],
    total: 0,
    order: 0,
    orderDir: 'DESC',
    startIndex: 0,
    pageSize: 10
  });
  const columns = [
    {
      field: 'idx',
      headerName: t('serial'),
      width: 50,
      sortable: false,
      filterable: false
    },

    {
      field: 'tieuDe',
      headerName: t('danhmuctotnghiep.field.tieude'),
      flex: 2,
      minWidth: 200,
      renderCell: (params) => (
        <Grid container>
          <Grid item xs={12}>
            <Typography variant="body1">{params.value}</Typography>
          </Grid>
        </Grid>
      )
    },
    {
      field: 'soQuyetDinh',
      headerName: t('danhmuctotnghiep.field.soquyetdinh'),
      flex: 2,
      minWidth: 200
    },
    {
      field: 'namThi',
      headerName: t('danhmuctotnghiep.field.namtotnghiep'),
      flex: 1,
      minWidth: 100
    },
    {
      field: 'trangThai',
      headerName: t('danhmuctotnghiep.field.trangthai'),
      flex: 1,
      minWidth: 100,
      renderCell: (params) => (
        <Grid container>
          <Grid item xs={12} mt={0.2}>
            <div style={{ width: '200%' }}>
              <Chip
                // variant='outlined'
                size="small"
                label={params.row.khoa === true ? 'Đã khóa ' : params.row.trangThai === 1 ? 'Đã in bằng' : 'Hoạt động'}
                color={params.row.khoa === true ? 'warning' : params.row.trangThai === 1 ? 'error' : 'success'}
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
      renderCell: (params) => (
        <>
          <Grid container justifyContent="center">
            {params.row.khoa ? (
              <ActionButtons type="active" handleActive={handleActive} params={params.row} />
            ) : (
              <CombinedActionButtons params={params.row} buttonConfigurations={generateButtonConfigurations(params.row)} />
            )}
          </Grid>
        </>
      )
    }
  ];
  const handleAddDanhmucTN = () => {
    setTitle(t('danhmuctotnghiep.title.add'));
    setForm('add');
    dispatch(setOpenPopup(true));
  };

  const handleDeActive = (danhmuctotnghiep) => {
    setTitle(t('danhmuctotnghiep.title.khoa'));
    setForm('deActive');
    dispatch(selectedNamthi(nam));
    dispatch(selectedDanhmuctotnghiep(danhmuctotnghiep));
    dispatch(setOpenPopup(true));
  };

  const handleActive = (danhmuctotnghiep) => {
    setTitle(t('danhmuctotnghiep.title.mokhoa'));
    setForm('active');
    dispatch(selectedNamthi(nam));
    dispatch(selectedDanhmuctotnghiep(danhmuctotnghiep));
    dispatch(setOpenPopup(true));
  };

  const handleGetById = (danhmuctotnghiep) => {
    setTitle(t('danhmuctotnghiep.title.detail'));
    setForm('detail');
    dispatch(selectedNamthi(nam));
    dispatch(selectedDanhmuctotnghiep(danhmuctotnghiep));
    dispatch(setOpenPopup(true));
  };

  const handleEditDanhmucTN = (danhmuctotnghiep) => {
    setTitle(t('danhmuctotnghiep.title.edit'));
    setForm('edit');
    dispatch(selectedDanhmuctotnghiep(danhmuctotnghiep));
    dispatch(selectedNamthi(nam));
    dispatch(setOpenPopup(true));
  };

  const handleDeleteDangmucTN = (danhmuctotnghiep) => {
    setTitle(t('danhmuctotnghiep.title.delete'));
    setForm('delete');
    dispatch(selectedDanhmuctotnghiep(danhmuctotnghiep));
    dispatch(selectedNamthi(nam));
    dispatch(setOpenPopup(true));
  };

  const handlePhanQuyenTungTruongDanhmucTN = (danhmuctotnghiep) => {
    setTitle(t('Phân Quyền trường gửi đề nghị xét tốt nghiệp'));
    setForm('permission');
    dispatch(selectedDanhmuctotnghiep(danhmuctotnghiep));
    dispatch(setOpenPopup(true));
  };
  const handleThongBaoTungTruong = (danhmuctotnghiep) => {
    setTitle(t('Thông báo trường gửi đề nghị xét tốt nghiệp'));
    setForm('notify');
    dispatch(selectedDanhmuctotnghiep(danhmuctotnghiep));
    dispatch(selectedNamthi(nam));
    dispatch(setOpenPopup(true));
  };

  const generateButtonConfigurations = (row) => {
    const config = [
      {
        type: 'detail',
        handleGetbyId: handleGetById
      }
    ];

    if (row.trangThai === 0) {
      config.push(
        {
          type: 'edit',
          handleEdit: handleEditDanhmucTN
        },

        { type: 'permission', handlePermission: handlePhanQuyenTungTruongDanhmucTN },
        { type: 'notify', handleNotify: handleThongBaoTungTruong }
      );
    }

    config.push(
      {
        type: 'deActive',
        handleDeActive: handleDeActive
      },
      {
        type: 'delete',
        handleDelete: handleDeleteDangmucTN
      }
    );

    return config;
  };

  const handleChange = async (event) => {
    const idNam = event.target.value;
    const trangThai = idNam == 'all' ? '' : idNam;
    setSelectedNam(trangThai);
  };

  const listDanhmuc = async (namT) => {
    const params = await createSearchParams(pageState);
    const danhmuctotnghiep = await getSearchDanhmucTN(namT, params);
    const dataDanhmucTN = await danhmuctotnghiep.data;
    const dataWithIds = dataDanhmucTN.danhMucTotNghieps.map((row, index) => ({
      idx: pageState.startIndex * pageState.pageSize + index + 1,
      tenNam: row.namThi.ten,
      ...row
    }));

    setPageState((old) => ({
      ...old,
      isLoading: false,
      danhmuctotnghiep: dataWithIds,
      total: dataDanhmucTN.totalRow
    }));
  };
  useEffect(() => {
    const fetchData = async () => {
      setPageState((old) => ({ ...old, isLoading: true }));

      const namThi = await getAllNamthi();

      const check = await handleResponseStatus(namThi, navigate);
      if (check) {
        const dataNamthi = await namThi.data;
        const dataWithhdt = dataNamthi.map((row, index) => ({
          idIndex: index + 1,
          ...row
        }));
        dispatch(setReloadData(false));
        setPageState((old) => ({
          ...old,
          isLoading: false,
          namThi: dataWithhdt
        }));
      } else {
        setIsAccess(false);
      }
    };
    if (nam !== null) {
      listDanhmuc(nam);
    } else {
      setNam('');
      listDanhmuc();
    }
    fetchData();
  }, [reloadData, pageState.order, pageState.orderDir, pageState.startIndex, pageState.pageSize, search, quickSearch]);

  const handleSearch = () => {
    setSearch(!search);
    dispatch(setNam(selectedNam));
  };

  return (
    <>
      <MainCard title={t('danhmuctotnghiep.title')} secondary={<AddButton handleClick={handleAddDanhmucTN} />}>
        <Grid container spacing={2} justifyContent={'center'} alignItems={'center'} my={1}>
          <Grid item xs={2} minWidth={120}>
            <FormControl fullWidth variant="outlined" size="small">
              <InputLabel> {t('namthi.title')}</InputLabel>
              <Select value={selectedNam == '' ? 'all' : selectedNam} onChange={handleChange} label={t('namthi.title')}>
                <MenuItem value="all">{'Tất cả'}</MenuItem>
                {pageState.namThi.map((item) => (
                  <MenuItem key={item.id} value={item.id}>
                    {item.ten}
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
        <Grid container justifyContent="flex-end" mb={1} sx={{ marginTop: '-5px' }}>
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
            rows={pageState.danhmuctotnghiep}
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
      </MainCard>
      {form !== '' && (
        <Popup
          title={title}
          form={form}
          openPopup={openPopup}
          bgcolor={form === 'delete' || form === 'deActive' ? '#F44336' : '#2196F3'}
          maxWidth={form == 'permission' || form == 'notify' ? 'md' : 'sm'}
        >
          {form === 'add' ? (
            <Add />
          ) : form === 'edit' ? (
            <Edit />
          ) : form === 'deActive' ? (
            <DeActive />
          ) : form === 'active' ? (
            <Active />
          ) : form === 'detail' ? (
            <Detail />
          ) : form === 'permission' ? (
            <Permission />
          ) : form === 'notify' ? (
            <ThongBao />
          ) : (
            <Delete />
          )}
        </Popup>
      )}
      <BackToTop />
    </>
  );
};

export default Danhmuctotnghiep;
