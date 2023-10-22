import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';

export const useMenuValidationSchema = () => {
  const { t } = useTranslation();

  const menuValidationSchema = Yup.object({
    nameMenu: Yup.string().required(t('validation.donvitruong.ten'))
  });

  return menuValidationSchema;
};

export default useMenuValidationSchema;
