import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';

export const useHocSinhValidationSchema = (isPhong = false, configAuto) => {
  const { t } = useTranslation();

  let hocSinhValidationSchema = Yup.object({
    ngaySinh: Yup.string().required(t('validation.hocsinh.ngaysinh')),
    idDanhMucTotNghiep: Yup.string().required(t('validation.danhmuctotnghiep')),
    idKhoaThi: Yup.string().required(t('validation.khoathi')),
    hoTen: Yup.string().required(t('validation.user.fullname')),
    cccd: Yup.string().required(t('validation.hocsinh.cccd')),
    danToc: Yup.string().required(t('validation.hocsinh.dantoc')),
    diaChi: Yup.string().required(t('validation.hocsinh.diachi')),
    lop: Yup.string().required(t('validation.hocsinh.lop')),
    noiSinh: Yup.string().required(t('validation.hocsinh.noisinh')),
    //xepLoai: Yup.string().required(t('validation.hocsinh.xeploai'))
    // hocLuc: Yup.string().required(t('validation.hocsinh.hocluc')),
    hanhKiem: Yup.string().required(t('validation.hocsinh.hanhkiem'))
  });

  if (isPhong) {
    hocSinhValidationSchema = hocSinhValidationSchema.shape({
      idTruong: Yup.string().required(t('validation.donvitruong'))
    });
  }
  if (!configAuto) {
    hocSinhValidationSchema = hocSinhValidationSchema.shape({
      hocLuc: Yup.string().required(t('validation.hocsinh.hocluc')),
      xepLoai: Yup.string().required(t('validation.hocsinh.xeploai')),
      ketQua: Yup.string().required(t('Kết quả không được để trống'))
    });
  }

  return hocSinhValidationSchema;
};

export default useHocSinhValidationSchema;
