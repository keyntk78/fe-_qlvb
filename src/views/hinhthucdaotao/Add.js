import React from 'react';
import { Grid, useMediaQuery } from '@mui/material';
import { useFormik } from 'formik';
import { createHinhthucdaotao } from 'services/hinhthucdaotaoService';
import { setOpenPopup, showAlert, setReloadData } from 'store/actions';
import { useDispatch, useSelector } from 'react-redux';
import { useHinhthucdaotaoValidationSchema } from 'components/validations/hinhthucdaotaoValidation';
import { useTranslation } from 'react-i18next';
import InputForm from 'components/form/InputForm';
import { openPopupSelector, userLoginSelector } from 'store/selectors';
import { convertJsonToFormData } from 'utils/convertJsonToFormData';
import FormControlComponent from 'components/form/FormControlComponent ';
import FormGroupButton from 'components/button/FormGroupButton';
import { useEffect } from 'react';

const AddHinhthucdaotao = () => {
  const isXs = useMediaQuery('(max-width:800px)');
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const openPopup = useSelector(openPopupSelector);
  const hinhthucdaotaoValidationSchema = useHinhthucdaotaoValidationSchema();
  const user = useSelector(userLoginSelector);

  const formik = useFormik({
    initialValues: {
      ma: '',
      ten: '',
      nguoithuchien: user.username
    },
    validationSchema: hinhthucdaotaoValidationSchema,
    onSubmit: async (values) => {
      try {
        const formData = await convertJsonToFormData(values);
        const addedHinhthucdaotaos = await createHinhthucdaotao(formData);
        if (addedHinhthucdaotaos.isSuccess == false) {
          dispatch(showAlert(new Date().getTime().toString(), 'error', addedHinhthucdaotaos.message.toString()));
        } else {
          dispatch(setReloadData(true));
          dispatch(setOpenPopup(false));
          dispatch(showAlert(new Date().getTime().toString(), 'success', addedHinhthucdaotaos.message.toString()));
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
      <Grid container>
        <Grid item container xs={isXs ? 12 : 10} spacing={isXs ? 1 : 2} my={1} ml={isXs ? 0 : 3}>
          <FormControlComponent xsLabel={isXs ? 0 : 4.3} xsForm={isXs ? 12 : 7.7} isRequire label={t('hinhthucdaotao.field.ma')}>
            <InputForm formik={formik} name="ma" type="text" />
          </FormControlComponent>
          <FormControlComponent xsLabel={isXs ? 0 : 4.3} xsForm={isXs ? 12 : 7.7} isRequire label={t('hinhthucdaotao.field.ten')}>
            <InputForm formik={formik} name="ten" type="text" />
          </FormControlComponent>
        </Grid>
        <Grid item xs={12} container spacing={2} justifyContent="flex-end">
          <FormGroupButton />
        </Grid>
      </Grid>
    </form>
  );
};

export default AddHinhthucdaotao;
