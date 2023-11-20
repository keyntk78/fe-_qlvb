import { DataGrid } from '@mui/x-data-grid';
import Popup from 'components/controls/popup';
import Add from './Add';
import Edit from './Edit';
import Delete from './Delete';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setReloadData, selectedKhoathi, setOpenSubPopup } from 'store/actions';
import { openSubPopupSelector, reloadDataSelector, selectedNamthiSelector } from 'store/selectors';
import { useNavigate } from 'react-router-dom';
import { handleResponseStatus } from 'utils/handleResponseStatus';
import { useTranslation } from 'react-i18next';
import useLocalText from 'utils/localText';
import AddButton from 'components/button/AddButton';
import { createSearchParams } from 'utils/createSearchParams';
import i18n from 'i18n';
import { getKhoathi } from 'services/khoathiService';
import { convertISODateToFormattedDate } from 'utils/formatDate';
import CombinedActionButtons from 'components/button/CombinedActionButtons';
import { Grid } from '@mui/material';
import BackToTop from 'components/scroll/BackToTop';
import MainCard from 'components/cards/MainCard';
import QuickSearch from 'components/form/QuickSearch';

const Khoathi = () => {
  const language = i18n.language;
  const { t } = useTranslation();
  const localeText = useLocalText();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const openSubPopup = useSelector(openSubPopupSelector);
  const [title, setTitle] = useState('');
  const [form, setForm] = useState('');
  const [isAccess, setIsAccess] = useState(true);
  const [search, setSearch] = useState(false);
  const reloadData = useSelector(reloadDataSelector);
  const selectedNamthi = useSelector(selectedNamthiSelector);
  const [pageState, setPageState] = useState({
    isLoading: false,
    data: [],
    total: 0,
    order: 1,
    orderDir: 'ASC',
    startIndex: 0,
    pageSize: 10
  });

  const handleEditKhoathi = (khoathi) => {
    setTitle(t('khoathi.title.edit'));
    setForm('edit');
    dispatch(selectedKhoathi(khoathi));
    dispatch(setOpenSubPopup(true));
  };

  const handleDeleteKhoathi = (khoathi) => {
    setTitle(t('khoathi.title.delete'));
    setForm('delete');
    dispatch(selectedKhoathi(khoathi));
    dispatch(setOpenSubPopup(true));
  };

  const buttonConfigurations = [
    {
      type: 'edit',
      handleEdit: handleEditKhoathi
    },
    {
      type: 'delete',
      handleDelete: handleDeleteKhoathi
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
      flex: 1.5,
      field: 'ten',
      headerName: t('khoathi.field.Ten'),
      minWidth: 250
    },
    {
      flex: 1,
      field: 'ngay_fm',
      headerName: t('khoathi.field.Ngay'),
      minWidth: 100
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
      const response = await getKhoathi(params, selectedNamthi.id);
      const check = handleResponseStatus(response, navigate);
      if (check) {
        const data = await response.data;
        const dataWithIds = data.khoaThis.map((row, index) => ({
          idx: pageState.startIndex * pageState.pageSize + index + 1,
          ngay_fm: convertISODateToFormattedDate(row.ngay),
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
  }, [pageState.order, pageState.orderDir, pageState.startIndex, pageState.pageSize, reloadData, selectedNamthi.id, search]);

  const handleAddKhoathi = () => {
    setTitle(<> {t('khoathi.title.add')} </>);
    setForm('add');
    dispatch(setOpenSubPopup(true));
  };

  return (
    <>
      <MainCard title={t('khoathi.title')} secondary={<AddButton handleClick={handleAddKhoathi} />}>
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
          title={title}
          form={form}
          openPopup={openSubPopup}
          type="subpopup"
          maxWidth={'sm'}
          bgcolor={form === 'delete' ? '#F44336' : '#2196F3'}
        >
          {form === 'add' ? <Add /> : form === 'edit' ? <Edit /> : <Delete />}
        </Popup>
      )}
      <BackToTop />
    </>
  );
};

export default Khoathi;
