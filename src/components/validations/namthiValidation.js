import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';

export const useNamthiValidationSchema = () => {
  const { t } = useTranslation();

  const namethiValidationSchema = Yup.object({
    Ten: Yup.number()
      .test('exactDigits', t('validation.namthi.SoKytu'), (value) => {
        return /^\d{4}$/.test(value);
      })
      .required(t('validation.namthi.Ten'))
  });

  return namethiValidationSchema;
};

export default useNamthiValidationSchema;
