import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';

export const useReportValidationSchema = () => {
  const { t } = useTranslation();

  const reportValidationSchema = Yup.object({
    name: Yup.string().required(t('Tên báo cáo không được để trống')),
    url: Yup.string().required(t('Đường dẫn không được để trống'))
  });

  return reportValidationSchema;
};

export default useReportValidationSchema;
