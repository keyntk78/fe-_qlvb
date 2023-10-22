import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';

export const useHinhthucdaotaoValidationSchema = () => {
  const { t } = useTranslation();

  const hinhthucdaotaoValidationSchema = Yup.object({
    ten: Yup.string().required(t('validation.hinhthucdaotao.ten')),
    ma: Yup.string().required(t('validation.hinhthucdaotao.ma'))
  });

  return hinhthucdaotaoValidationSchema;
};

export default useHinhthucdaotaoValidationSchema;
