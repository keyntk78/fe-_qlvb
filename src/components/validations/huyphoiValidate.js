import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';

export const useHuyphoiValidationSchema = () => {
  const { t } = useTranslation();

  const phoivabbangValidationSchema = Yup.object({
    LyDoHuy: Yup.string().required(t('validation.phoivanbang.lydohuy'))
    // FileBienBanHuyPhoi: Yup.mixed().required('Vui lòng chọn tệp!')
  });

  return phoivabbangValidationSchema;
};

export default useHuyphoiValidationSchema;
