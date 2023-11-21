import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';

export const useActionValidationSchema = () => {
  const { t } = useTranslation();

  const functionValidationSchema = Yup.object({
    action: Yup.string().required(t('validation.action.name')),
    description: Yup.string().required(t('validation.action.description'))
  });

  return functionValidationSchema;
};

export default useActionValidationSchema;
