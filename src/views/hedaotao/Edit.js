import { React } from 'react';
import { Grid, useMediaQuery } from '@mui/material';
import { useFormik } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { showAlert, setOpenPopup, setReloadData } from 'store/actions';
import { openPopupSelector, selectedHedaotaoSelector, userLoginSelector } from 'store/selectors';
import InputForm from 'components/form/InputForm';
import { useTranslation } from 'react-i18next';
import { convertJsonToFormData } from 'utils/convertJsonToFormData';
import useHedaotaoValidationSchema from 'components/validations/hedaotaoValidation';
import { editHedaotao, getHedaotaoById } from 'services/hedaotaoService';
import FormControlComponent from 'components/form/FormControlComponent ';
import FormGroupButton from 'components/button/FormGroupButton';

const EditHedaotao = () => {
  const isXs = useMediaQuery('(max-width:800px)');
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const selectedHedaotao = useSelector(selectedHedaotaoSelector);
  const user = useSelector(userLoginSelector);
  const hedaotaoValidationSchema = useHedaotaoValidationSchema();
  const openPopup = useSelector(openPopupSelector);
  const formik = useFormik({
    initialValues: {
      Ma: '',
      Ten: ''
    },
    validationSchema: hedaotaoValidationSchema,
    onSubmit: async (values) => {
      try {
        const convertValues = await convertJsonToFormData(values);
        const hedaotaoUpdated = await editHedaotao(convertValues);
        if (hedaotaoUpdated.isSuccess == false) {
          dispatch(showAlert(new Date().getTime().toString(), 'error', hedaotaoUpdated.message.toString()));
        } else {
          dispatch(setOpenPopup(false));
          dispatch(setReloadData(true));
          dispatch(showAlert(new Date().getTime().toString(), 'success', hedaotaoUpdated.message.toString()));
        }
      } catch (error) {
        console.error('Error updating function:', error);
        dispatch(showAlert(new Date().getTime().toString(), 'error', error.toString()));
      }
    }
  });

  useEffect(() => {
    const fetchData = async () => {
      const hedaotaobyid = await getHedaotaoById(selectedHedaotao.id);
      const datahedaotao = hedaotaobyid.data;
      if (selectedHedaotao || openPopup) {
        formik.setValues({
          Id: selectedHedaotao.id,
          Ma: datahedaotao.ma || '',
          Ten: datahedaotao.ten || '',
          NguoiThucHien: user.username
        });
      }
      dispatch(setReloadData(false));
    };
    if (openPopup) {
      fetchData();
    }
  }, [selectedHedaotao, openPopup]);

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

export default EditHedaotao;
