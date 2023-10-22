import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';

export const useProfileValidationSchema = () => {
  const { t } = useTranslation();

  let profileValidationSchema = Yup.object({
    fullName: Yup.string().max(255).required(t('validation.user.fullname')),
    email: Yup.string().email(t('validation.user.email.valid')).max(255).required(t('validation.user.email.required')),
    birthday: Yup.date(),
    phone: Yup.string(),
    address: Yup.string(),
    cccd: Yup.string(),
  });

  return profileValidationSchema;
};

export default useProfileValidationSchema;
