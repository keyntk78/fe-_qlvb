import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';

export const useDanTocValidationSchema = () => {
  const { t } = useTranslation();

  const danTocValidationSchema = Yup.object({
    Ten: Yup.string().required(t('validation.dantoc.name'))
  });

  return danTocValidationSchema;
};

export default useDanTocValidationSchema;
