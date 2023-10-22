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
import { Chip, Grid } from '@mui/material';

const Phoigoc = () => {
  const { t } = useTranslation();
  const language = i18n.language;
  const localeText = useLocalText();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const openPopup = useSelector(openPopupSelector);
  const [title, setTitle] = useState('');
  const [form, setForm] = useState('');
  const [isAccess, setIsAccess] = useState(true);
  const reloadData = useSelector(reloadDataSelector);
  const [pageState, setPageState] = useState({
    isLoading: false,
    data: [],
    total: 0,
    order: 0,
    orderDir: 'ASC',
    startIndex: 0,
    pageSize: 10
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
  const handleDetailPhoi = (phoigoc) => {
    setTitle(t('phoivanbang.title.detailhuyphoi'));
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

  const buttonConfigurations = [
    {
      type: 'config',
      handleClick: handleConfig
    },
    {
      type: 'edit',
      handleEdit: handleEditPhoi
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

  const buttonConfigurations1 = [
    {
      type: 'detail',
      handleGetbyId: handleDetailPhoi
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
      field: 'soHieuPhoi',
      headerName: t('phoivanbang.field.tientophoi'),
      minWidth: 100
    },
    {
      flex: 1,
      field: 'soBatDau',
      headerName: t('phoivanbang.field.sobatdau'),
      minWidth: 80
    },
    {
      flex: 1,
      field: 'tinhTrang',
      headerName: t('phoivanbang.field.tinhtrang'),
      minWidth: 100,
      renderCell: (params) => (
        <Grid container>
          <Grid item xs={12} mt={0.2}>
            <div style={{ width: '200%' }}>
              <Chip
                // variant='outlined'
                size="small"
                label={params.row.tinhTrang === 0 ? 'Hoạt động' : 'Đã hủy phôi'}
                color={params.row.tinhTrang === 0 ? 'success' : 'error'}
              />
            </div>
          </Grid>
        </Grid>
      )
    },
    {
      flex: 1,
      field: 'soLuongPhoi',
      headerName: t('phoivanbang.field.soluongphoi'),
      minWidth: 80
    },
    {
      flex: 1,
      field: 'NgayApDung',
      headerName: t('phoivanbang.field.ngayapdung'),
      minWidth: 100
    },
    {
      field: 'actions',
      headerName: t('action'),
      width: 90,
      sortable: false,
      filterable: false,
      renderCell: (params) =>
        params.row.tinhTrang == 1 ? (
          <>
            <Grid container justifyContent="center">
              <CombinedActionButtons params={params.row} buttonConfigurations={buttonConfigurations1} />
            </Grid>
          </>
        ) : (
          <>
            <Grid container justifyContent="center">
              <CombinedActionButtons params={params.row} buttonConfigurations={buttonConfigurations} />
            </Grid>
          </>
        )
    }
  ];
  useEffect(() => {
    const fetchData = async () => {
      setPageState((old) => ({ ...old, isLoading: true }));
      const params = await createSearchParams(pageState, navigate);
      const response = await getSearchPhoigoc(params);
      const check = handleResponseStatus(response, navigate);
      if (check) {
        const data = await response.data;
        const dataWithIds = data.phoiGocs.map((row, index) => ({
          id: index + 1,
          idx: pageState.startIndex * pageState.pageSize + index + 1,
          NgayApDung: convertISODateToFormattedDate(row.ngayApDung),
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
  }, [pageState.search, pageState.order, pageState.orderDir, pageState.startIndex, pageState.pageSize, reloadData]);

  return (
    <>
      <MainCard title={t('phoivanbang.title.bangoc')} secondary={<AddButton handleClick={handleAddPhoi} />}>
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
            maxWidth={form === 'add' || form === 'edit' || form === 'detail' || form === 'huyphoi' ? 'sm' : form === 'config' ? 'xl' : ''}
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
