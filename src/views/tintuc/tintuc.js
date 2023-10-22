import { DataGrid } from '@mui/x-data-grid';
import MainCard from 'components/cards/MainCard';
import Popup from 'components/controls/popup';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setOpenPopup, setReloadData, selectedTinTuc } from 'store/actions';
import { openPopupSelector, reloadDataSelector } from 'store/selectors';
import { useTranslation } from 'react-i18next';
import useLocalText from 'utils/localText';
import { useNavigate } from 'react-router-dom';
import { handleResponseStatus } from 'utils/handleResponseStatus';
import AddButton from 'components/button/AddButton';
import { createSearchParams } from 'utils/createSearchParams';
import i18n from 'i18n';
import CombinedActionButtons from 'components/button/CombinedActionButtons';
import { getSearchTinTuc } from 'services/tintucService';
import config from 'config';
import { getAllLoaiTinTuc } from 'services/loaitintucService';
import Add from './Add';
import Edit from './Edit';
import Delete from './Delete';
import Show from './Show';
import Hide from './Hide';
import { Chip, Grid } from '@mui/material';
import BackToTop from 'components/scroll/BackToTop';

const TinTuc = () => {
  const { t } = useTranslation();
  const language = i18n.language;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const localeText = useLocalText();
  const openPopup = useSelector(openPopupSelector);
  const [title, setTitle] = useState('');
  const [form, setForm] = useState('');
  const reloadData = useSelector(reloadDataSelector);
  const [urlFileImage, setUrlFileImage] = useState('');
  const [isAccess, setIsAccess] = useState(true);
  const [loaiTinTuc, setLoaiTinTuc] = useState([]);
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
    setTitle(t('Thêm tin tức'));
    setForm('add');
    dispatch(setOpenPopup(true));
  };

  const handleHide = (tintuc) => {
    setTitle(t('Ẩn tin tức'));
    setForm('hide');
    dispatch(selectedTinTuc(tintuc));
    dispatch(setOpenPopup(true));
  };

  const handleShow = (tintuc) => {
    setTitle(t('Hiển thị tin tức'));
    setForm('show');
    dispatch(selectedTinTuc(tintuc));
    dispatch(setOpenPopup(true));
  };

  const handleEdit = (tintuc) => {
    setTitle(t('Chỉnh sửa tin tức'));
    setForm('edit');
    dispatch(selectedTinTuc(tintuc));
    dispatch(setOpenPopup(true));
  };

  const handleDelete = (tintuc) => {
    setTitle(t('Xóa tin tức'));
    setForm('delete');
    dispatch(selectedTinTuc(tintuc));
    dispatch(setOpenPopup(true));
  };

  const buttonConfigurations1 = [
    {
      type: 'hide',
      handleClick: handleHide
    },
    {
      type: 'edit',
      handleEdit: handleEdit
    },
    {
      type: 'delete',
      handleDelete: handleDelete
    }
  ];

  const buttonConfigurations2 = [
    {
      type: 'show',
      handleClick: handleShow
    },
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
      field: 'idx',
      headerName: t('serial'),
      width: 50,
      sortable: false,
      filterable: false
    },
    {
      field: 'image',
      headerName: t('Hình ảnh'),
      flex: 0.5,
      justifyContent: 'center',
      alignItems: 'center',
      minWidth: 80,
      renderCell: (params) =>
        params.row.hinhAnh ? (
          <img
            src={`${urlFileImage}${params.row.hinhAnh}`}
            alt="hinhAnh"
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
      field: 'tieuDe',
      headerName: t('Tiêu đề'),
      flex: 2,
      minWidth: 180
    },
    {
      field: 'idLoaiTinTuc',
      headerName: t('Loại tin tức'),
      flex: 1,
      minWidth: 120,
      valueGetter: (params) => {
        const matchingLoaiTinTuc = loaiTinTuc.find((item) => item.id === params.value);
        return matchingLoaiTinTuc ? matchingLoaiTinTuc.tieuDe : 'N/A';
      }
    },
    {
      field: 'trangThai',
      headerName: t('Trạng thái'),
      flex: 1,
      minWidth: 120,
      renderCell: (params) => (
        <>
          <Grid container>
            <Grid item xs={12} mt={0.2}>
              <Chip
                size="small"
                label={params.row.trangThai_fm}
                color={params.row.trangThai_fm === 'Đang hiển thị' ? 'info' : 'secondary'}
              />
            </Grid>
          </Grid>
        </>
      )
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
            {params.row.trangThai == 0 ? (
              <CombinedActionButtons params={params.row} buttonConfigurations={buttonConfigurations2} />
            ) : (
              <CombinedActionButtons params={params.row} buttonConfigurations={buttonConfigurations1} />
            )}
          </Grid>
        </>
      )
    }
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getAllLoaiTinTuc();
        setLoaiTinTuc(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setPageState((old) => ({ ...old, isLoading: true }));
      setUrlFileImage(config.urlFile + 'TinTuc/');
      const params = await createSearchParams(pageState);
      const response = await getSearchTinTuc(params);
      const check = await handleResponseStatus(response, navigate);
      if (check) {
        const data = await response.data;
        const dataWithIds = data.tinTucs.map((row, index) => ({
          idx: pageState.startIndex * pageState.pageSize + index + 1,
          trangThai_fm: row.trangThai == 1 ? t('Đang hiển thị') : row.trangThai == 0 ? t('Đã bị ẩn') : '',
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
      <MainCard title={t('Tin tức')} secondary={<AddButton handleClick={handleAdd} />}>
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
          openPopup={openPopup}
          maxWidth={form === 'add' || form === 'edit' ? 'xl' : 'sm'}
          bgcolor={form === 'delete' ? '#F44336' : '#2196F3'}
        >
          {form === 'add' ? (
            <Add />
          ) : form === 'edit' ? (
            <Edit />
          ) : form === 'delete' ? (
            <Delete />
          ) : form === 'show' ? (
            <Show />
          ) : form === 'hide' ? (
            <Hide />
          ) : (
            ''
          )}
        </Popup>
      )}
      <BackToTop />
    </>
  );
};

export default TinTuc;
