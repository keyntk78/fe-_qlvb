import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';
export const useChinhSuaVanBangValidationSchema = () => {
  const { t } = useTranslation();

  const configChinhSuaVanBangValidationSchema = Yup.object({
    HoTen: Yup.string().required(t('validation.user.fullname')),
    CCCD: Yup.string().required(t('validation.hocsinh.cccd')),
    NgaySinh: Yup.string().required(t('validation.config.tendiaphuongcapbang')),
    NoiSinh: Yup.string().required(t('validation.config.tenuybannhandan')),
    LyDo: Yup.string().required(t('validation.phoivanbang.lydo')),
    SoHieuVanbang: Yup.string().required(t('sohieuvb.valid')),
    SoVaoSoCapBang: Yup.string().required(t('sovaoso.valid')),
    HoiDongThi: Yup.string().required(t('hoidongthi.valid')),
    XepLoai: Yup.string().required(t('validation.hocsinh.xeploai'))
  });

  return configChinhSuaVanBangValidationSchema;
};

export default useChinhSuaVanBangValidationSchema;
