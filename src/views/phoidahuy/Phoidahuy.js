import { DataGrid } from '@mui/x-data-grid';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setReloadData } from 'store/actions';
import { reloadDataSelector } from 'store/selectors';
import { getSearchPhoiDaHuy } from 'services/phoigocService';
import { useNavigate } from 'react-router-dom';
import { handleResponseStatus } from 'utils/handleResponseStatus';
import { useTranslation } from 'react-i18next';
import useLocalText from 'utils/localText';
import { createSearchParams } from 'utils/createSearchParams';
import i18n from 'i18n';
// import AddButton from 'components/button/AddButton';
// import { Grid } from '@mui/material';
// import { convertISODateToFormattedDate } from 'utils/formatDate';
// import { Grid } from '@mui/material';

const PhoiDahuy = () => {
  const { t } = useTranslation();
  const language = i18n.language;
  const localeText = useLocalText();
  const dispatch = useDispatch();
  const navigate = useNavigate();
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

  //   const handleEditPhoi = (phoigoc) => {
  //     setTitle(t('phoivanbang.title.editgoc'));
  //     setForm('edit');
  //     dispatch(selectedPhoigoc(phoigoc));
  //     dispatch(setOpenSubPopup(true));
  //   };

  //   const handleDestroy = (phoigoc) => {
  //     setTitle(t('phoivanbang.title.destroygoc'));
  //     setForm('huyphoi');
  //     dispatch(selectedPhoigoc(phoigoc));
  //     dispatch(setOpenSubPopup(true));
  //   };

  //   const handleDeletePhoi = (phoigoc) => {
  //     setTitle(t('phoivanbang.title.deletegoc'));
  //     setForm('delete');
  //     dispatch(selectedPhoigoc(phoigoc));
  //     dispatch(setOpenSubPopup(true));
  //   };

  //   const buttonConfigurations = [
  //     {
  //       type: 'edit',
  //       handleEdit: handleEditPhoi
  //     },
  //     {
  //       type: 'huyphoi',
  //       handleClick: handleDestroy
  //     },
  //     {
  //       type: 'delete',
  //       handleDelete: handleDeletePhoi
  //     }
  //   ];

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
      field: 'tenPhoi',
      headerName: t('phoivanbang.field.tenPhoi')
    },
    {
      flex: 0.5,
      field: 'SoHieuBatDau',
      headerName: t('phoivanbang.field.sohieuphoi')
    },
    {
      flex: 1,
      field: 'bienBanHuyPhoi',
      headerName: t('phoivanbang.field.bienbanhuyphoi')
    },
    {
      flex: 1,
      field: 'lyDoHuy',
      headerName: t('phoivanbang.field.lydohuy')
    }
  ];
  useEffect(() => {
    const fetchData = async () => {
      setPageState((old) => ({ ...old, isLoading: true }));
      const params = await createSearchParams(pageState, navigate);
      const response = await getSearchPhoiDaHuy(selectedDonvitruong.id, params);
      const check = handleResponseStatus(response, navigate);
      if (check) {
        const data = await response.data;
        const dataWithIds = data.phoiDaHuys.map((row, index) => ({
          id: index + 1,
          idx: pageState.startIndex * pageState.pageSize + index + 1,
          SoHieuBatDau: `${row['tienToPhoi']}${row['soBatDau'] || ''}`,
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
  }, [selectedDonvitruong.id, pageState.search, pageState.order, pageState.orderDir, pageState.startIndex, pageState.pageSize, reloadData]);

  return (
    <>
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
    </>
  );
};

export default PhoiDahuy;
