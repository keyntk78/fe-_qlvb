import { React } from 'react';
import { FormControl, Grid, useMediaQuery } from '@mui/material';
import { useFormik } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { setReloadData } from 'store/actions';
import { openPopupSelector, reloadDataSelector, selectedPhoisaoSelector } from 'store/selectors';
import InputForm from 'components/form/InputForm';
import { useTranslation } from 'react-i18next';
import { getPhoisaoById } from 'services/phoisaoService';
import FormControlComponent from 'components/form/FormControlComponent ';
import { convertFormattedDateToISODate, convertISODateToFormattedDate } from 'utils/formatDate';
import ImageForm from 'components/form/ImageForm';
import { useState } from 'react';
import config from 'config';
import ResetButton from 'components/button/ExitButton';
import { getAllHedaotao } from 'services/hedaotaoService';
import SelectForm from 'components/form/SelectForm';

const Detail = () => {
  const isXs = useMediaQuery('(max-width:600px)');
  const [urlImage, setUrlImage] = useState('');
  const [urlFile, setUrlFile] = useState('');
  const reloadData = useSelector(reloadDataSelector);
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const selectedphoisao = useSelector(selectedPhoisaoSelector);
  const openPopup = useSelector(openPopupSelector);
  const [hdt, setHDT] = useState([]);

  const formik = useFormik({
    initialValues: {
      MaHeDaoTao: '',
      TenPhoi: '',
      SoLuongPhoi: 0,
      AnhPhoi: '',
      NgayHuy: '',
      FileBienBanHuyPhoi: '',
      LyDoHuy: ''
    }
  });

  useEffect(() => {
    const fetchData = async () => {
      const phoisaoById = await getPhoisaoById(selectedphoisao.id);
      const dataPhoisao = phoisaoById.data;
      const NgayMua = convertISODateToFormattedDate(dataPhoisao.ngayMua);
      if (selectedphoisao) {
        formik.setValues({
          TenPhoi: dataPhoisao.tenPhoi || '',
          MaHeDaoTao: dataPhoisao.maHeDaoTao || '',
          SoLuongPhoi: dataPhoisao.soLuongPhoi || 0,
          FileBienBanHuyPhoi: dataPhoisao.fileBienBanHuyPhoi,
          AnhPhoi: dataPhoisao.anhPhoi || '',
          LyDoHuy: dataPhoisao.lyDoHuy || '',
          NgayMua: convertFormattedDateToISODate(NgayMua) || ''
        });
      }
      dispatch(setReloadData(false));
      if (dataPhoisao.anhPhoi) {
        setUrlImage(config.urlFile + 'PhoiBanSao/' + dataPhoisao.anhPhoi);
      } else {
        setUrlImage(''); // If no avatar value, reset the urlImage state to an empty string
      }
      if (dataPhoisao.fileBienBanHuyPhoi) {
        setUrlFile(config.urlFile + 'BienBanHuyPhoi/' + dataPhoisao.fileBienBanHuyPhoi);
      } else {
        setUrlFile(''); // If no avatar value, reset the urlImage state to an empty string
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
    <form>
      <Grid container spacing={1} my={2}>
        <Grid item xs={12} container spacing={1}>
          <FormControlComponent xsLabel={isXs ? 0 : 2.5} xsForm={isXs ? 12 : 9.5} label={t('hedaotao.title')}>
            <FormControl fullWidth variant="outlined">
              <SelectForm
                disabled
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
          <FormControlComponent xsLabel={isXs ? 0 : 2.5} xsForm={isXs ? 12 : 9.5} label={t('phoivanbang.field.tenphoi')}>
            <InputForm formik={formik} name="TenPhoi" isDisabled type="text" placeholder={t('phoivanbang.field.tenphoi')} />
          </FormControlComponent>
          <Grid item container spacing={1}>
            <Grid item xs={6}>
              <FormControlComponent xsLabel={isXs ? 0 : 5} xsForm={isXs ? 12 : 7} label={t('phoivanbang.field.ngaymua')}>
                <InputForm formik={formik} name="NgayMua" type="date" isDisabled placeholder={t('phoivanbang.field.ngaymua')} />
              </FormControlComponent>
            </Grid>
            <Grid item xs={6}>
              <FormControlComponent xsLabel={isXs ? 0 : 4.5} xsForm={isXs ? 12 : 7.5} label={t('phoivanbang.field.soluongphoi')}>
                <InputForm formik={formik} name="SoLuongPhoi" type="number" isDisabled placeholder={t('phoivanbang.field.soluongphoi')} />
              </FormControlComponent>
            </Grid>
          </Grid>
          <Grid item container spacing={1}>
            <Grid item xs={12}>
              <FormControlComponent xsLabel={3} xsForm={6.5} label={t('phoivanbang.field.bienbanhuyphoi')}>
                <a href={urlFile}>{formik.values.FileBienBanHuyPhoi}</a>
              </FormControlComponent>
            </Grid>
          </Grid>
          <Grid item xs={12} sx={{ flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <ImageForm
              noInsert
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
        </Grid>
        <Grid item xs={12} container spacing={1} mt={1} justifyContent="flex-end">
          <Grid item justifyContent="flex-end">
            <ResetButton />
          </Grid>
        </Grid>
      </Grid>
    </form>
  );
};

export default Detail;
