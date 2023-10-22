import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setOpenPopup, setReloadData, showAlert } from 'store/actions';
import { openPopupSelector, reloadDataSelector, selectedDonvitruongSelector } from 'store/selectors';
import { useTranslation } from 'react-i18next';
import { Grid, useMediaQuery } from '@mui/material';
import { getConfigByTruongId, editConfigDonviQuanLy, editConfigDonvi } from 'services/configDonviService';
import FormControlComponent from 'components/form/FormControlComponent ';
import FormGroupButton from 'components/button/FormGroupButton';
import InputForm from 'components/form/InputForm';
import { useFormik } from 'formik';
// import useConfigDonviValidationSchema from 'components/validations/configDonviValidation';
import config from 'config';
import ImageForm from 'components/form/ImageForm';
import { convertJsonToFormData } from 'utils/convertJsonToFormData';
//import { getAllConfigs } from 'services/configService';
// import { getAllConfigs } from 'services/configService';

const Config = () => {
  const isXs = useMediaQuery('(max-width:800px)');
  const openPopup = useSelector(openPopupSelector);
  const reloadData = useSelector(reloadDataSelector);
  const [urlImage, setUrlImage] = useState('');
  const donvi = useSelector(selectedDonvitruongSelector);
  console.log(donvi);
  // const configDonviValidationSchema = useConfigDonviValidationSchema();
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const formik = useFormik({
    initialValues: {
      MaCoQuanCapBang: '',
      TenCoQuanCapBang: '',
      TenDiaPhuongCapBang: '',
      TenUyBanNhanDan: '',
      HoTenNguoiKySoGoc: '',
      LogoDonvi: '',
      FileImage: '',
      TienToBanSao: '',
      SoKyTu: '',
      SoBatDau: '',
      HieuTruong: '',
      TenDiaPhuong: '',
      NgayBanHanh: ''
    },
    onSubmit: async (values) => {
      try {
        const formDataDonviQL = {
          MaCoQuanCapBang: values.MaCoQuanCapBang,
          TenCoQuanCapBang: values.TenCoQuanCapBang,
          TenDiaPhuongCapBang: values.TenDiaPhuongCapBang,
          TenUyBanNhanDan: values.TenUyBanNhanDan,
          HoTenNguoiKySoGoc: values.HoTenNguoiKySoGoc,
          LogoDonvi: values.LogoDonvi,
          FileImage: values.FileImage,
          TienToBanSao: values.TienToBanSao,
          SoKyTu: values.SoKyTu,
          SoBatDau: values.SoBatDau
        };

        const formDataDonviT = {
          LogoDonvi: values.LogoDonvi,
          FileImage: values.FileImage,
          HieuTruong: values.HieuTruong,
          TenDiaPhuong: values.TenDiaPhuong,
          NgayBanHanh: values.NgayBanHanh
        };

        const formData1 = await convertJsonToFormData(formDataDonviQL);
        const formData2 = await convertJsonToFormData(formDataDonviT);

        const configdonviUpdated = await (donvi.laPhong
          ? editConfigDonviQuanLy(donvi.id, formData1)
          : editConfigDonvi(donvi.id, formData2));

        if (configdonviUpdated.isSuccess === false) {
          dispatch(showAlert(new Date().getTime().toString(), 'error', configdonviUpdated.message.toString()));
        } else {
          dispatch(setOpenPopup(false));
          dispatch(setReloadData(true));
          dispatch(showAlert(new Date().getTime().toString(), 'success', configdonviUpdated.message.toString()));
        }
      } catch (error) {
        console.error('Lỗi khi cập nhật đơn vị:', error);
        dispatch(showAlert(new Date().getTime().toString(), 'error', error.toString()));
      }
    }
  });

  useEffect(() => {
    const fetchData = async () => {
      const congfigdonvi = await getConfigByTruongId(donvi.id);
      const datadonvi = await congfigdonvi.data;
      formik.setValues({
        MaCoQuanCapBang: datadonvi.maCoQuanCapBang || '',
        TenUyBanNhanDan: datadonvi.tenUyBanNhanDan || '',
        TenCoQuanCapBang: datadonvi.tenCoQuanCapBang || '',
        HoTenNguoiKySoGoc: datadonvi.hoTenNguoiKySoGoc || '',
        TenDiaPhuongCapBang: datadonvi.tenDiaPhuongCapBang || '',
        TienToBanSao: datadonvi.tienToBanSao || '',
        SoKyTu: datadonvi.soKyTu || '',
        SoBatDau: datadonvi.soBatDau || '',
        HieuTruong: datadonvi.hieuTruong || '',
        TenDiaPhuong: datadonvi.tenDiaPhuong || '',
        NgayBanHanh: datadonvi.ngayBanHanh || ''
      });
      //}
      if (datadonvi) {
        if (datadonvi.logoDonvi) {
          setUrlImage(config.urlFile + 'Logo/' + datadonvi.logoDonvi);
        } else {
          setUrlImage(''); // If no avatar value, reset the urlImage state to an empty string
        }
      } else {
        formik.resetForm();
      }
    };
    fetchData();
  }, [donvi.id, reloadData, openPopup]);

  return (
    <form onSubmit={formik.handleSubmit}>
      <Grid container spacing={2} my={1}>
        {donvi && donvi.laPhong ? (
          <Grid item lg={8} md={8} sm={8} xs={12} container spacing={1}>
            <div style={{ borderBottom: '2px solid black', fontWeight: 'bold', fontSize: '17px', height: '40px' }}>
              <p>{t('Cấu hình chung')}</p>
            </div>
            <Grid item container spacing={2}>
              <Grid item xs={isXs ? 12 : 6}>
                <FormControlComponent xsLabel={0} xsForm={12} label={t('cauhinhdonvi.field.maCoQuanCapBang')}>
                  <InputForm formik={formik} name="MaCoQuanCapBang" type="text" placeholder={t('cauhinhdonvi.field.maCoQuanCapBang')} />
                </FormControlComponent>
              </Grid>
              <Grid item xs={isXs ? 12 : 6}>
                <FormControlComponent xsLabel={0} xsForm={12} label={t('cauhinhdonvi.field.tenCoQuanCapBang')}>
                  <InputForm formik={formik} name="TenCoQuanCapBang" type="text" placeholder={t('cauhinhdonvi.field.tenCoQuanCapBang')} />
                </FormControlComponent>
              </Grid>
            </Grid>
            <Grid item container spacing={2}>
              <Grid item xs={isXs ? 12 : 6}>
                <FormControlComponent xsLabel={0} xsForm={12} label={t('cauhinhdonvi.field.tenDiaPhuongCapBang')}>
                  <InputForm
                    formik={formik}
                    name="TenDiaPhuongCapBang"
                    type="text"
                    placeholder={t('cauhinhdonvi.field.tenDiaPhuongCapBang')}
                  />
                </FormControlComponent>
              </Grid>
              <Grid item xs={isXs ? 12 : 6}>
                <FormControlComponent xsLabel={0} xsForm={12} label={t('cauhinhdonvi.field.tenUyBanNhanDan')}>
                  <InputForm formik={formik} name="TenUyBanNhanDan" type="text" placeholder={t('cauhinhdonvi.field.tenUyBanNhanDan')} />
                </FormControlComponent>
              </Grid>
            </Grid>
            <Grid item container spacing={2}>
              <Grid item xs={isXs ? 12 : 6}>
                <FormControlComponent xsLabel={0} xsForm={12} label={t('cauhinhdonvi.field.hoTenNguoiKySoGoc')}>
                  <InputForm formik={formik} name="HoTenNguoiKySoGoc" type="text" placeholder={t('cauhinhdonvi.field.hoTenNguoiKySoGoc')} />
                </FormControlComponent>
              </Grid>
            </Grid>
            <div style={{ borderBottom: '2px solid black', fontWeight: 'bold', fontSize: '17px', height: '40px' }}>
              <p>{t('Cấu hình số hiệu bản sao')}</p>
            </div>
            <Grid item container spacing={2}>
              <Grid item xs={isXs ? 12 : 6}>
                <FormControlComponent xsLabel={0} xsForm={12} label={t('Tiền tố bản sao')}>
                  <InputForm formik={formik} name="TienToBanSao" type="text" placeholder={t('Tiền tố bản sao')} />
                </FormControlComponent>
              </Grid>
              <Grid item xs={isXs ? 12 : 6}>
                <FormControlComponent xsLabel={0} xsForm={12} label={t('Số ký tự')}>
                  <InputForm formik={formik} name="SoKyTu" type="text" placeholder={t('Số ký tự')} />
                </FormControlComponent>
              </Grid>
            </Grid>
            <Grid item container spacing={2}>
              <Grid item xs={isXs ? 12 : 6}>
                <FormControlComponent xsLabel={0} xsForm={12} label={t('Số bắt đầu')}>
                  <InputForm formik={formik} name="SoBatDau" type="text" placeholder={t('Số bắt đầu')} />
                </FormControlComponent>
              </Grid>
            </Grid>
          </Grid>
        ) : (
          <Grid item lg={8} md={8} sm={8} xs={12} container spacing={1}>
            <Grid item container spacing={2}>
              <Grid item xs={isXs ? 12 : 6}>
                <FormControlComponent xsLabel={0} xsForm={12} label={t('Tên hiệu trưởng')}>
                  <InputForm formik={formik} name="HieuTruong" type="text" placeholder={t('Tên hiệu trưởng')} />
                </FormControlComponent>
              </Grid>
              <Grid item xs={isXs ? 12 : 6}>
                <FormControlComponent xsLabel={0} xsForm={12} label={t('Tên địa phương')}>
                  <InputForm formik={formik} name="TenDiaPhuong" type="text" placeholder={t('Tên địa phương')} />
                </FormControlComponent>
              </Grid>
            </Grid>
            <Grid item container spacing={2}>
              <Grid item xs={isXs ? 12 : 6}>
                <FormControlComponent xsLabel={0} xsForm={12} label={t('Ngày Ban Hành')}>
                  <InputForm
                    formik={formik}
                    name="NgayBanHanh"
                    type="date"
                    value={formik.values.ngayBanHanh ? new Date(formik.values.ngayBanHanh).toISOString().slice(0, 10) : ''}
                  />
                </FormControlComponent>
              </Grid>
            </Grid>
            <Grid item container spacing={2}></Grid>
            <Grid item container spacing={2}></Grid>
            <Grid item container spacing={2}></Grid>
            <Grid item container spacing={2}></Grid>
            <Grid item container spacing={2}></Grid>
            <Grid item container spacing={2}></Grid>
            <Grid item container spacing={2}></Grid>
            <Grid item container spacing={2}></Grid>
            <Grid item container spacing={2}></Grid>
            <Grid item container spacing={2}></Grid>
            <Grid item container spacing={2}></Grid>
            <Grid item container spacing={2}></Grid>
            <Grid item container spacing={2}></Grid>
          </Grid>
        )}
        <Grid
          item
          lg={4}
          md={4}
          sm={4}
          xs={12}
          sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}
        >
          <ImageForm
            donviTruong
            formik={formik}
            name="LogoDonvi"
            nameFile="FileImage"
            urlImage={urlImage}
            isImagePreview={openPopup}
            width={200}
            height={200}
          />
        </Grid>
      </Grid>
      <Grid>
        <FormGroupButton />
      </Grid>
    </form>
  );
};

export default Config;
