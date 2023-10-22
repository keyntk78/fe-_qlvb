import { DataGrid } from '@mui/x-data-grid';
import MainCard from 'components/cards/MainCard';
import Popup from 'components/controls/popup';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setOpenPopup, setReloadData, selectedMessageConfig } from 'store/actions';
import { openPopupSelector, reloadDataSelector } from 'store/selectors';
import { useTranslation } from 'react-i18next';
import useLocalText from 'utils/localText';
import { useNavigate } from 'react-router-dom';
import { handleResponseStatus } from 'utils/handleResponseStatus';
import AddButton from 'components/button/AddButton';
import { createSearchParams } from 'utils/createSearchParams';
import i18n from 'i18n';
import CombinedActionButtons from 'components/button/CombinedActionButtons';
import Add from './Add';
import Edit from './Edit';
import Delete from './Delete';
import BackToTop from 'components/scroll/BackToTop';
import { getMessageConfigByParams } from 'services/messageConfigService';
import { Grid } from '@mui/material';

const MessageConfig = () => {
  const { t } = useTranslation();
  const language = i18n.language;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const localeText = useLocalText();
  const openPopup = useSelector(openPopupSelector);
  const [title, setTitle] = useState('');
  const [form, setForm] = useState('');
  const reloadData = useSelector(reloadDataSelector);
  const [isAccess, setIsAccess] = useState(true);
  const [pageState, setPageState] = useState({
    isLoading: false,
    data: [],
    total: 0,
    order: 0,
    orderDir: 'DESC',
    startIndex: 0,
    pageSize: 10
  });
  const handleAdd = () => {
    setTitle(t('Thêm cấu hình tin nhắn'));
    setForm('add');
    dispatch(setOpenPopup(true));
  };

  const handleEdit = (config) => {
    setTitle(t('Chỉnh sửa cấu hình tin nhắn'));
    setForm('edit');
    dispatch(selectedMessageConfig(config));
    dispatch(setOpenPopup(true));
  };

  const handleDelete = (config) => {
    setTitle(t('Xóa cấu hình tin nhắn'));
    setForm('delete');
    dispatch(selectedMessageConfig(config));
    dispatch(setOpenPopup(true));
  };

  const buttonConfigurations = [
    {
      type: 'edit',
      handleEdit: handleEdit
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
      field: 'actionName',
      headerName: t('Tên hành động'),
      flex: 1,
      minWidth: 100
    },
    {
      field: 'title',
      headerName: t('Tiêu đề'),
      flex: 1.5,
      minWidth: 120
    },
    {
      field: 'description',
      headerName: t('Mô tả'),
      flex: 1.1,
      minWidth: 100
    },
    {
      field: 'url',
      headerName: t('Đường dẫn'),
      flex: 1.1,
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
      const response = await getMessageConfigByParams(params);
      const check = await handleResponseStatus(response, navigate);
      if (check) {
        const dataWithId = response.data.map((item, index) => ({
          ...item,
          id: index + 1
        }));
        dispatch(setReloadData(false));
        setPageState((old) => ({
          ...old,
          isLoading: false,
          data: dataWithId,
          total: dataWithId?.totalRow || 0
        }));
      } else {
        setIsAccess(false);
      }
    };
    fetchData();
  }, [pageState.search, pageState.order, pageState.orderDir, pageState.startIndex, pageState.pageSize, reloadData]);

  return (
    <>
      <MainCard title={t('Cấu hình tin nhắn')} secondary={<AddButton handleClick={handleAdd} />}>
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
        <Popup title={title} form={form} openPopup={openPopup} maxWidth={'sm'} bgcolor={form === 'delete' ? '#F44336' : '#2196F3'}>
          {form === 'add' ? <Add /> : form === 'edit' ? <Edit /> : form === 'delete' ? <Delete /> : ''}
        </Popup>
      )}
      <BackToTop />
    </>
  );
};

export default MessageConfig;
