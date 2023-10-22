import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';

export const useInGiayChungNhanValidationSchema = () => {
  const { t } = useTranslation();

  const InGiayChungNhanValidationSchema = Yup.object({
    tenDiaPhuong: Yup.string().required(t('validation.tenDiaPhuong')),
    ngayBanHanh: Yup.string().required(t('validation.ngayBanHanh')),
    tenHieuTruong: Yup.string().required(t('validation.tenHieuTruong'))
  });

  return InGiayChungNhanValidationSchema;
};
export default useInGiayChungNhanValidationSchema;
