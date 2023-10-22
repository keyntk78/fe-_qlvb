import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';

export const useDonyeucauValidationSchema = () => {
  const { t } = useTranslation();
  const donyeucauValidationSchema = Yup.object({
    IdTruong: Yup.string().required(t('validation.donvitruong.ten')),
    IdNamThi: Yup.string().required(t('validation.khoathi')),
    HoTen: Yup.string().required(t('validation.user.fullname')),
    CCCD: Yup.string().required(t('validation.hocsinh.cccd')),
    DanToc: Yup.string().required(t('validation.hocsinh.dantoc')),
    NgaySinh: Yup.date().required(t('validation.hocsinh.ngaysinh')),
    NoiSinh: Yup.string().required(t('validation.hocsinh.noisinh')),
    XepLoai: Yup.string().required(t('validation.loaitotnghiep')),
    SoLuongBanSao: Yup.number().required(t('validation.soluongbansao')).min(0, t('validation.mínoluongbansao')),
    HoTenNguoiYeuCau: Yup.string().required(t('validation.hotennguoiyeucau')),
    EmailNguoiYeuCau: Yup.string().required(t('validation.user.email.required')).email(t('validation.user.email.valid')),
    CCCDNguoiYeuCau: Yup.string().required(t('validation.hocsinh.cccd')),
    SoDienThoaiNguoiYeuCau: Yup.string().required(t('validation.sodienthoai')),
    DiaChiNguoiYeuCau: Yup.string().required(t('validation.diachi')),
    LyDo: Yup.string().required(t('validation.phoivanbang.lydo')),
    //DiaChiNhan: Yup.string().required(t('validation.diachi'))
    DiaChiNhan: Yup.string().when('PhuongThucNhan', {
      is: '1',
      then: Yup.string().required(t('validation.diachi'))
    })
  });

  return donyeucauValidationSchema;
};

export default useDonyeucauValidationSchema;
