import { DataGrid } from '@mui/x-data-grid';
import MainCard from 'components/cards/MainCard';
import Popup from 'components/controls/popup';
import Add from './Add';
import Edit from './Edit';
import Delete from './Delete';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setOpenPopup, setReloadData, selectedNamthi } from 'store/actions';
import { openPopupSelector, reloadDataSelector } from 'store/selectors';
import { useNavigate } from 'react-router-dom';
import { handleResponseStatus } from 'utils/handleResponseStatus';
import { useTranslation } from 'react-i18next';
import useLocalText from 'utils/localText';
import AddButton from 'components/button/AddButton';
import { createSearchParams } from 'utils/createSearchParams';
import i18n from 'i18n';
import { getNamthi } from 'services/namthiService';
import Khoathi from 'views/khoathi/Khoathi';
import CombinedActionButtons from 'components/button/CombinedActionButtons';
import { FormControl, Grid, IconButton, Input, InputAdornment, InputLabel } from '@mui/material';
import BackToTop from 'components/scroll/BackToTop';
import { IconSearch } from '@tabler/icons';

const Namthi = () => {
  const language = i18n.language;
  const { t } = useTranslation();
  const localeText = useLocalText();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const openPopup = useSelector(openPopupSelector);
  const [title, setTitle] = useState('');
  const [form, setForm] = useState('');
  const [isAccess, setIsAccess] = useState(true);
  const [search, setSearch] = useState(false);
  const reloadData = useSelector(reloadDataSelector);
  const [pageState, setPageState] = useState({
    isLoading: false,
    data: [],
    total: 0,
    order: 1,
    orderDir: 'ASC',
    startIndex: 0,
    pageSize: 10
  });
  const handleEditNamthi = (namthi) => {
    setTitle(t('namthi.title.edit'));
    setForm('edit');
    dispatch(selectedNamthi(namthi));
    dispatch(setOpenPopup(true));
  };

  const handleDeleteNamthi = (namthi) => {
    setTitle(t('namthi.title.delete'));
    setForm('delete');
    dispatch(selectedNamthi(namthi));
    dispatch(setOpenPopup(true));
  };

  const handleAddKhoathi = (namthi) => {
    setTitle(t('khoathi.title'));
    setForm('khoathi');
    dispatch(selectedNamthi(namthi));
    dispatch(setOpenPopup(true));
  };
  const buttonConfigurations = [
    {
      type: 'calendar',
      handleAdd: handleAddKhoathi
    },
    {
      type: 'edit',
      handleEdit: handleEditNamthi
    },
    {
      type: 'delete',
      handleDelete: handleDeleteNamthi
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
      field: 'ten',
      headerName: t('namthi.field.Ten')
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
    const fetchData = async () => {
      setPageState((old) => ({ ...old, isLoading: true }));
      const params = await createSearchParams(pageState);
      const response = await getNamthi(params);
      const check = handleResponseStatus(response, navigate);
      if (check) {
        const data = await response.data;
        const dataWithIds = data.namThis.map((row, index) => ({
          idx: pageState.startIndex * pageState.pageSize + index + 1,
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
  }, [pageState.order, pageState.orderDir, pageState.startIndex, pageState.pageSize, reloadData, search]);

  const handleAddNamthi = () => {
    setTitle(<> {t('namthi.title.add')} </>);
    setForm('add');
    dispatch(setOpenPopup(true));
  };

  const handleSearch = () => {
    setSearch(!search);
  };

  return (
    <>
      <MainCard title={t('namthi.title')} secondary={<AddButton handleClick={handleAddNamthi} />}>
        <Grid container justifyContent="flex-end" mb={1} sx={{ marginTop: '-15px' }}>
          <Grid item>
            <FormControl variant="standard" size="small">
              <InputLabel>Tìm kiếm</InputLabel>
              <Input
                id="search-input"
                value={pageState.search}
                onChange={(e) => setPageState((old) => ({ ...old, search: e.target.value }))}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton onClick={handleSearch} edge="end">
                      <IconSearch />
                    </IconButton>
                  </InputAdornment>
                }
              />
            </FormControl>
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
          form={form}
          title={title}
          openPopup={openPopup}
          maxWidth={form == 'khoathi' ? 'md' : 'xs'}
          bgcolor={form === 'delete' ? '#F44336' : '#2196F3'}
        >
          {form === 'add' ? <Add /> : form === 'edit' ? <Edit /> : form === 'khoathi' ? <Khoathi /> : <Delete />}
        </Popup>
      )}
      <BackToTop />
    </>
  );
};

export default Namthi;
