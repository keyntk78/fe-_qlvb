import { DataGrid } from '@mui/x-data-grid';
import MainCard from 'components/cards/MainCard';
import Popup from 'components/controls/popup';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setOpenPopup, setReloadData, selectedDonvitruong } from 'store/actions';
import { openPopupSelector, donviSelector, reloadDataSelector, userLoginSelector } from 'store/selectors';
import Add from './Add';
import Edit from './Edit';
import Delete from './Delete';
import Config from './Config';
import { getSearchDonvi } from 'services/donvitruongService';
import { useTranslation } from 'react-i18next';
import useLocalText from 'utils/localText';
import { useNavigate } from 'react-router-dom';
import { handleResponseStatus } from 'utils/handleResponseStatus';
import AddButton from 'components/button/AddButton';
import { createSearchParams } from 'utils/createSearchParams';
import i18n from 'i18n';
import CombinedActionButtons from 'components/button/CombinedActionButtons';
import { Grid } from '@mui/material';
import BackToTop from 'components/scroll/BackToTop';
import QuickSearch from 'components/form/QuickSearch';

const DonVi = () => {
  const language = i18n.language;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const localeText = useLocalText();
  const openPopup = useSelector(openPopupSelector);
  const [title, setTitle] = useState('');
  const [form, setForm] = useState('');
  const reloadData = useSelector(reloadDataSelector);
  const donvi = useSelector(donviSelector);
  const { t } = useTranslation();
  const [isAccess, setIsAccess] = useState(true);
  const [search, setSearch] = useState(false);
  const [pageState, setPageState] = useState({
    isLoading: false,
    data: [],
    total: 0,
    order: 0,
    orderDir: 'DESC',
    startIndex: 0,
    pageSize: 10,
    search: ''
  });

  const user = useSelector(userLoginSelector);

  const columns = [
    {
      field: 'idx',
      headerName: t('serial'),
      width: 50,
      sortable: false,
      filterable: false
    },
    {
      field: 'ma',
      headerName: t('donvitruong.field.ma'),
      flex: 1,
      minWidth: 80
    },
    {
      field: 'ten',
      headerName: t('donvitruong.field.ten'),
      flex: 2,
      minWidth: 200
    },
    {
      field: 'url',
      headerName: t('donvitruong.field.url'),
      flex: 2,
      minWidth: 140
    },

    {
      field: 'actions',
      headerName: t('action'),
      width: 90,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <>
          {params.row.id === donvi.id ? (
            <Grid container justifyContent="center">
              <CombinedActionButtons params={params.row} buttonConfigurations={buttonConfigurations1} />
            </Grid>
          ) : (
            <Grid container justifyContent="center">
              <CombinedActionButtons params={params.row} buttonConfigurations={buttonConfigurations} />
            </Grid>
          )}
        </>
      )
    }
  ];

  useEffect(() => {
    const fetchData = async () => {
      setPageState((old) => ({ ...old, isLoading: true }));
      const params = await createSearchParams(pageState);
      params.append('nguoiThucHien', user ? user.username : '');
      const response = await getSearchDonvi(params);
      const check = await handleResponseStatus(response, navigate);
      if (check) {
        const data = await response.data;
        const dataWithIds = data.truongs.map((row, index) => ({
          idx: pageState.startIndex * pageState.pageSize + index + 1,
          ...row
        }));
        dispatch(setReloadData(false));
        setPageState((old) => ({
          ...old,
          isLoading: false,
          data: dataWithIds,
          total: data?.totalRow || 0
        }));
      } else {
        setIsAccess(false);
      }
    };
    fetchData();
  }, [pageState.order, pageState.orderDir, pageState.startIndex, pageState.pageSize, reloadData, search]);

  const handleAddDonvi = () => {
    setTitle(t('donvitruong.title.add'));
    setForm('add');
    dispatch(setOpenPopup(true));
  };

  const handleGetById = (donvi) => {
    setTitle(t('cauhinhdonvi.title'));
    setForm('config');
    dispatch(selectedDonvitruong(donvi));
    dispatch(setOpenPopup(true));
  };

  const handleEditDonvi = (donvi) => {
    setTitle(t('donvitruong.title.edit'));
    setForm('edit');
    dispatch(selectedDonvitruong(donvi));
    dispatch(setOpenPopup(true));
  };

  const handleDeleteDonvi = (donvi) => {
    setTitle(t('donvitruong.title.delete'));
    setForm('delete');
    dispatch(selectedDonvitruong(donvi));
    dispatch(setOpenPopup(true));
  };

  const buttonConfigurations = [
    {
      type: 'config',
      handleClick: handleGetById
    },
    {
      type: 'edit',
      handleEdit: handleEditDonvi
    },
    {
      type: 'delete',
      handleDelete: handleDeleteDonvi
    }
  ];
  const buttonConfigurations1 = [
    {
      type: 'config',
      handleClick: handleGetById
    },
    {
      type: 'edit',
      handleEdit: handleEditDonvi
    }
  ];

  return (
    <>
      <MainCard title={t('donvitruong.title')} secondary={<AddButton handleClick={handleAddDonvi} />}>
        <Grid container justifyContent="flex-end" mb={1} sx={{ marginTop: '-15px' }}>
          <Grid item lg={3} md={4} sm={5} xs={7}>
            <QuickSearch
              value={pageState.search}
              onChange={(value) => setPageState((old) => ({ ...old, search: value }))}
              onSearch={() => setSearch(!search)}
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
      </MainCard>
      {form !== '' && (
        <Popup
          height={form === 'phoi' || form === 'socapbang' ? 500 : ''}
          title={title}
          form={form}
          openPopup={openPopup}
          maxWidth={form === 'config' ? 'md' : form === 'socapbang' ? 'lg' : 'sm'}
          bgcolor={form === 'delete' ? '#F44336' : '#2196F3'}
        >
          {form === 'add' ? <Add /> : form === 'edit' ? <Edit /> : form === 'config' ? <Config /> : <Delete />}
        </Popup>
      )}
      <BackToTop />
    </>
  );
};

export default DonVi;
