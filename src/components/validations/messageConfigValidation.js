import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';

export const useMessageConfigValidationSchema = () => {
  const { t } = useTranslation();

  const messageConfigValidationSchema = Yup.object({
    actionName: Yup.string().required(t('validation.messageconfig.actionname')),
    title: Yup.string().required(t('validation.messageconfig.title')),
    body: Yup.string().required(t('validation.messageconfig.body'))
  });

  return messageConfigValidationSchema;
};

export default useMessageConfigValidationSchema;
