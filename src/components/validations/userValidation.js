import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';

export const useUserValidationSchema = (isUpdate = false) => {
  const { t } = useTranslation();

  let userValidationSchema = Yup.object({
    truongId: Yup.string().max(255).required(t('validation.donvitruong')),
    userName: Yup.string().max(255).required(t('validation.user.username')),
    fullName: Yup.string().max(255).required(t('validation.user.fullname')),
    email: Yup.string().email(t('validation.user.email.valid')).max(255).required(t('validation.user.email.required')),
    birthday: Yup.date(),
    phone: Yup.string()
      .max(20)
      .required(t('validation.user.phone.required'))
      .matches(/\(?([0-9]{3})\)?([ .-]?)([0-9]{3})\2([0-9]{4})/, t('validation.user.phone.valid')),
    address: Yup.string(),
    cccd: Yup.string()
  });

  if (!isUpdate) {
    userValidationSchema = userValidationSchema.shape({
      password: Yup.string()
        .max(255)
        .required(t('validation.password.password'))
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/, t('validation.password.passcriteria'))
    });
  }

  return userValidationSchema;
};

export default useUserValidationSchema;
