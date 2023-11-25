import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';

export const useAuthenticationValidationSchema = () => {
  const { t } = useTranslation();

  const authenticationValidationSchema = Yup.object({
    otp: Yup.string()
      .matches(/^[0-9]+$/, t('Mã xác thực phải là số'))
      .length(6, t('Mã xác thực phải gồm 6 chữ số'))
      .required(t('Mã xác thực không được để trống'))
  });

  return authenticationValidationSchema;
};

export default useAuthenticationValidationSchema;
