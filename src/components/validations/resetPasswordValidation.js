import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';

export const useResetPassValidationSchema = () => {
  const { t } = useTranslation();

  const resetPassValidationSchema = Yup.object({
    password: Yup.string()
      .max(255)
      .required(t('validation.password.password'))
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/,
        t('validation.password.passcriteria')
      ),
    confirmPassword: Yup.string()
      .max(255)
      .required(t('validation.password.confirmpass'))
      .oneOf([Yup.ref('password'), null], t('validation.password.matchpassword'))
  });

  return resetPassValidationSchema;
};

export default useResetPassValidationSchema;
