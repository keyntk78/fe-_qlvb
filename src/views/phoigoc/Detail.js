import { React } from 'react';
import { FormControl, Grid, useMediaQuery } from '@mui/material';
import { useFormik } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { setReloadData } from 'store/actions';
import { openPopupSelector, reloadDataSelector, selectedPhoigocSelector } from 'store/selectors';
import InputForm from 'components/form/InputForm';
import { useTranslation } from 'react-i18next';
import { getPhoigocById } from 'services/phoigocService';
import FormControlComponent from 'components/form/FormControlComponent ';
import { convertFormattedDateToISODate, convertISODateToFormattedDate } from 'utils/formatDate';
import ImageForm from 'components/form/ImageForm';
import { useState } from 'react';
import config from 'config';
import ResetButton from 'components/button/ExitButton';
import SelectForm from 'components/form/SelectForm';
import { getAllHedaotao } from 'services/hedaotaoService';
import InputForm1 from 'components/form/InputForm1';

const Detail = () => {
  const isXs = useMediaQuery('(max-width:600px)');
  const [urlImage, setUrlImage] = useState('');
  const [urlFile, setUrlFile] = useState('');
  const reloadData = useSelector(reloadDataSelector);
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const selectedPhoigoc = useSelector(selectedPhoigocSelector);
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
      NgayHuy: '',
      FileBienBanHuyPhoi: '',
      LyDoHuy: ''
    }
  });

  useEffect(() => {
    const fetchData = async () => {
      const Phoigocbyid = await getPhoigocById(selectedPhoigoc.id);
      const dataPhoigoc = Phoigocbyid.data;
      const NgayHuy = convertISODateToFormattedDate(dataPhoigoc.bienBanHuyPhoi.ngayHuy);
      if (selectedPhoigoc) {
        formik.setValues({
          TenPhoi: dataPhoigoc.tenPhoi || '',
          MaHeDaoTao: dataPhoigoc.maHeDaoTao || '',
          SoHieuPhoi: dataPhoigoc.soHieuPhoi,
          SoBatDau: dataPhoigoc.soBatDau || '',
          SoLuongPhoi: dataPhoigoc.soLuongPhoi || 0,
          FileBienBanHuyPhoi: dataPhoigoc.bienBanHuyPhoi.fileBienBanHuyPhoi,
          AnhPhoi: dataPhoigoc.anhPhoi || '',
          LyDoHuy: dataPhoigoc.bienBanHuyPhoi.lyDoHuy || '',
          NgayHuy: convertFormattedDateToISODate(NgayHuy) || ''
        });
      }
      dispatch(setReloadData(false));
      if (dataPhoigoc.anhPhoi) {
        setUrlImage(config.urlFile + 'PhoiGoc/' + dataPhoigoc.anhPhoi);
      } else {
        setUrlImage(''); // If no avatar value, reset the urlImage state to an empty string
      }
      if (dataPhoigoc.bienBanHuyPhoi.fileBienBanHuyPhoi) {
        setUrlFile(config.urlFile + 'BienBanHuyPhoi/' + dataPhoigoc.bienBanHuyPhoi.fileBienBanHuyPhoi);
      } else {
        setUrlFile(''); // If no avatar value, reset the urlImage state to an empty string
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
    <form>
      <Grid container spacing={1} my={isXs ? 0 : 2}>
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
              <FormControlComponent xsLabel={isXs ? 0 : 5} xsForm={isXs ? 12 : 7} label={t('phoivanbang.field.sohieuphoi')}>
                <InputForm formik={formik} name="SoHieuPhoi" isDisabled type="text" placeholder={t('phoivanbang.field.sohieuphoi')} />
              </FormControlComponent>
            </Grid>
            <Grid item xs={6}>
              <FormControlComponent xsLabel={isXs ? 0 : 4.5} xsForm={isXs ? 12 : 7.5} label={t('phoivanbang.field.sobatdau')}>
                <InputForm formik={formik} name="SoBatDau" type="text" isDisabled placeholder={t('phoivanbang.field.sobatdau')} />
              </FormControlComponent>
            </Grid>
          </Grid>
          <Grid item container spacing={1}>
            <Grid item xs={6}>
              <FormControlComponent xsLabel={isXs ? 0 : 5} xsForm={isXs ? 12 : 7} label={t('phoivanbang.field.ngayapdung')}>
                <InputForm formik={formik} name="NgayHuy" type="date" isDisabled placeholder={t('phoivanbang.field.ngayapdung')} />
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
          <InputForm1
            formik={formik}
            minRows={3}
            maxRows={10}
            xs={12}
            name="LyDoHuy"
            type="text"
            isMulltiline
            isDisabled
            label={t('phoivanbang.field.lydo')}
          />
        </Grid>
        <Grid item xs={12} container spacing={2} justifyContent="flex-end">
          <Grid item justifyContent="flex-end">
            <ResetButton />
          </Grid>
        </Grid>
      </Grid>
    </form>
  );
};

export default Detail;
