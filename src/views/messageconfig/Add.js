import React from 'react';
import { Grid, useMediaQuery } from '@mui/material';
import FormGroupButton from 'components/button/FormGroupButton';
import { useFormik } from 'formik';
import { useTranslation } from 'react-i18next';
import InputForm1 from 'components/form/InputForm1';
import { useDispatch, useSelector } from 'react-redux';
import { openPopupSelector, userLoginSelector } from 'store/selectors';
import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { handleResponseStatus } from 'utils/handleResponseStatus';
import { setOpenPopup, setReloadData, showAlert } from 'store/actions';
import { createMessageConfig } from 'services/messageConfigService';
import useMessageConfigValidationSchema from 'components/validations/messageConfigValidation';

const AddMessageConfig = () => {
  const isXs = useMediaQuery('(max-width:600px)');
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // const editor = useRef(null);
  // const [content, setContent] = useState('');
  const userLogin = useSelector(userLoginSelector);
  const openPopup = useSelector(openPopupSelector);
  const messageConfigValidationSchema = useMessageConfigValidationSchema();

  // const config = useMemo(
  //   () => ({
  //     readonly: false,
  //     placeholder: placeholder || 'Nhập nội dung...'
  //   }),
  //   [placeholder]
  // );

  const formik = useFormik({
    initialValues: {
      actionName: '',
      description: '',
      title: '',
      body: '',
      url: '',
      color: '',
      userAction: userLogin.username
    },
    validationSchema: messageConfigValidationSchema,
    onSubmit: async (values) => {
      try {
        const response = await createMessageConfig(values);
        const check = handleResponseStatus(response, navigate);
        if (!check) {
          dispatch(showAlert(new Date().getTime().toString(), 'error', response.message.toString()));
        } else {
          if (response.isSuccess == false) {
            dispatch(showAlert(new Date().getTime().toString(), 'error', response.message.toString()));
          } else {
            dispatch(showAlert(new Date().getTime().toString(), 'success', response.message.toString()));
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
      // formik.setFieldValue('body', '');
      // setContent('');
    }
  }, [openPopup]);

  // const handleChange = (newContent) => {
  //   setContent(newContent);
  //   formik.setFieldValue('body', newContent);
  // };

  return (
    <>
      <form onSubmit={formik.handleSubmit}>
        <Grid container spacing={1} my={1}>
          <Grid item xs={12} container>
            <Grid item xs={12} container spacing={isXs ? 0 : 1}>
              <InputForm1
                xs={isXs ? 12 : 6}
                formik={formik}
                name="actionName"
                label={t('Tên hành động')}
                placeholder={t('Tên hành động')}
                isRequired
              />
              <InputForm1
                xs={isXs ? 12 : 6}
                formik={formik}
                name="title"
                label={t('tintuc.field.tieude')}
                placeholder={t('tintuc.field.tieude')}
                isRequired
              />
              <InputForm1 xs={8} formik={formik} name="url" label={t('Đường dẫn')} placeholder={t('Đường dẫn')} />
              <InputForm1 xs={4} formik={formik} name="color" label={t('Màu sắc')} placeholder={t('Màu sắc')} />
              <InputForm1
                xs={12}
                formik={formik}
                name="description"
                label={t('config.field.description')}
                placeholder={t('config.field.description')}
              />
            </Grid>
          </Grid>
          <Grid item xs={12}>
            {/* <FormControlComponent xsLabel={12} xsForm={12} isRequire label={t('tintuc.field.noidung')}>
              <JoditEditor
                ref={editor}
                value={content}
                config={config}
                onChange={handleChange}
                style={{ height: '300px !important' }}
                tabIndex={-1}
                onBlur={(newContent) => setContent(newContent)}
              />
            </FormControlComponent> */}
            <InputForm1
              xs={12}
              formik={formik}
              name="body"
              label={t('Nội dung')}
              placeholder={t('Nội dung')}
              isRequired
              isMulltiline
              minRows={3}
            />
          </Grid>
        </Grid>
        <FormGroupButton />
      </form>
    </>
  );
};

export default AddMessageConfig;
