import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';

export const usePhoibansaoValidationSchema = (isUpdate = false) => {
  const { t } = useTranslation();

  let phoibansaoValidationSchema = Yup.object({
    MaHeDaoTao: Yup.string().required(t('validation.donvitruong.mahedaotao')),
    TenPhoi: Yup.string().required(t('validation.phoivanbang.tenphoi')),
    SoLuongPhoi: Yup.string().required(t('validation.phoivanbang.soluongphoi')),
    NgayMua: Yup.string().required(t('validation.phoivanbang.ngaymua')),
    ChieuNgang: Yup.string().required(t('Chiều ngang phôi không được để trống')),
    ChieuDoc: Yup.string().required(t('Chiều dọc phôi không được để trống')),
    SoHieuPhoi: Yup.string().required(t('Tiền tố phôi không được để trống')),
    SoBatDau: Yup.string().required(t('Số bắt đầu không được để trống'))
  });

  if (!isUpdate) {
    phoibansaoValidationSchema = phoibansaoValidationSchema.shape({
      lyDo: Yup.string().required(t('validation.phoivanbang.lydo'))
    });
  }

  return phoibansaoValidationSchema;
};

export default usePhoibansaoValidationSchema;
