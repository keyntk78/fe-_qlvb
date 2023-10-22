import React from 'react';
import { FormControl, Grid, TextField, useMediaQuery } from '@mui/material';
import { useFormik } from 'formik';
import { setOpenSubPopup, setReloadData, showAlert } from 'store/actions';
import { useDispatch, useSelector } from 'react-redux';
import InputForm from 'components/form/InputForm';
import { useTranslation } from 'react-i18next';
import SaveButton from 'components/button/SaveButton';
import ExitButton from 'components/button/ExitButton';
import { openSubPopupSelector, selectedNamthiSelector, userLoginSelector } from 'store/selectors';
import { useEffect } from 'react';
import { convertJsonToFormData } from 'utils/convertJsonToFormData';
import { createKhoathi } from 'services/khoathiService';
import useKhoathiValidationSchema from 'components/validations/khoathiValidation';
import FormControlComponent from 'components/form/FormControlComponent ';

const Addkhoathi = () => {
  const isXs = useMediaQuery('(max-width:800px)');
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const khoathiValidationSchema = useKhoathiValidationSchema();
  const openSubPopup = useSelector(openSubPopupSelector);
  const selectedNamthi = useSelector(selectedNamthiSelector);
  const user = useSelector(userLoginSelector);
  const formik = useFormik({
    initialValues: {
      Ten: '',
      Ngay: ''
    },
    validationSchema: khoathiValidationSchema,
    onSubmit: async (values) => {
      try {
        const convertValues = await convertJsonToFormData(values);
        convertValues.append('NguoiThucHien', user.username);
        const addedKhoathi = await createKhoathi(selectedNamthi.id, convertValues);
        if (addedKhoathi.isSuccess == false) {
          dispatch(showAlert(new Date().getTime().toString(), 'error', addedKhoathi.message.toString()));
        } else {
          dispatch(setOpenSubPopup(false));
          dispatch(setReloadData(true));
          dispatch(showAlert(new Date().getTime().toString(), 'success', addedKhoathi.message.toString()));
        }
      } catch (error) {
        console.error('error' + error);
        dispatch(showAlert(new Date().getTime().toString(), 'error', error.toString()));
      }
    }
  });

  useEffect(() => {
    if (openSubPopup) {
      formik.resetForm();
    }
  }, [openSubPopup, selectedNamthi]);

  return (
    <form onSubmit={formik.handleSubmit}>
      <Grid container>
        <Grid item container xs={isXs ? 12 : 10} spacing={isXs ? 1 : 2} my={1} ml={isXs ? 0 : 3}>
          <FormControlComponent xsLabel={isXs ? 0 : 3} xsForm={isXs ? 12 : 9} isRequire label={t('khoathi.input.label.Ten')}>
            <InputForm formik={formik} name="Ten" type="text" />
          </FormControlComponent>
          <FormControlComponent xsLabel={isXs ? 0 : 3} xsForm={isXs ? 12 : 9} isRequire label={t('khoathi.input.label.Ngay')}>
            <FormControl fullWidth variant="outlined" sx={{ width: '200px' }}>
              <TextField
                size="small"
                name="Ngay"
                type="date"
                value={formik.values.Ngay}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.Ngay && Boolean(formik.errors.Ngay)}
                helperText={formik.touched.Ngay && formik.errors.Ngay}
                InputLabelProps={{
                  shrink: true
                }}
              />
            </FormControl>
          </FormControlComponent>
        </Grid>
        <Grid item xs={12} container spacing={2} mt={1} justifyContent="flex-end">
          <Grid item>
            <SaveButton />
          </Grid>
          <Grid item>
            <ExitButton type="subpopup" />
          </Grid>
        </Grid>
      </Grid>
    </form>
  );
};

export default Addkhoathi;
