import { DataGrid } from '@mui/x-data-grid';
import { useFormik } from 'formik';
import MainCard from 'components/cards/MainCard';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setReloadData, setOpenSubPopup } from 'store/actions';
import { openPopupSelector, reloadDataSelector, selectedPhoigocSelector, openSubPopupSelector } from 'store/selectors';
import { useNavigate } from 'react-router-dom';
import { handleResponseStatus } from 'utils/handleResponseStatus';
import { useTranslation } from 'react-i18next';
import { IconTransferIn, IconFilePlus, IconDownload, IconSearch } from '@tabler/icons';
import useLocalText from 'utils/localText';
import { createSearchParams } from 'utils/createSearchParams';
import { convertISODateTimeToFormattedDateTime } from 'utils/formatDate';
import i18n from 'i18n';
import React from 'react';
import { Grid, useMediaQuery, Button, Input, FormControl, Select, MenuItem, InputLabel } from '@mui/material';
import BackToTop from 'components/scroll/BackToTop';
import { getSearchPhoiDaHuyByIdPhoiGoc } from 'services/phoigocService';
import FormControlComponent from 'components/form/FormControlComponent ';
import InputForm from 'components/form/InputForm';
import usePhoicabietValidationSchema from 'components/validations/phoicabietValidation';
import QuickSearch from 'components/form/QuickSearch';
import config from 'config';
import XacNhanHuySoHieuPhoi from './XacNhanHuySoHieuPhoi';
import Popup from 'components/controls/popup';
import SelectForm from 'components/form/SelectForm';

const lyDoHuyList = [
  {
    id: 1,
    value: 'Chứng chỉ bị hư hỏng'
  },
  {
    id: 2,
    value: 'Viết sai'
  },
  {
    id: 3,
    value: 'Chất lượng không đảm bảo'
  },
  {
    id: 4,
    value: 'Chưa sử dụng do thay đổi mẫu'
  }
];

const PhoiCaBiet = () => {
  const isXs = useMediaQuery('(max-width:600px)');
  const PhoicabietValidationSchema = usePhoicabietValidationSchema();
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
  const openSubPopup = useSelector(openSubPopupSelector);
  const [title, setTitle] = useState('');
  const [form, setForm] = useState('');
  const [pageState, setPageState] = useState({
    idphoigoc: selectedPhoigoc.id,
    isLoading: false,
    data: [],
    total: 0,
    order: 1,
    orderDir: 'ASC',
    startIndex: 0,
    pageSize: 10,
    search: '',
    lyDoHuy: []
  });
  const formik = useFormik({
    initialValues: {
      IdPhoiGoc: selectedPhoigoc.id,
      soHieus: '',
      LyDoHuy: ''
    },
    validationSchema: PhoicabietValidationSchema,
    onSubmit: async () => {
      setTitle(t('Xác nhận thu hồi '));
      setForm('delete');
      dispatch(setOpenSubPopup(true));
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
      params.append('lydo', pageState.lyDoHuy.join(';'));
      params.append('idphoigoc', selectedPhoigoc.id);
      console.log(params);
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

    if (!openPopup) {
      setPageState({
        idphoigoc: selectedPhoigoc.id,
        isLoading: false,
        data: [],
        total: 0,
        order: 1,
        orderDir: 'ASC',
        startIndex: 0,
        pageSize: 10,
        search: '',
        lyDoHuy: []
      });
    }

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

  const handelSelectBoxChange = (e) => {
    const { value } = e.target;
    console.log(value);

    setPageState((prev) => ({
      ...prev,
      lyDoHuy: value
    }));
  };
  return (
    <>
      <MainCard hideInstruct title={t('Hủy số hiệu phôi')}>
        <Grid item container spacing={1} mb={2} display={'flex'} alignItems={'center'} justifyContent={'center'}>
          <Grid item container xs={isXs ? 12 : 6}>
            <Grid item xs={12}>
              <FormControlComponent xsLabel={isXs ? 0 : 2} xsForm={isXs ? 12 : 10} isRequire label={t('Số hiệu phôi')}>
                <InputForm formik={formik} name="soHieus" placeholder={t('Các số hiệu cách nhau bằng dấu phẩy')} />
              </FormControlComponent>
            </Grid>
            <Grid item mt={2} xs={12}>
              <FormControlComponent xsLabel={isXs ? 0 : 2} xsForm={isXs ? 12 : 10} isRequire label={t('Lý do hủy')}>
                <FormControl fullWidth variant="outlined">
                  <SelectForm
                    formik={formik}
                    keyProp="value"
                    valueProp="value"
                    item={lyDoHuyList}
                    name="LyDoHuy"
                    value={formik.values.LyDoHuy}
                    onChange={(e) => formik.setFieldValue('LyDoHuy', e.target.value)}
                  />
                </FormControl>
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
            <Button variant="contained" fullWidth onClick={formik.handleSubmit} color="error" startIcon={<IconTransferIn />}>
              {t('Hủy số hiệu phôi')}
            </Button>
          </Grid>
        </Grid>
      </MainCard>
      <Grid>
        <MainCard hideInstruct title={t('Danh sách số hiệu phôi đã hủy')}>
          <Grid container spacing={2} justifyContent={'center'} alignItems={'center'} my={1}>
            <Grid item xs={2.5} minWidth={120}>
              <FormControl fullWidth variant="outlined" size="small">
                <InputLabel>{t('Lý do hủy')}</InputLabel>
                <Select
                  multiple
                  value={pageState.lyDoHuy}
                  onChange={handelSelectBoxChange}
                  renderValue={(selected) => selected.join('; ')}
                  label={t('Lý do hủy')}
                >
                  {lyDoHuyList.map((lydo) => (
                    <MenuItem key={lydo.value} value={lydo.value}>
                      {lydo.value}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item md={4} sm={4} lg={2} xs={6}>
              <Button
                variant="contained"
                title={t('button.search')}
                fullWidth
                onClick={() => setSearch(!search)}
                color="info"
                startIcon={<IconSearch />}
              >
                {t('button.search')}
              </Button>
            </Grid>
          </Grid>
          <Grid container justifyContent="flex-end" mb={1} sx={{ marginTop: '-15px' }} spacing={1}>
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
      {form !== '' && (
        <Popup
          title={title}
          form={form}
          openPopup={openSubPopup}
          type="subpopup"
          maxWidth={'sm'}
          bgcolor={form === 'delete' ? '#F44336' : '#2196F3'}
        >
          {form === 'delete' ? (
            <XacNhanHuySoHieuPhoi
              formik={formik}
              selectFile={selectFile}
              setSelectFile={setSelectFile}
              selectedFileName={selectedFileName}
              setSelectedFileName={setSelectedFileName}
            />
          ) : (
            ''
          )}
        </Popup>
      )}
    </>
  );
};

export default PhoiCaBiet;
