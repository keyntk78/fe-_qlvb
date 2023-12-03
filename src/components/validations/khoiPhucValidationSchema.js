import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';

export const useKhoiphucValidationSchema = () => {
  const { t } = useTranslation();

  let phoicabietValidationSchema = Yup.object({
    selectedFileName: Yup.string().required(t('File không được để trống'))
  });

  return phoicabietValidationSchema;
};

export default useKhoiphucValidationSchema;
