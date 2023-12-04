import { Grid, useMediaQuery, Radio, RadioGroup, FormControlLabel } from '@mui/material';
import { IconRefresh } from '@tabler/icons';
import { useFormik } from 'formik';
import NoButton from 'components/button/NoButton';
import YesButton from 'components/button/YesButton';
import MuiTypography from '@mui/material/Typography';
import { useDispatch, useSelector } from 'react-redux';
import { setOpenPopup, setReloadData, showAlert, setOpenSubPopup } from 'store/actions';
import { useTranslation } from 'react-i18next';
import FormControlComponent from 'components/form/FormControlComponent ';
import InputForm from 'components/form/InputForm';
import { useDongBoValidationSchema } from 'components/validations/dongBoValidation';
import { useState } from 'react';
import { openSubPopupSelector } from 'store/selectors';
import XacNhanDongBo from './XacNhanDongBo';
import Popup from 'components/controls/popup';
import { SyncCollection } from 'services/saoluuService';

function DongBo() {
  const openSubPopup = useSelector(openSubPopupSelector);
  const isXs = useMediaQuery('(max-width:600px)');
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const DongBoValidationSchema = useDongBoValidationSchema();
  const [option, setOption] = useState('all');
  const [title, setTitle] = useState('');
  const [form, setForm] = useState('');

  const formik = useFormik({
    initialValues: {
      Option: 'all',
      StartDate: '',
      EndDate: ''
    },
    validationSchema: DongBoValidationSchema,
    onSubmit: async () => {
      setForm('xacnhandongbo');
      setTitle(t('Xác nhận đồng bộ'));
      dispatch(setOpenSubPopup(true));
    }
  });

  const handleChange = (event) => {
    const value = event.target.value;
    setOption(value);
    formik.setFieldValue('Option', value);
    if (value === 'all') {
      formik.resetForm();
    }
  };

  const handleSubmit = async () => {
    try {
      const response = await SyncCollection(formik.values.StartDate, formik.values.EndDate);

      if (response.isSuccess == false) {
        dispatch(showAlert(new Date().getTime().toString(), 'error', response.message.toString()));
      } else {
        dispatch(setOpenPopup(false));
        dispatch(setOpenSubPopup(false));
        dispatch(setReloadData(true));
        dispatch(showAlert(new Date().getTime().toString(), 'success', response.message.toString()));
        formik.resetForm();
        setOption('all');
      }
    } catch (error) {
      console.error('error' + error);
      dispatch(setOpenSubPopup(false));
      dispatch(showAlert(new Date().getTime().toString(), 'error', error.toString()));
    }
  };

  return (
    <div style={{ textAlign: 'center' }}>
      <Grid item xs={12} mt={2}>
        <IconRefresh size={100} color="#2196F3" />
      </Grid>
      <MuiTypography variant="h4" gutterBottom m={1}>
        {`${t('Bạn có chắc chắn đồng bộ dữ liệu ?')}`}
      </MuiTypography>
      <Grid item container spacing={isXs ? 0 : 1} columnSpacing={isXs ? 1 : 0} mt={2} justifyContent={'center'}>
        <Grid item xs={8}>
          <FormControlComponent xsLabel={isXs ? 0 : 5} xsForm={isXs ? 12 : 7} label={t('Đồng bộ theo')}>
            <RadioGroup style={{ display: 'flex', justifyContent: 'flex-start' }} row value={option} onChange={handleChange}>
              <FormControlLabel value={'all'} control={<Radio />} label={t('Tất cả')} />
              <FormControlLabel value={'part'} control={<Radio />} label={t('Theo đợt')} />
            </RadioGroup>
          </FormControlComponent>
        </Grid>
      </Grid>
      {option === 'part' ? (
        <>
          <Grid item container spacing={isXs ? 0 : 1} columnSpacing={isXs ? 1 : 0} mt={2} justifyContent={'center'}>
            <Grid item xs={8}>
              <FormControlComponent xsLabel={isXs ? 0 : 5} xsForm={isXs ? 12 : 7} isRequire label={t('Ngày bắt đầu')}>
                <InputForm formik={formik} name="StartDate" type="date" placeholder={t('Ngày bắt đầu')} />
              </FormControlComponent>
            </Grid>
          </Grid>
          <Grid item container spacing={isXs ? 0 : 1} columnSpacing={isXs ? 1 : 0} my={1} justifyContent={'center'}>
            <Grid item xs={8}>
              <FormControlComponent xsLabel={isXs ? 0 : 5} xsForm={isXs ? 12 : 7} isRequire label={t('Ngày kết thúc')}>
                <InputForm formik={formik} name="EndDate" type="date" placeholder={t('Ngày kết thúc')} />
              </FormControlComponent>
            </Grid>
          </Grid>
        </>
      ) : (
        ''
      )}

      <Grid container spacing={1} direction="row" justifyContent="center" my={2}>
        <Grid item>
          <YesButton handleClick={formik.handleSubmit} />
        </Grid>
        <Grid item>
          <NoButton />
        </Grid>
      </Grid>
      {form !== '' && (
        <Popup
          title={title}
          form={form}
          openPopup={openSubPopup}
          type={'subpopup'}
          maxWidth={'sm'}
          bgcolor={form === 'xacnhandongbo' ? '#F44336' : '#2196F3'}
        >
          <XacNhanDongBo onSubmit={handleSubmit} />
        </Popup>
      )}
    </div>
  );
}
export default DongBo;
