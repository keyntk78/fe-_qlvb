import React from 'react';
import { FormControl, FormControlLabel, Grid, Radio, RadioGroup, useMediaQuery } from '@mui/material';
import { useFormik } from 'formik';
import { createUser } from 'services/userService';
import { setOpenPopup, showAlert, setReloadData } from 'store/actions';
import { useDispatch, useSelector } from 'react-redux';
import { useUserValidationSchema } from 'components/validations/userValidation';
import { handleResponseStatus } from 'utils/handleResponseStatus';
import { useNavigate } from 'react-router';
import InputForm from 'components/form/InputForm';
import ImageForm from 'components/form/ImageForm';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { donviSelector, openPopupSelector, userLoginSelector } from 'store/selectors';
import { convertJsonToFormData } from 'utils/convertJsonToFormData';
import FormControlComponent from 'components/form/FormControlComponent ';
import { useState } from 'react';
import InputForm2 from 'components/form/InputForm2';

import { getAllDonViByUsername } from 'services/sharedService';

import FormGroupButton from 'components/button/FormGroupButton';
import SelectForm from 'components/form/SelectForm';

const AddUser = () => {
  const isXs = useMediaQuery('(max-width:800px)');
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const userValidationSchema = useUserValidationSchema(false);
  const openPopup = useSelector(openPopupSelector);
  const userLogin = useSelector(userLoginSelector);
  const [donvi, setDonvi] = useState([]);
  const navigate = useNavigate();
  const user = useSelector(userLoginSelector);
  const donviquanly = useSelector(donviSelector);
  const formik = useFormik({
    initialValues: {
      fullName: '',
      userName: '',
      password: '',
      email: '',
      phone: '',
      address: '',
      cccd: '',
      birthday: '',
      gender: '',
      avatar: '',
      truongId: '0',
      fileImage: '',
      createdBy: userLogin.username
    },
    validationSchema: userValidationSchema,
    onSubmit: async (values) => {
      try {
        const formData = await convertJsonToFormData(values);
        const addedUser = await createUser(formData);
        const check = handleResponseStatus(addedUser, navigate);
        if (!check) {
          dispatch(showAlert(new Date().getTime().toString(), 'error', addedUser.message.toString()));
        } else {
          if (addedUser.isSuccess == false) {
            dispatch(showAlert(new Date().getTime().toString(), 'error', addedUser.message.toString()));
          } else {
            dispatch(showAlert(new Date().getTime().toString(), 'success', addedUser.message.toString()));
            dispatch(setOpenPopup(false));
            dispatch(setReloadData(true));
          }
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
      formik.setFieldValue('gender', true);
    }
  }, [openPopup]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getAllDonViByUsername(user.username);
        setDonvi(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);

  const handleGenderChange = (event) => {
    formik.setFieldValue('gender', event.target.value === 'male');
  };

  const handleSchoolChange = (event) => {
    const selectedValue = event.target.value;
    const truongId = selectedValue === 'nochoose' ? '0' : selectedValue;
    formik.setFieldValue('truongId', truongId);
  };

  return (
    <form onSubmit={formik.handleSubmit}>
      <Grid container spacing={isXs ? 0 : 2} my={1}>
        <Grid item lg={8} md={8} sm={8} xs={12} container spacing={isXs ? 0 : 1} columnSpacing={isXs ? 1 : 0}>
          {/* Username */}
          <Grid item container xs={12} spacing={1}>
            <Grid item xs={6}>
              <FormControlComponent xsLabel={isXs ? 0 : 4} xsForm={isXs ? 12 : 8} isRequire label={t('user.label.username')}>
                <InputForm formik={formik} name="userName" placeholder={t('user.label.username')} type="text" />
              </FormControlComponent>
            </Grid>
            {/* <InputForm1 formik={formik} xs={6} label={t('user.label.username')} name='userName' placeholder={t('user.label.username')} isRequired/> */}
            <Grid item xs={6}>
              <FormControlComponent xsLabel={isXs ? 0 : 4} xsForm={isXs ? 12 : 8} isRequire label={t('user.label.password')}>
                <InputForm2 formik={formik} name="password" placeholder={t('user.label.password')} type="password" />
              </FormControlComponent>
            </Grid>
          </Grid>
          {/* Name */}
          <Grid item xs={12}>
            <FormControlComponent xsLabel={isXs ? 0 : 2} xsForm={isXs ? 12 : 10} isRequire label={t('user.label.fullname')}>
              <InputForm formik={formik} name="fullName" placeholder={t('user.label.fullname')} type="text" />
            </FormControlComponent>
          </Grid>
          {/* Birthday */}
          <Grid item xs={6}>
            <FormControlComponent xsLabel={isXs ? 0 : 4} xsForm={isXs ? 12 : 8} label={t('user.label.birthday')}>
              <InputForm
                formik={formik}
                name="birthday"
                type="date"
                value={formik.values.birthday ? new Date(formik.values.birthday).toISOString().slice(0, 10) : ''}
              />
            </FormControlComponent>
          </Grid>
          {/* Phone */}
          <Grid item xs={6}>
            <FormControlComponent xsLabel={isXs ? 0 : 2} xsForm={isXs ? 12 : 10} label={t('user.label.phone')} isRequire>
              <InputForm formik={formik} name="phone" placeholder={t('user.label.phone')} type="text" />
            </FormControlComponent>
          </Grid>
          {/* Gender */}
          <Grid item xs={6}>
            <FormControlComponent xsLabel={isXs ? 0 : 4} xsForm={isXs ? 12 : 8} label={t('user.label.gender')} isRequire>
              <FormControl fullWidth variant="outlined">
                <RadioGroup
                  name="gender"
                  value={formik.values.gender ? 'male' : 'female'}
                  onChange={handleGenderChange}
                  onBlur={formik.handleBlur}
                >
                  <Grid container>
                    <FormControlLabel size="small" value="male" control={<Radio size="small" />} label={t('gender.male')} />
                    <FormControlLabel size="small" value="female" control={<Radio size="small" />} label={t('gender.female')} />
                  </Grid>
                </RadioGroup>
              </FormControl>
            </FormControlComponent>
          </Grid>
          {/* CCCD */}
          <Grid item xs={6}>
            <FormControlComponent xsLabel={isXs ? 0 : 2} xsForm={isXs ? 12 : 10} label={t('user.label.cccd')}>
              <InputForm formik={formik} name="cccd" placeholder={t('user.label.cccd')} type="text" />
            </FormControlComponent>
          </Grid>
          {/* Email */}
          <Grid item xs={12}>
            <FormControlComponent xsLabel={isXs ? 0 : 2} xsForm={isXs ? 12 : 10} isRequire label={t('user.label.email')}>
              <InputForm formik={formik} name="email" placeholder={t('user.label.email')} type="email" />
            </FormControlComponent>
          </Grid>
          {/* Address */}
          <Grid item xs={12}>
            <FormControlComponent xsLabel={isXs ? 0 : 2} xsForm={isXs ? 12 : 10} label={t('user.label.address')}>
              <InputForm formik={formik} name="address" placeholder={t('user.label.address')} type="text" />
            </FormControlComponent>
          </Grid>
          {/* School */}
          {donviquanly === 0 ? (
            <Grid item xs={12}>
              <FormControlComponent xsLabel={isXs ? 0 : 2} xsForm={isXs ? 12 : 10} label={t('user.label.school')} isRequire>
                <FormControl fullWidth variant="outlined">
                  <SelectForm
                    formik={formik}
                    keyProp="id"
                    valueProp="ten"
                    item={donvi}
                    placeholder={t('user.label.school')}
                    name="truongId"
                    value={formik.values.truongId === '0' ? 'nochoose' : formik.values.truongId}
                    onChange={handleSchoolChange}
                    onBlur={formik.handleBlur}
                    nochoose
                  />
                </FormControl>
              </FormControlComponent>
            </Grid>
          ) : (
            <Grid item xs={12}>
              <FormControlComponent xsLabel={isXs ? 0 : 2} xsForm={isXs ? 12 : 10} label={t('user.label.school')} isRequire>
                <FormControl fullWidth variant="outlined">
                  <SelectForm
                    formik={formik}
                    keyProp="id"
                    valueProp="ten"
                    item={donvi}
                    placeholder={t('user.label.school')}
                    name="truongId"
                    value={formik.values.truongId === '' ? 'nochoose' : formik.values.truongId}
                    onChange={handleSchoolChange}
                    onBlur={formik.handleBlur}
                  />
                </FormControl>
              </FormControlComponent>
            </Grid>
          )}
        </Grid>
        <Grid
          mt={isXs ? 1 : 0}
          item
          lg={4}
          md={4}
          sm={4}
          xs={12}
          sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}
        >
          <ImageForm formik={formik} name="avatar" nameFile="fileImage" isImagePreview={openPopup} width={'200'} height={'200'} />
        </Grid>
        <Grid item xs={12} container spacing={2} justifyContent="flex-end">
          <FormGroupButton />
        </Grid>
      </Grid>
    </form>
  );
};

export default AddUser;
