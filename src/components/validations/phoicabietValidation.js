import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';

export const usePhoicabietValidationSchema = () => {
  const { t } = useTranslation();

  let phoicabietValidationSchema = Yup.object({
    soHieus: Yup.string().required(t('Số hiệu không được để trống')),
    LyDoHuy: Yup.string().required(t('Lý do huy không được để trống'))
  });

  return phoicabietValidationSchema;
};

export default usePhoicabietValidationSchema;
