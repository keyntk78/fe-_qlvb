import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';

export const useLoginValidationSchema = () => {
  const { t } = useTranslation();

  const loginValidationSchema = Yup.object({
    username: Yup.string().max(255).required(t('validation.user.username')),
    password: Yup.string()
      .max(255)
      .required(t('validation.password.password'))
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/,
        t('validation.password.passcriteria')
      ),
  });

  return loginValidationSchema;
};

export default useLoginValidationSchema;
