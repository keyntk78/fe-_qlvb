import { DataGrid } from '@mui/x-data-grid';
import Add from './Add';
import Edit from './Edit';
import Delete from './Delete';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setOpenSubPopup, setReloadData, selectedAction } from 'store/actions';
import { openSubPopupSelector, reloadDataSelector } from 'store/selectors';
import { getAction } from 'services/actionService';
import { useNavigate } from 'react-router-dom';
import { handleResponseStatus } from 'utils/handleResponseStatus';
import { useTranslation } from 'react-i18next';
import useLocalText from 'utils/localText';
import { selectedFunctionSelector } from 'store/selectors';
import { createSearchParams } from 'utils/createSearchParams';
import Popup from 'components/controls/popup';
import CombinedActionButtons from 'components/button/CombinedActionButtons';
import i18n from 'i18n';
import AddButton from 'components/button/AddButton';
import { FormControl, Grid, IconButton, Input, InputAdornment, InputLabel } from '@mui/material';
import BackToTop from 'components/scroll/BackToTop';
import { IconSearch } from '@tabler/icons';
import MainCard from 'components/cards/MainCard';

const Action = () => {
  const { t } = useTranslation();
  const language = i18n.language;
  const localeText = useLocalText();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const selectedFunction = useSelector(selectedFunctionSelector);
  const openSubPopup = useSelector(openSubPopupSelector);
  const [title, setTitle] = useState('');
  const [form, setForm] = useState('');
  const [search, setSearch] = useState(false);
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

  const handleAddAction = () => {
    setTitle(t('action.title.add'));
    setForm('add');
    dispatch(setOpenSubPopup(true));
  };

  const handleEditAction = (action) => {
    setTitle(t('action.title.edit'));
    setForm('edit');
    dispatch(selectedAction(action));
    dispatch(setOpenSubPopup(true));
  };

  const handleDeleteAction = (functions) => {
    setTitle(t('action.title.delete'));
    setForm('delete');
    dispatch(selectedAction(functions));
    dispatch(setOpenSubPopup(true));
  };
  const handleSearch = () => {
    setSearch(!search);
  };
  const buttonConfigurations = [
    {
      type: 'edit',
      handleEdit: handleEditAction
    },
    {
      type: 'delete',
      handleDelete: handleDeleteAction
    }
  ];

  const columns = [
    {
      field: 'rowIndex',
      headerName: t('serial'),
      width: 50,
      sortable: false,
      filterable: false
    },
    {
      flex: 1,
      field: 'action',
      headerName: t('action.field.action')
    },

    {
      flex: 1,
      field: 'description',
      headerName: t('action.field.description')
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
      const params = await createSearchParams(pageState, navigate);
      const response = await getAction(selectedFunction.functionId, params);

      const check = handleResponseStatus(response, navigate);
      if (check) {
        const data = await response.data;
        const dataWithIds = data.map((row, index) => ({
          id: index + 1,
          ...row
        }));

        dispatch(setReloadData(false));

        setPageState((old) => ({
          ...old,
          isLoading: false,
          data: dataWithIds,
          total: dataWithIds[0]?.totalRow || 0
        }));
      } else {
        setIsAccess(false);
      }
    };
    fetchData();
  }, [selectedFunction.functionId, search, pageState.order, pageState.orderDir, pageState.startIndex, pageState.pageSize, reloadData]);

  return (
    <>
      <MainCard hideInstruct title={t('action.title')} secondary={<AddButton handleClick={handleAddAction} />} sx={{ my: 1 }}>
        <Grid container justifyContent={'flex-end'}>
          <Grid container justifyContent="flex-end" mb={1}>
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
          <Popup title={title} form={form} openPopup={openSubPopup} type="subpopup" bgcolor={form === 'delete' ? '#F44336' : '#2196F3'}>
            {form === 'add' ? <Add /> : form === 'edit' ? <Edit /> : <Delete />}
          </Popup>
        )}
        <BackToTop />
      </MainCard>
    </>
  );
};

export default Action;
