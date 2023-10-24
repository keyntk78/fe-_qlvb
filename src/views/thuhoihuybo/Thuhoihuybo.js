import { Button, Divider, Grid, Input, Tooltip, useMediaQuery } from '@mui/material';
import InputForm1 from 'components/form/InputForm1';
import { useFormik } from 'formik';
import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { openPopupSelector, openSubPopupSelector, selectedHocsinhSelector, userLoginSelector } from 'store/selectors';
import AnimateButton from 'components/extended/AnimateButton';
import { IconCheck, IconFilePlus } from '@tabler/icons';
import ExitButton from 'components/button/ExitButton';
import { setOpenSubPopup, showAlert } from 'store/actions';
import { useTranslation } from 'react-i18next';
import '../../index.css';
import Popup from 'components/controls/popup';
import XacNhanHuyBo from './XacNhanHuyBo';
import useThuHoiHuyBoValidationSchema from 'components/validations/thuhoihuyboValidation';
const Thuhoihuybo = () => {
  const isXs = useMediaQuery('(max-width:800px)');
  const { t } = useTranslation();
  const openPopup = useSelector(openPopupSelector);
  const [selectedFileName, setSelectedFileName] = useState('');
  const [selectFile, setSelectFile] = useState('');
  const selectedHocsinh = useSelector(selectedHocsinhSelector);
  const user = useSelector(userLoginSelector);
  const dispatch = useDispatch();
  const [title, setTitle] = useState('');
  const [form, setForm] = useState('');
  const openSubPopup = useSelector(openSubPopupSelector);

  const formik = useFormik({
    initialValues: {
      lyDo: ''
    },
    validationSchema: useThuHoiHuyBoValidationSchema()
  });
  const data = { IdHocSinh: selectedHocsinh.id, FileVanBan: selectFile, NguoiThucHien: user.username, LyDo: formik.values.lyDo };

  const handleOnchangfile = (e) => {
    const file = e.target.files[0];
    setSelectedFileName(file.name);
    setSelectFile(file);
    e.target.value = null;
  };
  const openDelete = () => {
    if (!selectFile) {
      dispatch(showAlert(new Date().getTime().toString(), 'error', t('Vui lòng chọn tệp')));
      return;
    }
    if (
      !selectFile.name.endsWith('.xlsx') &&
      !selectFile.name.endsWith('.xls') &&
      !selectFile.name.endsWith('.docx') &&
      !selectFile.name.endsWith('.doc')
    ) {
      dispatch(showAlert(new Date().getTime().toString(), 'error', t('Định dạng file không hợp lệ')));
      return;
    }
    if (formik.values.lyDo == '') {
      dispatch(showAlert(new Date().getTime().toString(), 'error', t('Vui lòng nhập lý do')));
      return;
    }
    setTitle(t('Xác nhận thu hồi '));
    setForm('delete');
    dispatch(setOpenSubPopup(true));
  };

  useEffect(() => {
    if (openPopup) {
      formik.resetForm();
      setSelectedFileName('');
    }
  }, [openPopup]);

  return (
    <>
      <div style={{ borderBottom: '2px solid black', fontWeight: 'bold', paddingTop: 3 }}>
        <p>{t('Thông tin hủy bỏ văng bằng chứng chỉ')}</p>
      </div>
      <Grid container spacing={1}>
        <Grid item xs={12} container spacing={2}>
          <Grid xs={isXs ? 4 : 2.4}>
            {' '}
            <p style={{ marginTop: '55px', marginLeft: '17px', color: 'black' }}>
              File quyết định hủy bỏ <span style={{ color: 'red' }}>(*)</span>
            </p>
          </Grid>
          <Grid item container xs={isXs ? 4 : 9} mt={'30px'}>
            <Input type="file" accept=".xlsx, .xls, .docx, .doc" style={{ display: 'none' }} id="fileInput" onChange={handleOnchangfile} />
            <label htmlFor="fileInput">
              <Button variant="outlined" component="span" color="success" startIcon={<IconFilePlus />}>
                {t('button.upload')}
              </Button>
            </label>
            <Grid item mt={'17px'} ml={'4px'}>
              {selectedFileName && <span>{selectedFileName}</span>}
            </Grid>
          </Grid>
        </Grid>

        <Grid item xs={12} container spacing={2} mt={-4}>
          <InputForm1
            formik={formik}
            minRows={3}
            maxRows={10}
            xs={12}
            name="lyDo"
            type="text"
            isMulltiline
            placeholder={t('Lý do hủy bỏ')}
            isRequired
            label={t('Lý do hủy bỏ')}
          />
        </Grid>
      </Grid>

      <Grid item mt={2}>
        <Divider />
      </Grid>
      <Grid item xs={12} container spacing={2} justifyContent="flex-end" mt={1}>
        <Grid item xs={12} container spacing={2} justifyContent="flex-end">
          <Grid item xs={12} container spacing={2} justifyContent="flex-end" mt={1}>
            <Grid item>
              <AnimateButton>
                <Tooltip title={'Xác nhận'} placement="bottom">
                  <Button color="info" variant="contained" size="medium" startIcon={<IconCheck />} onClick={openDelete}>
                    Xác nhận
                  </Button>
                </Tooltip>
              </AnimateButton>
            </Grid>
            <Grid item>
              <ExitButton />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      {form !== '' && (
        <Popup
          title={title}
          form={form}
          openPopup={openSubPopup}
          type="subpopup"
          maxWidth={'sm'}
          bgcolor={form === 'delete' ? '#F44336' : '#2196F3'}
        >
          {form === 'delete' ? <XacNhanHuyBo data={data} /> : ''}
        </Popup>
      )}
    </>
  );
};

export default Thuhoihuybo;
