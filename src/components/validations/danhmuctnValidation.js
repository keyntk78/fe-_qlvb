import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';

export const useDanhmucTNValidationSchema = () => {
  const { t } = useTranslation();

  const danmuctnValidationSchema = Yup.object({
    IdHinhThucDaoTao: Yup.string().required(t('validation.danhmuctotnghiep.htdt')),
    IdNamThi: Yup.string().required(t('validation.danhmuctotnghiep.nam')),
    TieuDe: Yup.string().required(t('validation.danhmuctotnghiep.tieude')),
    NgayCapBang: Yup.string().required(t('validation.danhmuctotnghiep.ngay')),
    SoQuyetDinh: Yup.string().required(t('validation.danhmuctotnghiep.soquyetdinh'))
  });

  return danmuctnValidationSchema;
};

export default useDanhmucTNValidationSchema;
