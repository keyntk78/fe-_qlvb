import React from 'react';
import { Grid, useMediaQuery } from '@mui/material';
import { useFormik } from 'formik';
import { createAction } from 'services/actionService';
import { showAlert, setReloadData, setOpenSubPopup } from 'store/actions';
import { useDispatch, useSelector } from 'react-redux';
import { useActionValidationSchema } from 'components/validations/actionValidation';
import InputForm from 'components/form/InputForm';
import { useTranslation } from 'react-i18next';
import { openSubPopupSelector, selectedFunctionSelector } from 'store/selectors';
import { useEffect } from 'react';
import FormControlComponent from 'components/form/FormControlComponent ';
import FormGroupButton from 'components/button/FormGroupButton';

const AddAction = () => {
  const isXs = useMediaQuery('(max-width:800px)');
  const selectedFunction = useSelector(selectedFunctionSelector);
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const acionValidationSchema = useActionValidationSchema();
  const openSubPopup = useSelector(openSubPopupSelector);

  const formik = useFormik({
    initialValues: {
      action: '',
      functionId: selectedFunction.functionId
    },
    validationSchema: acionValidationSchema,
    onSubmit: async (values) => {
      try {
        const addedAction = await createAction({
          ...values
        });
        if (addedAction.isSuccess == false) {
          dispatch(showAlert(new Date().getTime().toString(), 'error', addedAction.message.toString()));
        } else {
          dispatch(setOpenSubPopup(false));
          dispatch(setReloadData(true));
          dispatch(showAlert(new Date().getTime().toString(), 'success', addedAction.message.toString()));
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
  }, [openSubPopup]);
  return (
    <form onSubmit={formik.handleSubmit}>
      <Grid container spacing={1} my={2}>
        <FormControlComponent xsLabel={isXs ? 0 : 3} xsForm={isXs ? 12 : 9} isRequire label={t('action.input.label.action')}>
          <InputForm formik={formik} name="action" type="text" />
        </FormControlComponent>
        <Grid item xs={12} container spacing={2} justifyContent="flex-end">
          <FormGroupButton type="subpopup" />
        </Grid>
      </Grid>
    </form>
  );
};

export default AddAction;
