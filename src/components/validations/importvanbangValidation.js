import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';

export const useImportVanBangValidationSchema = () => {
  const { t } = useTranslation();

  let ImportVanBangValidationSchema = Yup.object({
    UyBanNhanDan: Yup.string().required(t('Ủy ban nhân dân không được để trống')),
    CoQuanCapBang: Yup.string().required(t('Cơ quan cấp bằng không được để trống')),
    NguoiKyBang: Yup.string().required(t('Người lý bằng không được để trống')),
    DiaPhuongCapBang: Yup.string().required(t('Địa phương cấp bằng không được để trống'))
  });

  return ImportVanBangValidationSchema;
};

export default useImportVanBangValidationSchema;
