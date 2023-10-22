import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';

export const useConfigPhoiValidationSchema = () => {
  const { t } = useTranslation();

  const configPhoiValidationSchema = Yup.object({
    KieuChu: Yup.string().required(t('validation.phoivanbang.kieuchu')),
    CoChu: Yup.string().required(t('validation.phoivanbang.kichthuoc')),
    DinhDangKieuChu: Yup.string().required(t('validation.phoivanbang.đinhangkieuchu')),
    ViTriTren: Yup.string().required(t('validation.phoivanbang.vitritren')),
    ViTriTrai: Yup.string().required(t('validation.phoivanbang.vitritrai')),
    MauChu: Yup.string().required(t('validation.phoivanbang.mauchu'))
  });

  return configPhoiValidationSchema;
};

export default useConfigPhoiValidationSchema;
