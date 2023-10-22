import React from 'react';
import { Grid, MenuItem, Select } from '@mui/material';
import { useFormik } from 'formik';
import { createSogoc } from 'services/sogocService';
import { showAlert, setReloadData, setOpenSubPopup } from 'store/actions';
import { useDispatch, useSelector } from 'react-redux';
import { useSocapbangValidationSchema } from 'components/validations/socapbangValidation';
import { useTranslation } from 'react-i18next';
// import InputForm from 'components/form/InputForm';
import { openSubPopupSelector, reloadDataSelector, selectedDonvitruongSelector, userLoginSelector } from 'store/selectors';
import { convertJsonToFormData } from 'utils/convertJsonToFormData';
import FormControlComponent from 'components/form/FormControlComponent ';
import FormGroupButton from 'components/button/FormGroupButton';
import { useEffect } from 'react';
// import InputTextaria from 'components/form/StyledTextarea';

import { getAllNamthi } from 'services/namthiService';
import BootstrapInput from 'components/form/BootrapInput';
import { useState } from 'react';
import InputForm1 from 'components/form/InputForm1';
import SelectList from 'components/form/SelectList';
import { getAllDanhmucTN } from 'services/sharedService';

const Add = () => {
  const openSubPopup = useSelector(openSubPopupSelector);
  const [nam, setNam] = useState('');
  const reloadData = useSelector(reloadDataSelector);
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const donvi = useSelector(selectedDonvitruongSelector);
  const socapbangValidationSchema = useSocapbangValidationSchema();
  const user = useSelector(userLoginSelector);
  const [pageState, setPageState] = useState({
    isLoading: false,
    namthi: [],
    danhmuctotnghiep: [],
    hinhthucdaotao: []
  });
  const formik = useFormik({
    initialValues: {
      IdNamThi: '',
      NgayQuyetDinhTotNghiep: '',
      TenSo: '',
      IdDanhMucTotNghiep: '',
      IdHinhThucDaoTao: '',
      GhiChu: '',
      IdTruong: donvi.id,
      nguoithuchien: user.username
    },
    validationSchema: socapbangValidationSchema,
    onSubmit: async (values) => {
      try {
        const formData = await convertJsonToFormData(values);

        const addedSogoc = await createSogoc(formData);
        if (addedSogoc.isSuccess == false) {
          dispatch(showAlert(new Date().getTime().toString(), 'error', addedSogoc.message.toString()));
        } else {
          dispatch(setReloadData(true));
          dispatch(setOpenSubPopup(false));
          dispatch(showAlert(new Date().getTime().toString(), 'success', addedSogoc.message.toString()));
        }
      } catch (error) {
        console.error('error' + error);
        dispatch(showAlert(new Date().getTime().toString(), 'error', error.toString()));
      }
    }
  });
  const handleChange = async (event) => {
    const idnam = event.target.value;
    formik.setFieldValue('IdNamThi', idnam);
    setNam(idnam);
  };
  useEffect(() => {
    if (openSubPopup) {
      formik.resetForm();
    }
  }, [openSubPopup]);

  useEffect(() => {
    const fetchData = async () => {
      setPageState((old) => ({ ...old, isLoading: true }));

      const namthi = await getAllNamthi();
      const datanamthi = await namthi.data;
      const dataWitnamthi = datanamthi.map((row, index) => ({
        idindex: index + 1,
        ...row
      }));

      const danhmuctn = await getAllDanhmucTN(user ? user.username : '');
      const datadanhmuc = await danhmuctn.data;
      const hinhthucdt = await getAllHinhthucdaotao();
      const datahtdt = await hinhthucdt.data;

      const dataWithdanhmuctn = datadanhmuc.map((row, index) => ({
        idindex: index + 1,
        ...row
      }));

      const dataWithhtdt = datahtdt.map((row, index) => ({
        idindex: index + 1,
        ...row
      }));

      if (pageState.namthi.length === 0) {
        setNam(datanamthi[0].id);
        formik.setFieldValue('IdNamThi', datanamthi[0].id);
      }
      dispatch(setReloadData(false));
      setPageState((old) => ({
        ...old,
        isLoading: false,
        namthi: dataWitnamthi,
        danhmuctotnghiep: dataWithdanhmuctn,
        hinhthucdaotao: dataWithhtdt
      }));

      formik.setFieldValue('IdDanhMucTotNghiep', datadanhmuc[0].id);
      formik.setFieldValue('IdHinhThucDaoTao', datahtdt[0].id);
    };

    fetchData();
  }, [reloadData]);

  return (
    <form onSubmit={formik.handleSubmit}>
      <Grid container>
        <Grid item container xs={10} spacing={1} ml={3} my={1}>
          <InputForm1 formik={formik} name="TenSo" xs={12} label={t('socapbang.field.tensogoc')} isRequired />

          <Grid item xs={12} container spacing={1}>
            <Grid item xs={4} container>
              <FormControlComponent xsLabel={12} xsForm={12} isRequire label={t('namtn.title')}>
                <Select
                  labelId="demo-customized-select-label"
                  style={{ width: '100%' }}
                  id="demo-customized-select"
                  value={nam}
                  name="IdNamThi"
                  onChange={handleChange}
                  input={<BootstrapInput />}
                >
                  {pageState.namthi.map((item) => (
                    <MenuItem key={item.id} value={item.id}>
                      {item.ten}
                    </MenuItem>
                  ))}
                </Select>
              </FormControlComponent>
            </Grid>
            <Grid item xs={8} container>
              <InputForm1 formik={formik} name="NgayQuyetDinhTotNghiep" xs={12} type="date" label={t('khoatn.title')} isRequired />
            </Grid>
          </Grid>
          <Grid item xs={12} container spacing={1}>
            <Grid item xs={6} container>
              <FormControlComponent xsLabel={12} xsForm={12} label={t('danhmuctotnghiep.title')} isRequire>
                <SelectList
                  data={pageState.danhmuctotnghiep}
                  name="IdDanhMucTotNghiep"
                  value="id"
                  request={'id'}
                  optionName="tieuDe"
                  placeholder={t('danhmuctotnghiep.title')}
                  formik={formik}
                  openPopup
                />
              </FormControlComponent>
            </Grid>
            <Grid item xs={6} container>
              <FormControlComponent xsLabel={12} xsForm={12} label={t('hinhthucdaotao.title')} isRequire>
                <SelectList
                  data={pageState.hinhthucdaotao}
                  name="IdHinhThucDaoTao"
                  value="id"
                  request={'id'}
                  optionName="ten"
                  placeholder={t('hinhthucdaotao.title')}
                  formik={formik}
                  openPopup
                />
              </FormControlComponent>
            </Grid>
          </Grid>
          <InputForm1 formik={formik} name="GhiChu" type="text" rows={3} maxRows={10} xs={12} label={t('danhmuctotnghiep.field.ghichu')} />
        </Grid>
        <Grid item xs={12} container spacing={2} justifyContent="flex-end">
          <FormGroupButton type="subpopup" />
        </Grid>
      </Grid>
    </form>
  );
};

export default Add;
