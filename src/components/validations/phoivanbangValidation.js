import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';

export const usePhoivanbangValidationSchema = (isUpdate = false) => {
  const { t } = useTranslation();

  let phoivabbangValidationSchema = Yup.object({
    MaHeDaoTao: Yup.string().required(t('validation.donvitruong.mahedaotao')),
    TenPhoi: Yup.string().required(t('validation.phoivanbang.tenphoi')),
    SoHieuPhoi: Yup.string().required(t('validation.phoivanbang.tientophoi')),
    SoBatDau: Yup.string().required(t('validation.phoivanbang.sobatdau')),
    SoLuongPhoi: Yup.string().required(t('validation.phoivanbang.soluongphoi')),
    NgayApDung: Yup.string().required(t('validation.phoivanbang.ngayapdung'))
    // lyDo: Yup.string().required(t('validation.phoivanbang.lydo'))
  });

  if (!isUpdate) {
    phoivabbangValidationSchema = phoivabbangValidationSchema.shape({
      lyDo: Yup.string().required(t('validation.phoivanbang.lydo'))
    });
  }

  return phoivabbangValidationSchema;
};

export default usePhoivanbangValidationSchema;
