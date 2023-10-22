import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';

export const useHedaotaoValidationSchema = () => {
  const { t } = useTranslation();

  const hedaotaoValidationSchema = Yup.object({
    Ma: Yup.string().required(t('validation.hedaotao.Ma')),
    Ten: Yup.string().required(t('validation.hedaotao.Ten'))
  });

  return hedaotaoValidationSchema;
};

export default useHedaotaoValidationSchema;
