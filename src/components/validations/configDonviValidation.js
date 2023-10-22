import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';

export const useConfigDonviValidationSchema = () => {
  const { t } = useTranslation();

  const configDonviValidationSchema = Yup.object({
    MaCoQuanCapBang: Yup.string().required(t('validation.config.macoquan')),
    TenCoQuanCapBang: Yup.string().required(t('validation.config.tencoquan')),
    TenDiaPhuongCapBang: Yup.string().required(t('validation.config.tendiaphuongcapbang')),
    TenUyBanNhanDan: Yup.string().required(t('validation.config.tenuybannhandan')),
    HoTenNguoiKySoGoc: Yup.string().required(t('validation.config.hotenkyso')),
    DinhDangSoThuTuSoGoc: Yup.string().required(t('validation.config.thutusogoc')),
    DinhDangSoThuTuCapLai: Yup.string().required(t('validation.config.thutucaplai'))
  });

  return configDonviValidationSchema;
};

export default useConfigDonviValidationSchema;
