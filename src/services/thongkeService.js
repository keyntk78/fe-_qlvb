// import { sendRequest } from 'utils/apiUtils';
import { axiosClient } from './axiosClient';

export async function GetThongKeHocSinhTongQuat(id, nam) {
  try {
    const response = await axiosClient(`TrangChu/GetThongKeHocSinhTongQuat?idTruong=${id}&idNamThi=${nam}`, 'GET');
    return response;
  } catch (error) {
    console.error('Error creating thong ke:', error);
    throw error;
  }
}
export async function GetThongKeSoLuongHocSinhNhanBang(id) {
  try {
    const response = await axiosClient(`TrangChu/GetThongKeSoLuongHocSinhNhanBang?idTruong=${id}`, 'GET');
    return response;
  } catch (error) {
    console.error('Error creating thong ke:', error);
    throw error;
  }
}
export async function ThongKeSoLuongXepLoaiTheoNam(id) {
  try {
    const response = await axiosClient(`TrangChu/ThongKeSoLuongXepLoaiTheoNam?idTruong=${id}`, 'GET');
    return response;
  } catch (error) {
    console.error('Error creating thong ke:', error);
    throw error;
  }
}
export async function ThongKeSoLuongHocSinhTheoNam(id) {
  try {
    const response = await axiosClient(`TrangChu/ThongKeSoLuongHocSinhTheoNam?idTruong=${id}`, 'GET');
    return response;
  } catch (error) {
    console.error('Error creating thong ke:', error);
    throw error;
  }
}

export async function GetTruongById(id) {
  try {
    const response = await axiosClient(`TrangChu/GetTruongById?id=${id}`, 'GET');
    return response;
  } catch (error) {
    console.error('Error creating thong ke:', error);
    throw error;
  }
}

export async function ThongKeHocSinhTotNghiepTheoTruong(params) {
  try {
    const response = await axiosClient(`ThongKe/ThongKeHocSinhTotNghiepTheoTruong?${params}`, 'GET');
    return response;
  } catch (error) {
    console.error('Error creating thong ke:', error);
    throw error;
  }
}

export async function ThongKeHocSinhDoTotNghiepTheoDMTN(params) {
  try {
    const response = await axiosClient(`ThongKe/ThongKeHocSinhDoTotNghiepTheoDMTN?${params}`, 'GET');
    return response;
  } catch (error) {
    console.error('Error creating thong ke:', error);
    throw error;
  }
}

export async function GetHocSinhDTNByTruongAndNamOrDMTN(params) {
  try {
    const response = await axiosClient(`ThongKe/GetHocSinhDTNByTruongAndNamOrDMTN?${params}`, 'GET');
    return response;
  } catch (error) {
    console.error('Error creating thong ke:', error);
    throw error;
  }
}

export async function ThongKePhatBang(params) {
  try {
    const response = await axiosClient(`ThongKe/ThongKePhatBang?${params}`, 'GET');
    return response;
  } catch (error) {
    console.error('Error creating thong ke:', error);
    throw error;
  }
}

export async function GetThongKePhoiGocDaIn(params) {
  try {
    const response = await axiosClient(`ThongKe/GetThongKePhoiGocDaIn?${params}`, 'GET');
    return response;
  } catch (error) {
    console.error('Error creating thong ke:', error);
    throw error;
  }
}

export async function GetHocSinhDoTotNghiepByTruongAndNam(params) {
  try {
    const response = await axiosClient(`ThongKe/GetHocSinhDoTotNghiepByTruongAndNam?${params}`, 'GET');
    return response;
  } catch (error) {
    console.error('Error creating thong ke:', error);
    throw error;
  }
}

export async function GetThongKeInPhoiBang(params) {
  try {
    const response = await axiosClient(`ThongKe/GetThongKeInPhoiBang?${params}`, 'GET');
    return response;
  } catch (error) {
    console.error('Error creating thong ke:', error);
    throw error;
  }
}

export async function GetThongKePhatBang(params) {
  try {
    const response = await axiosClient(`ThongKe/GetThongKePhatBang?${params}`, 'GET');
    return response;
  } catch (error) {
    console.error('Error creating thong ke:', error);
    throw error;
  }
}

export async function GetTraCuuHocSinhTotNghiep(params) {
  try {
    const response = await axiosClient(`TrangChu/GetTraCuuHocSinhTotNghiep?${params}`, 'GET');
    return response;
  } catch (error) {
    console.error('Error creating thong ke:', error);
    throw error;
  }
}

export async function GetSoLuongPhoiDaIn(params) {
  try {
    const response = await axiosClient(`TrangChu/GetSoLuongPhoiDaIn?${params}`, 'GET');
    return response;
  } catch (error) {
    console.error('Error creating thong ke:', error);
    throw error;
  }
}

export async function GetSoLuongDonViDaGui(params) {
  try {
    const response = await axiosClient(`TrangChu/GetSoLuongDonViDaGui?${params}`, 'GET');
    return response;
  } catch (error) {
    console.error('Error creating thong ke:', error);
    throw error;
  }
}

export async function GetSoLuongDonYeuCauCapBanSao(params) {
  try {
    const response = await axiosClient(`TrangChu/GetSoLuongDonYeuCauCapBanSao?${params}`, 'GET');
    return response;
  } catch (error) {
    console.error('Error creating thong ke:', error);
    throw error;
  }
}

export async function GetSoLuongHocSinhChuaDuyet(params) {
  try {
    const response = await axiosClient(`TrangChu/GetSoLuongHocSinhChuaDuyet?${params}`, 'GET');
    return response;
  } catch (error) {
    console.error('Error creating thong ke:', error);
    throw error;
  }
}

export async function GetTongSoHocSinhByTruong(params) {
  try {
    const response = await axiosClient(`TrangChu/GetTongSoHocSinhByTruong?${params}`, 'GET');
    return response;
  } catch (error) {
    console.error('Error creating thong ke:', error);
    throw error;
  }
}

export async function GetSoHocSinhDaDuyetByTruong(params) {
  try {
    const response = await axiosClient(`TrangChu/GetSoHocSinhDaDuyetByTruong?${params}`, 'GET');
    return response;
  } catch (error) {
    console.error('Error creating thong ke:', error);
    throw error;
  }
}

export async function GetSoHocSinhChoDuyetByTruong(params) {
  try {
    const response = await axiosClient(`TrangChu/GetSoHocSinhChoDuyetByTruong?${params}`, 'GET');
    return response;
  } catch (error) {
    console.error('Error creating thong ke:', error);
    throw error;
  }
}

export async function GetSoHocSinhNhanBangByTruong(params) {
  try {
    const response = await axiosClient(`TrangChu/GetSoHocSinhNhanBangByTruong?${params}`, 'GET');
    return response;
  } catch (error) {
    console.error('Error creating thong ke:', error);
    throw error;
  }
}

export async function GetHocSinhDaNhanBangByTruong(params) {
  try {
    const response = await axiosClient(`TrangChu/GetHocSinhDaNhanBangByTruong?${params}`, 'GET');
    return response;
  } catch (error) {
    console.error('Error creating thong ke:', error);
    throw error;
  }
}

export async function GetHocSinhChuaNhanBangByTruong(params) {
  try {
    const response = await axiosClient(`TrangChu/GetHocSinhChuaNhanBangByTruong?${params}`, 'GET');
    return response;
  } catch (error) {
    console.error('Error creating thong ke:', error);
    throw error;
  }
}

export async function GetSoLuongHocSinhQuaTungNam(params) {
  try {
    const response = await axiosClient(`TrangChu/GetSoLuongHocSinhQuaTungNam?${params}`, 'GET');
    return response;
  } catch (error) {
    console.error('Error creating thong ke:', error);
    throw error;
  }
}

export async function GetSoLuongHocSinhTheoXepLoai(params) {
  try {
    const response = await axiosClient(`TrangChu/GetSoLuongHocSinhTheoXepLoai?${params}`, 'GET');
    return response;
  } catch (error) {
    console.error('Error creating thong ke:', error);
    throw error;
  }
}

export async function GetSoLuongHocSinhCapPhatBang(params) {
  try {
    const response = await axiosClient(`TrangChu/GetSoLuongHocSinhCapPhatBang?${params}`, 'GET');
    return response;
  } catch (error) {
    console.error('Error creating thong ke:', error);
    throw error;
  }
}

export async function GetThongKeTongQuatByPhong(params) {
  try {
    const response = await axiosClient(`TrangChu/GetThongKeTongQuatByPhong?${params}`, 'GET');
    return response;
  } catch (error) {
    console.error('Error creating thong ke:', error);
    throw error;
  }
}

export async function GetThongKeTongQuatByTruong(params) {
  try {
    const response = await axiosClient(`TrangChu/GetThongKeTongQuatByTruong?${params}`, 'GET');
    return response;
  } catch (error) {
    console.error('Error creating thong ke:', error);
    throw error;
  }
}
