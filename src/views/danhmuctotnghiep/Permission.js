import i18n from 'i18n';
import { DataGrid } from '@mui/x-data-grid';
import { useState } from 'react';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createSearchParams, useNavigate } from 'react-router-dom';
import { setOpenPopup, setOpenSubPopup, setReloadData, showAlert } from 'store/actions';
import { selectedUserSelector, reloadDataSelector, openSubPopupSelector } from 'store/selectors';
import { handleResponseStatus } from 'utils/handleResponseStatus';
import useLocalText from 'utils/localText';
import { useTranslation } from 'react-i18next';
import { Button, Checkbox, Grid } from '@mui/material';
import SaveButtonTable from 'components/button/SaveButtonTable';
import ExitButton from 'components/button/ExitButton';
import { getReportsViaUser, saveUserReport } from 'services/userService';
import { IconBellPlus } from '@tabler/icons';
import Popup from 'components/controls/popup';
import ThongBao from './ThongBao';

const Permission = () => {
  const language = i18n.language;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const localeText = useLocalText();
  const reloadData = useSelector(reloadDataSelector);
  const { t } = useTranslation();
  const [isAccess, setIsAccess] = useState(true);
  const selectedUser = useSelector(selectedUserSelector);

  const [title, setTitle] = useState('');
  const [form, setForm] = useState('');
  const openSubPopup = useSelector(openSubPopupSelector);

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
      field: 'rowIndex',
      headerName: t('serial'),
      width: 50,
      sortable: false,
      filterable: false
    },
    {
      field: 'name',
      headerName: t('Tên báo cáo'),
      flex: 1,
      minWidth: 138
    },
    {
      field: 'actions',
      headerName: t('action'),
      width: 88,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <>
          <Checkbox
            checked={params.row.hasPermission}
            color="info"
            onChange={(event) => handleCheckboxChange(event, params.row.id)}
            name={params.row.userId ? params.row.userId.toString() : ''}
          />
        </>
      )
    }
  ];

  const handleCheckboxChange = (event, id) => {
    const checked = event.target.checked;

    // Cập nhật giá trị hasPermission trong state dựa trên id của hàng được chọn
    setPageState((prevState) => ({
      ...prevState,
      data: prevState.data.map((row) => {
        if (row.id === id) {
          return {
            ...row,
            hasPermission: checked
          };
        }
        return row;
      })
    }));
  };

  const handleSave = async () => {
    const selectedUserIds = pageState.data.reduce((result, report) => {
      if (report.hasPermission) {
        return result !== '' ? `${result},${report.reportId}` : `${report.reportId}`;
      }
      return result;
    }, '');

    const data = {
      userId: selectedUser.userId,
      reportIds: selectedUserIds
    };

    const response = await saveUserReport(data);
    const check = handleResponseStatus(response, navigate);
    if (!check) {
      dispatch(showAlert(new Date().getTime().toString(), 'error', response.message.toString()));
    } else {
      if (response.isSuccess == false) {
        dispatch(showAlert(new Date().getTime().toString(), 'error', response.message.toString()));
      } else {
        dispatch(showAlert(new Date().getTime().toString(), 'success', response.message.toString()));
        dispatch(setOpenPopup(false));
        dispatch(setReloadData(true));
      }
    }
  };

  const openPopupGuiThongBao = () => {
    setTitle(t('Thông báo'));
    setForm('notify');
    dispatch(setOpenSubPopup(true));
  };

  useEffect(() => {
    const fetchData = async () => {
      setPageState((old) => ({ ...old, isLoading: true }));
      const params = await createSearchParams(pageState);
      if (selectedUser) {
        const response = await getReportsViaUser(selectedUser.userId, params);
        const check = await handleResponseStatus(response, navigate);
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
      }
    };
    fetchData();
  }, [pageState.search, pageState.order, pageState.orderDir, pageState.startIndex, pageState.pageSize, selectedUser, reloadData]);

  return (
    <>
      <Grid item sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
        <Button color="info" variant="contained" onClick={openPopupGuiThongBao} sx={{ mx: 1 }} startIcon={<IconBellPlus />}>
          {t('Thông báo')}
        </Button>
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
          />
        </Grid>
      ) : (
        <h1>{t('not.allow.access')}</h1>
      )}
      <Grid item xs={12} container spacing={2} justifyContent="flex-end" mt={1}>
        <Grid item>
          <SaveButtonTable onClick={handleSave} />
        </Grid>
        <Grid item>
          <ExitButton />
        </Grid>
      </Grid>
      {form !== '' && (
        <Popup
          title={title}
          form={form}
          openPopup={openSubPopup}
          type="subpopup"
          maxWidth={'md'}
          bgcolor={form === 'delete' ? '#F44336' : '#2196F3'}
        >
          {form === 'notify' ? <ThongBao /> : ''}
        </Popup>
      )}
    </>
  );
};

export default Permission;
