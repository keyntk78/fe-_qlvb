import { React } from 'react';
import { FormControl, Grid, useMediaQuery } from '@mui/material';
import { useFormik } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { showAlert, setReloadData, setOpenPopup } from 'store/actions';
import { openPopupSelector, reloadDataSelector, selectedPhoigocSelector, userLoginSelector } from 'store/selectors';
import InputForm from 'components/form/InputForm';
import { useTranslation } from 'react-i18next';
import { editPhoigoc, getPhoigocById } from 'services/phoigocService';
import FormControlComponent from 'components/form/FormControlComponent ';
import FormGroupButton from 'components/button/FormGroupButton';
import { convertJsonToFormData } from 'utils/convertJsonToFormData';
import { convertFormattedDateToISODate, convertISODateToFormattedDate } from 'utils/formatDate';
// import usePhoivanbangValidationSchema from 'components/validations/phoivanbangValidation';
import ImageForm from 'components/form/ImageForm';
import { useState } from 'react';
import config from 'config';
// import InputTextaria from 'components/form/StyledTextarea';
import InputForm1 from 'components/form/InputForm1';
import SelectForm from 'components/form/SelectForm';
import { getAllHedaotao } from 'services/hedaotaoService';
import usePhoivanbangValidationSchema from 'components/validations/phoivanbangValidation';

const Edit = () => {
  const isXs = useMediaQuery('(max-width:600px)');
  const [urlImage, setUrlImage] = useState('');
  const reloadData = useSelector(reloadDataSelector);
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const selectedPhoigoc = useSelector(selectedPhoigocSelector);
  const user = useSelector(userLoginSelector);
  const PhoiValidationSchema = usePhoivanbangValidationSchema();
  const openPopup = useSelector(openPopupSelector);
  const [hdt, setHDT] = useState([]);
  const formik = useFormik({
    initialValues: {
      MaHeDaoTao: '',
      TenPhoi: '',
      SoHieuPhoi: '',
      SoBatDau: '',
      SoLuongPhoi: 0,
      AnhPhoi: '',
      FileImage: '',
      NgayApDung: '',
      lyDo: ''
    },
    validationSchema: PhoiValidationSchema,
    onSubmit: async (values) => {
      try {
        const formData = await convertJsonToFormData(values);
        const PhoigocUpdated = await editPhoigoc(values.lyDo, formData);
        if (PhoigocUpdated.isSuccess == false) {
          dispatch(showAlert(new Date().getTime().toString(), 'error', PhoigocUpdated.message.toString()));
        } else {
          dispatch(setOpenPopup(false));
          dispatch(setReloadData(true));
          dispatch(showAlert(new Date().getTime().toString(), 'success', PhoigocUpdated.message.toString()));
        }
      } catch (error) {
        console.error('Error updating function:', error);
        dispatch(showAlert(new Date().getTime().toString(), 'error', error.toString()));
      }
    }
  });

  useEffect(() => {
    const fetchData = async () => {
      const Phoigocbyid = await getPhoigocById(selectedPhoigoc.id);
      const dataPhoigoc = Phoigocbyid.data;
      const NgayApDung = convertISODateToFormattedDate(dataPhoigoc.ngayApDung);
      if (selectedPhoigoc) {
        formik.setValues({
          Id: selectedPhoigoc.id,
          MaHeDaoTao: dataPhoigoc.maHeDaoTao || '',
          TenPhoi: dataPhoigoc.tenPhoi || '',
          SoHieuPhoi: dataPhoigoc.soHieuPhoi || '',
          SoBatDau: dataPhoigoc.soBatDau || '',
          SoLuongPhoi: dataPhoigoc.soLuongPhoi || 0,
          AnhPhoi: dataPhoigoc.anhPhoi || '',
          lyDo: dataPhoigoc.lyDo || '',
          NgayApDung: convertFormattedDateToISODate(NgayApDung) || '',
          NguoiThucHien: user.username
        });
      }
      dispatch(setReloadData(false));
      if (dataPhoigoc.anhPhoi) {
        setUrlImage(config.urlFile + 'PhoiGoc/' + dataPhoigoc.anhPhoi);
      } else {
        setUrlImage(''); // If no avatar value, reset the urlImage state to an empty string
      }
    };
    if (openPopup) {
      fetchData();
    }
  }, [selectedPhoigoc, openPopup, reloadData]);

  useEffect(() => {
    const fetchDataDL = async () => {
      const response = await getAllHedaotao();
      setHDT(response.data);
    };
    fetchDataDL();
  }, []);

  return (
    <form onSubmit={formik.handleSubmit}>
      <Grid container spacing={1} my={isXs ? 0 : 2}>
        <Grid item xs={12} container spacing={1}>
          <FormControlComponent xsLabel={isXs ? 0 : 2.5} xsForm={isXs ? 12 : 9.5} label={t('hedaotao.title')} isRequire>
            <FormControl fullWidth variant="outlined">
              <SelectForm
                name="MaHeDaoTao"
                value={formik.values.MaHeDaoTao}
                onChange={(e) => formik.setFieldValue('MaHeDaoTao', e.target.value)}
                formik={formik}
                item={hdt}
                keyProp={'ma'}
                valueProp={'ten'}
              />
            </FormControl>
          </FormControlComponent>
          <FormControlComponent xsLabel={isXs ? 0 : 2.5} xsForm={isXs ? 12 : 9.5} isRequire label={t('phoivanbang.field.tenphoi')}>
            <InputForm formik={formik} name="TenPhoi" type="text" placeholder={t('phoivanbang.field.tenphoi')} />
          </FormControlComponent>
          <Grid item container spacing={1}>
            <Grid item xs={6}>
              <FormControlComponent xsLabel={isXs ? 0 : 5} xsForm={isXs ? 12 : 7} isRequire label={t('phoivanbang.field.tientophoi')}>
                <InputForm formik={formik} name="SoHieuPhoi" type="text" placeholder={t('phoivanbang.field.tientophoi')} />
              </FormControlComponent>
            </Grid>
            <Grid item xs={6}>
              <FormControlComponent xsLabel={isXs ? 0 : 4.5} xsForm={isXs ? 12 : 7.5} isRequire label={t('phoivanbang.field.sobatdau')}>
                <InputForm formik={formik} name="SoBatDau" type="text" placeholder={t('phoivanbang.field.sobatdau')} />
              </FormControlComponent>
            </Grid>
          </Grid>
          <Grid item container spacing={1}>
            <Grid item xs={6}>
              <FormControlComponent xsLabel={isXs ? 0 : 5} xsForm={isXs ? 12 : 7} isRequire label={t('phoivanbang.field.ngayapdung')}>
                <InputForm formik={formik} name="NgayApDung" type="date" placeholder={t('phoivanbang.field.ngayapdung')} />
              </FormControlComponent>
            </Grid>
            <Grid item xs={6}>
              <FormControlComponent xsLabel={isXs ? 0 : 4.5} xsForm={isXs ? 12 : 7.5} isRequire label={t('phoivanbang.field.soluongphoi')}>
                <InputForm formik={formik} name="SoLuongPhoi" type="number" placeholder={t('phoivanbang.field.soluongphoi')} />
              </FormControlComponent>
            </Grid>
          </Grid>
          <Grid item xs={12} sx={{ flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <ImageForm
              formik={formik}
              name="AnhPhoi"
              nameFile="FileImage"
              width={isXs ? '300' : '450'}
              urlImage={urlImage}
              height={isXs ? '190' : '290'}
              noAvata
              isImagePreview={openPopup}
            />
          </Grid>
          <InputForm1
            formik={formik}
            minRows={3}
            maxRows={10}
            xs={12}
            name="lyDo"
            type="text"
            isMulltiline
            placeholder={t('phoivanbang.field.lydo')}
            isRequired
            label={t('phoivanbang.field.lydo')}
          />
        </Grid>

        <Grid item xs={12} container spacing={2} justifyContent="flex-end">
          <FormGroupButton />
        </Grid>
      </Grid>
    </form>
  );
};

export default Edit;
