import { Button, Grid, Input, useMediaQuery } from '@mui/material';
import SaveButton from 'components/button/SaveButton';
import ExitButton from 'components/button/ExitButton';
//import FormControlComponent from 'components/form/FormControlComponent ';
import { useState } from 'react';
import { useEffect } from 'react';
import { openPopupSelector, openSubPopupSelector } from 'store/selectors';
import { setOpenSubPopup, showAlert } from 'store/actions';
import { useDispatch, useSelector } from 'react-redux';
import { IconFilePlus } from '@tabler/icons';
import { useTranslation } from 'react-i18next';
// import { getAllDanhmucTN, getAllTruong } from 'services/sharedService';
//import { getAllDonvi } from 'services/donvitruongService';
// import { getAllKhoathiByDMTN } from 'services/khoathiService';
//import { convertISODateToFormattedDate } from 'utils/formatDate';
// import { ImportDanhSachVanBang } from 'services/xacminhvanbangService';
import Popup from 'components/controls/popup';
//import DanhSachImport from './DanhSachImport';
//import InputForm1 from 'components/form/InputForm1';
import DanhSachImport from './DanhSachImport';

function Import({ selectedValue, selectedName }) {
  const isXs = useMediaQuery('(max-width:800px)');
  const dispatch = useDispatch();
  //   const [dataDMTNs, setDataDMTNs] = useState('');
  //   const [dataDonvis, setDataDonvis] = useState('');
  //   const [dataDMTN, setDataDMTN] = useState('');
  //   const [dataDonvi, setDataDonvi] = useState('');
  //   const [khoaThis, setKhoaThis] = useState([]);
  // const [selectKhoaThi, setSelectKhoaThi] = useState('');
  const [selectFile, setSelectFile] = useState('');
  //   const user = useSelector(userLoginSelector);
  const openPopup = useSelector(openPopupSelector);
  const [selectedFileName, setSelectedFileName] = useState('');
  //   const [selectDanhmuc, setSelectDanhmuc] = useState('');
  const openSubPopup = useSelector(openSubPopupSelector);
  const { t } = useTranslation();

  const [title, setTitle] = useState('');
  const [form, setForm] = useState('');
  //   useEffect(() => {
  //     const fetchDataDL = async () => {
  //       try {
  //         dispatch(setLoading(true));
  //         const danhmuc = await getAllDanhmucTN(user ? user.username : '');
  //         setDataDMTNs(danhmuc.data);
  //         const donvi = await getAllTruong(user ? user.username : '');
  //         setDataDonvis(donvi.data);
  //         setSelectDanhmuc(danhmuc && danhmuc.data.length > 0 ? danhmuc.data[0].id : '');
  //       } catch (error) {
  //         console.error('Error fetching data:', error);
  //         setDataDMTN([]);
  //         setDataDonvi([]);
  //       }
  //     };
  //     fetchDataDL();
  //   }, [user]);

  //   useEffect(() => {
  //     const fetchDataDL = async () => {
  //       const response = await getAllKhoathiByDMTN(selectDanhmuc);
  //       if (response.data && response.data.length > 0) {
  //         setKhoaThis(response.data);
  //         setSelectKhoaThi(response.data[0].id);
  //       } else {
  //         setKhoaThis([]);
  //         setSelectKhoaThi('');
  //       }
  //       dispatch(setLoading(false));
  //     };
  //     if (selectDanhmuc) {
  //       fetchDataDL();
  //     }
  //   }, [selectDanhmuc]);

  const handleOnchangfile = (e) => {
    const file = e.target.files[0];
    setSelectFile(file);
    setSelectedFileName(file.name);
    e.target.value = null;
  };
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
      setTitle(t('Danh Sách văn bằng import'));
      setForm('import');
      dispatch(setOpenSubPopup(true));
      //   const values = new FormData();
      //   values.append('IdTruong', dataDonvi ? dataDonvi : dataDonvis && dataDonvis.length > 0 ? dataDonvis[0].id : '');
      //   values.append('IdDanhMucTotNghiep', dataDMTN ? dataDMTN : dataDMTNs && dataDMTNs.length > 0 ? dataDMTNs[0].id : '');
      //   values.append('IdKhoaThi', selectKhoaThi ? selectKhoaThi : khoaThis && khoaThis.length > 0 ? khoaThis[0].id : '');
      //   values.append('NguoiThucHien', user.username);
      //   values.append('fileExcel', selectFile);
      //   dispatch(selectedDonvitruong(dataDonvi ? dataDonvi : dataDonvis && dataDonvis.length > 0 ? dataDonvis[0].id : ''));
      //   dispatch(selectedDanhmuctotnghiep(dataDMTN ? dataDMTN : dataDMTNs && dataDMTNs.length > 0 ? dataDMTNs[0].id : ''));
      //   const Import = await ImportDanhSachVanBang(values);
      //   if (Import.isSuccess == false) {
      //     //dispatch(showAlert(new Date().getTime().toString(), 'error', Import.message.toString()));
      //   } else {
      //     setTitle(t('Danh Sách văn bằng import'));
      //     setForm('import');
      //     dispatch(setOpenSubPopup(true));
      //     // dispatch(showAlert(new Date().getTime().toString(), 'success', Import.message.toString()));
      //   }
    } catch (error) {
      console.error('error' + error);
      dispatch(showAlert(new Date().getTime().toString(), 'error', error.toString()));
    }
  };

  useEffect(() => {
    if (openPopup) {
      //setDataDMTN('');
      //setDataDonvi('');
      setSelectFile(null);
      setSelectedFileName(null);
      // formik.resetForm();
    }
  }, [openPopup]);

  return (
    <>
      <form onSubmit={submitFile}>
        <div>
          <p style={{ marginBottom: '0px', fontSize: '17px' }}>
            {t('Import danh mục :')} <span style={{ fontWeight: 'bold' }}>{selectedName}</span>
          </p>
        </div>
        <Grid item xs={12} container spacing={2} justifyContent="flex-end">
          <Grid item container xs={12} spacing={1} my={1}>
            <Grid item xs={isXs ? 12 : 3} md={5} lg={3}>
              <Input type="file" accept=".xlsx, .xls" style={{ display: 'none' }} id="fileInput" onChange={handleOnchangfile} />
              <label htmlFor="fileInput">
                <Button variant="outlined" component="span" color="success" startIcon={<IconFilePlus />}>
                  {t('button.upload')}
                </Button>
              </label>
            </Grid>
            <Grid item xs={isXs ? 12 : 8} md={6} lg={8} sx={{ mt: 2 }}>
              {' '}
              {selectedFileName && <span>{selectedFileName}</span>}
            </Grid>
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
      {form !== '' && (
        <Popup
          title={title}
          form={form}
          openPopup={openSubPopup}
          type="subpopup"
          maxWidth={'lg'}
          bgcolor={form === 'delete' ? '#F44336' : '#2196F3'}
        >
          {form === 'import' ? <DanhSachImport selectedValue={selectedValue} selectedName={selectedName} /> : ''}
        </Popup>
      )}
    </>
  );
}
export default Import;
