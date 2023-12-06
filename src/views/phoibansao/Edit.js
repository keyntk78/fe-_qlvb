import { React } from 'react';
import { Checkbox, FormControl, FormControlLabel, Grid, useMediaQuery } from '@mui/material';
import { useFormik } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { showAlert, setReloadData, setOpenPopup } from 'store/actions';
import { openPopupSelector, reloadDataSelector, selectedPhoisaoSelector, userLoginSelector } from 'store/selectors';
import InputForm from 'components/form/InputForm';
import { useTranslation } from 'react-i18next';
import { editPhoisao, getPhoisaoById } from 'services/phoisaoService';
import FormControlComponent from 'components/form/FormControlComponent ';
import FormGroupButton from 'components/button/FormGroupButton';
import { convertJsonToFormData } from 'utils/convertJsonToFormData';
import { convertFormattedDateToISODate, convertISODateToFormattedDate } from 'utils/formatDate';
import { usePhoibansaoValidationSchema } from 'components/validations/phoibansaoValidation';
import ImageForm from 'components/form/ImageForm';
import { useState } from 'react';
import config from 'config';
import InputForm1 from 'components/form/InputForm1';
import SelectForm from 'components/form/SelectForm';
import { getAllHedaotao } from 'services/hedaotaoService';

const EditAction = () => {
  const isXs = useMediaQuery('(max-width:600px)');
  const [urlImage, setUrlImage] = useState('');
  const reloadData = useSelector(reloadDataSelector);
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const selectedphoisao = useSelector(selectedPhoisaoSelector);
  const user = useSelector(userLoginSelector);
  const PhoiValidationSchema = usePhoibansaoValidationSchema();
  const openPopup = useSelector(openPopupSelector);
  const [hdt, setHDT] = useState([]);

  const formik = useFormik({
    initialValues: {
      MaHeDaoTao: '',
      TenPhoi: '',
      SoLuongPhoi: 0,
      AnhPhoi: '',
      FileImage: '',
      NgayMua: '',
      SoHieuPhoi: '',
      SoBatDau: '',
      lyDo: ''
    },
    validationSchema: PhoiValidationSchema,
    onSubmit: async (values) => {
      try {
        const formData = await convertJsonToFormData(values);
        const phoiSaoData = await editPhoisao(formik.values.lyDo, formData);
        if (phoiSaoData.isSuccess == false) {
          dispatch(showAlert(new Date().getTime().toString(), 'error', phoiSaoData.message.toString()));
        } else {
          dispatch(setOpenPopup(false));
          dispatch(setReloadData(true));
          dispatch(showAlert(new Date().getTime().toString(), 'success', phoiSaoData.message.toString()));
        }
      } catch (error) {
        console.error('Error updating function:', error);
        dispatch(showAlert(new Date().getTime().toString(), 'error', error.toString()));
      }
    }
  });

  useEffect(() => {
    const fetchData = async () => {
      const PhoisaoById = await getPhoisaoById(selectedphoisao.id);
      const dataPhoisao = PhoisaoById.data;
      const NgayMua = convertISODateToFormattedDate(dataPhoisao.ngayMua);
      if (selectedphoisao) {
        formik.setValues({
          Id: selectedphoisao.id || '',
          MaHeDaoTao: dataPhoisao.maHeDaoTao || '',
          TenPhoi: dataPhoisao.tenPhoi || '',
          SoLuongPhoi: dataPhoisao.soLuongPhoi || 0,
          AnhPhoi: dataPhoisao.anhPhoi || '',
          TuDongKhoa: dataPhoisao.tuDongKhoa || false,
          ChieuDoc: dataPhoisao.chieuDoc || '',
          ChieuNgang: dataPhoisao.chieuNgang || '',
          MoTa: dataPhoisao.moTa || '',
          lyDo: dataPhoisao.lyDo || '',
          SoHieuPhoi: dataPhoisao.soHieuPhoi,
          SoBatDau: dataPhoisao.soBatDau || '',
          NgayMua: convertFormattedDateToISODate(NgayMua) || '',
          NguoiThucHien: user.username
        });
      }
      dispatch(setReloadData(false));
      if (dataPhoisao.anhPhoi) {
        setUrlImage(config.urlFile + 'PhoiBanSao/' + dataPhoisao.anhPhoi);
      } else {
        setUrlImage(''); // If no avatar value, reset the urlImage state to an empty string
      }
    };
    if (openPopup) {
      fetchData();
    }
  }, [selectedphoisao, openPopup, reloadData]);

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
          <Grid item container spacing={isXs ? 0 : 1} columnSpacing={isXs ? 1 : 0}>
            <Grid item xs={6}>
              <FormControlComponent xsLabel={isXs ? 0 : 5} xsForm={isXs ? 12 : 7} isRequire label={t('phoivanbang.field.tientophoi')}>
                <InputForm formik={formik} name="SoHieuPhoi" type="text" placeholder={t('phoivanbang.field.tientophoi')} />
              </FormControlComponent>
            </Grid>
            <Grid item xs={6}>
              <FormControlComponent xsLabel={isXs ? 0 : 5} xsForm={isXs ? 12 : 7} isRequire label={t('Số bắt đầu')}>
                <InputForm formik={formik} name="SoBatDau" type="text" placeholder={t('Số bắt đầu')} />
              </FormControlComponent>
            </Grid>
          </Grid>
          <Grid item container spacing={1}>
            <Grid item xs={6}>
              <FormControlComponent xsLabel={isXs ? 0 : 5} xsForm={isXs ? 12 : 7} isRequire label={t('phoivanbang.field.ngaymua')}>
                <InputForm formik={formik} name="NgayMua" type="date" placeholder={t('phoivanbang.field.ngaymua')} />
              </FormControlComponent>
            </Grid>
            <Grid item xs={6}>
              <FormControlComponent xsLabel={isXs ? 0 : 4.5} xsForm={isXs ? 12 : 7.5} isRequire label={t('phoivanbang.field.soluongphoi')}>
                <InputForm formik={formik} name="SoLuongPhoi" type="number" placeholder={t('phoivanbang.field.soluongphoi')} />
              </FormControlComponent>
            </Grid>
          </Grid>
          <Grid item container spacing={isXs ? 0 : 1} columnSpacing={isXs ? 1 : 0}>
            <Grid item xs={6}>
              <FormControlComponent xsLabel={isXs ? 0 : 5} xsForm={isXs ? 12 : 7} isRequire label={t('Chiều ngang')}>
                <InputForm formik={formik} name="ChieuNgang" type="number" placeholder={t('Chiều ngang')} />
              </FormControlComponent>
            </Grid>
            <Grid item xs={6}>
              <FormControlComponent xsLabel={isXs ? 0 : 5} xsForm={isXs ? 12 : 7} isRequire label={t('Chiều dọc')}>
                <InputForm formik={formik} name="ChieuDoc" type="number" placeholder={t('Chiều dọc')} />
              </FormControlComponent>
            </Grid>
          </Grid>
          <Grid item xs={6}>
            <FormControlLabel
              control={
                <Checkbox
                  formik={formik}
                  checked={formik.values.TuDongKhoa} // Check if the value is 'x'
                  onChange={(e) => formik.setFieldValue('TuDongKhoa', e.target.checked)}
                />
              }
              label="Khóa di chuyển phôi"
            />
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
          <Grid item xs={12}>
            <InputForm1 formik={formik} name="MoTa" label={t('Mô tả')} isMulltiline minRows={3} maxRows={10} placeholder={t('Mô tả')} />
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

export default EditAction;
