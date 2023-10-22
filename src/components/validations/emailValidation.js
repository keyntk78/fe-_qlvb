import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';

export const useEmailValidationSchema = () => {
  const { t } = useTranslation();

  const emailValidationSchema = Yup.object({
    email: Yup.string().email(t('validation.user.email.valid')).max(255).required(t('validation.user.email.required')),
  });

  return emailValidationSchema;
};

export default useEmailValidationSchema;
