import { DataGrid } from '@mui/x-data-grid';
import MainCard from 'components/cards/MainCard';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setReloadData } from 'store/actions';
import { reloadDataSelector, selectedHocsinhSelector } from 'store/selectors';
import { useNavigate } from 'react-router-dom';
import { handleResponseStatus } from 'utils/handleResponseStatus';
import { useTranslation } from 'react-i18next';
import useLocalText from 'utils/localText';
import { createSearchParams } from 'utils/createSearchParams';
import i18n from 'i18n';
import React from 'react';
import { convertISODateToFormattedDate } from 'utils/formatDate';
import BackToTop from 'components/scroll/BackToTop';
import config from 'config';
import { getHistoryThuHoiHuyBo } from 'services/thuhoihuyboService';
import { IconDownload } from '@tabler/icons';
//import config from 'config';
const LichSuThuHoi = () => {
  const language = i18n.language;
  const { t } = useTranslation();
  const localeText = useLocalText();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isAccess, setIsAccess] = useState(true);
  const reloadData = useSelector(reloadDataSelector);
  const selectHocsinh = useSelector(selectedHocsinhSelector);
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
    { flex: 4, field: 'lyDo', headerName: t('Lý do'), minWidth: 100 },

    {
      flex: 1,
      field: 'ngayTao_fm',
      headerName: t('Ngày thao tác'),
      minWidth: 100
    },
    {
      flex: 1,
      field: 'nguoiTao',
      headerName: t('Người thao tác'),
      minWidth: 100
    },
    {
      flex: 1,
      field: 'pathFileVanBan',
      headerName: t('File xác minh'),
      minWidth: 100,
      align: 'center',
      renderCell: (params) => {
        const pathFileVanBan = config.urlImages + params.row.pathFileVanBan;
        return (
          <a href={pathFileVanBan} download title="Tải xuống">
            <IconDownload />
          </a>
        );
      }
    }
  ];

  useEffect(() => {
    const fetchData = async () => {
      setPageState((old) => ({ ...old, isLoading: true }));
      const params = await createSearchParams(pageState);
      params.append('idHocSinh', selectHocsinh.id);
      const response = await getHistoryThuHoiHuyBo(params);
      const data = await response.data;
      const check = handleResponseStatus(response, navigate);
      if (check) {
        if (data && data.lichSus.length > 0) {
          const dataWithIds = data.lichSus.map((row, index) => ({
            idx: index + 1,
            ngayTao_fm: convertISODateToFormattedDate(row.ngayTao),
            hoTen_fm: row.hocSinh.hoTen,
            ...row
          }));
          // Lưu trữ dữ liệu gốc vào state
          dispatch(setReloadData(false));
          setPageState((old) => ({
            ...old,
            isLoading: false,
            data: dataWithIds,
            total: data.totalRow || 0
          }));
        } else {
          setPageState((old) => ({
            ...old,
            isLoading: false,
            data: [],
            total: 0
          }));
        }
      } else {
        setIsAccess(false);
      }
    };
    fetchData();
  }, [pageState.search, pageState.order, pageState.orderDir, pageState.startIndex, pageState.pageSize, reloadData, selectHocsinh.id]);

  return (
    <>
      <MainCard sx={{ mt: 2 }} title={t(`Lịch sử thu hồi, hủy bỏ [${selectHocsinh.hoTen}]`)}>
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
      <BackToTop />
    </>
  );
};

export default LichSuThuHoi;
