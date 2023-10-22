import React from 'react';
import { FormControl, FormControlLabel, Grid, Radio, RadioGroup, useMediaQuery } from '@mui/material';
import { useFormik } from 'formik';
import { useUserValidationSchema } from '../../components/validations/userValidation';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { setOpenPopup, setReloadData, showAlert } from 'store/actions';
import { openPopupSelector, selectedUserSelector } from 'store/selectors';
import InputForm from 'components/form/InputForm';
import ImageForm from 'components/form/ImageForm';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import config from '../../config';
import { updateUser, getUserById } from 'services/userService';
import { handleResponseStatus } from 'utils/handleResponseStatus';
import { convertJsonToFormData } from 'utils/convertJsonToFormData';
import { useNavigate } from 'react-router';
import FormControlComponent from 'components/form/FormControlComponent ';
import { getAllDonviHavePhong } from 'services/donvitruongService';
import FormGroupButton from 'components/button/FormGroupButton';
import SelectForm from 'components/form/SelectForm';
import { convertDateTimeToDate } from 'utils/formatDate';

const EditUser = () => {
  const isXs = useMediaQuery('(max-width:800px)');
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const userValidationSchema = useUserValidationSchema(true);
  const selectedUser = useSelector(selectedUserSelector);
  const [urlImage, setUrlImage] = useState('');
  const openPopup = useSelector(openPopupSelector);
  const [donvi, setDonvi] = useState([]);
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      fullName: '',
      userName: '',
      email: '',
      phone: '',
      gender: '',
      birthday: '',
      address: '',
      cccd: '',
      truongId: '',
      avatar: '',
      fileImage: ''
    },
    validationSchema: userValidationSchema,
    onSubmit: async (values) => {
      try {
        const formData = await convertJsonToFormData(values);
        const updatedUser = await updateUser(formData);
        const check = handleResponseStatus(updatedUser, navigate);
        if (!check) {
          dispatch(showAlert(new Date().getTime().toString(), 'error', updatedUser.message.toString()));
        } else {
          if (updatedUser.isSuccess == false) {
            dispatch(showAlert(new Date().getTime().toString(), 'error', updatedUser.message.toString()));
          } else {
            dispatch(showAlert(new Date().getTime().toString(), 'success', updatedUser.message.toString()));
            dispatch(setOpenPopup(false));
            dispatch(setReloadData(true));
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
      const userbyid = await getUserById(selectedUser.userId);
      const datauser = userbyid.data;
      if (selectedUser && openPopup) {
        formik.setValues({
          userId: selectedUser.userId || 0,
          fullName: datauser.fullName || '',
          userName: datauser.userName || '',
          email: datauser.email || '',
          phone: datauser.phone || '',
          gender: datauser.gender || '',
          birthday: datauser.birthday || '',
          address: datauser.address || '',
          cccd: datauser.cccd || '',
          avatar: datauser.avatar || '',
          truongId: datauser.truongID || '',
          fileImage: ''
        });
        setUrlImage(config.urlFile + 'Users/' + datauser.avatar);
      }
      dispatch(setReloadData(false));
    };
    if (openPopup === true) {
      fetchData();
    }
  }, [selectedUser, openPopup]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getAllDonviHavePhong();
        setDonvi(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);

  const handleGenderChange = (event) => {
    const isMale = event.target.value === 'male';
    formik.setFieldValue('gender', isMale);
  };

  const handleSchoolChange = (event) => {
    const selectedValue = event.target.value;
    // const truongId = selectedValue === 'phongGDDT' ? '' : selectedValue;
    formik.setFieldValue('truongId', selectedValue);
  };

  return (
    <form onSubmit={formik.handleSubmit}>
      <Grid container spacing={isXs ? 0 : 2} my={1}>
        <Grid item lg={8} md={8} sm={8} xs={12} container spacing={isXs ? 0 : 1} columnSpacing={isXs ? 1 : 0}>
          {/* Username */}
          <Grid item xs={12}>
            <FormControlComponent xsLabel={isXs ? 0 : 2} xsForm={isXs ? 12 : 10} isRequire label={t('user.label.username')}>
              <InputForm formik={formik} name="userName" isDisabled placeholder={t('user.label.username')} type="text" />
            </FormControlComponent>
          </Grid>
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
            <FormControlComponent
              xsLabel={isXs ? 0 : 2}
              xsForm={isXs ? 12 : 10}
              justifyContent={'center'}
              label={t('user.label.phone')}
              isRequire
            >
              <InputForm formik={formik} name="phone" type="text" />
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
          {/* School */}
          <Grid item xs={12}>
            <FormControlComponent xsLabel={isXs ? 0 : 2} xsForm={isXs ? 12 : 10} label={t('user.label.school')} isRequire>
              <FormControl fullWidth variant="outlined">
                <SelectForm
                  name="truongId"
                  value={formik.values.truongId}
                  onChange={handleSchoolChange}
                  onBlur={formik.handleBlur}
                  formik={formik}
                  item={donvi}
                  keyProp={'id'}
                  valueProp={'ten'}
                />
              </FormControl>
            </FormControlComponent>
          </Grid>
        </Grid>
        <Grid
          mt={isXs ? 3 : 0}
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
            isImagePreview={openPopup}
            urlImage={urlImage}
            width={'200'}
            height={'200'}
          />
        </Grid>
        <Grid item xs={12} container spacing={2} justifyContent="flex-end">
          <FormGroupButton />
        </Grid>
      </Grid>
    </form>
  );
};

export default EditUser;
