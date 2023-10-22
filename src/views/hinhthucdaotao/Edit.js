import React from 'react';
import { Grid, useMediaQuery } from '@mui/material';
import { useFormik } from 'formik';
import { useHinhthucdaotaoValidationSchema } from 'components/validations/hinhthucdaotaoValidation';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { editHinhthucdaotao, getHinhthucdaotaoById } from 'services/hinhthucdaotaoService';
import { showAlert, setOpenPopup, setReloadData } from 'store/actions';
import { openPopupSelector, reloadDataSelector, selectedHinhthucdaotaoSelector } from 'store/selectors';
import { useTranslation } from 'react-i18next';
import { userLoginSelector } from 'store/selectors';
import { convertJsonToFormData } from 'utils/convertJsonToFormData';
import InputForm from 'components/form/InputForm';
import FormControlComponent from 'components/form/FormControlComponent ';
import FormGroupButton from 'components/button/FormGroupButton';

const EditHinhthucdaotao = () => {
  const isXs = useMediaQuery('(max-width:800px)');
  const openPopup = useSelector(openPopupSelector);
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const hinhthucdaotaoValidationSchema = useHinhthucdaotaoValidationSchema();
  const user = useSelector(userLoginSelector);
  const htdt = useSelector(selectedHinhthucdaotaoSelector);
  const reloadData = useSelector(reloadDataSelector);

  const formik = useFormik({
    initialValues: {
      ma: '',
      ten: ''
    },

    validationSchema: hinhthucdaotaoValidationSchema,
    onSubmit: async (values) => {
      try {
        const formData = await convertJsonToFormData(values);
        const htdtUpdated = await editHinhthucdaotao(formData);
        if (htdtUpdated.isSuccess == false) {
          dispatch(showAlert(new Date().getTime().toString(), 'error', htdtUpdated.message.toString()));
        } else {
          dispatch(setReloadData(true));
          dispatch(setOpenPopup(false));
          dispatch(showAlert(new Date().getTime().toString(), 'success', htdtUpdated.message.toString()));
        }
      } catch (error) {
        console.error('Error updating role:', error);
        dispatch(showAlert(new Date().getTime().toString(), 'error', error.toString()));
      }
    }
  });

  useEffect(() => {
    const fetchData = async () => {
      const hinhthucdaotao = await getHinhthucdaotaoById(htdt.id);
      const datahinhthucdaotao = hinhthucdaotao.data;
      if (htdt) {
        formik.setValues({
          id: htdt.id,
          ma: datahinhthucdaotao.ma || '',
          ten: datahinhthucdaotao.ten || '',
          nguoithuchien: user.username
        });
      }
      dispatch(setReloadData(false));
    };
    if(openPopup) {
      fetchData();
    }
  }, [htdt, reloadData, openPopup]);

  return (
    <form onSubmit={formik.handleSubmit}>
      <Grid container>
        <Grid item container xs={10} spacing={isXs ? 1 : 2} my={1} ml={isXs ? 0 : 3}>
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

export default EditHinhthucdaotao;
