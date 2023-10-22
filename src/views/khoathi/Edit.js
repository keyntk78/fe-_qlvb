import { React } from 'react';
import { FormControl, Grid, TextField, useMediaQuery } from '@mui/material';
import { useFormik } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { showAlert, setOpenSubPopup, setReloadData } from 'store/actions';
import {
  openSubPopupSelector,
  reloadDataSelector,
  selectedKhoathiSelector,
  selectedNamthiSelector,
  userLoginSelector
} from 'store/selectors';
import InputForm from 'components/form/InputForm';
import { useTranslation } from 'react-i18next';
import { convertJsonToFormData } from 'utils/convertJsonToFormData';
import { editKhoathi, getKhoathiById } from 'services/khoathiService';
import useKhoathiValidationSchema from 'components/validations/khoathiValidation';
import { convertFormattedDateToISODate, convertISODateToFormattedDate } from 'utils/formatDate';
import FormControlComponent from 'components/form/FormControlComponent ';
import FormGroupButton from 'components/button/FormGroupButton';

const EditKhoathi = () => {
  const isXs = useMediaQuery('(max-width:800px)');
  const reloadData = useSelector(reloadDataSelector);
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const selectedNamthi = useSelector(selectedNamthiSelector);
  const selectedKhoathi = useSelector(selectedKhoathiSelector);
  const user = useSelector(userLoginSelector);
  const khoathiValidationSchema = useKhoathiValidationSchema();
  const openSubPopup = useSelector(openSubPopupSelector);

  const formik = useFormik({
    initialValues: {
      Ten: '',
      Ngay: ''
    },
    validationSchema: khoathiValidationSchema,
    onSubmit: async (values) => {
      try {
        const convertValues = await convertJsonToFormData(values);
        convertValues.append('Id', selectedKhoathi.id);
        convertValues.append('NguoiThucHien', user.username);
        const namthiUpdated = await editKhoathi(selectedNamthi.id, convertValues);
        if (namthiUpdated.isSuccess == false) {
          dispatch(showAlert(new Date().getTime().toString(), 'error', namthiUpdated.message.toString()));
        } else {
          dispatch(setOpenSubPopup(false));
          dispatch(setReloadData(true));
          dispatch(showAlert(new Date().getTime().toString(), 'success', namthiUpdated.message.toString()));
        }
      } catch (error) {
        console.error('Error updating function:', error);
        dispatch(showAlert(new Date().getTime().toString(), 'error', error.toString()));
      }
    }
  });

  useEffect(() => {
    const fetchData = async () => {
      const khoathibyid = await getKhoathiById(selectedNamthi.id, selectedKhoathi.id);
      const datakhoathi = khoathibyid.data;
      const ngay_fm = convertISODateToFormattedDate(datakhoathi.ngay);
      if (selectedKhoathi) {
        formik.setValues({
          Ten: datakhoathi.ten || '',
          Ngay: convertFormattedDateToISODate(ngay_fm) || ''
        });
      }
      dispatch(setReloadData(false));
    };
    if(openSubPopup) {
      fetchData();
    }
  }, [openSubPopup, selectedKhoathi, selectedNamthi, reloadData]);

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
        <Grid item xs={12} container spacing={2} justifyContent="flex-end">
          <FormGroupButton type="subpopup" />
        </Grid>
      </Grid>
    </form>
  );
};

export default EditKhoathi;
