import { Button, FormControl, Grid, Input, InputLabel, MenuItem, Select, useMediaQuery } from '@mui/material';
import SaveButton from 'components/button/SaveButton';
import ExitButton from 'components/button/ExitButton';
import FormControlComponent from 'components/form/FormControlComponent ';
import { useState } from 'react';
import { useEffect } from 'react';
import { donviSelector, openPopupSelector, openSubPopupSelector, userLoginSelector } from 'store/selectors';
import { setLoading, setOpenPopup, setOpenSubPopup, showAlert } from 'store/actions';
import { useDispatch, useSelector } from 'react-redux';
import { IconEye, IconFilePlus } from '@tabler/icons';
import { useTranslation } from 'react-i18next';
import { getAllDanhmucTN, getAllTruong } from 'services/sharedService';
import { getAllKhoathiByDMTN } from 'services/khoathiService';
import { convertISODateToFormattedDate } from 'utils/formatDate';
import Popup from 'components/controls/popup';
import NotificationForm from 'components/form/NotificationForm';
import { ImportDanhSachBangDaPhat } from 'services/capphatbangService';

function Import() {
  const isXs = useMediaQuery('(max-width:800px)');
  const dispatch = useDispatch();
  const [dataDMTNs, setDataDMTNs] = useState('');
  const [dataDonvis, setDataDonvis] = useState('');
  const [dataDMTN, setDataDMTN] = useState('');
  const [dataDonvi, setDataDonvi] = useState('');
  const [khoaThis, setKhoaThis] = useState([]);
  const [selectKhoaThi, setSelectKhoaThi] = useState('');
  const [selectFile, setSelectFile] = useState('');
  const user = useSelector(userLoginSelector);
  const openPopup = useSelector(openPopupSelector);
  const [selectedFileName, setSelectedFileName] = useState('');
  const [selectDanhmuc, setSelectDanhmuc] = useState('');
  const openSubPopup = useSelector(openSubPopupSelector);
  const { t } = useTranslation();
  const donvi = useSelector(donviSelector);
  const [data, setData] = useState('');

  useEffect(() => {
    const fetchDataDL = async () => {
      try {
        dispatch(setLoading(true));
        const danhmuc = await getAllDanhmucTN(user ? user.username : '');
        setDataDMTNs(danhmuc.data);
        const donvi = await getAllTruong(user ? user.username : '');
        setDataDonvis(donvi.data);
        setSelectDanhmuc(danhmuc && danhmuc.data.length > 0 ? danhmuc.data[0].id : '');
      } catch (error) {
        console.error('Error fetching data:', error);
        setDataDMTN([]);
        setDataDonvi([]);
      }
    };
    fetchDataDL();
  }, [user]);

  useEffect(() => {
    const fetchDataDL = async () => {
      const response = await getAllKhoathiByDMTN(selectDanhmuc);
      if (response.data && response.data.length > 0) {
        setKhoaThis(response.data);
        setSelectKhoaThi(response.data[0].id);
      } else {
        setKhoaThis([]);
        setSelectKhoaThi('');
      }
      dispatch(setLoading(false));
    };
    if (selectDanhmuc) {
      fetchDataDL();
    }
  }, [selectDanhmuc]);

  const handleOnchangfile = (e) => {
    const file = e.target.files[0];
    setSelectFile(file);
    setSelectedFileName(file.name);
    e.target.value = null;
  };

  useEffect(() => {
    if (openPopup) {
      setDataDMTN('');
      setDataDonvi('');
      setSelectFile(null);
      setSelectedFileName(null);
    }
  }, [openPopup]);
  const submitFile = async (e) => {
    e.preventDefault();
    if (!selectFile) {
      dispatch(showAlert(new Date().getTime().toString(), 'error', t('hocsinhtotnghiep.emptyfile')));
      return;
    }
    if (!selectFile.name.endsWith('.xlsx') && !selectFile.name.endsWith('.xls')) {
      dispatch(showAlert(new Date().getTime().toString(), 'error', t('hocsinhtotnghiep.formatfile')));
      return;
    }
    try {
      const values = new FormData();
      donvi != 0 && donvi.laPhong
        ? values.append('IdTruong', dataDonvi ? dataDonvi : dataDonvis && dataDonvis.length > 0 ? dataDonvis[0].id : '')
        : values.append('IdTruong', donvi.id);
      values.append('IdDanhMucTotNghiep', dataDMTN ? dataDMTN : dataDMTNs && dataDMTNs.length > 0 ? dataDMTNs[0].id : '');
      values.append('IdKhoaThi', selectKhoaThi ? selectKhoaThi : khoaThis && khoaThis.length > 0 ? khoaThis[0].id : '');
      values.append('NguoiThucHien', user.username);
      values.append('fileExcel', selectFile);

      const Import = await ImportDanhSachBangDaPhat(values);
      if (Import == false) {
        dispatch(setOpenSubPopup(true));
        setData(Import);
      } else {
        dispatch(setOpenSubPopup(true));
        setData(Import);
        dispatch(setOpenPopup(false));
      }
    } catch (error) {
      console.error('error' + error);
      dispatch(showAlert(new Date().getTime().toString(), 'error', error.toString()));
    }
  };
  return (
    <>
      <form onSubmit={submitFile}>
        <Grid item xs={12} container spacing={2}>
          <Grid item container xs={12} spacing={1} my={1} justifyContent="center">
            <Grid item container xs={isXs ? 12 : 3.5}>
              <FormControlComponent xsForm={12}>
                <FormControl fullWidth variant="outlined">
                  <InputLabel>{t('Danh mục tốt nghiệp')}</InputLabel>
                  <Select
                    label={t('Danh mục tốt nghiệp')}
                    size="small"
                    name="danhmuc"
                    value={dataDMTN ? dataDMTN : dataDMTNs && dataDMTNs.length > 0 ? dataDMTNs[0].id : ''}
                    onChange={(e) => {
                      setDataDMTN(e.target.value);
                      setSelectDanhmuc(e.target.value);
                    }}
                  >
                    {dataDMTNs && dataDMTNs.length > 0 ? (
                      dataDMTNs.map((dmtn) => (
                        <MenuItem key={dmtn.id} value={dmtn.id}>
                          {dmtn.tieuDe}
                        </MenuItem>
                      ))
                    ) : (
                      <MenuItem value="">{t('selected.nodata')}</MenuItem>
                    )}
                  </Select>
                </FormControl>
              </FormControlComponent>
            </Grid>
            <Grid item container xs={isXs ? 5 : 3}>
              <FormControlComponent xsForm={12}>
                <FormControl fullWidth variant="outlined">
                  <InputLabel>{t('Khóa thi')}</InputLabel>
                  <Select
                    label={t('Khóa thi')}
                    size="small"
                    name="khoaThi"
                    value={selectKhoaThi ? selectKhoaThi : ''}
                    onChange={(e) => setSelectKhoaThi(e.target.value)}
                  >
                    {khoaThis && khoaThis.length > 0 ? (
                      khoaThis.map((data) => (
                        <MenuItem key={data.id} value={data.id}>
                          {data && data.ngay ? convertISODateToFormattedDate(data.ngay) : ''}
                        </MenuItem>
                      ))
                    ) : (
                      <MenuItem value="">{t('selected.nodata')}</MenuItem>
                    )}
                  </Select>
                </FormControl>
              </FormControlComponent>
            </Grid>
            {donvi != 0 && donvi.laPhong && (
              <Grid item container xs={isXs ? 7 : 3.5}>
                <FormControlComponent xsForm={12}>
                  <FormControl fullWidth variant="outlined">
                    <InputLabel>{t('Đơn vị trường')}</InputLabel>
                    <Select
                      label={t('Đơn vị trường')}
                      size="small"
                      name="donvi"
                      value={dataDonvi ? dataDonvi : dataDonvis && dataDonvis.length > 0 ? dataDonvis[0].id : ''}
                      onChange={(e) => {
                        setDataDonvi(e.target.value);
                      }}
                    >
                      {dataDonvis && dataDonvis.length > 0 ? (
                        dataDonvis.map((data) => (
                          <MenuItem key={data.id} value={data.id}>
                            {data.ten}
                          </MenuItem>
                        ))
                      ) : (
                        <MenuItem value="">{t('selected.nodata')}</MenuItem>
                      )}
                    </Select>
                  </FormControl>
                </FormControlComponent>
              </Grid>
            )}
            <Grid item container xs={isXs ? 5 : 2} mt={'10px'}>
              <Input type="file" accept=".xlsx, .xls" style={{ display: 'none' }} id="fileInput" onChange={handleOnchangfile} />
              <label htmlFor="fileInput">
                <Button variant="outlined" component="span" color="success" startIcon={<IconFilePlus />}>
                  {t('button.upload')}
                </Button>
              </label>
            </Grid>
          </Grid>
          <Grid item xs={isXs ? 12 : 12} style={{ display: 'flex', justifyContent: 'flex-end' }}>
            {' '}
            {selectedFileName && <span>{selectedFileName}</span>}
          </Grid>
          <Grid item xs={12} container spacing={2} justifyContent="flex-end" mt={1}>
            <Grid item>
              <SaveButton />
            </Grid>
            <Grid item>
              <ExitButton />
            </Grid>
          </Grid>
        </Grid>
      </form>
      {/* {form !== '' && (
        <Popup
          title={title}
          form={form}
          openPopup={openSubPopup}
          type="subpopup"
          maxWidth={'lg'}
          bgcolor={form === 'delete' ? '#F44336' : '#2196F3'}
        >
          {form === 'import' ? <DanhSachImport /> : ''}
        </Popup>
      )} */}
      <Popup
        title="Kết quả import"
        type={'subpopup'}
        openPopup={openSubPopup}
        maxWidth={'sm'}
        icon={IconEye}
        bgcolor={data.isSuccess ? '#00B835' : '#F44336'}
      >
        {data && (
          <NotificationForm
            message={data.message}
            type={'subpopup'}
            success={data.isSuccess}
            url={data.data && data.data.path ? data.data.path : ''}
          />
        )}
      </Popup>
    </>
  );
}
export default Import;
