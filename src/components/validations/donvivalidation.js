import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';

export const useDonviValidationSchema = (isPhong, donvi) => {
  const { t } = useTranslation();

  let donviValidationSchema = Yup.object({
    ten: Yup.string().required(t('validation.donvitruong.ten')),
    ma: Yup.string().required(t('validation.donvitruong.ma')),
    mahedaotao: Yup.string().required(t('validation.donvitruong.mahedaotao'))
    // donviquanly: Yup.string().required(t('Cấp quản lý không được để trống'))
    //diaChi: Yup.string().required(t('validation.hocsinh.diachi')),
    //email: Yup.string().email(t('validation.user.email.valid')).max(255).required(t('validation.user.email.required')),
    //url: Yup.string().required(t('validation.donvitruong.url'))
  });

  if (donvi === 0) {
    donviValidationSchema = donviValidationSchema.shape({
      // idcha: Yup.string().required(t('Đơn vị cha không được để trống')),
      // mahinhthucdaotao: Yup.string().required(t('validation.donvitruong.mahinhthucdaotao'))
      donviquanly: Yup.string().required(t('Cấp quản lý không được để trống'))
    });
  }

  if (!isPhong) {
    donviValidationSchema = donviValidationSchema.shape({
      idcha: Yup.string().required(t('Đơn vị cha không được để trống')),
      mahinhthucdaotao: Yup.string().required(t('validation.donvitruong.mahinhthucdaotao'))
    });
  }

  return donviValidationSchema;
};

export default useDonviValidationSchema;
