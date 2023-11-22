import React from 'react';
import { Checkbox, Grid, useMediaQuery } from '@mui/material';
import { useFormik } from 'formik';
import { useDonviValidationSchema } from 'components/validations/donvivalidation';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { editDonvi, getById } from 'services/donvitruongService';
import { getAllHinhthucdaotao } from 'services/hinhthucdaotaoService';
import { getAllHedaotao } from 'services/hedaotaoService';
import { showAlert, setOpenPopup, setReloadData } from 'store/actions';
import { donviSelector, openPopupSelector, selectedDonvitruongSelector } from 'store/selectors';
import { useTranslation } from 'react-i18next';
import { userLoginSelector, reloadDataSelector } from 'store/selectors';
import { convertJsonToFormData } from 'utils/convertJsonToFormData';
import InputForm from 'components/form/InputForm';
import { handleResponseStatus } from 'utils/handleResponseStatus';
import { useNavigate } from 'react-router-dom';
import FormGroupButton from 'components/button/FormGroupButton';
import FormControlComponent from 'components/form/FormControlComponent ';
import SelectList from 'components/form/SelectList';
import { getAllDonViCha, getAllLoaiDonVi } from 'services/sharedService';
import { useTheme } from '@emotion/react';

const EditDonvi = () => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  // const isXs = useMediaQuery('(max-width:800px)');
  const openPopup = useSelector(openPopupSelector);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const [isChecked, setIsChecked] = useState(false);
  const dvql = useSelector(donviSelector);
  const donviValidationSchema = useDonviValidationSchema(isChecked ? true : false, dvql);
  const user = useSelector(userLoginSelector);
  const reloadData = useSelector(reloadDataSelector);
  const donvi = useSelector(selectedDonvitruongSelector);
  const [pageState, setPageState] = useState({
    isLoading: false,
    hinhthucdaotao: [],
    hedaotao: [],
    donviquanly: [],
    donviquanlycha: []
  });
  const formik = useFormik({
    initialValues: {
      mahedaotao: '',
      mahinhthucdaotao: '',
      donviquanly: dvql === 0 ? '' : dvql.donViQuanLy,
      idcha: dvql === 0 ? '' : dvql.id,
      email: '',
      url: '',
      ma: '',
      diaChi: '',
      ten: '',
      laPhong: ''
    },
    validationSchema: donviValidationSchema,
    onSubmit: async (values) => {
      try {
        values.laPhong = isChecked;
        const formData = await convertJsonToFormData(values);
        const donviUpdated = await editDonvi(formData);

        if (donviUpdated.isSuccess == false) {
          dispatch(showAlert(new Date().getTime().toString(), 'error', donviUpdated.message.toString()));
        } else {
          dispatch(setOpenPopup(false));
          dispatch(setReloadData(true));
          dispatch(showAlert(new Date().getTime().toString(), 'success', donviUpdated.message.toString()));
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
      const donvibyid = await getById(donvi.id);
      const hinhthucdaotao = await getAllHinhthucdaotao();
      const hedaotao = await getAllHedaotao();
      const dvquanly = await getAllLoaiDonVi();
      const dvquanlycha = await getAllDonViCha();
      const check = await handleResponseStatus(hinhthucdaotao, navigate);
      const check2 = await handleResponseStatus(hedaotao, navigate);
      const check3 = await handleResponseStatus(dvquanly, navigate);
      const check4 = await handleResponseStatus(dvquanlycha, navigate);
      if (check & check2 & check3 & check4) {
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
        const datadonvi = await donvibyid.data;
        dispatch(setReloadData(false));

        setPageState((old) => ({
          ...old,
          isLoading: false,
          hinhthucdaotao: dataWithIds,
          hedaotao: dataWithhdt,
          donviquanly: dataWithdvql,
          donviquanlycha: dataWithdvqlc
        }));
        if (donvi) {
          formik.setValues({
            id: donvi.id,
            url: datadonvi.url || '',
            ma: datadonvi.ma || '',
            ten: datadonvi.ten || '',
            laPhong: datadonvi.laPhong || '',
            email: datadonvi.email || '',
            diaChi: datadonvi.diaChi || '',
            mahedaotao: datadonvi.maHeDaoTao || '',
            mahinhthucdaotao: datadonvi.maHinhThucDaoTao || '',
            donviquanly: datadonvi.donViQuanLy || '',
            idcha: datadonvi.idCha,
            // giatridonviquanly: datadonvi.donViQuanLy,
            // madonvicha: datadonvi.ma,
            nguoithuchien: user.username
          });
          setIsChecked(datadonvi.laPhong);
        }
      } else {
        setIsAccess(false);
      }
    };
    if (openPopup) {
      fetchData();
    }
  }, [donvi, reloadData, openPopup]);

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
      <Grid container>
        <Grid item xs={12} container spacing={2} mt={1}>
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
        {dvql === 0 && (
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
              {dvql === 0 && (
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

export default EditDonvi;
