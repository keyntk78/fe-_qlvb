import React, { useState, useRef, useMemo } from 'react';
import JoditEditor from 'jodit-react';
import { FormControl, Grid, useMediaQuery } from '@mui/material';
import FormControlComponent from 'components/form/FormControlComponent ';
import FormGroupButton from 'components/button/FormGroupButton';
import { useFormik } from 'formik';
import { useTranslation } from 'react-i18next';
import InputForm1 from 'components/form/InputForm1';
import { getAllLoaiTinTuc } from 'services/loaitintucService';
import { useDispatch, useSelector } from 'react-redux';
import { openPopupSelector, userLoginSelector } from 'store/selectors';
import { useEffect } from 'react';
import { createTinTuc } from 'services/tintucService';
import { useNavigate } from 'react-router';
import { convertJsonToFormData } from 'utils/convertJsonToFormData';
import { handleResponseStatus } from 'utils/handleResponseStatus';
import ImageForm1 from 'components/form/ImageForm1';
import { setOpenPopup, setReloadData, showAlert } from 'store/actions';
import { useTinTucValidationSchema } from 'components/validations/tintucValidation';
import SelectForm from 'components/form/SelectForm';

const Add = ({ placeholder }) => {
  const isXs = useMediaQuery('(max-width:800px)');
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const editor = useRef(null);
  const [content, setContent] = useState('');
  const [loaiTinTuc, setLoaiTinTuc] = useState([]);
  const userLogin = useSelector(userLoginSelector);
  const openPopup = useSelector(openPopupSelector);
  const tinTucValidationSchema = useTinTucValidationSchema();

  const config = useMemo(
    () => ({
      readonly: false,
      placeholder: placeholder || 'Start typing...'
    }),
    [placeholder]
  );

  const formik = useFormik({
    initialValues: {
      tieuDe: '',
      noiDung: '',
      IdLoaiTinTuc: '',
      hinhAnh: '',
      fileImage: '',
      moTaNgan: '',
      NguoiThucHien: userLogin.username
    },
    validationSchema: tinTucValidationSchema,
    onSubmit: async (values) => {
      try {
        const formData = await convertJsonToFormData(values);
        // formData.append('idHocSinh', selectedHocSinh.id);
        const addedTinTuc = await createTinTuc(formData);
        const check = handleResponseStatus(addedTinTuc, navigate);
        if (!check) {
          dispatch(showAlert(new Date().getTime().toString(), 'error', addedTinTuc.message.toString()));
        } else {
          if (addedTinTuc.isSuccess == false) {
            dispatch(showAlert(new Date().getTime().toString(), 'error', addedTinTuc.message.toString()));
          } else {
            dispatch(showAlert(new Date().getTime().toString(), 'success', addedTinTuc.message.toString()));
            dispatch(setOpenPopup(false));
            dispatch(setReloadData(true));
          }
        }
      } catch (error) {
        console.error('error' + error);
        dispatch(showAlert(new Date().getTime().toString(), 'error', error.toString()));
      }
    }
  });

  useEffect(() => {
    if (openPopup) {
      formik.resetForm();
      formik.setFieldValue('noiDung', '');
      setContent('');
    }
  }, [openPopup]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getAllLoaiTinTuc();
        setLoaiTinTuc(response.data);
        if (response.data && response.data.length > 0) {
          formik.setFieldValue('IdLoaiTinTuc', response.data[0].id);
        } else {
          formik.setFieldValue('IdLoaiTinTuc', '');
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);

  const handleChange = (newContent) => {
    setContent(newContent);
    formik.setFieldValue('noiDung', newContent);
  };

  const handleLoaiTinTucChange = (event) => {
    const selectedValue = event.target.value;
    formik.setFieldValue('IdLoaiTinTuc', selectedValue);
  };

  return (
    <>
      <form onSubmit={formik.handleSubmit}>
        <Grid container spacing={1} my={2}>
          <Grid item xs={12} container>
            <Grid item xs={isXs ? 12 : 6} container spacing={1}>
              <InputForm1
                xs={12}
                formik={formik}
                name="tieuDe"
                label={t('Tiêu đề')}
                placeholder={t('tintuc.field.tieude')}
                isMulltiline
                maxRows={3}
                isRequired
              />
              <FormControlComponent xsLabel={0} xsForm={12} label={t('Loại tin tức')}>
                <FormControl fullWidth variant="outlined">
                  <SelectForm
                    placeholder={t('Loại tin tức')}
                    keyProp="id"
                    valueProp="tieuDe"
                    item={loaiTinTuc}
                    name="IdLoaiTinTuc"
                    value={formik.values.IdLoaiTinTuc ? formik.values.IdLoaiTinTuc : ''}
                    onBlur={formik.handleBlur}
                    formik={formik}
                    onChange={handleLoaiTinTucChange}
                  />
                </FormControl>
              </FormControlComponent>
              <InputForm1
                xs={12}
                formik={formik}
                name="moTaNgan"
                label={t('tintuc.field.motangan')}
                placeholder={t('tintuc.field.motangan')}
                isMulltiline
                maxRows={5}
                isRequired
              />
            </Grid>
            <Grid item xs={isXs ? 12 : 6} container spacing={1}>
              <Grid item xs={12} mt={'10px'}>
                <ImageForm1
                  formik={formik}
                  name="hinhAnh"
                  nameFile="FileImage"
                  width={300}
                  height={170}
                  isImagePreview={openPopup}
                  tintuc
                />
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <FormControlComponent xsLabel={12} xsForm={12} isRequire label={t('tintuc.field.noidung')}>
              <JoditEditor
                ref={editor}
                value={content}
                config={config}
                onChange={handleChange}
                style={{ height: '300px !important' }}
                tabIndex={-1}
                onBlur={(newContent) => setContent(newContent)}
              />
            </FormControlComponent>
          </Grid>
        </Grid>
        <FormGroupButton />
      </form>
    </>
  );
};

export default Add;
