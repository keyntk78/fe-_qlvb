import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Chip, Grid } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { reloadDataSelector } from 'store/selectors';
import { useTranslation } from 'react-i18next';
import { createSearchParams } from 'utils/createSearchParams';
import { handleResponseStatus } from 'utils/handleResponseStatus';
import useLocalText from 'utils/localText';
import i18n from 'i18n';
import BackToTop from 'components/scroll/BackToTop';
import { thongKeGetTruongHasPermision } from 'services/danhmuctotnghiepService';
import { setReloadData } from 'store/actions';
import ExitButton from 'components/button/ExitButton';

export default function ThongkeDonViGuiDuyet({ danhMuc }) {
  const language = i18n.language;
  const { t } = useTranslation();
  const reloadData = useSelector(reloadDataSelector);
  const dispatch = useDispatch();
  const localeText = useLocalText();
  const navigate = useNavigate();
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
      field: 'id',
      headerName: t('serial'),
      width: 50,
      sortable: false,
      filterable: false,
      cellClassName: 'top-aligned-cell'
    },
    {
      field: 'tenTruong',
      headerName: t('Tên trường'),
      flex: 3,
      minWidth: 180
    },
    {
      field: 'trangThai',
      headerName: t('Trạng thái'),
      flex: 1.5,
      minWidth: 100,
      renderCell: (params) => (
        <>
          <Grid container>
            <Grid item xs={12}>
              <Chip size="small" label={params.row.trangThai} color={params.row.trangThai === 'Đã gửi' ? 'success' : 'secondary'} />
            </Grid>
          </Grid>
        </>
      )
    },
    {
      field: 'soDaGui',
      headerName: t('Số lượng đã gửi'),
      minWidth: 80,
      flex: 1
    },
    {
      field: 'soChuaGui',
      headerName: t('Số lượng chưa gửi'),
      minWidth: 100,
      flex: 1.3
    }
  ];

  useEffect(() => {
    const fetchData = async () => {
      setPageState((old) => ({ ...old, isLoading: true }));
      const params = await createSearchParams(pageState);
      params.append('idDanhMucTotNghiep', danhMuc);
      const response = await thongKeGetTruongHasPermision(params);
      const check = handleResponseStatus(response, navigate);
      if (check) {
        const data = await response.data;
        const dataWithIds = data?.truongs?.map((row, index) => ({
          id: index + 1,
          trangThai: row.soDaGui == 0 ? t('Chưa gửi') : t('Đã gửi'),
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
    if (danhMuc) {
      fetchData();
    }
  }, [pageState.search, pageState.order, pageState.orderDir, pageState.startIndex, pageState.pageSize, danhMuc, reloadData]);

  return (
    <>
      <Grid container mt={2}>
        <DataGrid
          autoHeight
          columns={columns}
          rows={pageState.data}
          rowCount={pageState.total}
          loading={pageState.isLoading}
          rowsPerPageOptions={[5, 10, 20]}
          rowHeight={60}
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
      <Grid item xs={12} container spacing={1} justifyContent="flex-end" mt={1}>
        <Grid item>
          <ExitButton />
        </Grid>
      </Grid>
      <BackToTop />
    </>
  );
}
