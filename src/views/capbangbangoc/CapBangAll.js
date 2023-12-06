import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectedPhoigoc, setDisabledButton, setOpenSubPopup } from 'store/actions';
import { openSubPopupSelector, selectedDanhmucSelector, selectedDonvitruongSelector } from 'store/selectors';
import { useTranslation } from 'react-i18next';
import { Button, Divider, Grid, Tooltip, Typography, useMediaQuery } from '@mui/material';
import { IconFileCertificate } from '@tabler/icons';
import AnimateButton from 'components/extended/AnimateButton';
import ExitButton from 'components/button/ExitButton';
import { useFormik } from 'formik';
import InputForm1 from 'components/form/InputForm1';
import FormControlComponent from 'components/form/FormControlComponent ';
import { getPhoiDangSuDung } from 'services/phoigocService';
import Popup from 'components/controls/popup';
import InBang from './InBang';
import { convertDateTimeToDate } from 'utils/formatDate';
import { getAllHocSinhDuaVaoSoGoc } from 'services/capbangbanchinhService';

const CapBangAll = () => {
  const isXs = useMediaQuery('(max-width:800px)');
  const dispatch = useDispatch();
  const donvi = useSelector(selectedDonvitruongSelector);
  const { t } = useTranslation();
  const danhmuc = useSelector(selectedDanhmucSelector);
  const [title, setTitle] = useState('');
  const [form, setForm] = useState('');
  const openSubPopup = useSelector(openSubPopupSelector);
  const [phoi, setPhoi] = useState('');
  const [daTaSoGoc, setdaTaSoGoc] = useState([]);

  const handleInBang = () => {
    setTitle(t('In bằng'));
    setForm('inbang');
    dispatch(setOpenSubPopup(true));
    dispatch(setDisabledButton(false));
  };

  useEffect(() => {
    const fetchData = async () => {
      const phoidata = await getPhoiDangSuDung(donvi.id);
      setPhoi(phoidata.data);
      dispatch(selectedPhoigoc(phoidata.data));
    };
    fetchData();
  }, [donvi, danhmuc]);

  const formik = useFormik({
    initialValues: {
      UyBanNhanDan: '',
      CoQuanCapBang: '',
      NguoiKyBang: '',
      DiaPhuongCapBang: '',
      ngayCapBang: ''
    }
  });

  useEffect(() => {
    const fetchData = async () => {
      const response = await getAllHocSinhDuaVaoSoGoc(donvi.id, danhmuc.id);
      setdaTaSoGoc(response.data);
      formik.setValues({
        UyBanNhanDan: response.data[0].uyBanNhanDan || '',
        CoQuanCapBang: response.data[0].coQuanCapBang || '',
        NguoiKyBang: response.data[0].nguoiKyBang || '',
        DiaPhuongCapBang: response.data[0].diaPhuongCapBang || '',
        ngayCapBang: convertDateTimeToDate(response.data[0].ngayCapBang) || ''
      });
    };
    fetchData();
  }, [donvi.id, danhmuc.id]);

  return (
    <>
      <form onSubmit={formik.handleSubmit}>
        <Grid container>
          <Grid item container justifyContent="flex-end" mt={3}>
            <AnimateButton>
              <Tooltip title={t('Cấp bằng')} placement="bottom">
                <Button color="primary" variant="contained" onClick={handleInBang} startIcon={<IconFileCertificate />}>
                  {t('Cấp bằng')}
                </Button>
              </Tooltip>
            </AnimateButton>
          </Grid>
          <Grid container spacing={1} mb={4}>
            <Grid item xs={isXs ? 12 : 3}>
              <FormControlComponent xsLabel={isXs ? 5 : 7} xsForm={isXs ? 5 : 5} label={t('Tổng số học sinh:')}>
                <Typography variant="h5" mt={0.8} sx={{ fontSize: 17, fontWeight: 'bold' }}>
                  {daTaSoGoc && daTaSoGoc.length > 0 ? daTaSoGoc.length : 0}
                </Typography>
              </FormControlComponent>
            </Grid>
            <Grid item xs={isXs ? 12 : 5}>
              <FormControlComponent xsLabel={2} xsForm={10} label={t('Số hiệu:')}>
                <Typography variant="h5" mt={0.8} sx={{ fontSize: 17, fontWeight: 'bold' }}>
                  {daTaSoGoc && daTaSoGoc.length > 0
                    ? `${daTaSoGoc[0].soHieuVanBang} - ${daTaSoGoc[daTaSoGoc.length - 1].soHieuVanBang}`
                    : '12'}
                </Typography>
              </FormControlComponent>
            </Grid>
            <Grid item xs={isXs ? 12 : 4}>
              <FormControlComponent xsLabel={isXs ? 4 : 5} xsForm={isXs ? 5 : 6} label={t('Số phôi còn lại:')}>
                <Typography variant="h5" mt={0.8} sx={{ fontSize: 17, fontWeight: 'bold' }}>
                  {phoi ? phoi.soLuongPhoi : ''}
                </Typography>
              </FormControlComponent>
            </Grid>
          </Grid>
          <Grid container spacing={1} mt={-3}>
            <Grid item xs={12} sm={6} md={4}>
              <InputForm1 formik={formik} xs={12} label={'Danh mục tốt nghiệp'} name="dmtn" value={danhmuc.tieuDe} isDisabled />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <InputForm1 formik={formik} xs={12} label={'Đơn vị trường'} name="dvdk" value={donvi.ten} isDisabled />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <InputForm1 formik={formik} xs={12} label={'Ủy ban nhân dân'} name="UyBanNhanDan" isDisabled />
            </Grid>
          </Grid>
        </Grid>
        <Grid container spacing={1} mt={1}>
          <Grid item xs={6} sm={3} md={3}>
            <InputForm1 formik={formik} xs={12} label={'Cơ quan cấp bằng'} name="CoQuanCapBang" isDisabled />
          </Grid>
          <Grid item xs={6} sm={3} md={3}>
            <InputForm1 formik={formik} xs={12} label={'Địa phương cấp bằng'} name="DiaPhuongCapBang" isDisabled />
          </Grid>
          <Grid item xs={6} sm={3} md={3}>
            <InputForm1 formik={formik} xs={12} label={'Người ký'} name="NguoiKyBang" isDisabled />
          </Grid>
          <Grid item xs={6} sm={3} md={3}>
            <InputForm1 formik={formik} xs={12} label={'Ngày cấp bằng'} name="ngayCapBang" type="date" isDisabled />
          </Grid>
        </Grid>
        <Grid item mt={2}>
          <Divider />
        </Grid>
        <Grid item xs={12} container spacing={2} justifyContent="flex-end">
          <Grid item mt={2}>
            <ExitButton />
          </Grid>
        </Grid>
      </form>
      {form !== '' && (
        <Popup
          title={title}
          form={form}
          type="subpopup"
          openPopup={openSubPopup}
          maxWidth={form === 'inbang' ? 'md' : 'sm'}
          bgcolor={form === 'delete' ? '#F44336' : '#2196F3'}
        >
          {form === 'inbang' ? <InBang duLieuHocSinhSoGoc={daTaSoGoc} /> : ''}
        </Popup>
      )}
    </>
  );
};

export default CapBangAll;
