import { React } from 'react';
import { Grid, useMediaQuery } from '@mui/material';
import { useFormik } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { showAlert, setOpenPopup, setReloadData } from 'store/actions';
import { openPopupSelector, selectedNamthiSelector, userLoginSelector } from 'store/selectors';
import InputForm from 'components/form/InputForm';
import { useTranslation } from 'react-i18next';
import useNamthiValidationSchema from 'components/validations/namthiValidation';
import { editNamthi, getNamthiById } from 'services/namthiService';
import { convertJsonToFormData } from 'utils/convertJsonToFormData';
import FormControlComponent from 'components/form/FormControlComponent ';
import FormGroupButton from 'components/button/FormGroupButton';

const EditNamthi = () => {
  const isXs = useMediaQuery('(max-width:800px)');
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const selectedNamthi = useSelector(selectedNamthiSelector);
  const user = useSelector(userLoginSelector);
  const namthiValidationSchema = useNamthiValidationSchema();
  const openPopup = useSelector(openPopupSelector);

  const formik = useFormik({
    initialValues: {
      Ten: ''
    },
    validationSchema: namthiValidationSchema,
    onSubmit: async (values) => {
      try {
        const convertValues = await convertJsonToFormData(values);
        convertValues.append('Id', selectedNamthi.id);
        convertValues.append('NguoiThucHien', user.username);
        const namthiUpdated = await editNamthi(convertValues);
        if (namthiUpdated.isSuccess == false) {
          dispatch(showAlert(new Date().getTime().toString(), 'error', namthiUpdated.message.toString()));
        } else {
          dispatch(setOpenPopup(false));
          dispatch(setReloadData(true));
          dispatch(showAlert(new Date().getTime().toString(), 'success', namthiUpdated.message.toString()));
        }
      } catch (error) {
        console.error('Error updating year exam:', error);
        dispatch(showAlert(new Date().getTime().toString(), 'error', error.toString()));
      }
    }
  });

  useEffect(() => {
    const fetchData = async () => {
      const namthibyid = await getNamthiById(selectedNamthi.id);
      const datanamthi = namthibyid.data;
      if (selectedNamthi || openPopup) {
        formik.setValues({
          Ten: datanamthi.ten || ''
        });
      }
      dispatch(setReloadData(false));
    };
    if (openPopup) {
      fetchData();
    }
  }, [selectedNamthi, openPopup]);

  return (
    <form onSubmit={formik.handleSubmit}>
      <Grid container>
        <Grid item container xs={isXs ? 12 : 10} spacing={isXs ? 1 : 2} my={1} ml={isXs ? 0 : 3}>
          <FormControlComponent xsLabel={isXs ? 0 : 4} xsForm={isXs ? 12 : 8} isRequire label={t('namthi.input.label.Ten')}>
            <InputForm formik={formik} name="Ten" type="number" />
          </FormControlComponent>
        </Grid>
        <Grid item xs={12} container spacing={2} justifyContent="flex-end">
          <FormGroupButton />
        </Grid>
      </Grid>
    </form>
  );
};

export default EditNamthi;
