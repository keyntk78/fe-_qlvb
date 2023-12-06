import { DataGrid } from '@mui/x-data-grid';
import Edit from './EditConfig';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setOpenSubPopup, setReloadData, selectedConfigPhoiGoc } from 'store/actions';
import { openSubPopupSelector, reloadDataSelector, selectedPhoigocSelector } from 'store/selectors';
import { GetConfigPhoi } from 'services/phoigocService';
import { useNavigate } from 'react-router-dom';
import { handleResponseStatus } from 'utils/handleResponseStatus';
import { useTranslation } from 'react-i18next';
import useLocalText from 'utils/localText';
import Popup from 'components/controls/popup';
import i18n from 'i18n';
import Xemtruoc from './Xemtruoc';
import BeforeViewButton from 'components/button/BeforeViewButton';
import ActionButtons from 'components/button/ActionButtons';
import { Grid } from '@mui/material';
import { IconCheck, IconX } from '@tabler/icons';

const Config = () => {
  const { t } = useTranslation();
  const language = i18n.language;
  const localeText = useLocalText();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const openSubPopup = useSelector(openSubPopupSelector);
  const [title, setTitle] = useState('');
  const [form, setForm] = useState('');
  const [isAccess, setIsAccess] = useState(true);
  const reloadData = useSelector(reloadDataSelector);
  const selectedPhoigoc = useSelector(selectedPhoigocSelector);
  const [pageState, setPageState] = useState({
    isLoading: false,
    data: []
  });
  const handleEditPhoi = (phoigoc) => {
    setTitle(t('phoivanbang.title.editcauhinhgoc'));
    setForm('edit');
    dispatch(selectedConfigPhoiGoc(phoigoc));
    dispatch(setOpenSubPopup(true));
  };

  const handleView = () => {
    setTitle(t('Xem cấu hình phôi'));
    setForm('xemtruoc');
    dispatch(setOpenSubPopup(true));
  };

  const handleViewSample = () => {
    setTitle(t('Xem dữ liệu mẫu'));
    setForm('xemtruocsample');
    dispatch(setOpenSubPopup(true));
  };

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
      field: 'maTruongDuLieu',
      headerName: t('config.field.tenconfig'),
      minWidth: 100
    },
    {
      flex: 1,
      field: 'kieuChu',
      headerName: t('config.field.kieuchu'),
      minWidth: 120
    },
    {
      width: 100,
      field: 'coChu',
      headerName: t('config.field.cochu'),
      minWidth: 60
    },
    {
      width: 130,
      field: 'dinhDangKieuChu',
      headerName: t('config.field.dinhdangkieuchu'),
      minWidth: 90
    },
    {
      width: 100,
      sortable: false,
      filterable: false,
      field: 'viTri',
      headerName: t('config.field.vitri'),
      minWidth: 90
    },
    {
      width: 100,
      sortable: false,
      filterable: false,
      field: 'mauChu',
      headerName: t('config.field.mauchu'),
      minWidth: 90
    },
    {
      width: 100,
      sortable: false,
      filterable: false,
      field: 'hienThi',
      headerName: t('Hiển thị'),
      renderCell: (params) => (
        <Grid container justifyContent="center">
          {params.row.hienThi ? <IconCheck /> : <IconX />}
        </Grid>
      )
    },
    {
      field: 'actions',
      headerName: t('action'),
      width: 100,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <>
          <ActionButtons type="edit" handleEdit={handleEditPhoi} params={params.row} />
        </>
      )
    }
  ];
  useEffect(() => {
    const fetchData = async () => {
      setPageState((old) => ({ ...old, isLoading: true }));
      const response = await GetConfigPhoi(selectedPhoigoc.id);
      const check = handleResponseStatus(response, navigate);
      if (check) {
        const data = await response.data;
        const dataWithIds = data.map((row, index) => ({
          idx: index + 1,
          viTri: row.viTriTren + ' - ' + row.viTriTrai,
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
  }, [pageState.search, pageState.order, pageState.orderDir, pageState.startIndex, pageState.pageSize, reloadData, form]);

  return (
    <>
      {/* <MainCard title={t('cauhinhphoivanbang.titlegoc')} secondary={<BeforeViewButton handleClick={handleView} />}> */}
      <Grid container justifyContent={'flex-end'} my={2} spacing={1}>
        <Grid item>
          <BeforeViewButton handleClick={handleViewSample} title={t('Xem dữ liệu mẫu')} />
        </Grid>
        <Grid item>
          <BeforeViewButton handleClick={handleView} title={t('Xem cấu hình phôi')} />
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
          // paginationMode="server"
          hideFooterPagination
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
        <Popup
          title={title}
          form={form}
          openPopup={openSubPopup}
          type="subpopup"
          maxWidth={form === 'edit' ? 'sm' : form === 'xemtruoc' ? 'lg' : 'md'}
          bgcolor={form === 'delete' ? '#F44336' : '#2196F3'}
        >
          {form === 'edit' ? <Edit /> : form === 'xemtruoc' ? <Xemtruoc /> : form === 'xemtruocsample' ? <Xemtruoc isSample /> : ''}
        </Popup>
      )}
      {/* </MainCard> */}
    </>
  );
};

export default Config;
