import { DataGrid } from '@mui/x-data-grid';
import MainCard from 'components/cards/MainCard';
import Popup from 'components/controls/popup';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setOpenPopup, setReloadData, selectedMenu } from 'store/actions';
import { openPopupSelector, reloadDataSelector } from 'store/selectors';
import Add from './Add';
import Edit from './Edit';
import Delete from './Delete';
import { getAllMenu } from 'services/menuService';
import { useTranslation } from 'react-i18next';
import useLocalText from 'utils/localText';
import { createSearchParams, useNavigate } from 'react-router-dom';
import { handleResponseStatus } from 'utils/handleResponseStatus';
// import ActionButtons from 'components/button/ActionButtons';
import AddButton from 'components/button/AddButton';
// import { createSearchParams } from 'utils/createSearchParams';
import i18n from 'i18n';
import CombinedActionButtons from 'components/button/CombinedActionButtons';
import BackToTop from 'components/scroll/BackToTop';
import { Grid } from '@mui/material';
import QuickSearch from 'components/form/QuickSearch';

const Menu = () => {
  const language = i18n.language;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const localeText = useLocalText();
  const openPopup = useSelector(openPopupSelector);
  const [title, setTitle] = useState('');
  const [form, setForm] = useState('');
  const [search, setSearch] = useState(false);
  const reloadData = useSelector(reloadDataSelector);
  const { t } = useTranslation();
  const [isAccess, setIsAccess] = useState(true);
  const [pageState, setPageState] = useState({
    isLoading: false,
    data: [],
    total: 0,
    order: 1,
    orderDir: 'ASC',
    startIndex: 0,
    pageSize: 10
  });

  const columns = [
    {
      field: 'idindex',
      headerName: t('serial'),
      width: 50,
      sortable: false,
      filterable: false
    },
    {
      field: 'hienThi',
      headerName: t('menu.field.ten'),
      flex: 1
    },
    {
      field: 'link',
      headerName: t('menu.field.link'),
      flex: 1
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
      const response = await getAllMenu(params);

      const check = await handleResponseStatus(response, navigate);
      if (check) {
        const data = await response.data;
        const dataWithIds = data.map((row, index) => ({
          id: index + 1,
          idindex: index + 1,
          ...row
        }));

        dispatch(setReloadData(false));

        setPageState((old) => ({
          ...old,
          isLoading: false,
          data: dataWithIds
        }));
      } else {
        setIsAccess(false);
      }
    };
    fetchData();
  }, [search, pageState.order, pageState.orderDir, pageState.startIndex, pageState.pageSize, reloadData]);

  const handleAddmenu = () => {
    setTitle(<> {t('menu.title.add')}</>);
    setForm('add');
    dispatch(setOpenPopup(true));
  };

  const handleEditMenu = (menu) => {
    setTitle(<> {t('menu.title.edit')} </>);
    setForm('edit');
    dispatch(selectedMenu(menu));
    dispatch(setOpenPopup(true));
  };

  const handleDeleteHinhthucdaotao = (menu) => {
    setTitle(<> {t('menu.title.delete')} </>);
    setForm('delete');
    dispatch(selectedMenu(menu));
    dispatch(setOpenPopup(true));
  };

  const buttonConfigurations = [
    {
      type: 'edit',
      handleEdit: handleEditMenu
    },
    {
      type: 'delete',
      handleDelete: handleDeleteHinhthucdaotao
    }
  ];
  return (
    <>
      <MainCard title={t('menu.title')} secondary={<AddButton handleClick={handleAddmenu} />}>
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
            loading={pageState.isLoading}
            localeText={language === 'vi' ? localeText : null}
            disableSelectionOnClick={true}
            hideFooterPagination
          />
        ) : (
          <h1>{t('not.allow.access')}</h1>
        )}
      </MainCard>

      {form !== '' && (
        <Popup
          title={title}
          openPopup={openPopup}
          form={form}
          bgcolor={form === 'delete' ? '#F44336' : '#2196F3'}
          maxWidth={form === 'permission' ? 'xl' : 'sm'}
        >
          {form === 'add' ? <Add /> : form === 'edit' ? <Edit /> : <Delete />}
        </Popup>
      )}
      <BackToTop />
    </>
  );
};

export default Menu;
