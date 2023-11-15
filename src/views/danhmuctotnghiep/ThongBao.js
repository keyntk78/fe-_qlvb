import i18n from 'i18n';
import { DataGrid } from '@mui/x-data-grid';
import { useState } from 'react';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createSearchParams, useNavigate } from 'react-router-dom';
import { setOpenSubSubPopup, setReloadData } from 'store/actions';
import { reloadDataSelector, openSubSubPopupSelector, userLoginSelector } from 'store/selectors';
import { handleResponseStatus } from 'utils/handleResponseStatus';
import useLocalText from 'utils/localText';
import { useTranslation } from 'react-i18next';
import { Button, Grid } from '@mui/material';
import ExitButton from 'components/button/ExitButton';
import { IconSend } from '@tabler/icons';
import Popup from 'components/controls/popup';
import GuiThongBaoLuaChon from './GuiThongBaoLuaChon';
import GuiThongBaoTatCa from './GuiThongBaoTatCa';
import { getSearchDonvi } from 'services/donvitruongService';

const ThongBao = () => {
  const language = i18n.language;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const localeText = useLocalText();
  const reloadData = useSelector(reloadDataSelector);
  const { t } = useTranslation();
  const [isAccess, setIsAccess] = useState(true);
  const user = useSelector(userLoginSelector);
  const [title, setTitle] = useState('');
  const [form, setForm] = useState('');
  const openSubSubPopup = useSelector(openSubSubPopupSelector);
  const [selectedRowData, setSelectedRowData] = useState([]);
  const [dataIdTruong, setDataIdTruong] = useState([]);

  const [pageState, setPageState] = useState({
    isLoading: false,
    data: [],
    total: 0,
    order: 0,
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
    }
  ];

  const openGuiThongBao = () => {
    setTitle(t('Gửi thông báo'));
    setForm('gui');
    dispatch(setOpenSubSubPopup(true));
  };
  const openGuiTatCaThongBao = () => {
    setTitle(t('Gửi thông báo'));
    setForm('guiall');
    dispatch(setOpenSubSubPopup(true));
  };
  useEffect(() => {
    setDataIdTruong(selectedRowData.map((row) => row.id));
  }, [selectedRowData]);
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
          idindex: index + 1,
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
  }, [pageState.search, pageState.order, pageState.orderDir, pageState.startIndex, pageState.pageSize, reloadData]);

  return (
    <>
      <Grid container sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
        <Grid item>
          <Button color="info" variant="contained" onClick={openGuiThongBao} sx={{ mx: 1 }} startIcon={<IconSend />}>
            {t('Gửi thông báo')}
          </Button>
        </Grid>
        <Grid item>
          <Button color="info" onClick={openGuiTatCaThongBao} variant="contained" startIcon={<IconSend />}>
            {t('Gửi thông báo tất cả')}
          </Button>
        </Grid>
      </Grid>

      {isAccess ? (
        <Grid container mt={2}>
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
            checkboxSelection
            onSelectionModelChange={(ids) => {
              const selectedIDs = new Set(ids);
              setSelectedRowData(pageState.data.filter((row) => selectedIDs.has(row.id)));
            }}
          />
        </Grid>
      ) : (
        <h1>{t('not.allow.access')}</h1>
      )}
      <Grid item xs={12} container spacing={2} justifyContent="flex-end" mt={1}>
        <Grid item>
          <ExitButton type="subpopup" />
        </Grid>
      </Grid>
      {form !== '' && (
        <Popup
          title={title}
          form={form}
          openPopup={openSubSubPopup}
          type="subsubpopup"
          maxWidth={'sm'}
          bgcolor={form === 'delete' ? '#F44336' : '#2196F3'}
        >
          {form === 'gui' ? <GuiThongBaoLuaChon dataIdTruong={dataIdTruong} /> : form === 'guiall' ? <GuiThongBaoTatCa /> : ''}
        </Popup>
      )}
    </>
  );
};

export default ThongBao;
