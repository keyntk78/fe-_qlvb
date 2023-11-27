import React from 'react';
import { Chip, Grid, useMediaQuery } from '@mui/material';
import { useFormik } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { getById, thongKeGetTruongHasPermision } from 'services/danhmuctotnghiepService';
import { setReloadData } from 'store/actions';
import ExitButton from 'components/button/ExitButton';
import { openPopupSelector, reloadDataSelector, selectedDanhmuctotnghiepSelector } from 'store/selectors';
import { useTranslation } from 'react-i18next';
import InputForm from 'components/form/InputForm';
import FormControlComponent from 'components/form/FormControlComponent ';
import { convertFormattedDateToISODate, convertISODateToFormattedDate } from 'utils/formatDate';
import { createSearchParams } from 'utils/createSearchParams';
import { handleResponseStatus } from 'utils/handleResponseStatus';
import { DataGrid } from '@mui/x-data-grid';
import { useState } from 'react';
import i18n from 'i18n';
import useLocalText from 'utils/localText';
import { useNavigate } from 'react-router';

const Detail = () => {
  const language = i18n.language;
  const isXs = useMediaQuery('(max-width:800px)');
  const openPopup = useSelector(openPopupSelector);
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const localeText = useLocalText();
  const danhmucTN = useSelector(selectedDanhmuctotnghiepSelector);
  const reloadData = useSelector(reloadDataSelector);
  const navigate = useNavigate();
  const formik = useFormik({
    initialValues: {
      IdNamThi: '',
      TieuDe: '',
      GhiChu: '',
      NamThi: '',
      NgayCapBang: '',
      SoQuyetDinh: '',
      HinhThucDaoTao: '',
      HeDaoTao: '',
      TenKyThi: '',
      SoTruong: 0,
      SoHocSinh: 0,
      SoTruongDaGui: 0,
      SoTruongDaDuyet: 0
    }
  });

  const [pageState, setPageState] = useState({
    isLoading: false,
    data: [],
    total: 0,
    order: 0,
    orderDir: 'ASC',
    startIndex: 0,
    pageSize: 5
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
    }
  ];

  useEffect(() => {
    const fetchData = async () => {
      const danhmucTNbyid = await getById(danhmucTN.id);
      const datadanhmucTN = danhmucTNbyid.data;
      const ngay_fm = convertISODateToFormattedDate(datadanhmucTN.ngayCapBang);
      if (danhmucTN) {
        formik.setValues({
          id: danhmucTN.id,
          TieuDe: datadanhmucTN.tieuDe,
          GhiChu: datadanhmucTN.ghiChu,
          NamThi: datadanhmucTN.namThi,
          HinhThucDaoTao: datadanhmucTN.hinhThucDaoTao,
          HeDaoTao: datadanhmucTN.maHeDaoTao,
          TenKyThi: datadanhmucTN.tenKyThi,
          NgayCapBang: convertFormattedDateToISODate(ngay_fm),
          SoQuyetDinh: datadanhmucTN.soQuyetDinh,
          SoTruong: datadanhmucTN.tongSoTruong !== 0 ? datadanhmucTN.tongSoTruong : '0',
          SoHocSinh: datadanhmucTN.soLuongNguoiHoc !== 0 ? datadanhmucTN.soLuongNguoiHoc : '0',
          SoTruongDaGui: datadanhmucTN.tongSoTruongDaGui !== 0 ? datadanhmucTN.tongSoTruongDaGui : '0',
          SoTruongDaDuyet: datadanhmucTN.tongSoTruongDaDuyet !== 0 ? datadanhmucTN.tongSoTruongDaDuyet : '0'
        });
      }
      dispatch(setReloadData(false));
    };
    if (openPopup) {
      fetchData();
    }
  }, [danhmucTN, reloadData, openPopup]);

  useEffect(() => {
    const fetchData = async () => {
      setPageState((old) => ({ ...old, isLoading: true }));
      const params = await createSearchParams(pageState);
      params.append('idDanhMucTotNghiep', danhmucTN.id);
      const response = await thongKeGetTruongHasPermision(params);
      const check = handleResponseStatus(response, navigate);
      if (check) {
        const data = await response.data;
        const dataWithIds = data?.truongs?.map((row, index) => ({
          id: index + 1,
          trangThai: row.soDaGui == 0 ? t('Chưa gửi') : t('Đã gửi'),
          ...row
        }));
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
    if (danhmucTN) {
      fetchData();
    }
  }, [pageState.search, pageState.order, pageState.orderDir, pageState.startIndex, pageState.pageSize, danhmucTN]);

  return (
    <form>
      <Grid container justifyContent={'center'}>
        <Grid item container xs={12} my={1} spacing={1}>
          <Grid item container xs={12} spacing={1}>
            <Grid item xs={isXs ? 12 : 6}>
              <FormControlComponent xsLabel={0} xsForm={12} label={t('danhmuctotnghiep.field.tieude')}>
                <InputForm formik={formik} name="TieuDe" type="text" isDisabled />
              </FormControlComponent>
            </Grid>
            <Grid xs={isXs ? 12 : 6} item>
              <FormControlComponent xsLabel={0} xsForm={12} label={t('quyetdinhtotnghiep.title')}>
                <InputForm formik={formik} name="SoQuyetDinh" type="text" isDisabled />
              </FormControlComponent>
            </Grid>
          </Grid>
          <Grid item container xs={12} spacing={1}>
            <Grid item xs={isXs ? 12 : 6}>
              <FormControlComponent xsLabel={0} xsForm={12} label={t('hinhthucdaotao.title')}>
                <InputForm formik={formik} name="HinhThucDaoTao" type="text" isDisabled />
              </FormControlComponent>
            </Grid>
            <Grid item xs={isXs ? 12 : 6}>
              <FormControlComponent xsLabel={0} xsForm={12} label={t('kỳ thi')}>
                <InputForm formik={formik} name="TenKyThi" type="text" isDisabled />
              </FormControlComponent>
            </Grid>
          </Grid>
          <Grid item container xs={12} spacing={1}>
            <Grid item xs={isXs ? 12 : 4}>
              <FormControlComponent xsLabel={0} xsForm={12} label={t('danhmuctotnghiep.title.ngay')}>
                <InputForm formik={formik} name="NgayCapBang" type="date" isDisabled />
              </FormControlComponent>
            </Grid>
            <Grid item xs={isXs ? 12 : 4}>
              <FormControlComponent xsLabel={0} xsForm={12} label={t('hedaotao.title')}>
                <InputForm formik={formik} name="HeDaoTao" type="text" isDisabled />
              </FormControlComponent>
            </Grid>
            <Grid item xs={isXs ? 12 : 4}>
              <FormControlComponent xsLabel={0} xsForm={12} label={t('danhmuctotnghiep.field.namtotnghiep')}>
                <InputForm formik={formik} name="NamThi" type="text" isDisabled />
              </FormControlComponent>
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <FormControlComponent xsLabel={0} xsForm={12} label={t('danhmuctotnghiep.field.ghichu')}>
              <InputForm formik={formik} name="GhiChu" placeholder="Ghi chú" isMulltiline minRows={3} isDisabled />
            </FormControlComponent>
          </Grid>
          <Grid item container xs={12} spacing={1}>
            <Grid item xs={isXs ? 12 : 3}>
              <FormControlComponent xsLabel={0} xsForm={12} label={t('Số trường đã gửi')}>
                <InputForm formik={formik} name="SoTruongDaGui" type="text" isDisabled />
              </FormControlComponent>
            </Grid>
            <Grid item xs={isXs ? 12 : 3}>
              <FormControlComponent xsLabel={0} xsForm={12} label={t('Tổng số trường')}>
                <InputForm formik={formik} name="SoTruong" type="text" isDisabled />
              </FormControlComponent>
            </Grid>
            <Grid item xs={isXs ? 12 : 3}>
              <FormControlComponent xsLabel={0} xsForm={12} label={t('Số trường đã duyệt ')}>
                <InputForm formik={formik} name="SoTruongDaDuyet" type="text" isDisabled />
              </FormControlComponent>
            </Grid>
            <Grid item xs={isXs ? 12 : 3}>
              <FormControlComponent xsLabel={0} xsForm={12} label={t('danhmuctotnghiep.title.sohocsinh')}>
                <InputForm formik={formik} name="SoHocSinh" type="text" isDisabled />
              </FormControlComponent>
            </Grid>
          </Grid>
        </Grid>
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
        <Grid item xs={12} container spacing={1} mt={1} justifyContent="flex-end">
          <Grid item>
            <ExitButton />
          </Grid>
        </Grid>
      </Grid>
    </form>
  );
};

export default Detail;
