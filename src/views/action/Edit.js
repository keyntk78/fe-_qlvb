import { React } from 'react';
import { Grid, useMediaQuery } from '@mui/material';
import { useFormik } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { showAlert, setReloadData, setOpenSubPopup } from 'store/actions';
import { openSubPopupSelector, reloadDataSelector, selectedActionSelector, selectedFunctionSelector } from 'store/selectors';
import InputForm from 'components/form/InputForm';
import { useTranslation } from 'react-i18next';
import useActionValidationSchema from 'components/validations/actionValidation';
import { editAction, getActionByidFunctionAction } from 'services/actionService';
import FormControlComponent from 'components/form/FormControlComponent ';
import FormGroupButton from 'components/button/FormGroupButton';

const EditAction = () => {
  const isXs = useMediaQuery('(max-width:800px)');
  const reloadData = useSelector(reloadDataSelector);
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const selectedFunction = useSelector(selectedFunctionSelector);
  const selectedAction = useSelector(selectedActionSelector);
  const actionValidationSchema = useActionValidationSchema();
  const openSubPopup = useSelector(openSubPopupSelector);

  const formik = useFormik({
    initialValues: {
      action: '',
      description: ''
    },
    validationSchema: actionValidationSchema,
    onSubmit: async (values) => {
      try {
        const actionUpdated = await editAction({
          ...values,
          functionActionId: selectedAction.functionActionId,
          functionId: selectedFunction.functionId
        });
        if (actionUpdated.isSuccess == false) {
          dispatch(showAlert(new Date().getTime().toString(), 'error', actionUpdated.message.toString()));
        } else {
          dispatch(setOpenSubPopup(false));
          dispatch(setReloadData(true));
          dispatch(showAlert(new Date().getTime().toString(), 'success', actionUpdated.message.toString()));
        }
      } catch (error) {
        console.error('Error updating function:', error);
        dispatch(showAlert(new Date().getTime().toString(), 'error', error.toString()));
      }
    }
  });
  useEffect(() => {
    if (openSubPopup) {
      formik.resetForm();
    }
  }, [openSubPopup]);
  useEffect(() => {
    const fetchData = async () => {
      const actionbyid = await getActionByidFunctionAction(selectedAction.functionActionId);
      const dataaction = actionbyid.data;
      if (selectedAction) {
        formik.setValues({
          action: dataaction.action || '',
          description: dataaction.description || ''
        });
      }
      dispatch(setReloadData(false));
    };
    if (openSubPopup) {
      fetchData();
    }
  }, [selectedAction, openSubPopup, reloadData]);

  return (
    <form onSubmit={formik.handleSubmit}>
      <Grid container spacing={1} my={2}>
        <FormControlComponent xsLabel={isXs ? 0 : 3} xsForm={isXs ? 12 : 9} isRequire label={t('action.input.label.action')}>
          <InputForm formik={formik} name="action" type="text" />
        </FormControlComponent>
        <FormControlComponent xsLabel={isXs ? 0 : 3} xsForm={isXs ? 12 : 9} isRequire label={t('action.input.label.description')}>
          <InputForm formik={formik} name="description" type="text" />
        </FormControlComponent>
        <Grid item xs={12} container spacing={2} justifyContent="flex-end">
          <FormGroupButton type="subpopup" />
        </Grid>
      </Grid>
    </form>
  );
};

export default EditAction;
