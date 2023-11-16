import { DataGrid } from '@mui/x-data-grid';
import MainCard from 'components/cards/MainCard';
import Popup from 'components/controls/popup';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setOpenPopup, setReloadData, selectedLoaiTinTuc } from 'store/actions';
import { openPopupSelector, reloadDataSelector } from 'store/selectors';
import Add from './Add';
import Edit from './Edit';
import Delete from './Delete';
import { useTranslation } from 'react-i18next';
import useLocalText from 'utils/localText';
import { useNavigate } from 'react-router-dom';
import { handleResponseStatus } from 'utils/handleResponseStatus';
import AddButton from 'components/button/AddButton';
import { createSearchParams } from 'utils/createSearchParams';
import i18n from 'i18n';
import CombinedActionButtons from 'components/button/CombinedActionButtons';
import { getSearchLoaiTinTuc } from 'services/loaitintucService';
import { Grid } from '@mui/material';
import BackToTop from 'components/scroll/BackToTop';

const Monthi = () => {
  const language = i18n.language;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const localeText = useLocalText();
  const openPopup = useSelector(openPopupSelector);
  const [title, setTitle] = useState('');
  const [form, setForm] = useState('');
  const reloadData = useSelector(reloadDataSelector);
  const { t } = useTranslation();
  const [isAccess, setIsAccess] = useState(true);
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
      field: 'idx',
      headerName: t('serial'),
      width: 50,
      sortable: false,
      filterable: false
    },
    {
      field: 'tieuDe',
      headerName: t('Tiêu đề'),
      flex: 1,
      minWidth: 120
    },
    {
      field: 'ghiChu',
      headerName: t('Ghi chú'),
      flex: 1.3,
      minWidth: 150
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
      const response = await getSearchLoaiTinTuc(params);

      const check = await handleResponseStatus(response, navigate);
      if (check) {
        const data = await response.data;
        const dataWithIds = data.loaiTinTucs.map((row, index) => ({
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
  }, [pageState.search, pageState.order, pageState.orderDir, pageState.startIndex, pageState.pageSize, reloadData]);

  const handleAdd = () => {
    setTitle(t('Thêm loại tin tức'));
    setForm('add');
    dispatch(setOpenPopup(true));
  };

  const handleEdit = (loaitintuc) => {
    setTitle(t('Chỉnh sửa loại tin tức'));
    setForm('edit');
    dispatch(selectedLoaiTinTuc(loaitintuc));
    dispatch(setOpenPopup(true));
  };

  const handleDelete = (loaitintuc) => {
    setTitle(t('Xóa loại tin tức'));
    setForm('delete');
    dispatch(selectedLoaiTinTuc(loaitintuc));
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

  return (
    <>
      <MainCard title={t('Loại tin tức')} secondary={<AddButton handleClick={handleAdd} />}>
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
        <Popup title={title} form={form} openPopup={openPopup} bgcolor={form === 'delete' ? '#F44336' : '#2196F3'} maxWidth={'sm'}>
          {form === 'add' ? <Add /> : form === 'edit' ? <Edit /> : <Delete />}
        </Popup>
      )}
      <BackToTop />
    </>
  );
};

export default Monthi;
