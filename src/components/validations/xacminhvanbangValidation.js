import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';

export const useXacMinhVanBangValidationSchema = () => {
  const { t } = useTranslation();

  const XacMinhVangBangValidationSchema = Yup.object({
    donViXacMinh: Yup.string().required(t('Đơn vị xác minh không được để trống')),
    ngayBanHanh: Yup.string().required(t('validation.ngayBanHanh')),
    congVanSo: Yup.string().required(t('Số công văn không được để trống'))
  });

  return XacMinhVangBangValidationSchema;
};
export default useXacMinhVanBangValidationSchema;
