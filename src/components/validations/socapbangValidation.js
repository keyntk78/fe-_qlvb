import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';

export const useSocapbangValidationSchema = () => {
  const { t } = useTranslation();

  const socapbangValidationSchema = Yup.object({
    NgayQuyetDinhTotNghiep: Yup.string().required(t('validation.khoatn')),
    TenSo: Yup.string().required(t('validation.socapbang.name')),
    IdDanhMucTotNghiep: Yup.string().required(t('validation.danhmuctotnghiep')),
    IdHinhThucDaoTao: Yup.string().required(t('validation.hinhthucdaotao')),
    IdNamThi: Yup.string().required(t('validation.namthi'))
  });

  return socapbangValidationSchema;
};

export default useSocapbangValidationSchema;
