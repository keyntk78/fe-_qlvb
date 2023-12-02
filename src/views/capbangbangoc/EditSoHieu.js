import MainCard from 'components/cards/MainCard';
import { useDispatch, useSelector } from 'react-redux';
import { openSubPopupSelector, selectedHocsinhSelector, userLoginSelector } from 'store/selectors';
import { useTranslation } from 'react-i18next';
import React from 'react';
import { Grid } from '@mui/material';

import BackToTop from 'components/scroll/BackToTop';

import InputForm1 from 'components/form/InputForm1';
import { useFormik } from 'formik';
import { ModifySoHieu, getHocSinhByCCCD } from 'services/hocsinhService';
import { useEffect } from 'react';
import { useState } from 'react';
import { setOpenSubPopup, setReloadData, showAlert } from 'store/actions';
import FormGroupButton from 'components/button/FormGroupButton';

const EditSoHieu = () => {
  const { t } = useTranslation();
  const hocSinh = useSelector(selectedHocsinhSelector);
  const user = useSelector(userLoginSelector);
  const [IdHocSinh, setIdHocSinh] = useState('');
  const openSubPopup = useSelector(openSubPopupSelector);
  const dispatch = useSelector(useDispatch);
  console.log(hocSinh);
  const formik = useFormik({
    initialValues: {
      soHieuHienTai: '',
      soHieuMoi: ''
    },
    //validationSchema: userValidationSchema,
    onSubmit: async (values) => {
      try {
        const response = await ModifySoHieu(values.soHieuMoi, IdHocSinh, user.username);
        if (response.isSuccess == false) {
          dispatch(showAlert(new Date().getTime().toString(), 'error', response.message.toString()));
        } else {
          dispatch(showAlert(new Date().getTime().toString(), 'success', response.message.toString()));
          dispatch(setOpenSubPopup(false));
          dispatch(setReloadData(true));
        }
      } catch (error) {
        console.error('Error updating role:', error);
        dispatch(showAlert(new Date().getTime().toString(), 'error', error.toString()));
      }
    }
  });
  useEffect(() => {
    const fetchData = async () => {
      const userbyid = await getHocSinhByCCCD(hocSinh.cccd);
      const datauser = userbyid.data;
      console.log(datauser);
      setIdHocSinh(datauser.id);

      formik.setValues({
        soHieuHienTai: datauser.soHieuVanBang || ''
      });
      dispatch(setReloadData(false));
    };
    if (openSubPopup) {
      fetchData();
    }
  }, [hocSinh, openSubPopup]);

  return (
    <form onSubmit={formik.handleSubmit}>
      <MainCard title={t('Chỉnh sửa số hiệu văn bằng')}>
        <Grid item container spacing={1} mb={2} justifyContent={'center'} alignItems={'center'}>
          <Grid item lg={4} md={6} sm={6} xs={8}>
            <InputForm1
              xs={12}
              label={'Số hiệu hiện tại'}
              name="soHieuHienTai"
              formik={formik}
              placeholder={'Số hiệu hiện tại'}
              isDisabled
            />
          </Grid>
          <Grid item lg={4} md={6} sm={6} xs={8}>
            <InputForm1 xs={12} label={'Số hiệu mới'} name="soHieuMoi" formik={formik} placeholder={'Số hiệu mới'} />
          </Grid>
        </Grid>
        <Grid item xs={12} container spacing={2} justifyContent="flex-end">
          <FormGroupButton />
        </Grid>
      </MainCard>
      <BackToTop />
    </form>
  );
};

export default EditSoHieu;
