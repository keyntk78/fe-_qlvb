import React from 'react';
import { Grid, useMediaQuery, Checkbox } from '@mui/material';
import { useFormik } from 'formik';
import { useRoleValidationSchema } from '../../components/validations/roleValidation';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { editRole, getRoleById } from 'services/roleService';
import { showAlert, setOpenPopup, setReloadData } from 'store/actions';
import { openPopupSelector, selectedRoleSelector } from 'store/selectors';
import { useTranslation } from 'react-i18next';
import InputForm from 'components/form/InputForm';
import FormGroupButton from 'components/button/FormGroupButton';
import FormControlComponent from 'components/form/FormControlComponent ';
import { useState } from 'react';

const EditRole = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const selectedRole = useSelector(selectedRoleSelector);
  const roleValidationSchema = useRoleValidationSchema();
  const [isChecked, setIsChecked] = useState(false);
  const [levelPhong, setLevelPhong] = useState(1);
  const openPopup = useSelector(openPopupSelector);
  const isXs = useMediaQuery('(max-width:800px)');

  const formik = useFormik({
    initialValues: {
      name: ''
    },
    validationSchema: roleValidationSchema,
    onSubmit: async (values) => {
      try {
        const roleUpdated = await editRole({
          ...values,
          roleId: selectedRole.roleId
        });
        if (roleUpdated.isSuccess == false) {
          dispatch(showAlert(new Date().getTime().toString(), 'error', roleUpdated.message.toString()));
        } else {
          dispatch(setOpenPopup(false));
          dispatch(setReloadData(true));
          dispatch(showAlert(new Date().getTime().toString(), 'success', roleUpdated.message.toString()));
        }
      } catch (error) {
        console.error('Error updating role:', error);
        dispatch(showAlert(new Date().getTime().toString(), 'error', error.toString()));
      }
    }
  });

  const handelCheckLevel = (event) => {
    const check = event.target.checked == true ? 2 : 1;
    setLevelPhong(check);
    setIsChecked(!isChecked);
    formik.setFieldValue('level', check);
  };
  useEffect(() => {
    const fetchData = async () => {
      const rolebyid = await getRoleById(selectedRole.roleId);
      const datarole = rolebyid.data;
      if (selectedRole && openPopup) {
        if (selectedRole) {
          formik.setValues({
            name: datarole.name || '',
            level: datarole.level || 0
          });
          setLevelPhong(datarole.level);
        }
      }
      dispatch(setReloadData(false));
    };
    if (openPopup) {
      fetchData();
    }
  }, [selectedRole, openPopup]);

  return (
    <form onSubmit={formik.handleSubmit}>
      <Grid container spacing={1} my={2}>
        <Grid item xs={12}>
          <FormControlComponent xsLabel={isXs ? 0 : 3} xsForm={isXs ? 12 : 9} isRequire label={t('role.input.label.name')}>
            <InputForm formik={formik} name="name" type="text" />
          </FormControlComponent>
        </Grid>
        <Grid item xs={12}>
          <FormControlComponent xsLabel={isXs ? 0 : 3} xsForm={isXs ? 12 : 9} label={t('Nhóm thuộc trường')}>
            <Checkbox
              checked={levelPhong == 2 ? true : false} // Kiểm tra giá trị levelPhong để quyết định trạng thái checked của checkbox
              onChange={handelCheckLevel}
              inputProps={{ 'aria-label': 'controlled' }}
            />
          </FormControlComponent>
        </Grid>
        <FormGroupButton />
      </Grid>
    </form>
  );
};

export default EditRole;
