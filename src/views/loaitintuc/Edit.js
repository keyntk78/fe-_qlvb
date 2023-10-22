import React from 'react';
import { Grid, useMediaQuery } from '@mui/material';
import { useFormik } from 'formik';
import { useLoaiTinTucValidationSchema } from 'components/validations/loaitintucValidation';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { showAlert, setOpenPopup, setReloadData } from 'store/actions';
import { openPopupSelector, reloadDataSelector, selectedLoaiTinTucSelector } from 'store/selectors';
import { useTranslation } from 'react-i18next';
import { userLoginSelector } from 'store/selectors';
import { convertJsonToFormData } from 'utils/convertJsonToFormData';
import InputForm from 'components/form/InputForm';
import FormControlComponent from 'components/form/FormControlComponent ';
import FormGroupButton from 'components/button/FormGroupButton';
import { editLoaiTinTuc, getLoaiTinTucById } from 'services/loaitintucService';

const EditLoaiTinTuc = () => {
  const isXs = useMediaQuery('(max-width:800px)');
  const openPopup = useSelector(openPopupSelector);
  const dispatch = useDispatch();
  const reloadData = useSelector(reloadDataSelector);
  const { t } = useTranslation();
  const loaiTinTucValidationSchema = useLoaiTinTucValidationSchema();
  const user = useSelector(userLoginSelector);
  const loaitintuc = useSelector(selectedLoaiTinTucSelector);
  const formik = useFormik({
    initialValues: {
      tieuDe: '',
      ghiChu: ''
    },
    validationSchema: loaiTinTucValidationSchema,
    onSubmit: async (values) => {
      try {
        const formData = await convertJsonToFormData(values);
        const dataUpdated = await editLoaiTinTuc(formData);
        if (dataUpdated.isSuccess == false) {
          dispatch(showAlert(new Date().getTime().toString(), 'error', dataUpdated.message.toString()));
        } else {
          dispatch(setReloadData(true));
          dispatch(setOpenPopup(false));
          dispatch(showAlert(new Date().getTime().toString(), 'success', dataUpdated.message.toString()));
        }
      } catch (error) {
        console.error('Error updating role:', error);
        dispatch(showAlert(new Date().getTime().toString(), 'error', error.toString()));
      }
    }
  });

  useEffect(() => {
    const fetchData = async () => {
      const loaitt = await getLoaiTinTucById(loaitintuc.id);
      const data = loaitt.data;
      if (loaitintuc) {
        formik.setValues({
          id: data.id,
          tieuDe: data.tieuDe || '',
          ghiChu: data.ghiChu || '',
          nguoithuchien: user.username
        });
      }
      dispatch(setReloadData(false));
    };
    if (openPopup) {
      fetchData();
    }
  }, [loaitintuc, reloadData, openPopup]);

  return (
    <form onSubmit={formik.handleSubmit}>
      <Grid container>
        <Grid item container xs={isXs ? 12 : 10} spacing={isXs ? 1 : 2} my={1} ml={isXs ? 0 : 3}>
          <FormControlComponent xsLabel={isXs ? 0 : 2} xsForm={isXs ? 12 : 10} isRequire label={t('Tiêu đề')}>
            <InputForm formik={formik} name="tieuDe" type="text" />
          </FormControlComponent>
          <FormControlComponent xsLabel={isXs ? 0 : 2} xsForm={isXs ? 12 : 10} label={t('Ghi chú')}>
            <InputForm formik={formik} name="ghiChu" type="text" />
          </FormControlComponent>
        </Grid>
        <Grid item xs={12} container spacing={2} justifyContent="flex-end">
          <FormGroupButton />
        </Grid>
      </Grid>
    </form>
  );
};

export default EditLoaiTinTuc;
