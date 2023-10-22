import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';
import { isValidYear } from 'utils/checkValidYear';
import { selectedNamthiSelector } from 'store/selectors';
import { useSelector } from 'react-redux';
export const useKhoathiValidationSchema = () => {
  const { t } = useTranslation();
  const selectedNamthi = useSelector(selectedNamthiSelector);
  const khoathiValidationSchema = Yup.object({
    Ten: Yup.string().required(t('validation.khoathi.Ten')),
    Ngay: Yup.date()
      .required(t('validation.khoathi.Ngay'))
      .test('is-valid-year', `${t('validation.year.valid')}`, function (value) {
        const year = new Date(value).getFullYear();
        const namthiTen = selectedNamthi?.ten;
        return isValidYear(year, namthiTen);
      })
  });

  return khoathiValidationSchema;
};

export default useKhoathiValidationSchema;
