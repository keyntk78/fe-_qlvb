import { React } from 'react';
import { Grid, useMediaQuery } from '@mui/material';
import { useFormik } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { showAlert, setOpenPopup, setReloadData } from 'store/actions';
import { openPopupSelector, selectedDanTocSelector, userLoginSelector } from 'store/selectors';
import InputForm from 'components/form/InputForm';
import { useTranslation } from 'react-i18next';
import { convertJsonToFormData } from 'utils/convertJsonToFormData';
import FormControlComponent from 'components/form/FormControlComponent ';
import FormGroupButton from 'components/button/FormGroupButton';
import { editDanToc, getDanTocById } from 'services/dantocService';
import useDanTocValidationSchema from 'components/validations/dantocValidation';

const EditDanToc = () => {
  const isXs = useMediaQuery('(max-width:600px)');
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const selectedDanToc = useSelector(selectedDanTocSelector);
  const user = useSelector(userLoginSelector);
  const dantocValidationSchema = useDanTocValidationSchema();
  const openPopup = useSelector(openPopupSelector);

  const formik = useFormik({
    initialValues: {
      Ten: ''
    },
    validationSchema: dantocValidationSchema,
    onSubmit: async (values) => {
      try {
        const convertValues = await convertJsonToFormData(values);
        convertValues.append('Id', selectedDanToc.id);
        convertValues.append('NguoiThucHien', user.username);
        const namthiUpdated = await editDanToc(convertValues);
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
      const response = await getDanTocById(selectedDanToc.id);
      const data = response.data;
      if (selectedDanToc || openPopup) {
        formik.setValues({
          Ten: data.ten || ''
        });
      }
      dispatch(setReloadData(false));
    };
    if (openPopup) {
      fetchData();
    }
  }, [selectedDanToc, openPopup]);

  return (
    <form onSubmit={formik.handleSubmit}>
      <Grid container>
        <Grid item container xs={isXs ? 12 : 10} spacing={isXs ? 1 : 2} my={1} ml={isXs ? 0 : 3}>
          <FormControlComponent xsLabel={isXs ? 0 : 2} xsForm={isXs ? 12 : 10} isRequire label={t('Tên')}>
            <InputForm formik={formik} name="Ten" />
          </FormControlComponent>
        </Grid>
        <Grid item xs={12} container spacing={2} justifyContent="flex-end">
          <FormGroupButton />
        </Grid>
      </Grid>
    </form>
  );
};

export default EditDanToc;
