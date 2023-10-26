import React from 'react';
import { useFormik } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import ExitButton from 'components/button/ExitButton';
import { Grid, RadioGroup, Radio, FormControlLabel, FormControl, Typography, Divider, useMediaQuery } from '@mui/material';

import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import SaveButton from 'components/button/SaveButton';
import { donviSelector, openProfileSelector, reloadDataSelector } from 'store/selectors';
import { useState } from 'react';
import { profile, updateProfile } from 'services/authService';
import config from 'config';
import { useNavigate } from 'react-router';
import { setLoading, setOpenProfile, setReloadData, showAlert } from 'store/actions';
import { convertJsonToFormData } from 'utils/convertJsonToFormData';
import { handleResponseStatus } from 'utils/handleResponseStatus';
import InputForm from 'components/form/InputForm';
import FormControlComponent from 'components/form/FormControlComponent ';
import { useProfileValidationSchema } from 'components/validations/profileValidation';
import ImageForm from 'components/form/ImageForm';
import { convertDateTimeToDate } from 'utils/formatDate';

const Profile = () => {
  const isXs = useMediaQuery('(max-width:800px)');
  const { t } = useTranslation();
  const profileValidationSchema = useProfileValidationSchema(false);
  const openProfile = useSelector(openProfileSelector);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [user, setUser] = useState({});
  const [donvi, setDonvi] = useState({});
  const reloadData = useSelector(reloadDataSelector);
  const [urlImage, setUrlImage] = useState('');
  const dvql = useSelector(donviSelector);
  const formik = useFormik({
    initialValues: {
      fullName: '',
      email: '',
      gender: '',
      birthday: '',
      phone: '',
      address: '',
      cccd: '',
      avatar: '',
      fileImage: ''
    },
    validationSchema: profileValidationSchema,
    onSubmit: async (values) => {
      try {
        dispatch(setLoading(true));
        const formData = await convertJsonToFormData(values);
        const updatedUser = await updateProfile(formData);
        dispatch(setLoading(false));
        const check = handleResponseStatus(updatedUser, navigate);
        if (!check) {
          dispatch(showAlert(new Date().getTime().toString(), 'error', updatedUser.message.toString()));
        } else {
          if (updatedUser.isSuccess == false) {
            dispatch(showAlert(new Date().getTime().toString(), 'error', updatedUser.message.toString()));
          } else {
            dispatch(setOpenProfile(false));
            dispatch(setReloadData(true));
            dispatch(showAlert(new Date().getTime().toString(), 'success', updatedUser.message.toString()));
          }
        }
      } catch (error) {
        console.error('Error updating role:', error);
        dispatch(showAlert(new Date().getTime().toString(), 'error', error.toString()));
      }
    }
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await profile();
        const userData = response.data;
        setUser(userData.data);
        dispatch(setReloadData(false));
        setDonvi(userData.donvi.ten);
      } catch (error) {
        dispatch(setReloadData(false));
      }
    };

    fetchData();
  }, [reloadData, dispatch]);

  useEffect(() => {
    const updateFormikValues = async () => {
      if (user && openProfile) {
        formik.setValues({
          userId: user.userId || 0,
          fullName: user.fullName || '',
          userName: user.userName || '',
          email: user.email || '',
          gender: user.gender || '',
          birthday: user.birthday || '',
          phone: user.phone || '',
          address: user.address || '',
          cccd: user.cccd || '',
          avatar: user.avatar || '',
          fileImage: ''
        });
        if (user.avatar) {
          setUrlImage(config.urlFile + 'Users/' + user.avatar);
        } else {
          setUrlImage(''); // If no avatar value, reset the urlImage state to an empty string
        }
      }
    };
    updateFormikValues();
  }, [user, openProfile]);

  const handleGenderChange = (event) => {
    const isMale = event.target.value === 'male';
    formik.setFieldValue('gender', isMale);
  };

  if (!donvi || Object.keys(donvi).length === 0) {
    return null;
  }

  return (
    <form onSubmit={formik.handleSubmit}>
      <Grid container spacing={isXs ? 0 : 2} my={1}>
        <Grid item lg={8} md={8} sm={8} xs={12} container spacing={isXs ? 0 : 1} columnSpacing={isXs ? 1 : 0}>
          {/* Name */}
          <Grid item xs={12}>
            <FormControlComponent xsLabel={isXs ? 0 : 2} xsForm={isXs ? 12 : 10} isRequire label={t('user.label.fullname')}>
              <InputForm formik={formik} name="fullName" type="text" />
            </FormControlComponent>
          </Grid>
          {/* Birthday */}
          <Grid item xs={6}>
            <FormControlComponent xsLabel={isXs ? 0 : 4} xsForm={isXs ? 12 : 8} label={t('user.label.birthday')}>
              <InputForm
                formik={formik}
                name="birthday"
                type="date"
                value={formik.values.birthday ? convertDateTimeToDate(formik.values.birthday) : ''}
              />
            </FormControlComponent>
          </Grid>
          {/* Phone */}
          <Grid item xs={6}>
            <FormControlComponent xsLabel={isXs ? 0 : 2} xsForm={isXs ? 12 : 10} justifyContent={'center'} label={t('user.label.phone')}>
              <InputForm formik={formik} name="phone" type="text" />
            </FormControlComponent>
          </Grid>
          {/* Gender */}
          <Grid item xs={6}>
            <FormControlComponent xsLabel={isXs ? 0 : 4} xsForm={isXs ? 12 : 8} label={t('user.label.gender')}>
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
              <InputForm formik={formik} name="cccd" type="text" />
            </FormControlComponent>
          </Grid>
          {/* Email */}
          <Grid item xs={12}>
            <FormControlComponent xsLabel={isXs ? 0 : 2} xsForm={isXs ? 12 : 10} isRequire label={t('user.label.email')}>
              <InputForm formik={formik} name="email" type="email" />
            </FormControlComponent>
          </Grid>
          {/* Address */}
          <Grid item xs={12}>
            <FormControlComponent xsLabel={isXs ? 0 : 2} xsForm={isXs ? 12 : 10} label={t('user.label.address')}>
              <InputForm formik={formik} name="address" type="text" />
            </FormControlComponent>
          </Grid>
          {dvql !== 0 && (
            <Grid item xs={12}>
              <FormControlComponent xsLabel={isXs ? 0 : 2} xsForm={isXs ? 12 : 10} label={t('user.label.school')}>
                <Typography variant="subtitle1" gutterBottom mt={'6px'} ml={'14px'}>
                  {donvi}
                </Typography>
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
          <ImageForm
            formik={formik}
            name="avatar"
            nameFile="fileImage"
            urlImage={urlImage}
            isImagePreview={openProfile}
            width={'200'}
            height={'200'}
          />
        </Grid>
        <Grid item xs={12} mt={isXs ? 2 : 0}>
          <Divider />
        </Grid>
        <Grid item xs={12} mt={isXs ? 2 : 0} container spacing={2} justifyContent="flex-end">
          <Grid item>
            <SaveButton />
          </Grid>
          <Grid item>
            <ExitButton type="profile" />
          </Grid>
        </Grid>
      </Grid>
    </form>
  );
};

export default Profile;
