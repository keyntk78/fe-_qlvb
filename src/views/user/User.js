import { DataGrid } from '@mui/x-data-grid';
import MainCard from 'components/cards/MainCard';
import { useNavigate } from 'react-router';
import config from '../../config';

import Popup from 'components/controls/popup';

import { selectedUser, setOpenPopup, setReloadData } from 'store/actions';
import { openPopupSelector, reloadDataSelector, userLoginSelector } from 'store/selectors';
import Add from '../user/Add';
import Edit from '../user/Edit';
import Delete from '../user/Delete';
import DeActive from '../user/DeActive';
import Active from '../user/Active';
import PermissionsGroup from '../user/PermissionsGroup';

import { getUsers } from 'services/userService';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createSearchParams } from 'utils/createSearchParams';
import { handleResponseStatus } from 'utils/handleResponseStatus';
import useLocalText from 'utils/localText';
import { useTranslation } from 'react-i18next';
import ActionButtons from 'components/button/ActionButtons';
import AddButton from 'components/button/AddButton';
import i18n from 'i18n';
import CombinedActionButtons from 'components/button/CombinedActionButtons';
import ResetPassword from './ResetPassword';
import { Grid } from '@mui/material';
import BackToTop from 'components/scroll/BackToTop';
import PermissionsReport from './PermissionsReport';

const User = () => {
  const language = i18n.language;
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const localeText = useLocalText();
  const openPopup = useSelector(openPopupSelector);
  const userLogin = useSelector(userLoginSelector);
  const [title, setTitle] = useState('');
  const [urlFileImage, setUrlFileImage] = useState('');
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
  const user = useSelector(userLoginSelector);

  const handleEdit = (user) => {
    setTitle(t('user.title.edit'));
    setForm('edit');
    dispatch(selectedUser(user));
    dispatch(setOpenPopup(true));
  };

  const handleDelete = (role) => {
    setTitle(t('user.title.delete'));
    setForm('delete');
    dispatch(selectedUser(role));
    dispatch(setOpenPopup(true));
  };

  const handleDeActive = (user) => {
    setTitle(t('user.title.deActive'));
    setForm('deActive');
    dispatch(selectedUser(user));
    dispatch(setOpenPopup(true));
  };

  const handleActive = (user) => {
    setTitle(t('user.title.active'));
    setForm('active');
    dispatch(selectedUser(user));
    dispatch(setOpenPopup(true));
  };

  const handleAdd = (user) => {
    setTitle(t('user.title.permissionGroup'));
    setForm('permissionGroup');
    dispatch(selectedUser(user));
    dispatch(setOpenPopup(true));
  };

  const handlePermissonReport = (user) => {
    setTitle(t('user.title.permissionGroup'));
    setForm('permissionReport');
    dispatch(selectedUser(user));
    dispatch(setOpenPopup(true));
  };

  const handleResetPass = (user) => {
    setTitle(t('reset.password.title'));
    setForm('reset');
    dispatch(selectedUser(user));
    dispatch(setOpenPopup(true));
  };

  const buttonConfigurations = [
    {
      type: 'permissionGroup',
      handleClick: handleAdd
    },
    {
      type: 'permissionReport',
      handleClick: handlePermissonReport
    },
    {
      type: 'edit',
      handleEdit: handleEdit
    },
    {
      type: 'reset',
      handleClick: handleResetPass
    },
    {
      type: 'deActive',
      handleDeActive: handleDeActive
    },
    {
      type: 'delete',
      handleDelete: handleDelete
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
      field: 'image',
      headerName: t('user.field.avatar'),
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      renderCell: (params) =>
        params.row.avatar ? (
          <img
            src={`${urlFileImage}${params.row.avatar}`}
            alt="avatar"
            style={{
              width: 45,
              height: 45,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              cursor: 'pointer'
            }}
          />
        ) : (
          <></>
        )
    },
    {
      field: 'userName',
      headerName: t('user.field.username'),
      minWidth: 80,
      flex: 1
    },
    {
      field: 'fullName',
      headerName: t('user.field.fullname'),
      minWidth: 150,
      flex: 2
    },
    {
      field: 'email',
      headerName: t('user.field.email'),
      minWidth: 100,
      flex: 2
    },
    {
      field: 'phone',
      headerName: t('user.field.phone'),
      minWidth: 100,
      flex: 1
    },
    {
      field: 'address',
      headerName: t('user.field.address'),
      minWidth: 100,
      flex: 2
    },
    {
      field: 'actions',
      headerName: t('action'),
      width: 100,
      sortable: false,
      filterable: false,
      justifyContent: 'center',
      renderCell: (params) =>
        params.row.userName === userLogin.username ? (
          <></>
        ) : (
          <Grid container justifyContent="center">
            {params.row.isActive ? (
              <CombinedActionButtons params={params.row} buttonConfigurations={buttonConfigurations} />
            ) : (
              <ActionButtons type="active" handleActive={handleActive} params={params.row} />
            )}
          </Grid>
        )
    }
  ];

  useEffect(() => {
    const fetchData = async () => {
      setPageState((old) => ({ ...old, isLoading: true }));
      setUrlFileImage(config.urlFile + 'Users/');
      const params = await createSearchParams(pageState);
      params.append('nguoiThucHien', user ? user.username : '');

      const response = await getUsers(params);
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
    };
    fetchData();
  }, [pageState.search, pageState.order, pageState.orderDir, pageState.startIndex, pageState.pageSize, reloadData]);

  const handleAddUser = () => {
    setTitle(t('user.title.add'));
    setForm('add');
    dispatch(setOpenPopup(true));
  };

  return (
    <>
      <MainCard title={t('user.title')} secondary={<AddButton handleClick={handleAddUser} />}>
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
          maxWidth={form === 'delete' || form === 'deActive' || form === 'reset' ? 'sm' : 'md'}
          openPopup={openPopup}
          bgcolor={form === 'delete' || form === 'deActive' ? '#F44336' : form === 'reset' ? '#F44336' : '#2196F3'}
        >
          {form === 'add' ? (
            <Add />
          ) : form === 'edit' ? (
            <Edit />
          ) : form === 'delete' ? (
            <Delete />
          ) : form === 'deActive' ? (
            <DeActive />
          ) : form === 'active' ? (
            <Active />
          ) : form === 'reset' ? (
            <ResetPassword />
          ) : form === 'permissionGroup' ? (
            <PermissionsGroup />
          ) : form === 'permissionReport' ? (
            <PermissionsReport />
          ) : (
            ''
          )}
        </Popup>
      )}
      <BackToTop />
    </>
  );
};

export default User;
