import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';

export const useThayDoiSoHieuValidationSchema = () => {
  const { t } = useTranslation();

  const thaydoisohieuValidationSchema = Yup.object({
    soHieuMoi: Yup.string().required(t('Số hiệu mới không được để trống'))
  });

  return thaydoisohieuValidationSchema;
};

export default useThayDoiSoHieuValidationSchema;
