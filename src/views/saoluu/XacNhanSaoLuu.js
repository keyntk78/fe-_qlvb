import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useState } from 'react';
import { setOpenPopup, setReloadData, showAlert } from 'store/actions';
import { useTranslation } from 'react-i18next';
import { IconDownload, IconRotateClockwise, IconFilePlus } from '@tabler/icons';
import { useFormik } from 'formik';
import { Grid, Input, Button, Typography } from '@mui/material';
import YesButton from 'components/button/YesButton';
import NoButton from 'components/button/NoButton';
import MuiTypography from '@mui/material/Typography';
import { userLoginSelector } from 'store/selectors';
import { backupData } from 'services/saoluuService';
import useKhoiphucValidationSchema from 'components/validations/khoiPhucValidationSchema';

const XacNhanSaoLuu = ({ type }) => {
  const dispatch = useDispatch();
  const KhoiPhucValidationSchema = useKhoiphucValidationSchema();
  const user = useSelector(userLoginSelector);
  const { t } = useTranslation();
  const [selectFile, setSelectFile] = useState('');
  const formik = useFormik({
    initialValues: {
      selectedFileName: ''
    },
    validationSchema: KhoiPhucValidationSchema,
    onSubmit: async (values) => {
      console.log(selectFile, values.selectedFileName);
    }
  });

  const handleBackup = async () => {
    try {
      const backup = await backupData(user.username);
      if (backup.isSuccess == false) {
        dispatch(showAlert(new Date().getTime().toString(), 'error', backup.message.toString()));
      } else {
        dispatch(setOpenPopup(false));
        dispatch(setReloadData(true));
        dispatch(showAlert(new Date().getTime().toString(), 'success', backup.message.toString()));
      }
    } catch (error) {
      console.error('error' + error);
      dispatch(showAlert(new Date().getTime().toString(), 'error', error.toString()));
    }
  };

  const handleOnchangfile = (e) => {
    const file = e.target.files[0];
    formik.setFieldValue('selectedFileName', file.name);
    setSelectFile(file);
    e.target.value = null;
  };

  return (
    <div style={{ textAlign: 'center' }}>
      {type === 'saoluu' ? <IconDownload size={100} color="#2196F3" /> : <IconRotateClockwise size={100} color="#2196F3" />}
      <MuiTypography variant="h4" gutterBottom m={2}>
        {type === 'saoluu' ? t(`Bạn có muốn sao lưu không?`) : t(`Vui lòng chọn file zip chứa dữ liệu sao lưu`)}
      </MuiTypography>
      {type !== 'saoluu' ? (
        <Grid container spacing={1} direction="row" justifyContent="center" my={2}>
          <Grid item xs={12} display={'flex'} alignItems={'center'} flexDirection={'column'}>
            <Input type="file" inputProps={{ accept: '.zip' }} style={{ display: 'none' }} id="fileInput" onChange={handleOnchangfile} />
            <label htmlFor="fileInput">
              <Button variant="outlined" component="span" color="success" startIcon={<IconFilePlus />}>
                {t('button.upload')}
              </Button>
            </label>
            <Grid item mx={1}>
              {formik.values['selectedFileName'] && <span>{formik.values['selectedFileName']}</span>}
            </Grid>
            <Grid item mx={1}>
              {formik.errors.selectedFileName ? (
                <Typography variant="h5" color="red" mt={1}>
                  {formik.errors.selectedFileName}
                </Typography>
              ) : (
                ''
              )}
            </Grid>
          </Grid>
        </Grid>
      ) : (
        ''
      )}
      <Grid container spacing={1} direction="row" justifyContent="center" my={1}>
        <Grid item>
          <YesButton color="primary" handleClick={type === 'saoluu' ? handleBackup : formik.handleSubmit} />
        </Grid>
        <Grid item>
          <NoButton />
        </Grid>
      </Grid>
    </div>
  );
};
export default XacNhanSaoLuu;
