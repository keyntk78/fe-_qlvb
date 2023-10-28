import React from 'react';
import { Grid, useMediaQuery } from '@mui/material';
import { useFormik } from 'formik';
import { createDanhmucTN } from 'services/danhmuctotnghiepService';
import { setOpenPopup, showAlert, setReloadData } from 'store/actions';
import { useDispatch, useSelector } from 'react-redux';
import { useDanhmucTNValidationSchema } from 'components/validations/danhmuctnValidation';
import { useTranslation } from 'react-i18next';
// import InputForm from 'components/form/InputForm';
import { openPopupSelector, reloadDataSelector, userLoginSelector } from 'store/selectors';
import { convertJsonToFormData } from 'utils/convertJsonToFormData';
import FormControlComponent from 'components/form/FormControlComponent ';
import FormGroupButton from 'components/button/FormGroupButton';
import { useEffect } from 'react';
//import InputTextaria from 'components/form/StyledTextarea';
import { getAllNamthi } from 'services/namthiService';
// import BootstrapInput from 'components/form/BootrapInput';
import { useState } from 'react';
import InputForm1 from 'components/form/InputForm1';
import InputForm from 'components/form/InputForm';
import { getAllHinhthucdaotao } from 'services/hinhthucdaotaoService';
import SelectForm from 'components/form/SelectForm';
import { getAllHeDaoTao } from 'services/sharedService';

const Add = () => {
  const isXs = useMediaQuery('(max-width:800px)');
  const openPopup = useSelector(openPopupSelector);
  const reloadData = useSelector(reloadDataSelector);
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const danhmuctnValidationSchema = useDanhmucTNValidationSchema();
  const user = useSelector(userLoginSelector);
  const [pageState, setPageState] = useState({
    isLoading: false,
    namThi: [],
    hinhthucdaotao: [],
    hedaotao: []
  });
  const formik = useFormik({
    initialValues: {
      IdNamThi: '',
      IdHinhThucDaoTao: '',
      MaHeDaoTao: '',
      TenKyThi: '',
      TieuDe: '',
      GhiChu: '',
      NgayCapBang: '',
      SoQuyetDinh: '',
      nguoithuchien: user.username
    },
    validationSchema: danhmuctnValidationSchema,
    onSubmit: async (values) => {
      try {
        const formData = await convertJsonToFormData(values);

        const addedDanhmucTN = await createDanhmucTN(formData);
        if (addedDanhmucTN.isSuccess == false) {
          dispatch(showAlert(new Date().getTime().toString(), 'error', addedDanhmucTN.message.toString()));
        } else {
          dispatch(setReloadData(true));
          dispatch(setOpenPopup(false));
          dispatch(showAlert(new Date().getTime().toString(), 'success', addedDanhmucTN.message.toString()));
        }
      } catch (error) {
        console.error('error' + error);
        dispatch(showAlert(new Date().getTime().toString(), 'error', error.toString()));
      }
    }
  });
  const handleChange = async (event) => {
    const idNam = event.target.value;
    formik.setFieldValue('IdNamThi', idNam);
  };
  const handleChangeHTDT = async (event) => {
    const idHinhThucDaoTao = event.target.value;
    formik.setFieldValue('IdHinhThucDaoTao', idHinhThucDaoTao);
  };
  const handleChangeHDT = async (event) => {
    const maHeDaoTao = event.target.value;
    formik.setFieldValue('MaHeDaoTao', maHeDaoTao);
  };

  useEffect(() => {
    if (openPopup) {
      formik.resetForm();
    }
  }, [openPopup]);

  useEffect(() => {
    const fetchData = async () => {
      setPageState((old) => ({ ...old, isLoading: true }));

      const namThi = await getAllNamthi();
      const dataNamthi = await namThi.data;
      const dataWithnt = dataNamthi.map((row, index) => ({
        idIndex: index + 1,
        ...row
      }));
      //hinhthucdaotao
      const hinhThucdaotao = await getAllHinhthucdaotao();
      const datahinhThucdaotao = await hinhThucdaotao.data;
      const dataWithhtdt = datahinhThucdaotao.map((row, index) => ({
        idIndex: index + 1,
        ...row
      }));

      //hedaotao
      const hedaotao = await getAllHeDaoTao();
      const datahedaotao = await hedaotao.data;
      if (datahedaotao && datahedaotao.length > 0) {
        formik.setFieldValue('MaHeDaoTao', datahedaotao[0].ma);
      }
      const dataWithhdt = datahedaotao.map((row, index) => ({
        idIndex: index + 1,
        ...row
      }));
      dispatch(setReloadData(false));
      setPageState((old) => ({
        ...old,
        isLoading: false,
        namThi: dataWithnt,
        hinhthucdaotao: dataWithhtdt,
        hedaotao: dataWithhdt
      }));
    };

    fetchData();
  }, [reloadData]);
  return (
    <form onSubmit={formik.handleSubmit}>
      <Grid container>
        <Grid item container xs={isXs ? 12 : 10} spacing={isXs ? 0 : 2} my={1} ml={isXs ? 0 : 3}>
          <FormControlComponent xsLabel={0} xsForm={12} isRequire label={t('danhmuctotnghiep.field.tieude')}>
            <InputForm formik={formik} name="TieuDe" type="text" />
          </FormControlComponent>
          <FormControlComponent xsLabel={0} xsForm={12} isRequire label={t('quyetdinhtotnghiep.title')}>
            <InputForm formik={formik} name="SoQuyetDinh" type="text" />
          </FormControlComponent>
          <Grid item xs={12} container spacing={1}>
            <Grid item xs={isXs ? 12 : 5}>
              <FormControlComponent xsLabel={0} xsForm={12} isRequire label={t('hinhthucdaotao.title')}>
                <SelectForm
                  formik={formik}
                  fullWidth
                  keyProp="id"
                  valueProp="ten"
                  item={pageState.hinhthucdaotao}
                  name="IdHinhThucDaoTao"
                  value={formik.values.IdHinhThucDaoTao}
                  onChange={handleChangeHTDT}
                />
              </FormControlComponent>
            </Grid>
            <Grid item xs={isXs ? 5.5 : 3} container>
              <FormControlComponent xsLabel={0} xsForm={12} isRequire label={t('namthi.title')}>
                <SelectForm
                  formik={formik}
                  fullWidth
                  keyProp="id"
                  valueProp="ten"
                  item={pageState.namThi}
                  name="IdNamThi"
                  value={formik.values.IdNamThi}
                  onChange={handleChange}
                />
              </FormControlComponent>
            </Grid>
            <Grid item xs={isXs ? 6.5 : 4}>
              <FormControlComponent xsLabel={0} xsForm={12} isRequire label={t('danhmuctotnghiep.title.ngay')}>
                <InputForm formik={formik} name="NgayCapBang" type="date" />
              </FormControlComponent>
            </Grid>
          </Grid>
          <Grid item xs={12} container spacing={1}>
            <Grid item xs={isXs ? 12 : 6}>
              <FormControlComponent xsLabel={0} xsForm={12} isRequire label={t('hedaotao.title')}>
                <SelectForm
                  formik={formik}
                  fullWidth
                  keyProp="ma"
                  valueProp="ten"
                  item={pageState.hedaotao}
                  name="MaHeDaoTao"
                  value={formik.values.MaHeDaoTao}
                  onChange={handleChangeHDT}
                />
              </FormControlComponent>
            </Grid>
            <Grid item xs={isXs ? 12 : 6}>
              <FormControlComponent xsLabel={0} xsForm={12} isRequire label={t('Tên kỳ thi')}>
                <InputForm formik={formik} name="TenKyThi" type="text" placeholder={t('Tên kỳ thi')} />
              </FormControlComponent>
            </Grid>
          </Grid>
          <InputForm1
            formik={formik}
            isMulltiline
            name="GhiChu"
            placeholder="ghi chú"
            style="100%"
            minRows={3}
            maxRows={10}
            xs={12}
            label={t('danhmuctotnghiep.field.ghichu')}
          />
        </Grid>
        <Grid item xs={12} container spacing={2} justifyContent="flex-end">
          <FormGroupButton />
        </Grid>
      </Grid>
    </form>
  );
};

export default Add;
