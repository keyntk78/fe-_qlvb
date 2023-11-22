import React from 'react';
import { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import { Checkbox, Grid, useMediaQuery } from '@mui/material';
import { createDonvi } from 'services/donvitruongService';
import { useTranslation } from 'react-i18next';
import { useDonviValidationSchema } from 'components/validations/donvivalidation';
import { setOpenPopup, showAlert, setReloadData } from 'store/actions';
import { convertJsonToFormData } from 'utils/convertJsonToFormData';
import { userLoginSelector, openPopupSelector, donviSelector } from 'store/selectors';
import InputForm from 'components/form/InputForm';
import { handleResponseStatus } from 'utils/handleResponseStatus';
import { useNavigate } from 'react-router-dom';
import FormControlComponent from 'components/form/FormControlComponent ';
import SelectList from 'components/form/SelectList';
import FormGroupButton from 'components/button/FormGroupButton';
import { useTheme } from '@emotion/react';
import { getAllDonViCha, getAllLoaiDonVi, getAllHinhThucDaoTao, getAllHeDaoTao } from 'services/sharedService';

const AddDonvi = () => {
  const theme = useTheme();

  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  // const isXs = useMediaQuery('(max-width:800px)');
  const openPopup = useSelector(openPopupSelector);
  const userlogin = useSelector(userLoginSelector);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const [isChecked, setIsChecked] = useState(false);
  const donvi = useSelector(donviSelector);
  const donviValidationSchema = useDonviValidationSchema(isChecked ? true : false, donvi);

  const [pageState, setPageState] = useState({
    isLoading: false,
    hinhthucdaotao: [],
    hedaotao: [],
    donviquanly: [],
    donviquanlycha: []
  });

  useEffect(() => {}, [isChecked]);

  const formik = useFormik({
    initialValues: {
      mahedaotao: '',
      mahinhthucdaotao: '',
      donviquanly: donvi === 0 ? '' : donvi.donViQuanLy,
      idcha: donvi === 0 ? '' : donvi.id,
      email: '',
      url: '',
      ma: '',
      diaChi: '',
      ten: '',
      laPhong: '',
      nguoithuchien: userlogin.username
    },
    validationSchema: donviValidationSchema,
    onSubmit: async (values) => {
      try {
        values.laPhong = isChecked;
        const formData = await convertJsonToFormData(values);
        const adddonvi = await createDonvi(formData);
        if (adddonvi.isSuccess == false) {
          dispatch(showAlert(new Date().getTime().toString(), 'error', adddonvi.message.toString()));
        } else {
          dispatch(setOpenPopup(false));
          dispatch(setReloadData(true));
          dispatch(showAlert(new Date().getTime().toString(), 'success', adddonvi.message.toString()));
        }
      } catch (error) {
        console.error('Error updating donvi:', error);
        dispatch(showAlert(new Date().getTime().toString(), 'error', error.toString()));
      }
    }
  });

  useEffect(() => {
    const fetchData = async () => {
      setPageState((old) => ({ ...old, isLoading: true }));
      const hinhthucdaotao = await getAllHinhThucDaoTao();
      const hedaotao = await getAllHeDaoTao();
      const dvquanly = await getAllLoaiDonVi();
      const dvquanlycha = await getAllDonViCha();
      const check = await handleResponseStatus(hinhthucdaotao, navigate);
      const check2 = await handleResponseStatus(hedaotao, navigate);
      const check3 = await handleResponseStatus(dvquanly, navigate);
      const check4 = await handleResponseStatus(dvquanlycha, navigate);
      if (check && check2 && check3 && check4) {
        const datahinhthucdaotao = await hinhthucdaotao.data;
        const dataWithIds = datahinhthucdaotao.map((row, index) => ({
          idindex: index + 1,
          ...row
        }));

        const datahedaotao = await hedaotao.data;
        const dataWithhdt = datahedaotao.map((row, index) => ({
          idindex: index + 1,
          ...row
        }));

        const datadvquanly = await dvquanly.data;
        const dataWithdvql = datadvquanly.map((row, index) => ({
          idindex: index + 1,
          ...row
        }));

        const datadvquanlycha = await dvquanlycha.data;
        const dataWithdvqlc = datadvquanlycha.map((row, index) => ({
          idindex: index + 1,
          ...row
        }));
        dispatch(setReloadData(false));

        setPageState((old) => ({
          ...old,
          isLoading: false,
          hinhthucdaotao: dataWithIds,
          hedaotao: dataWithhdt,
          donviquanly: dataWithdvql,
          donviquanlycha: dataWithdvqlc
        }));

        formik.setValues({
          mahedaotao: pageState.hedaotao[0].ma || '',
          mahinhthucdaotao: pageState.hinhthucdaotao[0].ma || '',
          donviquanly: donvi && donvi === 0 ? pageState.donviquanly[0].giaTri : donvi.donViQuanLy,
          idcha: donvi && donvi === 0 ? pageState.donviquanlycha[0].id : donvi.id,
          nguoithuchien: userlogin.username
        });
      } else {
        setIsAccess(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (openPopup) {
      formik.resetForm();
      setIsChecked(false);
    }
  }, [openPopup]);

  useEffect(() => {
    if (isChecked) {
      formik.setValues((values) => ({
        ...values,
        // mahedaotao: '',
        mahinhthucdaotao: '',
        // giatridonviquanly: '',
        madonvicha: ''
      }));
    }
  }, [isChecked]);
  return (
    <form onSubmit={formik.handleSubmit}>
      <Grid container spacing={1} justifyContent={'center'} mt={1}>
        <Grid item xs={12} container spacing={2}>
          <Grid item xs={isSmallScreen ? 12 : 6}>
            <FormControlComponent xsLabel={0} xsForm={12} isRequire label={t('donvitruong.field.ma')}>
              <InputForm formik={formik} name="ma" type="text" placeholder={t('donvitruong.field.ma')} />
            </FormControlComponent>
          </Grid>
          <Grid item xs={isSmallScreen ? 12 : 6}>
            <FormControlComponent xsLabel={0} xsForm={12} label={t('hedaotao.title')} isRequire>
              <SelectList
                data={pageState.hedaotao}
                name="mahedaotao"
                value="ma"
                request={'ma'}
                optionName="ten"
                placeholder={t('hedaotao.title')}
                formik={formik}
                openPopup
              />
            </FormControlComponent>
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <FormControlComponent xsLabel={0} xsForm={12} isRequire label={t('donvitruong.field.ten')}>
            <InputForm formik={formik} name="ten" type="text" placeholder={t('donvitruong.field.ten')} />
          </FormControlComponent>
        </Grid>
        <Grid item xs={12} container spacing={2}>
          <Grid item xs={12}>
            <FormControlComponent xsLabel={0} xsForm={12} label={t('donvi.title.address')}>
              <InputForm formik={formik} name="diaChi" type="text" placeholder={t('donvi.title.address')} />
            </FormControlComponent>
          </Grid>
        </Grid>
        <Grid item xs={12} container spacing={2}>
          <Grid item xs={isSmallScreen ? 12 : 6}>
            <FormControlComponent xsLabel={0} xsForm={12} label={t('donvitruong.field.url')}>
              <InputForm formik={formik} name="url" type="text" placeholder={t('donvitruong.field.url')} />
            </FormControlComponent>
          </Grid>
          <Grid item xs={isSmallScreen ? 12 : 6}>
            <FormControlComponent xsLabel={0} xsForm={12} label={t('Email')}>
              <InputForm formik={formik} name="email" type="email" placeholder={t('Email')} />
            </FormControlComponent>
          </Grid>
        </Grid>
        {donvi === 0 && (
          <Grid item xs={12} container spacing={2}>
            <Grid item xs={isSmallScreen ? 12 : 6}>
              <FormControlComponent xsLabel={0} xsForm={12} label={t('donvitruong.field.donviquanly')} isRequire>
                <SelectList
                  data={pageState.donviquanly}
                  name="donviquanly"
                  value="giaTri"
                  request={'giaTri'}
                  optionName="tenLoai"
                  placeholder={t('donvitruong.field.donviquanly')}
                  formik={formik}
                  openPopup
                />
              </FormControlComponent>
            </Grid>
            <Grid item xs={isSmallScreen ? 12 : 6}>
              <FormControlComponent xsLabel={0} xsForm={12} label={t('donvitruong.field.isManager')}>
                <Checkbox
                  checked={formik.values.laPhong} // Kiểm tra giá trị isPhong để quyết định trạng thái checked của checkbox
                  onChange={(event) => {
                    setIsChecked(!isChecked);
                    formik.setFieldValue('laPhong', event.target.checked); // Cập nhật giá trị isPhong tùy thuộc vào trạng thái của checkbox
                  }}
                  inputProps={{ 'aria-label': 'controlled' }}
                />
              </FormControlComponent>
            </Grid>
          </Grid>
        )}
        {isChecked ? (
          ''
        ) : (
          <>
            <Grid item xs={12} container spacing={2}>
              {donvi === 0 && (
                <Grid item xs={isSmallScreen ? 12 : 6}>
                  <FormControlComponent xsLabel={0} xsForm={12} label={t('Thuộc đơn vị')} isRequire>
                    <SelectList
                      data={pageState.donviquanlycha}
                      name="idcha"
                      value="id"
                      request={'id'}
                      optionName="ten"
                      placeholder={t('Thuộc đơn vị')}
                      formik={formik}
                      openPopup
                    />
                  </FormControlComponent>
                </Grid>
              )}
              <Grid item xs={isSmallScreen ? 12 : 6}>
                {/* Hình thức đào tạo */}
                <FormControlComponent xsLabel={0} xsForm={12} label={t('hinhthucdaotao.title')} isRequire>
                  <SelectList
                    data={pageState.hinhthucdaotao}
                    name="mahinhthucdaotao"
                    value="ma"
                    request={'ma'}
                    optionName="ten"
                    placeholder={t('hinhthucdaotao.title')}
                    formik={formik}
                    openPopup
                  />
                </FormControlComponent>
              </Grid>
            </Grid>
          </>
        )}
      </Grid>
      <FormGroupButton />
    </form>
  );
};

export default AddDonvi;
