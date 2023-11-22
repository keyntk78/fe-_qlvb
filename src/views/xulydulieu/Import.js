import { Button, Grid, Input, useMediaQuery } from '@mui/material';
import SaveButton from 'components/button/SaveButton';
import ExitButton from 'components/button/ExitButton';
import { useState } from 'react';
import { useEffect } from 'react';
import { openPopupSelector, openSubPopupSelector, userLoginSelector } from 'store/selectors';
import { setOpenSubPopup, showAlert } from 'store/actions';
import { useDispatch, useSelector } from 'react-redux';
import { IconFilePlus } from '@tabler/icons';
import { useTranslation } from 'react-i18next';
import Popup from 'components/controls/popup';
import DanhSachImport from './DanhSachImport';
import { ImportDanhMuc } from 'services/xulydulieuService';

function Import({ selectedValue, selectedName }) {
  const isXs = useMediaQuery('(max-width:800px)');
  const dispatch = useDispatch();
  const [selectFile, setSelectFile] = useState('');
  const user = useSelector(userLoginSelector);
  const openPopup = useSelector(openPopupSelector);
  const [selectedFileName, setSelectedFileName] = useState('');
  const openSubPopup = useSelector(openSubPopupSelector);
  const { t } = useTranslation();
  const [title, setTitle] = useState('');
  const [form, setForm] = useState('');

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
      values.append('Key', selectedValue);
      values.append('NguoiThucHien', user.username);
      values.append('FileImport', selectFile);
      const Import = await ImportDanhMuc(values);
      if (Import.isSuccess == false) {
        dispatch(setOpenSubPopup(false));
        dispatch(showAlert(new Date().getTime().toString(), 'error', Import.error));
      } else {
        setTitle(t(`Danh Mục [${selectedName}]`));
        setForm('import');
        dispatch(setOpenSubPopup(true));
      }
    } catch (error) {
      console.error('error' + error);
      dispatch(showAlert(new Date().getTime().toString(), 'error', error.toString()));
    }
  };

  useEffect(() => {
    if (openPopup) {
      setSelectFile(null);
      setSelectedFileName(null);
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
