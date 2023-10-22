import React from 'react';
import { Grid, useMediaQuery } from '@mui/material';
import { useFormik } from 'formik';
import { createRole } from 'services/roleService';
import { setOpenPopup, showAlert, setReloadData } from 'store/actions';
import { useDispatch, useSelector } from 'react-redux';
import { useRoleValidationSchema } from 'components/validations/roleValidation';
import { useTranslation } from 'react-i18next';
import InputForm from 'components/form/InputForm';
import FormGroupButton from 'components/button/FormGroupButton';
import { openPopupSelector } from 'store/selectors';
import { useEffect } from 'react';
import FormControlComponent from 'components/form/FormControlComponent ';

const AddRole = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const roleValidationSchema = useRoleValidationSchema();
  const openPopup = useSelector(openPopupSelector);
  const isXs = useMediaQuery('(max-width:800px)');

  const formik = useFormik({
    initialValues: {
      name: ''
    },
    validationSchema: roleValidationSchema,
    onSubmit: async (values) => {
      try {
        const addedRoles = await createRole(values);
        if (addedRoles.isSuccess == false) {
          dispatch(showAlert(new Date().getTime().toString(), 'error', addedRoles.message.toString()));
        } else {
          dispatch(setOpenPopup(false));
          dispatch(setReloadData(true));
          dispatch(showAlert(new Date().getTime().toString(), 'success', addedRoles.message.toString()));
        }
      } catch (error) {
        console.error('error' + error);
        dispatch(showAlert(new Date().getTime().toString(), 'error', error.toString()));
      }
    }
  });

  useEffect(() => {
    if (openPopup) {
      formik.resetForm();
    }
  }, [openPopup]);

  return (
    <form onSubmit={formik.handleSubmit}>
      <Grid container spacing={1} my={2}>
        <FormControlComponent xsLabel={isXs ? 0 : 3} xsForm={isXs ? 12 : 9} isRequire label={t('role.input.label.name')}>
          <InputForm formik={formik} name="name" type="text" />
        </FormControlComponent>
        <FormGroupButton />
      </Grid>
    </form>
  );
};

export default AddRole;
