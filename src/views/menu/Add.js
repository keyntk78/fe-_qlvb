import React from 'react';
import { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import { Grid, FormControlLabel, useMediaQuery, Input, Button } from '@mui/material';
import { getAllMenu, createMenu } from 'services/menuService';
import { getAllFunctionAction } from 'services/functionActionService';
import { useTranslation } from 'react-i18next';
import { useMenuValidationSchema } from 'components/validations/menuValidation';
import { showAlert, setReloadData, setOpenPopup } from 'store/actions';
import { openPopupSelector, reloadDataSelector } from 'store/selectors';
import { handleResponseStatus } from 'utils/handleResponseStatus';
import { useNavigate } from 'react-router-dom';
import Checkbox from '@mui/material/Checkbox';
import InputForm from 'components/form/InputForm';
import SelectListIcon from 'components/form/SelectListIcon';
import SelectList from 'components/form/SelectList';
import FormControlComponent from 'components/form/FormControlComponent ';
import FormGroupButton from 'components/button/FormGroupButton';
import { IconFilePlus } from '@tabler/icons';
import { convertJsonToFormData } from 'utils/convertJsonToFormData';

const AddMenu = () => {
  const isXs = useMediaQuery('(max-width:800px)');
  const { t } = useTranslation();
  const reloadData = useSelector(reloadDataSelector);
  const menuValidationSchema = useMenuValidationSchema(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [selectFile, setSelectFile] = useState('');
  const [selectedFileName, setSelectedFileName] = useState('');
  const [pageState, setPageState] = useState({
    isLoading: false,
    functionaction: [],
    menucha: []
  });
  const openPopup = useSelector(openPopupSelector);

  const formik = useFormik({
    initialValues: {
      nameMenu: '',
      position: 0,
      parentId: 0,
      link: '',
      icon: '',
      functionActionId: 0,
      isShow: true
    },
    validationSchema: menuValidationSchema,
    onSubmit: async (values) => {
      try {
        const data = await convertJsonToFormData(values);
        data.append('FileHuongDan', selectFile);
        data.append('PathFileHuongDan', selectedFileName);
        const addmenu = await createMenu(data);
        if (addmenu.isSuccess == false) {
          dispatch(showAlert(new Date().getTime().toString(), 'error', addmenu.message.toString()));
        } else {
          dispatch(setOpenPopup(false));
          dispatch(setReloadData(true));
          dispatch(showAlert(new Date().getTime().toString(), 'success', addmenu.message.toString()));
        }
      } catch (error) {
        console.error('Error updating donvi:', error);
        dispatch(showAlert(new Date().getTime().toString(), 'error', error.toString()));
      }

      formik.setValues({
        menuId: 0,
        nameMenu: '',
        link: '',
        position: '',
        parentId: 0,
        icon: '',
        functionActionId: 0
      });
    }
  });
  useEffect(() => {
    const fetchData = async () => {
      setPageState((old) => ({ ...old, isLoading: true }));
      const functionaction = await getAllFunctionAction();

      const menuparent = await getAllMenu();
      const check = await handleResponseStatus(functionaction, navigate);

      const check3 = await handleResponseStatus(menuparent, navigate);
      if (check & check3) {
        const dataFaction = await functionaction.data;
        const dataWithIds = dataFaction.map((row, index) => ({
          idindex: index + 1,
          NameFunctionAction: `${row['function']} - ${row['action'] || ''}`,
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
          menucha: dataWithmenu
        }));
      } else {
        setIsAccess(false);
      }
    };

    fetchData();
  }, [reloadData]);

  useEffect(() => {
    if (openPopup) {
      formik.resetForm();
      setSelectedFileName('');
      setSelectFile('');
    }
  }, [openPopup]);
  const handleOnchangfile = (e) => {
    const file = e.target.files[0];
    setSelectedFileName(file.name);
    setSelectFile(file);
    e.target.value = null;
  };
  return (
    <form onSubmit={formik.handleSubmit}>
      <Grid container>
        <Grid item container sx={10} spacing={isXs ? 0 : 2} my={1} ml={isXs ? 0 : 3}>
          {/* Tên */}
          <FormControlComponent xsLabel={isXs ? 0 : 3} xsForm={isXs ? 12 : 7} label={t('menu.field.ten')}>
            <InputForm formik={formik} name="nameMenu" isRequire type="text" placeholder={t('menu.field.ten')}></InputForm>
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
          <FormControlComponent xsLabel={isXs ? 0 : 3} xsForm={isXs ? 12 : 7} label={t('menu.field.position')}>
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
          <Grid item xs={12} container>
            <FormControlComponent xsLabel={isXs ? 0 : 3} xsForm={isXs ? 12 : 9} label={t('File đính kèm')}>
              <Grid item xs={12} display={'flex'} alignItems={'center'}>
                <Input
                  type="file"
                  inputProps={{ accept: '.doc, .docx, .pdf' }}
                  style={{ display: 'none' }}
                  id="fileInput"
                  onChange={handleOnchangfile}
                />
                <label htmlFor="fileInput">
                  <Button variant="outlined" component="span" color="success" startIcon={<IconFilePlus />}>
                    {t('button.upload')}
                  </Button>
                </label>
                <Grid item mx={1}>
                  {selectedFileName && <span>{selectedFileName}</span>}
                </Grid>
              </Grid>
            </FormControlComponent>
          </Grid>
        </Grid>
        <Grid item xs={12} container spacing={2} justifyContent="flex-end">
          <FormGroupButton />
        </Grid>
      </Grid>
    </form>
  );
};

export default AddMenu;
