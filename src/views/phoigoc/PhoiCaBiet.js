import { DataGrid } from '@mui/x-data-grid';
import { useFormik } from 'formik';
import MainCard from 'components/cards/MainCard';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setReloadData, showAlert } from 'store/actions';
import { openPopupSelector, reloadDataSelector, selectedPhoigocSelector, userLoginSelector } from 'store/selectors';
import { useNavigate } from 'react-router-dom';
import { handleResponseStatus } from 'utils/handleResponseStatus';
import { useTranslation } from 'react-i18next';
import { IconTransferIn, IconFilePlus, IconDownload } from '@tabler/icons';
import useLocalText from 'utils/localText';
import { createSearchParams } from 'utils/createSearchParams';
import { convertISODateTimeToFormattedDateTime } from 'utils/formatDate';
import i18n from 'i18n';
import React from 'react';
import { Grid, useMediaQuery, Button, Input } from '@mui/material';
import BackToTop from 'components/scroll/BackToTop';
import { getSearchPhoiDaHuyByIdPhoiGoc, createPhoiCaBiet } from 'services/phoigocService';
import FormControlComponent from 'components/form/FormControlComponent ';
import InputForm from 'components/form/InputForm';
import usePhoicabietValidationSchema from 'components/validations/phoicabietValidation';
import QuickSearch from 'components/form/QuickSearch';
import config from 'config';

const PhoiCaBiet = () => {
  const isXs = useMediaQuery('(max-width:600px)');
  const PhoicabietValidationSchema = usePhoicabietValidationSchema();
  const user = useSelector(userLoginSelector);
  const language = i18n.language;
  const { t } = useTranslation();
  const localeText = useLocalText();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const reloadData = useSelector(reloadDataSelector);
  const selectedPhoigoc = useSelector(selectedPhoigocSelector);
  const [search, setSearch] = useState(false);
  const [selectedFileName, setSelectedFileName] = useState('');
  const openPopup = useSelector(openPopupSelector);
  const [selectFile, setSelectFile] = useState('');
  const [pageState, setPageState] = useState({
    idphoigoc: selectedPhoigoc.id,
    isLoading: false,
    data: [],
    total: 0,
    order: 1,
    orderDir: 'ASC',
    startIndex: 0,
    pageSize: 10
  });
  const formik = useFormik({
    initialValues: {
      IdPhoiGoc: selectedPhoigoc.id,
      soHieus: '',
      LyDoHuy: ''
    },
    validationSchema: PhoicabietValidationSchema,
    onSubmit: async (values) => {
      try {
        const form = new FormData();
        form.append('IdPhoiGoc', values.IdPhoiGoc);
        form.append('LyDoHuy', values.LyDoHuy);
        values.soHieus.split(',').forEach((item) => {
          form.append('ListSoHieu', item);
        });
        form.append('FileBienBanHuyPhoi', selectFile);
        form.append('PathFileBienBanHuyPhoi', selectedFileName);
        form.append('NguoiThucHien', user.username);

        const PhoiCaBiet = await createPhoiCaBiet(form);
        if (PhoiCaBiet.isSuccess == false) {
          dispatch(showAlert(new Date().getTime().toString(), 'error', PhoiCaBiet.message.toString()));
        } else {
          dispatch(setReloadData(true));
          dispatch(showAlert(new Date().getTime().toString(), 'success', PhoiCaBiet.message.toString()));
        }
      } catch (error) {
        console.error('Error updating function:', error);
        dispatch(showAlert(new Date().getTime().toString(), 'error', error.toString()));
      }
    }
  });
  useEffect(() => {
    if (openPopup) {
      formik.resetForm();
      setSelectedFileName('');
      setSelectFile('');
    }
  }, [openPopup]);
  const columns = [
    {
      field: 'idx',
      headerName: t('serial'),
      width: 50,
      sortable: false,
      filterable: false
    },
    {
      flex: 1.5,
      field: 'soHieuVBHuy',
      headerName: t('Số hiệu văn bằng'),
      minWidth: 180
    },
    {
      flex: 1,
      field: 'nguoiHuy',
      headerName: t('Người hủy'),
      minWidth: 100
    },
    {
      flex: 1.5,
      field: 'lyDoHuy',
      headerName: t('Lý do hủy'),
      minWidth: 180
    },
    {
      flex: 1,
      field: 'cancelTime',
      headerName: t('Thời gian hủy'),
      minWidth: 150
    },
    {
      flex: 0.1,
      field: 'pathFileBienBanHuyPhoi',
      headerName: t('BB Hủy Bỏ'),
      minWidth: 100,
      align: 'center',
      renderCell: (params) => {
        const pathFileYeuCau = config.urlImages + params.row.pathFileBienBanHuyPhoi;
        return (
          <a href={pathFileYeuCau} download title="Tải xuống">
            {params.row.pathFileBienBanHuyPhoi ? <IconDownload /> : ''}
          </a>
        );
      }
    }
  ];

  useEffect(() => {
    const fetchData = async () => {
      setPageState((old) => ({ ...old, isLoading: true }));
      const params = await createSearchParams(pageState);
      params.append('idphoigoc', selectedPhoigoc.id);
      const response = await getSearchPhoiDaHuyByIdPhoiGoc(params);
      const check = handleResponseStatus(response, navigate);
      if (check) {
        const data = await response.data;

        const phoiDaHuys = data.phoiDaHuys.map((item, index) => ({
          ...item,
          idx: pageState.startIndex * pageState.pageSize + index + 1,
          cancelTime: item.ngayHuy == null ? 'Chưa truy cập ' : convertISODateTimeToFormattedDateTime(item.ngayHuy)
        }));

        dispatch(setReloadData(false));
        setPageState((old) => ({
          ...old,
          isLoading: false,
          data: phoiDaHuys,
          total: data.totalRow || 0
        }));
      }
    };
    if (openPopup) {
      fetchData();
    }
    setSearch(false);
  }, [pageState.order, pageState.orderDir, pageState.startIndex, pageState.pageSize, reloadData, search, openPopup]);

  const handleOnchangfile = (e) => {
    const file = e.target.files[0];
    setSelectedFileName(file.name);
    setSelectFile(file);
    e.target.value = null;
  };

  return (
    <>
      <MainCard title={t('Hủy số hiệu phôi')}>
        <Grid item container spacing={1} mb={2} display={'flex'} alignItems={'center'} justifyContent={'center'}>
          <Grid item container xs={isXs ? 12 : 6}>
            <Grid item xs={12}>
              <FormControlComponent xsLabel={isXs ? 0 : 2} xsForm={isXs ? 12 : 10} isRequire label={t('Số hiệu phôi')}>
                <InputForm formik={formik} name="soHieus" placeholder={t('Các số hiệu cách nhau bằng dấu phẩy')} />
              </FormControlComponent>
            </Grid>
            <Grid item mt={2} xs={12}>
              <FormControlComponent xsLabel={isXs ? 0 : 2} xsForm={isXs ? 12 : 10} isRequire label={t('Lý do hủy')}>
                <InputForm formik={formik} name="LyDoHuy" placeholder={t('Lý do hủy')} />
              </FormControlComponent>
            </Grid>
            <Grid item mt={2} xs={12}>
              <FormControlComponent xsLabel={isXs ? 0 : 2} xsForm={isXs ? 12 : 10} label={t('File đính kèm')}>
                <Grid item xs={12} display={'flex'} alignItems={'center'}>
                  <Input
                    type="file"
                    inputProps={{ accept: '.doc, .docx, .pdf' }}
                    style={{ display: 'none' }}
                    id="fileInput"
                    onChange={handleOnchangfile}
                  />
                  <label htmlFor="fileInput">
                    <Button variant="outlined" component="span" color="success" startIcon={<IconFilePlus />}>
                      {t('button.upload')}
                    </Button>
                  </label>
                  <Grid item mx={1}>
                    {selectedFileName && <span>{selectedFileName}</span>}
                  </Grid>
                </Grid>
              </FormControlComponent>
            </Grid>
          </Grid>
        </Grid>
        <Grid item container spacing={1} mb={2} justifyContent={'center'} alignItems={'center'}>
          <Grid item lg={2} md={3} sm={3} xs={isXs ? 12 : 6}>
            <Button variant="contained" fullWidth onClick={formik.handleSubmit} color="info" startIcon={<IconTransferIn />}>
              {t('Hủy số hiệu phôi')}
            </Button>
          </Grid>
        </Grid>
      </MainCard>
      <Grid>
        <MainCard title={t('Danh sách số hiệu phôi đã hủy')}>
          <Grid container justifyContent="flex-end" mb={1} sx={{ marginTop: '-15px' }}>
            <Grid item lg={3} md={4} sm={5} xs={7}>
              <QuickSearch
                value={pageState.search}
                onChange={(value) => setPageState((old) => ({ ...old, search: value }))}
                onSearch={() => setSearch(!search)}
              />
            </Grid>
          </Grid>
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
        </MainCard>
      </Grid>
      <BackToTop />
    </>
  );
};

export default PhoiCaBiet;
