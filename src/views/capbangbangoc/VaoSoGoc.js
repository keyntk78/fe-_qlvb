import { DataGrid } from '@mui/x-data-grid';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectedHocsinh, setLoading, setOpenPopup, setOpenSubPopup, setReloadData, showAlert } from 'store/actions';
import {
  openPopupSelector,
  openSubPopupSelector,
  selectedDanhmucSelector,
  selectedDonvitruongSelector,
  userLoginSelector
} from 'store/selectors';
import { useTranslation } from 'react-i18next';
import useLocalText from 'utils/localText';
import { useNavigate } from 'react-router-dom';
import { handleResponseStatus } from 'utils/handleResponseStatus';
import { createSearchParams } from 'utils/createSearchParams';
import i18n from 'i18n';
import BackToTop from 'components/scroll/BackToTop';
import { Button, Grid, Tooltip } from '@mui/material';
import { IconDownload } from '@tabler/icons';
import AnimateButton from 'components/extended/AnimateButton';
import { convertDateTimeToDate, convertISODateToFormattedDate } from 'utils/formatDate';
import FormGroupButton from 'components/button/FormGroupButton';
import { useFormik } from 'formik';
import InputForm1 from 'components/form/InputForm1';
import { convertJsonToFormData } from 'utils/convertJsonToFormData';
import ExportSoGoc from './ExportSoGoc';
import { getPreviewHocSinh, putIntoSoGoc } from 'services/capbangbanchinhService';
import { GetCauHinhByIdDonVi } from 'services/sharedService';
import ActionButtons from 'components/button/ActionButtons';
import Popup from 'components/controls/popup';
import EditSoHieu from './EditSoHieu';
const VaoSoGoc = () => {
  const language = i18n.language;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const localeText = useLocalText();
  const donvi = useSelector(selectedDonvitruongSelector);
  const { t } = useTranslation();
  const danhmuc = useSelector(selectedDanhmucSelector);
  const [isAccess, setIsAccess] = useState(true);
  const user = useSelector(userLoginSelector);
  const openPopup = useSelector(openPopupSelector);
  const openSubPopup = useSelector(openSubPopupSelector);
  const [title, setTitle] = useState('');
  const [form, setForm] = useState('');
  const [pageState, setPageState] = useState({
    isLoading: false,
    data: [],
    total: 0,
    order: 'ASC',
    orderDir: 0,
    startIndex: 0,
    pageSize: 10,
    cccd: '',
    hoTen: '',
    noiSinh: '',
    danToc: '',
    trangThai: ''
  });

  const [pageState1, setPageState1] = useState({
    isLoading: false,
    data: [],
    total: 0,
    order: 'ASC',
    orderDir: 0,
    startIndex: 0,
    pageSize: 1000,
    cccd: '',
    hoTen: '',
    noiSinh: '',
    danToc: '',
    trangThai: 2
  });
  const handleEdit = (hocsinh) => {
    setTitle(t('Chỉnh sửa số hiệu văn bằng'));
    setForm('edit');
    dispatch(selectedHocsinh(hocsinh));
    dispatch(setOpenSubPopup(true));
  };
  const columns = [
    {
      field: 'idx',
      headerName: t('serial'),
      width: 50,
      sortable: false,
      filterable: false,
      cellClassName: 'top-aligned-cell'
    },
    {
      field: 'hoTen',
      headerName: t('hocsinh.field.fullname'),
      flex: 3,
      minWidth: 180
    },
    {
      field: 'cccd',
      headerName: t('hocsinh.field.cccd'),
      flex: 1.5,
      minWidth: 100
    },
    {
      field: 'ngaySinh_fm',
      headerName: t('hocsinh.field.bdate'),
      flex: 1.3,
      minWidth: 100
    },
    {
      field: 'gioiTinh_fm',
      headerName: t('hocsinh.field.gender'),
      flex: 1,
      minWidth: 70
    },
    {
      field: 'danToc',
      headerName: t('Dân tộc'),
      flex: 1,
      minWidth: 80
    },
    {
      field: 'xepLoai',
      headerName: t('Xếp loại'),
      flex: 1.2,
      minWidth: 90
    },
    {
      field: 'soHieuVanBang',
      headerName: t('hocsinh.field.soHieu'),
      flex: 1.5,
      minWidth: 90
    },
    {
      field: 'soVaoSoCapBang',
      headerName: t('hocsinh.field.soCapBang'),
      flex: 2,
      minWidth: 110
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
            <ActionButtons type="edit" handleEdit={handleEdit} params={params.row} />
          </Grid>
        </>
      )
    }
  ];

  useEffect(() => {
    const fetchData = async () => {
      setPageState((old) => ({ ...old, isLoading: true, trangThai: 2 }));
      const params = await createSearchParams(pageState);
      params.append('idDanhMucTotNghiep', danhmuc.id);
      params.append('idTruong', donvi.id);
      const response = await getPreviewHocSinh(params);
      const check = handleResponseStatus(response, navigate);
      if (check) {
        const data = await response.data;
        if (data && data?.hocSinhs?.length > 0) {
          const dataWithIds = data.hocSinhs.map((row, index) => ({
            idx: pageState.startIndex * pageState.pageSize + index + 1,
            soHieuVanBang: row.soHieuVanBang ? row.soHieuVanBang : 'Chưa cấp',
            soVaoSoCapBang: row.soVaoSoCapBang || 'Chưa cấp',
            gioiTinh_fm: row.gioiTinh ? 'Nam' : 'Nữ',
            ngaySinh_fm: convertISODateToFormattedDate(row.ngaySinh),
            ...row
          }));
          setPageState((old) => ({
            ...old,
            isLoading: false,
            data: dataWithIds,
            total: data.totalRow || 0
          }));
        }
      } else {
        setIsAccess(false);
      }
    };
    fetchData();
  }, [pageState.search, pageState.order, pageState.orderDir, pageState.startIndex, pageState.pageSize, donvi, danhmuc]);

  useEffect(() => {
    const fetchData = async () => {
      const params = await createSearchParams(pageState1);
      params.append('idDanhMucTotNghiep', danhmuc.id);
      params.append('idTruong', donvi.id);
      const response = await getPreviewHocSinh(params);
      const check = handleResponseStatus(response, navigate);
      if (check) {
        const data = await response.data;
        if (data && data?.hocSinhs?.length > 0) {
          const dataWithIds = data.hocSinhs.map((row, index) => ({
            idx: pageState.startIndex * pageState.pageSize + index + 1,
            soHieuVanBang: row.soHieuVanBang ? row.soHieuVanBang : 'Chưa cấp',
            soVaoSoCapBang: row.soVaoSoCapBang || 'Chưa cấp',
            gioiTinh_fm: row.gioiTinh ? 'Nam' : 'Nữ',
            ngaySinh_fm: convertISODateToFormattedDate(row.ngaySinh),
            ...row
          }));
          setPageState1((old) => ({
            ...old,
            isLoading: false,
            data: dataWithIds,
            total: data.totalRow || 0
          }));
        }
      } else {
        setIsAccess(false);
      }
    };
    fetchData();
  }, [danhmuc]);

  const handleExport = async (e) => {
    e.preventDefault();
    dispatch(setLoading(true));
    await ExportSoGoc(formik, pageState1, danhmuc, donvi, 'sogoc');
    dispatch(setLoading(false));
  };

  const formik = useFormik({
    initialValues: {
      UyBanNhanDan: '',
      CoQuanCapBang: '',
      QuyetDinh: '',
      NguoiKyBang: '',
      DiaPhuongCapBang: '',
      HeDaoTao: '',
      HinhThucDaoTao: '',
      NgayCapBang: ''
    },

    onSubmit: async (values) => {
      try {
        const convertValues = await convertJsonToFormData(values);
        convertValues.append('nguoiThucHien', user.username);
        convertValues.append('IdTruong', donvi.id);
        convertValues.append('IdDanhMucTotNghiep', danhmuc.id);
        const addedHocSinh = await putIntoSoGoc(convertValues);
        if (addedHocSinh.isSuccess == false) {
          dispatch(showAlert(new Date().getTime().toString(), 'error', addedHocSinh.message.toString()));
        } else {
          dispatch(setOpenPopup(false));
          dispatch(setReloadData(true));
          dispatch(showAlert(new Date().getTime().toString(), 'success', addedHocSinh.message.toString()));
        }
      } catch (error) {
        console.error(error);
        dispatch(showAlert(new Date().getTime().toString(), 'error', error.toString()));
      }
    }
  });

  useEffect(() => {
    if (danhmuc) {
      formik.setValues((values) => ({
        ...values,
        NgayCapBang: convertDateTimeToDate(danhmuc.ngayCapBang)
      }));
    }
  }, [danhmuc]);

  useEffect(() => {
    const fetchData = async () => {
      const response_cauhinh = await GetCauHinhByIdDonVi(user.username);
      const cauhinh_donvi = response_cauhinh.data;
      formik.setValues((values) => ({
        ...values,
        UyBanNhanDan: cauhinh_donvi.tenUyBanNhanDan || '',
        CoQuanCapBang: cauhinh_donvi.tenCoQuanCapBang || '',
        NguoiKyBang: cauhinh_donvi.hoTenNguoiKySoGoc || '',
        DiaPhuongCapBang: cauhinh_donvi.tenDiaPhuongCapBang || '',
        nguoiThucHien: user.username
      }));
    };
    if (openPopup) {
      fetchData();
    }
  }, [openPopup]);

  return (
    <>
      <form onSubmit={formik.handleSubmit}>
        <Grid container>
          <Grid item container justifyContent="flex-end" mt={3}>
            <AnimateButton>
              <Tooltip title={t('Tải xuống file xem trước sổ gốc')} placement="bottom">
                <Button color="secondary" variant="outlined" onClick={handleExport} startIcon={<IconDownload />}>
                  {t('Xem trước sổ gốc')}
                </Button>
              </Tooltip>
            </AnimateButton>
          </Grid>
          <Grid container spacing={1}>
            <Grid item xs={12} sm={4} md={4}>
              <InputForm1 formik={formik} xs={12} label={'Danh mục tốt nghiệp'} name="dmtn" value={danhmuc.tieuDe} isDisabled />
            </Grid>
            <Grid item xs={12} sm={4} md={4}>
              <InputForm1 formik={formik} xs={12} label={'Đơn vị trường'} name="dvdk" value={donvi.ten} isDisabled />
            </Grid>
            <Grid item xs={12} sm={4} md={4}>
              <InputForm1 formik={formik} xs={12} label={'Cơ quan cấp bằng'} name="CoQuanCapBang" />
            </Grid>
          </Grid>
          <Grid container spacing={1}>
            <Grid item xs={6} sm={3} md={3}>
              <InputForm1 formik={formik} xs={12} label={'Ủy ban nhân dân'} name="UyBanNhanDan" />
            </Grid>
            <Grid item xs={6} sm={3} md={3}>
              <InputForm1 formik={formik} xs={12} label={'Địa phương cấp bằng'} name="DiaPhuongCapBang" />
            </Grid>
            <Grid item xs={6} sm={3} md={3}>
              <InputForm1 formik={formik} xs={12} label={'Ngày cấp bằng'} name="NgayCapBang" type="date" />
            </Grid>
            <Grid item xs={6} sm={3} md={3}>
              <InputForm1 formik={formik} xs={12} label={'Người ký'} name="NguoiKyBang" />
            </Grid>
          </Grid>
          <Grid item xs={12} mt={2}>
            {isAccess ? (
              <DataGrid
                autoHeight
                columns={columns}
                rows={pageState.data}
                rowCount={pageState.total}
                loading={pageState.isLoading}
                rowsPerPageOptions={[5, 25, 50, 100]}
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
          </Grid>
        </Grid>
        <Grid item xs={12} container spacing={2} justifyContent="flex-end">
          <FormGroupButton />
        </Grid>
      </form>
      {form !== '' && (
        <Popup title={title} form={form} type="subpopup" openPopup={openSubPopup} maxWidth={'sm'} bgcolor={'#2196F3'}>
          {form === 'edit' ? <EditSoHieu /> : ''}
        </Popup>
      )}
      <BackToTop />
    </>
  );
};

export default VaoSoGoc;
