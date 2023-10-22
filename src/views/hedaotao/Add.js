import React from 'react';
import { Grid, useMediaQuery } from '@mui/material';
import { useFormik } from 'formik';
import { setOpenPopup, setReloadData, showAlert } from 'store/actions';
import { useDispatch, useSelector } from 'react-redux';
import InputForm from 'components/form/InputForm';
import { useTranslation } from 'react-i18next';
import { openPopupSelector, userLoginSelector } from 'store/selectors';
import { useEffect } from 'react';
import { convertJsonToFormData } from 'utils/convertJsonToFormData';
import { createHedaotao } from 'services/hedaotaoService';
import useHedaotaoValidationSchema from 'components/validations/hedaotaoValidation';
import FormGroupButton from 'components/button/FormGroupButton';
import FormControlComponent from 'components/form/FormControlComponent ';

const AddHedaotao = () => {
  const isXs = useMediaQuery('(max-width:800px)');
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const hedaotaoValidationSchema = useHedaotaoValidationSchema();
  const openPopup = useSelector(openPopupSelector);
  const user = useSelector(userLoginSelector);
  const formik = useFormik({
    initialValues: {
      Ma: '',
      Ten: ''
    },
    validationSchema: hedaotaoValidationSchema,
    onSubmit: async (values) => {
      try {
        const convertValues = await convertJsonToFormData(values);
        convertValues.append('NguoiThucHien', user.username);
        const addedNamthi = await createHedaotao(convertValues);
        if (addedNamthi.isSuccess == false) {
          dispatch(showAlert(new Date().getTime().toString(), 'error', addedNamthi.message.toString()));
        } else {
          dispatch(setOpenPopup(false));
          dispatch(setReloadData(true));
          dispatch(showAlert(new Date().getTime().toString(), 'success', addedNamthi.message.toString()));
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
          <FormControlComponent xsLabel={isXs ? 0 : 4} xsForm={isXs ? 12 : 8} isRequire label={t('hedaotao.input.label.Ma')}>
            <InputForm formik={formik} name="Ma" type="text" />
          </FormControlComponent>
          <FormControlComponent xsLabel={isXs ? 0 : 4} xsForm={isXs ? 12 : 8} isRequire label={t('hedaotao.input.label.Ten')}>
            <InputForm formik={formik} name="Ten" type="text" />
          </FormControlComponent>
        </Grid>
        <Grid item xs={12} container spacing={2} justifyContent="flex-end">
          <FormGroupButton />
        </Grid>
      </Grid>
    </form>
  );
};

export default AddHedaotao;
