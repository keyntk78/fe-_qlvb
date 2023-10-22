import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';

export const useMonthiValidationSchema = () => {
  const { t } = useTranslation();

  const monthiValidationSchema = Yup.object({
    ten: Yup.string().required(t('validation.monthi.ten')),
    ma: Yup.string().required(t('validation.monthi.ma'))
  });

  return monthiValidationSchema;
};

export default useMonthiValidationSchema;
