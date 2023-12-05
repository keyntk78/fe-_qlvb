import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';

export const useDongBoValidationSchema = () => {
  const { t } = useTranslation();

  let dongBoValidationSchema = Yup.object({
    Option: Yup.string(),
    StartDate: Yup.date().when('Option', {
      is: 'part',
      then: Yup.date().required(t('Ngày bắt đầu bắt buộc nhập')),
      otherwise: Yup.date().default(undefined) // Sử dụng giá trị không tồn tại trong mặc định
    }),
    EndDate: Yup.date()
      .when('Option', {
        is: 'part',
        then: Yup.date().required(t('Ngày kết thúc bắt buộc nhập')),
        otherwise: Yup.date().default(undefined) // Sử dụng giá trị không tồn tại trong mặc định
      })
      .min(Yup.ref('StartDate'), 'Ngày kết thúc phải lớn hơn ngày bắt đầu')
  });

  return dongBoValidationSchema;
};

export default useDongBoValidationSchema;
