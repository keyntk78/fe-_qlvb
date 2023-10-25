import { Button, Divider, Grid, Input, Tooltip, useMediaQuery } from '@mui/material';
import InputForm1 from 'components/form/InputForm1';
import { useFormik } from 'formik';
import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { donviSelector, openPopupSelector, openSubPopupSelector, userLoginSelector } from 'store/selectors';
import { generateDocument } from './Xulyxuatword_nhieunguoi';
import AnimateButton from 'components/extended/AnimateButton';
import { IconFileExport, IconFilePlus, IconPrinter } from '@tabler/icons';
import ExitButton from 'components/button/ExitButton';
import { selectedHocsinh, setLoading, setOpenPopup, setOpenSubPopup, showAlert } from 'store/actions';
import { useTranslation } from 'react-i18next';
import ButtonSuccess from 'components/buttoncolor/ButtonSuccess';
import { DataGrid } from '@mui/x-data-grid';
import { Language } from '@mui/icons-material';
import ActionButtons from 'components/button/ActionButtons';
import Popup from 'components/controls/popup';
import BackToTop from 'components/scroll/BackToTop';
import DeleteHocSinhDuocChon from './Delete';
import { AddListLichSuXacMinh, getCauHinhXacMinhVanBang } from 'services/xacminhvanbangService';
import useXacMinhVanBangValidationSchema from 'components/validations/xacminhvanbangValidation';
import { convertISODateToFormattedDate } from 'utils/formatDate';
import ExportExcel from './ExportExcel';

const Xacminhnhieunguoi = () => {
  const isXs = useMediaQuery('(max-width:800px)');
  const { t } = useTranslation();
  const openPopup = useSelector(openPopupSelector);
  const openSubPopup = useSelector(openSubPopupSelector);
  const [selectedFileName, setSelectedFileName] = useState('');
  const dispatch = useDispatch();
  const [title, setTitle] = useState('');
  const [form, setForm] = useState('');
  const [datas, setDatas] = useState(null);
  const donvi = useSelector(donviSelector);
  const [selectFile, setSelectFile] = useState('');
  const user = useSelector(userLoginSelector);

  const handleDelete = (hocsinh) => {
    setTitle(t('Xóa học sinh được chọn'));
    setForm('delete');
    console.log(hocsinh);
    dispatch(selectedHocsinh(hocsinh));
    dispatch(setOpenSubPopup(true));
  };
  const handleExport = async (e) => {
    e.preventDefault();
    dispatch(setLoading(true));
    await ExportExcel(rows, DataToExportWord);
    dispatch(setLoading(false));
  };
  const columns = [
    {
      field: 'id',
      headerName: t('serial'),
      width: 50,
      sortable: false,
      filterable: false
    },
    {
      flex: 1.5,
      field: 'hoTen',
      headerName: t('user.field.fullname'),
      minWidth: 180
    },
    {
      flex: 1,
      field: 'ngaySinh',
      headerName: t('Ngày sinh'),
      minWidth: 100
    },
    {
      flex: 1,
      field: 'noiSinh',
      headerName: t('Nơi Sinh'),
      minWidth: 100
    },
    {
      flex: 1.5,
      field: 'khoaThi',
      headerName: t('Khóa Thi'),
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
          <ActionButtons type="delete" handleDelete={handleDelete} params={params.row} />
        </>
      )
    }
  ];
  const data = JSON.parse(localStorage.getItem('hocsinhs')) || [];
  const rows = data.map((row, index) => ({
    id: index + 1,
    idx: row.idx,
    hoTen: row.hoTen,
    ngaySinh: row.ngaySinh_fm,
    noiSinh: row.noiSinh,
    soHieuVanBang: row.soHieuVanBang,
    khoaThi: convertISODateToFormattedDate(row.khoaThi),
    idHocSinh: row.id,
    cccdHocSinh: row.cccd
  }));
  const lstData = data.map((row) => ({
    idHocSinh: row.id
  }));

  const idArray = lstData.map((item) => item.idHocSinh);

  console.log(lstData, idArray);
  const formik = useFormik({
    initialValues: {
      donViXacMinh: '',
      ngayBanHanh: '',
      congVanSo: ''
    },
    validationSchema: useXacMinhVanBangValidationSchema(),
    onSubmit: async () => {
      const values = new FormData();
      idArray.forEach((id, index) => {
        values.append(`IdHocSinhs[${index}]`, id);
      });
      values.append('DonViYeuCauXacMinh', formik.values.donViXacMinh);
      values.append('CongVanSo', formik.values.congVanSo);
      values.append('NgayTrenCongVan', formik.values.ngayBanHanh);
      values.append('FileYeuCau', selectFile);
      values.append('NguoiThucHien', user.username);
      await AddListLichSuXacMinh(values);
      setLoading(true);
      generateDocument(rows, DataToExportWord);
      setLoading(false);
      dispatch(setOpenPopup(false));
      dispatch(showAlert(new Date().getTime().toString(), 'success', 'In Thành Công'));
      localStorage.removeItem('hocsinhs');
    }
  });

  const handleOnchangfile = (e) => {
    const file = e.target.files[0];
    setSelectedFileName(file.name);
    setSelectFile(file);
    e.target.value = null;
  };

  useEffect(() => {
    const fetchData = async () => {
      const response = await getCauHinhXacMinhVanBang(donvi.id);
      const datas = response.data;
      console.log(response.data);
      setDatas({
        uyBanNhanDan: datas.uyBanNhanDan.toUpperCase(),
        coQuanCapBang: datas.coQuanCapBang.toUpperCase(),
        diaPhuongCapBang: datas.diaPhuongCapBang.toUpperCase(),
        nguoiKy: datas.nguoiKyBang.toUpperCase()
      });
    };
    fetchData();
  }, [donvi.id]);

  const DataToExportWord = {
    uyBanNhanDan: datas ? datas.uyBanNhanDan : '',
    coQuanCapBang: datas ? datas.coQuanCapBang : '',
    diaPhuongCapBang: datas ? datas.diaPhuongCapBang : '',
    donViXacMinh: formik.values.donViXacMinh ? formik.values.donViXacMinh.toUpperCase() : '',
    ngay: formik.values.ngayBanHanh ? new Date(formik.values.ngayBanHanh).getDate() : 0,
    thang: formik.values.ngayBanHanh ? new Date(formik.values.ngayBanHanh).getMonth() + 1 : 0,
    nam: formik.values.ngayBanHanh ? new Date(formik.values.ngayBanHanh).getFullYear() : 0,
    congVanSo: formik.values.congVanSo ? formik.values.congVanSo.toUpperCase() : '',
    nguoiKy: datas ? datas.nguoiKy : '',
    soLuong: data ? data.length : 0
  };

  useEffect(() => {
    if (openPopup) {
      formik.resetForm();
      setSelectedFileName('');
    }
  }, [openPopup]);

  return (
    <form onSubmit={formik.handleSubmit}>
      <div style={{ borderBottom: '2px solid black', fontWeight: 'bold', paddingTop: 3 }}>
        <p>{t('Thông tin cần bổ sung')}</p>
      </div>
      <Grid container spacing={1}>
        <Grid item xs={6} sm={12} md={12}>
          <InputForm1
            xs={12}
            label={'Kính gửi đơn vị cần xác minh'}
            name="donViXacMinh"
            formik={formik}
            placeholder={t('Kính gửi đơn vị cần xác minh')}
          />
        </Grid>
        <Grid item xs={6} sm={4} md={4.5}>
          <InputForm1 xs={12} label={'Công văn số'} name="congVanSo" formik={formik} placeholder={t('Công văn số')} />
        </Grid>
        <Grid item xs={6} sm={4} md={4.5}>
          <InputForm1 xs={12} label={'Ngày ra công văn'} name="ngayBanHanh" formik={formik} type="date" />
        </Grid>

        <Grid item container xs={isXs ? 5 : 3} mt={'30px'}>
          <Input type="file" accept=".xlsx, .xls" style={{ display: 'none' }} id="fileInput" onChange={handleOnchangfile} />
          <label htmlFor="fileInput">
            <Button variant="outlined" component="span" color="success" startIcon={<IconFilePlus />}>
              {t('button.upload')}
            </Button>
          </label>
        </Grid>
      </Grid>
      <Grid item xs={isXs ? 12 : 3} textAlign={'right'}>
        <Grid item>{selectedFileName && <span>{selectedFileName}</span>}</Grid>
      </Grid>
      <div style={{ borderBottom: '2px solid black', fontWeight: 'bold', paddingTop: 3 }}>
        <p>{t('Danh sách đã chọn')}</p>
      </div>
      <Grid container spacing={1} mt={3}>
        <DataGrid
          autoHeight
          columns={columns}
          rows={rows}
          pagination
          localeText={Language === 'vi' ? localeText : null}
          disableSelectionOnClick={true}
        />
        {form !== '' && (
          <Popup
            title={title}
            form={form}
            openPopup={openSubPopup}
            type="subpopup"
            maxWidth={'sm'}
            bgcolor={form === 'delete' ? '#F44336' : '#2196F3'}
          >
            {form === 'delete' ? <DeleteHocSinhDuocChon /> : ''}
          </Popup>
        )}
        <BackToTop />
      </Grid>
      <Grid item mt={2}>
        <Divider />
      </Grid>
      <Grid item xs={12} container spacing={2} justifyContent="flex-end" mt={1}>
        <Grid item xs={12} container spacing={2} justifyContent="flex-end">
          <Grid item xs={12} container spacing={2} justifyContent="flex-end" mt={1}>
            <Grid item>
              <AnimateButton>
                <Tooltip title={'Tạo văn bản'} placement="bottom">
                  <Button type="submit" color="info" variant="contained" size="medium" startIcon={<IconPrinter />}>
                    Tạo văn bản
                  </Button>
                </Tooltip>
              </AnimateButton>
            </Grid>
            <Grid item>
              <ButtonSuccess title={t('Tạo danh sách')} icon={IconFileExport} onClick={handleExport} />
            </Grid>
            <Grid item>
              <ExitButton />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </form>
  );
};

export default Xacminhnhieunguoi;
