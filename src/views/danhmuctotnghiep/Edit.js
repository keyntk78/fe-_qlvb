import React, { useState } from 'react';
import { Grid, useMediaQuery } from '@mui/material';
import { useFormik } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { getById, editDanhmucTN } from 'services/danhmuctotnghiepService';
import { setOpenPopup, setReloadData, showAlert } from 'store/actions';
import { openPopupSelector, reloadDataSelector, selectedDanhmuctotnghiepSelector } from 'store/selectors';
import { useTranslation } from 'react-i18next';
import { userLoginSelector } from 'store/selectors';
import { convertJsonToFormData } from 'utils/convertJsonToFormData';
import InputForm from 'components/form/InputForm';
import FormControlComponent from 'components/form/FormControlComponent ';
import FormGroupButton from 'components/button/FormGroupButton';
import useDanhmucTNValidationSchema from 'components/validations/danhmuctnValidation';
import {
  convertFormattedDateToISODate,
  convertFormattedDateToISODateTime,
  convertISODateTimeToFormattedDateTime,
  convertISODateToFormattedDate
} from 'utils/formatDate';
import { getAllNamthi } from 'services/namthiService';
import InputForm1 from 'components/form/InputForm1';
import { getAllHinhthucdaotao } from 'services/hinhthucdaotaoService';
import SelectForm from 'components/form/SelectForm';
import { TuyChonSoVaoSo } from 'services/sharedService';
//import { getAllHeDaoTao } from 'services/sharedService';

const EditDanhmucTN = () => {
  const isXs = useMediaQuery('(max-width:800px)');
  const openPopup = useSelector(openPopupSelector);
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const [nam, setNam] = useState('');
  const [hinhThucDaoTao, setHinhThucDaoTao] = useState('');
  const user = useSelector(userLoginSelector);
  const danhmucTN = useSelector(selectedDanhmuctotnghiepSelector);
  const reloadData = useSelector(reloadDataSelector);
  const [pageState, setPageState] = useState({
    isLoading: false,
    namThi: [],
    hinhthucdaotao: [],
    tuychonVaoso: []
    //hedaotao: []
  });
  const danhmuctnValidationSchema = useDanhmucTNValidationSchema();
  const formik = useFormik({
    initialValues: {
      IdNamThi: '',
      IdHinhThucDaoTao: '',
      // MaHeDaoTao: '',
      TenKyThi: '',
      TieuDe: '',
      GhiChu: '',
      NgayCapBang: '',
      SoQuyetDinh: '',
      NgayGuiDanhSach: '',
      TuyChonSoVaoSo: '',
      nguoithuchien: user.username
    },
    validationSchema: danhmuctnValidationSchema,
    onSubmit: async (values) => {
      try {
        const formData = await convertJsonToFormData(values);

        const addedDanhmucTN = await editDanhmucTN(formData);
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
    setNam(idNam);
  };

  const handleChangeHTDT = async (event) => {
    const idHinhThucDaoTao = event.target.value;
    formik.setFieldValue('IdHinhThucDaoTao', idHinhThucDaoTao);
    setHinhThucDaoTao(idHinhThucDaoTao);
  };

  const handleChangeTuyChonVaoSo = async (event) => {
    const tuyChonSoVaoSo = event.target.value;
    formik.setFieldValue('TuyChonSoVaoSo', tuyChonSoVaoSo);
  };

  // const handleChangeHDT = async (event) => {
  //   const maHeDaoTao = event.target.value;
  //   formik.setFieldValue('MaHeDaoTao', maHeDaoTao);
  // };
  useEffect(() => {
    const fetchData = async () => {
      const danhmucTNbyid = await getById(danhmucTN.id);
      const datadanhmucTN = danhmucTNbyid.data;

      const ngay_fm = convertISODateToFormattedDate(datadanhmucTN.ngayCapBang);
      const ngayhen_fm = convertISODateTimeToFormattedDateTime(datadanhmucTN.ngayGuiDanhSach);
      // const ngayhengui_fm = convertISODateTimeToFormattedDateTime(datadanhmucTN.NgayGuiDanhSach);
      const namThi = await getAllNamthi();
      const dataNamthi = await namThi.data;
      const dataWithnt = dataNamthi.map((row, index) => ({
        idIndex: index + 1,
        ...row
      }));
      if (pageState.namThi.length === 0) {
        setNam(datadanhmucTN.idNamThi);
        formik.setFieldValue('IdNamThi', datadanhmucTN.idNamThi);
      }
      //hinhthucdaotao
      const hinhThucdaotao = await getAllHinhthucdaotao();
      const datahinhThucdaotao = await hinhThucdaotao.data;
      const dataWithhtdt = datahinhThucdaotao.map((row, index) => ({
        idIndex: index + 1,
        ...row
      }));

      //tùy chọn số vào sổ
      const tuyChonSoVaoSo = await TuyChonSoVaoSo();
      const dataTuyChonSoVaoSo = tuyChonSoVaoSo.data;

      //hedaotao
      // const hedaotao = await getAllHeDaoTao();
      // const datahedaotao = await hedaotao.data;
      // const dataWithhdt = datahedaotao.map((row, index) => ({
      //   idIndex: index + 1,
      //   ...row
      // }));
      setHinhThucDaoTao(datadanhmucTN.idHinhThucDaoTao);
      formik.setFieldValue('IdHinhThucDaoTao', datadanhmucTN.idHinhThucDaoTao);
      dispatch(setReloadData(false));
      setPageState((old) => ({
        ...old,
        isLoading: false,
        namThi: dataWithnt,
        hinhthucdaotao: dataWithhtdt,
        tuychonVaoso: dataTuyChonSoVaoSo
        //hedaotao: dataWithhdt
      }));
      if (datadanhmucTN) {
        formik.setValues({
          id: danhmucTN.id,
          IdNamThi: datadanhmucTN.idNamThi,
          IdHinhThucDaoTao: datadanhmucTN.idHinhThucDaoTao,
          // MaHeDaoTao: datadanhmucTN.maHeDaoTao,
          TenKyThi: danhmucTN.tenKyThi,
          TieuDe: datadanhmucTN.tieuDe || '',
          GhiChu: datadanhmucTN.ghiChu || '',
          NgayCapBang: convertFormattedDateToISODate(ngay_fm) || '',
          SoQuyetDinh: datadanhmucTN.soQuyetDinh || '',
          NgayGuiDanhSach: convertFormattedDateToISODateTime(ngayhen_fm) || '',
          TuyChonSoVaoSo: datadanhmucTN.tuyChonSoVaoSo || '',
          nguoithuchien: user.username
        });
      }
      dispatch(setReloadData(false));
    };
    if (openPopup) {
      fetchData();
    }
  }, [danhmucTN, reloadData, openPopup]);

  return (
    <form onSubmit={formik.handleSubmit}>
      <Grid container my={1} justifyContent="center">
        <Grid item container xs={isXs ? 12 : 10} spacing={isXs ? 0 : 1}>
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
                  value={hinhThucDaoTao}
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
                  value={nam}
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
            <Grid item xs={isXs ? 12 : 6.5}>
              <FormControlComponent xsLabel={0} xsForm={12} isRequire label={t('Tùy chọn số vào sổ')}>
                <SelectForm
                  formik={formik}
                  fullWidth
                  keyProp="id"
                  valueProp="name"
                  item={pageState.tuychonVaoso}
                  name="TuyChonSoVaoSo"
                  value={formik.values.TuyChonSoVaoSo}
                  onChange={handleChangeTuyChonVaoSo}
                />
              </FormControlComponent>
            </Grid>
            <Grid item xs={isXs ? 12 : 5.5}>
              <FormControlComponent xsLabel={0} xsForm={12} isRequire label={t('Thời hạn gửi học sinh')}>
                <InputForm formik={formik} name="NgayGuiDanhSach" type="datetime-local" />
              </FormControlComponent>
            </Grid>
          </Grid>
          <Grid item xs={12} container spacing={1}>
            {/* <Grid item xs={isXs ? 12 : 6}>
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
            </Grid> */}
            <Grid item xs={isXs ? 12 : 12}>
              <FormControlComponent xsLabel={0} xsForm={12} isRequire label={t('Tên kỳ thi')}>
                <InputForm formik={formik} name="TenKyThi" type="text" placeholder={t('Tên kỳ thi')} />
              </FormControlComponent>
            </Grid>
          </Grid>
          <InputForm1
            formik={formik}
            name="GhiChu"
            isMulltiline
            placeholder="Ghi chú"
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

export default EditDanhmucTN;
