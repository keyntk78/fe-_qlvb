import { React } from 'react';
import { Grid, useMediaQuery } from '@mui/material';
import { useFormik } from 'formik';
import { useFunctionValidationSchema } from '../../components/validations/functionValidation';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { editFunction, getFunctionById } from 'services/functionService';
import { showAlert, setOpenPopup, setReloadData } from 'store/actions';
import { openPopupSelector, selectedFunctionSelector } from 'store/selectors';
import InputForm from 'components/form/InputForm';
import { useTranslation } from 'react-i18next';
import FormControlComponent from 'components/form/FormControlComponent ';
import FormGroupButton from 'components/button/FormGroupButton';

const EditFunction = () => {
  const isXs = useMediaQuery('(max-width:800px)');
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const selectedFunction = useSelector(selectedFunctionSelector);
  const functionValidationSchema = useFunctionValidationSchema();
  const openPopup = useSelector(openPopupSelector);
  const formik = useFormik({
    initialValues: {
      name: '',
      description: '',
      action: ''
    },
    validationSchema: functionValidationSchema,
    onSubmit: async (values) => {
      try {
        const functionUpdated = await editFunction(values);
        if (functionUpdated.isSuccess == false) {
          dispatch(showAlert(new Date().getTime().toString(), 'error', functionUpdated.message.toString()));
        } else {
          dispatch(setReloadData(true));
          dispatch(setOpenPopup(false));
          dispatch(showAlert(new Date().getTime().toString(), 'success', functionUpdated.message.toString()));
        }
      } catch (error) {
        console.error('Error updating function:', error);
        dispatch(showAlert(new Date().getTime().toString(), 'error', error.toString()));
      }
    }
  });

  useEffect(() => {
    const fetchData = async () => {
      const functionbyid = await getFunctionById(selectedFunction.functionId);
      const datamonthi = functionbyid.data;
      if (selectedFunction || openPopup) {
        formik.setValues({
          functionId: selectedFunction.functionId,
          name: datamonthi.name || '',
          description: datamonthi.description || ''
        });
      }
      dispatch(setReloadData(false));
    };
    if(openPopup) {
      fetchData();
    }
  }, [selectedFunction, openPopup]);

  return (
    <form onSubmit={formik.handleSubmit}>
      <Grid container spacing={1} my={2}>
        <FormControlComponent xsLabel={isXs ? 0 : 3} xsForm={isXs ? 12 : 9} isRequire label={t('function.input.label.name')}>
          <InputForm formik={formik} name="name" type="text" />
        </FormControlComponent>
        <FormControlComponent xsLabel={isXs ? 0 : 3} xsForm={isXs ? 12 : 9} label={t('function.input.label.description')}>
          <InputForm formik={formik} name="description" type="text" />
        </FormControlComponent>
        <Grid item xs={12} container spacing={2} justifyContent="flex-end">
          <FormGroupButton />
        </Grid>
      </Grid>
    </form>
  );
};

export default EditFunction;
