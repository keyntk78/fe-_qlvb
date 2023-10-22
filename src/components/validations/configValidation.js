import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';

export const useConfigValidationSchema = () => {
  const { t } = useTranslation();

  const configValidationSchema = Yup.object({
    configKey: Yup.string().required(t('validation.config.key')),
    configValue: Yup.string().required(t('validation.config.value')),
    configDesc: Yup.string(),
  });

  return configValidationSchema;
};

export default useConfigValidationSchema;