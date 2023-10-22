import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';

export const useChangePassValidationSchema = () => {
  const { t } = useTranslation();

  const changePassValidationSchema = Yup.object({
    password: Yup.string().max(255).required(t('validation.password.oldpass')),
    newPassword: Yup.string()
      .max(255)
      .required(t('validation.password.newpass'))
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/,
        t('validation.password.passcriteria')
      ),
    confirmPassword: Yup.string()
      .max(255)
      .required(t('validation.password.confirmpass'))
      .oneOf([Yup.ref('newPassword'), null], t('validation.password.matchpassword'))
  });

  return changePassValidationSchema;
};

export default useChangePassValidationSchema;
