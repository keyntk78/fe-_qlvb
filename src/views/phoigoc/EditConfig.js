import { React, useState } from 'react';
import { Grid, MenuItem, Select, useMediaQuery, Checkbox } from '@mui/material';
import { useFormik } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { showAlert, setReloadData, setOpenSubPopup } from 'store/actions';
import { openSubPopupSelector, reloadDataSelector, selectedConfigPhoiGocSelector, selectedPhoigocSelector } from 'store/selectors';
import InputForm from 'components/form/InputForm';
import { useTranslation } from 'react-i18next';
import { editConfigPhoi, getConfigById } from 'services/phoigocService';
import FormControlComponent from 'components/form/FormControlComponent ';
import FormGroupButton from 'components/button/FormGroupButton';
import { convertJsonToFormData } from 'utils/convertJsonToFormData';
import useConfigPhoischema from 'components/validations/configPhoiValidation';
import ColorNamePicker from 'components/form/color';
import BootstrapInput from 'components/form/BootrapInput';

const EditConfig = () => {
  const isXs = useMediaQuery('(max-width:800px)');
  const reloadData = useSelector(reloadDataSelector);
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const selectedPhoigoc = useSelector(selectedPhoigocSelector);
  const selectedConfigPhoigoc = useSelector(selectedConfigPhoiGocSelector);
  const configPhoiValidationSchema = useConfigPhoischema();
  const opensubPopup = useSelector(openSubPopupSelector);
  const [selectedFormatting, setSelectedFormatting] = useState('');
  const textFormattingOptions = [
    { value: 'Normal', label: 'Normal' },
    { value: 'Bold', label: 'Bold' },
    { value: 'Italic', label: 'Italic' }
  ];
  const formik = useFormik({
    initialValues: {
      KieuChu: '',
      CoChu: '',
      DinhDangKieuChu: '',
      ViTriTren: 0,
      ViTriTrai: 0,
      MauChu: '',
      HienThi: false
    },
    validationSchema: configPhoiValidationSchema,
    onSubmit: async (values) => {
      try {
        const formData = await convertJsonToFormData(values);

        const configPhoigocUpdated = await editConfigPhoi(selectedPhoigoc.id, formData);
        if (configPhoigocUpdated.isSuccess == false) {
          dispatch(showAlert(new Date().getTime().toString(), 'error', configPhoigocUpdated.message.toString()));
        } else {
          dispatch(setOpenSubPopup(false));
          dispatch(setReloadData(true));
          dispatch(showAlert(new Date().getTime().toString(), 'success', configPhoigocUpdated.message.toString()));
        }
      } catch (error) {
        console.error('Error updating function:', error);
        dispatch(showAlert(new Date().getTime().toString(), 'error', error.toString()));
      }
    }
  });

  useEffect(() => {
    const fetchData = async () => {
      const ConfigPhoigocbyid = await getConfigById(selectedPhoigoc.id, selectedConfigPhoigoc.id);
      const ConfigPhoigocbyidData = ConfigPhoigocbyid.data;
      setSelectedFormatting(ConfigPhoigocbyidData.dinhDangKieuChu);
      if (selectedConfigPhoigoc) {
        formik.setValues({
          MaTruongDuLieu: ConfigPhoigocbyidData.maTruongDuLieu,
          Id: ConfigPhoigocbyidData.id,
          KieuChu: ConfigPhoigocbyidData.kieuChu || '',
          CoChu: ConfigPhoigocbyidData.coChu || '',
          DinhDangKieuChu: ConfigPhoigocbyidData.dinhDangKieuChu || '',
          ViTriTren: ConfigPhoigocbyidData.viTriTren || 0,
          ViTriTrai: ConfigPhoigocbyidData.viTriTrai || 0,
          HienThi: ConfigPhoigocbyidData.hienThi || false
        });
      }
      if (ConfigPhoigocbyidData.mauChu !== '') {
        formik.setFieldValue('MauChu', ConfigPhoigocbyidData.mauChu || '');
      } else {
        formik.setFieldValue('MauChu', '#000000');
      }
      dispatch(setReloadData(false));
    };
    if (opensubPopup) {
      fetchData();
    }
  }, [selectedPhoigoc, selectedConfigPhoigoc, opensubPopup, reloadData]);

  return (
    <form onSubmit={formik.handleSubmit}>
      <Grid container spacing={1} my={isXs ? 0 : 2}>
        <Grid xs={12} item container columnSpacing={isXs ? 1 : 0}>
          <FormControlComponent xsLabel={isXs ? 0 : 3} xsForm={isXs ? 12 : 9} label={t('phoivanbang.field.configmatruongdulieu')}>
            <InputForm formik={formik} name="MaTruongDuLieu" type="text" isDisabled />
          </FormControlComponent>
        </Grid>
        <Grid xs={12} item container columnSpacing={isXs ? 1 : 0}>
          <Grid item xs={6}>
            <FormControlComponent xsLabel={isXs ? 0 : 6} xsForm={isXs ? 12 : 6} isRequire label={t('config.field.dinhdangkieuchu')}>
              <Select
                style={{
                  width: '90%',
                  fontWeight: selectedFormatting === 'Bold' ? 'bold' : '',
                  fontStyle: selectedFormatting === 'Italic' ? 'italic' : ''
                }}
                value={selectedFormatting}
                name="DinhDangKieuChu"
                onChange={(event) => {
                  formik.handleChange(event); // Handle Formik's change event first
                  setSelectedFormatting(event.target.value); // Update selectedFormatting
                }}
                input={<BootstrapInput />}
              >
                {textFormattingOptions.map((item) => (
                  <MenuItem
                    key={item.value}
                    value={item.value}
                    style={{
                      fontWeight: item.value === 'Bold' ? 'bold' : 'normal',
                      fontStyle: item.value === 'Italic' ? 'italic' : 'normal'
                    }}
                  >
                    {item.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControlComponent>
          </Grid>
          <Grid item xs={6}>
            <ColorNamePicker name="MauChu" formik={formik} valueDefault={formik.values.MauChu} />
          </Grid>
        </Grid>
        <Grid xs={12} item container columnSpacing={isXs ? 1 : 0}>
          <Grid item xs={8}>
            <FormControlComponent xsLabel={isXs ? 0 : 4.5} xsForm={isXs ? 12 : 7.5} isRequire label={t('phoivanbang.field.configkieuchu')}>
              <InputForm
                formik={formik}
                name="KieuChu"
                type="text"
                placeholder={t('phoivanbang.field.configkieuchu')}
                sx={{ width: '95%' }}
              />
            </FormControlComponent>
          </Grid>
          <Grid item xs={4}>
            <FormControlComponent xsLabel={isXs ? 0 : 4.5} xsForm={isXs ? 12 : 7.5} isRequire label={t('config.field.cochu')}>
              <InputForm formik={formik} name="CoChu" type="text" placeholder={t('config.field.cochu')} />
            </FormControlComponent>
          </Grid>
        </Grid>
        <Grid xs={12} item container columnSpacing={isXs ? 1 : 0}>
          <Grid item xs={6}>
            <FormControlComponent xsLabel={isXs ? 0 : 6} xsForm={isXs ? 12 : 6} isRequire label={t('config.field.vitritren')}>
              <InputForm formik={formik} name="ViTriTren" type="number" sx={{ width: '90%' }} />
            </FormControlComponent>
          </Grid>
          <Grid item xs={6}>
            <FormControlComponent xsLabel={isXs ? 0 : 6} xsForm={isXs ? 12 : 6} isRequire label={t('config.field.vitritrai')}>
              <InputForm formik={formik} name="ViTriTrai" type="number" />
            </FormControlComponent>
          </Grid>
        </Grid>
        <Grid xs={12} item container columnSpacing={isXs ? 1 : 0}>
          <Grid item xs={6}>
            <FormControlComponent xsLabel={isXs ? 0 : 6} xsForm={isXs ? 12 : 6} isRequire label={t('Hiển thị trên phôi')}>
              <Checkbox
                checked={formik.values.HienThi} // Check if the value is 'x'
                onChange={(e) => formik.setFieldValue('HienThi', e.target.checked)}
                sx={{ padding: '8px 0' }}
              />
            </FormControlComponent>
          </Grid>
        </Grid>
        <Grid item xs={12} container spacing={2} justifyContent="flex-end">
          <FormGroupButton type="subpopup" />
        </Grid>
      </Grid>
    </form>
  );
};

export default EditConfig;
