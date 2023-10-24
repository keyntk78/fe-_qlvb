import { DataGrid } from '@mui/x-data-grid';
import MainCard from 'components/cards/MainCard';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setOpenSubPopup, setReloadData, upDateVBCC } from 'store/actions';
import { openSubPopupSelector, reloadDataSelector, selectedHocsinhSelector } from 'store/selectors';
import { useNavigate } from 'react-router-dom';
import { handleResponseStatus } from 'utils/handleResponseStatus';
import { useTranslation } from 'react-i18next';
import useLocalText from 'utils/localText';
import { createSearchParams } from 'utils/createSearchParams';
import i18n from 'i18n';
import React from 'react';
import AddDonChinhSua from '../chinhsuavbcc/AddDon';
import { convertISODateToFormattedDate } from 'utils/formatDate';
import { Grid } from '@mui/material';
import BackToTop from 'components/scroll/BackToTop';
import Popup from 'components/controls/popup';
import AddButton from 'components/button/AddButton';
import DetailHistory from '../chinhsuavbcc/Detail';
import { getSearchCapLaiVanBang } from 'services/caplaivbccService';
import CombinedActionButtons from 'components/button/CombinedActionButtons';
import InLaiVBCC from './InlaiVBCC';
//import config from 'config';
const CapLaiVBCC = () => {
  const language = i18n.language;
  const { t } = useTranslation();
  const localeText = useLocalText();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isAccess, setIsAccess] = useState(true);
  const reloadData = useSelector(reloadDataSelector);
  const selectHocsinh = useSelector(selectedHocsinhSelector);
  const openSubPopup = useSelector(openSubPopupSelector);
  const [search, setSearch] = useState(false);
  const [title, setTitle] = useState('');
  const [form, setForm] = useState('');
  // const [data, setData] = useState([]);
  const [pageState, setPageState] = useState({
    isLoading: false,
    data: [],
    total: 0,
    order: 1,
    orderDir: 'ASC',
    startIndex: 0,
    pageSize: 10
  });
  const handleDetail = (hocsinh) => {
    setTitle(t('Xem chi tiết'));
    setForm('detail');
    dispatch(upDateVBCC(hocsinh));
    dispatch(setOpenSubPopup(true));
  };
  const handleCapLai = (hocsinh) => {
    setTitle(t('Cấp lại văn bằng chứng chỉ'));
    setForm('caplai');
    dispatch(upDateVBCC(hocsinh));
    dispatch(setOpenSubPopup(true));
  };

  const handelUpdate = () => {
    setTitle(t('Chỉnh sửa VBCC'));
    setForm('add');
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
      field: 'hoTen',
      headerName: t('Họ tên'),
      minWidth: 180
    },
    {
      flex: 0.5,
      field: 'cccd',
      headerName: t('CCCD'),
      minWidth: 100
    },
    {
      flex: 0.3,
      field: 'gioiTinh',
      headerName: t('Giới tính'),
      renderCell: (params) => <>{params.row.gioiTinh ? t('gender.male') : t('gender.female')}</>
    },
    {
      flex: 0.3,
      field: 'danToc',
      headerName: t('Dân tộc')
    },
    {
      flex: 0.5,
      field: 'NgaySinh',
      headerName: t('Ngày sinh'),
      minWidth: 100
    },
    {
      flex: 0.5,
      field: 'NgayTao',
      headerName: t('Ngày tạo'),
      minWidth: 100
    },
    {
      flex: 0.5,
      field: 'nguoiTao',
      headerName: t('Người thao tác'),
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

  const buttonConfigurations = [
    {
      type: 'detail',
      handleGetbyId: handleDetail
    },
    {
      type: 'caplaivbcc',
      handleClick: handleCapLai
    }
  ];
  useEffect(() => {
    const fetchData = async () => {
      setPageState((old) => ({ ...old, isLoading: true }));
      const params = await createSearchParams(pageState);
      const response = await getSearchCapLaiVanBang(selectHocsinh.cccd, params);
      const data = await response.data;
      const check = handleResponseStatus(response, navigate);
      if (check) {
        if (data && data.lichSus.length > 0) {
          const dataWithIds = data.lichSus.map((row, index) => ({
            idx: index + 1,
            NgaySinh: convertISODateToFormattedDate(row.ngaySinh),
            NgayTao: convertISODateToFormattedDate(row.ngayTao),

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
    setSearch(false);
  }, [
    pageState.search,
    pageState.order,
    pageState.orderDir,
    pageState.startIndex,
    pageState.pageSize,
    reloadData,
    search,
    selectHocsinh.id
  ]);

  return (
    <>
      <MainCard
        sx={{ mt: 2 }}
        title={t(`Lịch sử Cấp lại văn bằng chứng chỉ`) + ' [' + selectHocsinh.hoTen + ']'}
        secondary={<Grid item>{<AddButton handleClick={handelUpdate} />}</Grid>}
      >
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
          openPopup={openSubPopup}
          type="subpopup"
          maxWidth={'md'}
          bgcolor={form === 'delete' ? '#F44336' : '#2196F3'}
        >
          {form === 'add' ? <AddDonChinhSua thaotac={1} /> : form === 'detail' ? <DetailHistory /> : form === 'caplai' ? <InLaiVBCC /> : ''}
        </Popup>
      )}
      <BackToTop />
    </>
  );
};

export default CapLaiVBCC;
