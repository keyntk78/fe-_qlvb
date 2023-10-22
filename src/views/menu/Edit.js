import React from 'react';
import { Checkbox, FormControlLabel, Grid, useMediaQuery } from '@mui/material';
import { useFormik } from 'formik';
import { useMenuValidationSchema } from 'components/validations/menuValidation';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { editMenu, getAllMenu, getMenuById } from 'services/menuService';
import { getAllFunctionAction } from 'services/functionActionService';
import { setReloadData, showAlert, setOpenPopup } from 'store/actions';
import { openPopupSelector, selectedMenuSelector } from 'store/selectors';
import InputForm from 'components/form/InputForm';
import { reloadDataSelector } from 'store/selectors';
import { getAllHedaotao } from 'services/hedaotaoService';
import FormControlComponent from 'components/form/FormControlComponent ';
import SelectListIcon from 'components/form/SelectListIcon';
import { useTranslation } from 'react-i18next';
import SelectList from 'components/form/SelectList';
import FormGroupButton from 'components/button/FormGroupButton';
const EditMenu = () => {
  const isXs = useMediaQuery('(max-width:800px)');
  const openPopup = useSelector(openPopupSelector);
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const menuValidationSchema = useMenuValidationSchema();
  const reloadData1 = useSelector(reloadDataSelector);
  const menu1 = useSelector(selectedMenuSelector);
  const [pageState, setPageState] = useState({
    isLoading: false,
    functionaction: [],
    hedaotao: [],
    menucha: []
  });
  const formik = useFormik({
    initialValues: {
      nameMenu: '',
      position: 0,
      parentId: 0,
      link: '',
      icon: '',
      functionActionId: 0,
      isShow: ''
    },
    validationSchema: menuValidationSchema,
    onSubmit: async (values) => {
      try {
        const menuUpdated = await editMenu(values);
        if (menuUpdated.isSuccess === false) {
          dispatch(showAlert(new Date().getTime().toString(), 'error', menuUpdated.message.toString()));
        } else {
          dispatch(setOpenPopup(false));
          dispatch(setReloadData(true));
          dispatch(showAlert(new Date().getTime().toString(), 'success', menuUpdated.message.toString()));
        }
      } catch (error) {
        console.error('Error updating donvi:', error);
        dispatch(showAlert(new Date().getTime().toString(), 'error', error.toString()));
      }
    }
  });

  useEffect(() => {
    const fetchData = async () => {
      setPageState((old) => ({ ...old, isLoading: true }));
      const functionaction = await getAllFunctionAction();
      const hedaotao = await getAllHedaotao();
      const menuparent = await getAllMenu();
      const menubyid = await getMenuById(menu1.menuId);
      const datamenubyid = menubyid.data;
      const dataFaction = await functionaction.data;
      const dataWithIds = dataFaction.map((row, index) => ({
        idindex: index + 1,
        NameFunctionAction: `${row['function']} - ${row['action'] || ''}`,
        ...row
      }));

      const datahedaotao = await hedaotao.data;
      const dataWithhdt = datahedaotao.map((row, index) => ({
        idindex: index + 1,
        ...row
      }));

      const datamenu = await menuparent.data;
      const dataWithmenu = datamenu.map((row, index) => ({
        id: index + 1,
        idindex: index + 1,
        ...row
      }));

      dispatch(setReloadData(false));

      setPageState((old) => ({
        ...old,
        isLoading: false,
        functionaction: dataWithIds,
        hedaotao: dataWithhdt,
        menucha: dataWithmenu
      }));

      if (menu1) {
        formik.setValues({
          menuId: menu1.menuId,
          nameMenu: datamenubyid.nameMenu || '',
          link: datamenubyid.link || '',
          position: datamenubyid.position || 0,
          parentId: datamenubyid.parentId || 0,
          icon: datamenubyid.icon || '',
          isShow: datamenubyid.isShow,
          functionActionId: datamenubyid.functionActionId || 0
        });
      }
    };
    if (openPopup) {
      fetchData();
    }
  }, [menu1, reloadData1, openPopup]);

  return (
    <form onSubmit={formik.handleSubmit}>
      <Grid container>
        <Grid item container sx={10} spacing={isXs ? 0 : 2} my={1} ml={isXs ? 0 : 3}>
          {/* Tên */}
          <FormControlComponent xsLabel={isXs ? 0 : 3} xsForm={isXs ? 12 : 7} label={t('menu.field.ten')}>
            <InputForm formik={formik} name="nameMenu" type="text" placeholder={t('menu.field.ten')}></InputForm>
          </FormControlComponent>
          {/* Menucha */}
          <FormControlComponent xsLabel={isXs ? 0 : 3} xsForm={isXs ? 12 : 7} label={t('menu.field.parentid')}>
            <SelectList
              data={pageState.menucha}
              name="parentId"
              value="menuId"
              request={'menuId'}
              optionName="hienThi"
              placeholder={t('menu.placehoder.menu')}
              formik={formik}
              openPopup
            />
          </FormControlComponent>
          {/* Vi trí */}
          <FormControlComponent xs={6} xsLabel={isXs ? 0 : 3} xsForm={isXs ? 12 : 7} label={t('menu.field.position')}>
            <InputForm formik={formik} name="position" type="number" placeholder={t('menu.field.position')}></InputForm>
          </FormControlComponent>
          {/* link */}
          <FormControlComponent xsLabel={isXs ? 0 : 3} xsForm={isXs ? 12 : 7} label={t('menu.field.link')}>
            <InputForm formik={formik} name="link" type="text" placeholder={t('menu.field.link')}></InputForm>{' '}
          </FormControlComponent>
          {/* Icon */}
          <FormControlComponent xsLabel={isXs ? 0 : 3} xsForm={isXs ? 12 : 7} label={t('menu.field.icon')}>
            <SelectListIcon formik={formik} name="icon" placeholder={t('menu.placehoder.icon')} />
          </FormControlComponent>
          {/* Chức năng */}
          <FormControlComponent xsLabel={isXs ? 0 : 3} xsForm={isXs ? 12 : 7} label={t('menu.field.function')}>
            <SelectList
              data={pageState.functionaction}
              name="functionActionId"
              value="functionActionId"
              request={'functionActionId'}
              optionName="NameFunctionAction"
              placeholder={t('menu.placehoder.function')}
              formik={formik}
              openPopup
            />
          </FormControlComponent>
          {/* Hiển thị */}
          <Grid item xs={12} container>
            <Grid item xs={isXs ? 0 : 3} mt={1}></Grid>
            <Grid item>
              <FormControlLabel
                control={
                  <Checkbox
                    id="isShow"
                    name="isShow"
                    checked={formik.values.isShow}
                    onChange={(event) => {
                      formik.setFieldValue('isShow', event.target.checked);
                    }}
                  />
                }
                label={t('menu.field.isshow')}
              />
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} container spacing={2} justifyContent="flex-end">
          <FormGroupButton />
        </Grid>
      </Grid>
    </form>
  );
};

export default EditMenu;
