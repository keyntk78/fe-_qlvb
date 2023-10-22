import React from 'react';
import { Grid, useMediaQuery } from '@mui/material';
import { useFormik } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { setReloadData } from 'store/actions';
import ExitButton from 'components/button/ExitButton';
import { openPopupSelector, reloadDataSelector, selectedTinNhanSelector } from 'store/selectors';
import { useTranslation } from 'react-i18next';
import { convertISODateTimeToFormattedDateTime } from 'utils/formatDate';
import { GetNotificationById } from 'services/notificationService';
import InputForm1 from 'components/form/InputForm1';

const Detail = () => {
  const isXs = useMediaQuery('(max-width:600px)');
  const openPopup = useSelector(openPopupSelector);
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const tinnhan = useSelector(selectedTinNhanSelector);
  const reloadData = useSelector(reloadDataSelector);
  const formik = useFormik({
    initialValues: {}
  });

  useEffect(() => {
    const fetchData = async () => {
      const response = await GetNotificationById(tinnhan.idMessage);
      const tinnhandata = response.data;
      if (tinnhan) {
        formik.setValues({
          time: convertISODateTimeToFormattedDateTime(tinnhandata.time),
          type: tinnhandata.messageType,
          action: tinnhandata.action,
          // nguoiNhan: tinnhandata.recipient,
          tieuDe: tinnhandata.title,
          noiDung: tinnhandata.content
        });
      }
      dispatch(setReloadData(false));
    };
    if (openPopup) {
      fetchData();
    }
  }, [tinnhan, reloadData, openPopup]);

  return (
    <>
      <Grid container spacing={1}>
        <Grid xs={12} item container spacing={1} mt={1}>
          <InputForm1 formik={formik} xs={isXs ? 12 : 6} label={t('Thời gian gửi')} name="time" isDisabled />
          <InputForm1 formik={formik} xs={isXs ? 12 : 6} label={t('Loại tin nhắn')} name="type" isDisabled />
        </Grid>
        {/* <Grid xs={12} item container spacing={1}>
          <InputForm1 formik={formik} xs={isXs ? 12 : 6} label={t('Người gửi')} name="nguoiGui" isDisabled />
          <InputForm1 formik={formik} xs={isXs ? 12 : 6} label={t('Người nhận')} name="nguoiNhan" isDisabled />
        </Grid> */}
        <InputForm1 formik={formik} xs={12} label={t('Thao tác')} name="action" isDisabled />
        <InputForm1 formik={formik} xs={12} label={t('Tiêu đề')} name="tieuDe" isDisabled />
        <InputForm1 formik={formik} xs={12} label={t('Nội dung')} name="noiDung" isDisabled isMulltiline minRows={3} />
        <Grid item xs={12} container spacing={2} justifyContent="flex-end" mt={1}>
          <Grid item>
            <ExitButton />
          </Grid>
        </Grid>
      </Grid>
    </>
  );
};

export default Detail;
