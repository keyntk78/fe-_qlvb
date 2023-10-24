import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';

export const useThuHoiHuyBoValidationSchema = () => {
  const { t } = useTranslation();

  const ThuHoiHuyBoValidationSchema = Yup.object({
    lyDo: Yup.string().required(t('Lý do không được để trống'))
  });

  return ThuHoiHuyBoValidationSchema;
};
export default useThuHoiHuyBoValidationSchema;
