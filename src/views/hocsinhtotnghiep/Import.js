import { Button, FormControl, Grid, Input, InputLabel, MenuItem, Select, useMediaQuery } from '@mui/material';
import SaveButton from 'components/button/SaveButton';
import ExitButton from 'components/button/ExitButton';
import FormControlComponent from 'components/form/FormControlComponent ';
import { useState } from 'react';
import { useEffect } from 'react';
import { ImportHocSinh } from 'services/nguoihoctotnghiepService';
import { donviSelector, openPopupSelector, userLoginSelector } from 'store/selectors';
import { setLoading, setOpenPopup, showAlert } from 'store/actions';
import { useDispatch, useSelector } from 'react-redux';
import { IconFilePlus } from '@tabler/icons';
import { useTranslation } from 'react-i18next';
import { getAllDanhmucTN } from 'services/danhmuctotnghiepService';
import { getAllKhoathiByDMTN } from 'services/khoathiService';
import { convertISODateToFormattedDate } from 'utils/formatDate';

function Import() {
  const isXs = useMediaQuery('(max-width:600px)');
  const dispatch = useDispatch();
  const [dataDMTNs, setDataDMTNs] = useState([]);
  const [dataDMTN, setDataDMTN] = useState('');
  const [khoaThis, setKhoaThis] = useState([]);
  const [khoaThi, setKhoaThi] = useState('');
  const [selectFile, setSelectFile] = useState('');
  const donvi = useSelector(donviSelector);
  const user = useSelector(userLoginSelector);
  const openPopup = useSelector(openPopupSelector);
  const [selectedFileName, setSelectedFileName] = useState('');
  const [selectDanhmuc, setSelectDanhmuc] = useState('');
  const { t } = useTranslation();

  useEffect(() => {
    const fetchDataDL = async () => {
      try {
        dispatch(setLoading(true));
        const danhmuc = await getAllDanhmucTN();
        const dataDM = danhmuc.data;
        setDataDMTNs(dataDM);
        setSelectDanhmuc(dataDM && dataDM.length > 0 ? dataDM[0].id : '');
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchDataDL();
  }, []);

  useEffect(() => {
    const fetchDataDL = async () => {
      const response = await getAllKhoathiByDMTN(selectDanhmuc);
      if (response.data && response.data.length > 0) {
        setKhoaThis(response.data);
      } else {
        setKhoaThis([]);
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
      values.append('IdTruong', donvi.id);
      values.append('IdDanhMucTotNghiep', dataDMTN ? dataDMTN : dataDMTNs && dataDMTNs.length > 0 ? dataDMTNs[0].id : '');
      values.append('IdKhoaThi', khoaThi ? khoaThi : khoaThis && khoaThis.length > 0 ? khoaThis[0].id : '');
      values.append('NguoiThucHien', user.username);
      values.append('fileExcel', selectFile);
      const Import = await ImportHocSinh(values);
      if (Import.isSuccess == false) {
        dispatch(showAlert(new Date().getTime().toString(), 'error', Import.message.toString()));
      } else {
        dispatch(setOpenPopup(false));
        dispatch(showAlert(new Date().getTime().toString(), 'success', Import.message.toString()));
      }
    } catch (error) {
      console.error('error' + error);
      dispatch(showAlert(new Date().getTime().toString(), 'error', error.toString()));
    }
  };
  useEffect(() => {
    if (openPopup) {
      setDataDMTN('');
      setKhoaThi('');
      setSelectFile(null);
      setSelectedFileName(null);
    }
  }, [openPopup]);
  return (
    <form onSubmit={submitFile}>
      <Grid item xs={12} container spacing={2} justifyContent="flex-end">
        <Grid item container xs={12} spacing={isXs ? 1 : 2} my={1}>
          <Grid item container xs={isXs ? 7 : 5}>
            <FormControlComponent xsForm={12}>
              <FormControl fullWidth variant="outlined">
                <InputLabel>{t('Danh mục tốt nghiệp')}</InputLabel>
                <Select
                  label={t('Danh mục tốt nghiệp')}
                  size="small"
                  name="danhMuc"
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
          <Grid item container xs={isXs ? 5 : 4}>
            <FormControlComponent xsForm={12}>
              <FormControl fullWidth variant="outlined">
                <InputLabel>{t('Khóa thi')}</InputLabel>
                <Select
                  label={t('Khóa thi')}
                  size="small"
                  name="khoaThi"
                  value={khoaThi ? khoaThi : khoaThis && khoaThis.length > 0 ? khoaThis[0].id : ''}
                  onChange={(e) => setKhoaThi(e.target.value)}
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
          <Grid item container xs={isXs ? 5 : 3} mt={'10px'}>
            <Input type="file" accept=".xlsx, .xls" style={{ display: 'none' }} id="fileInput" onChange={handleOnchangfile} />
            <label htmlFor="fileInput">
              <Button variant="outlined" component="span" color="success" startIcon={<IconFilePlus />}>
                {t('button.upload')}
              </Button>
            </label>
          </Grid>
        </Grid>
        <Grid item xs={isXs ? 12 : 3} textAlign={isXs ? 'left' : ''}>
          <Grid item>{selectedFileName && <span>{selectedFileName}</span>}</Grid>
        </Grid>
        <Grid item xs={12} container spacing={2} justifyContent="flex-end">
          <Grid item>
            <SaveButton />
          </Grid>
          <Grid item>
            <ExitButton />
          </Grid>
        </Grid>
      </Grid>
    </form>
  );
}
export default Import;
