import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';

export const useLoaiTinTucValidationSchema = () => {
  const { t } = useTranslation();

  const loaiTinTucValidationSchema = Yup.object({
    tieuDe: Yup.string().required(t('validation.danhmuctotnghiep.tieude')),
    ghiChu: Yup.string(),
  });

  return loaiTinTucValidationSchema;
};

export default useLoaiTinTucValidationSchema;
