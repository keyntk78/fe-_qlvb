import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';

const usePhatbangValidationSchema = () => {
  const { t } = useTranslation();

  const phatbangValidationSchema = Yup.object({
    cccdNguoiNhanBang: Yup.string().required(t('validation.hocsinh.cccd')),
    moiQuanHe: Yup.string().required(t('Quan hệ với người được cấp bằng không được để trống'))
    // giayUyQuyen: Yup.mixed()
    //   .required('Vui lòng chọn tệp giấy ủy quyền')
    //   .test('fileFormat', 'Invalid file format', (value) => {
    //     if (!value) return true; // Don't validate if no file is selected.
    //     const allowedFormats = /\.(docx|xlsx|xls|jpg|png)$/i; // Use a regular expression
    //     const fileName = value.name || '';
    //     return allowedFormats.test(fileName);
    //   })
    // giayUyQuyen: Yup.mixed().required('Vui lòng chọn tệp giấy ủy quyền')
  });

  return phatbangValidationSchema;
};

export default usePhatbangValidationSchema;
