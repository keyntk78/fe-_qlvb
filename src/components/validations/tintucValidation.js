import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';

export const useTinTucValidationSchema = () => {
  const { t } = useTranslation();

  const tinTucValidationSchema = Yup.object({
    IdLoaiTinTuc: Yup.string().required(t('tintuc.validation.loai')),
    tieuDe: Yup.string().required(t('validation.danhmuctotnghiep.tieude')),
    moTaNgan: Yup.string().required(t('validation.tintuc.motangan'))
  });

  return tinTucValidationSchema;
};

export default useTinTucValidationSchema;
