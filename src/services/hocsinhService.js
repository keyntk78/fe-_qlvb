import { sendRequest } from 'utils/apiUtils';
import { axiosClient } from './axiosClient';
import { setLoading } from 'store/actions';
import { store } from '../store/index';

export async function getHocSinhs(params) {
  try {
    const response = await sendRequest(`HocSinhPhong/GetSearchByPhong?${params}`, 'GET', null);
    return response;
  } catch (error) {
    console.error('Error creating User:', error);
    throw error;
  }
}

export async function getHocSinhByLop(idTruong, idDanhMucTotNghiep, maLop) {
  try {
    const response = await sendRequest(
      `HocSinhPhong/GetListHocSinhByLop?idTruong=${idTruong}&idDanhMucTotNghiep=${idDanhMucTotNghiep}&maLop=${maLop}`,
      'GET',
      null
    );
    return response;
  } catch (error) {
    console.error('Error creating User:', error);
    throw error;
  }
}

export async function getHocSinhByCCCD(cccd) {
  try {
    store.dispatch(setLoading(true));
    const response = await axiosClient(`HocSinhPhong/GetByCccd?cccd=${cccd}`, 'GET', null);
    store.dispatch(setLoading(false));
    return response;
  } catch (error) {
    console.error('Error creating User:', error);
    throw error;
  }
}

export async function createHocSinh(data) {
  try {
    store.dispatch(setLoading(true));
    const response = await axiosClient(`HocSinhPhong/Create`, 'POST', data);
    store.dispatch(setLoading(false));
    return response;
  } catch (error) {
    console.error('Error creating Hocsinh:', error);
    throw error;
  }
}

export async function editHocSinh(data) {
  try {
    store.dispatch(setLoading(true));
    const response = await sendRequest(`HocSinhPhong/Update`, 'PUT', data);
    store.dispatch(setLoading(false));
    return response;
  } catch (error) {
    console.error('Error creating Hocsinh:', error);
    throw error;
  }
}

export async function approveHocSinh(params, data) {
  try {
    store.dispatch(setLoading(true));
    const response = await sendRequest(`HocSinhPhong/Approve?${params}`, 'POST', data);
    store.dispatch(setLoading(false));
    return response;
  } catch (error) {
    console.error('Error creating history access:', error);
    throw error;
  }
}

export async function approveAllHocSinh(maTruong, idDanhmuc) {
  try {
    store.dispatch(setLoading(true));
    const response = await sendRequest(`HocSinhPhong/ApproveAll?IdTruong=${maTruong}&idDanhMucTotNghiep=${idDanhmuc}`, 'POST');
    store.dispatch(setLoading(false));
    return response;
  } catch (error) {
    console.error('Error creating history access:', error);
    throw error;
  }
}
export async function giveBackAllHocSinh(maTruong, idDanhmuc) {
  try {
    store.dispatch(setLoading(true));
    const response = await sendRequest(`HocSinhPhong/GiveBackAll?IdTruong=${maTruong}&idDanhMucTotNghiep=${idDanhmuc}`, 'POST');
    store.dispatch(setLoading(false));
    return response;
  } catch (error) {
    console.error('Error creating history access:', error);
    throw error;
  }
}

export async function giveBackHocSinh(idTruong, idDanhMuc, data) {
  try {
    store.dispatch(setLoading(true));
    const response = await sendRequest(`HocSinhPhong/GiveBack?idTruong=${idTruong}&idDanhMucTotNghiep=${idDanhMuc}`, 'POST', data);
    store.dispatch(setLoading(false));
    return response;
  } catch (error) {
    console.error('Error creating history access:', error);
    throw error;
  }
}

export async function ImportHocSinhByPhong(data) {
  try {
    store.dispatch(setLoading(true));
    const response = await axiosClient(`HocSinhPhong/ImportHocSinh`, 'POST', data);
    store.dispatch(setLoading(false));
    return response;
  } catch (error) {
    console.error('Error creating history access:', error);
    throw error;
  }
}

export async function getAllSoGoc(idTruong) {
  try {
    const response = await sendRequest(`SoGoc/GetAll?IdTruong=${idTruong}`, 'GET');
    return response;
  } catch (error) {
    console.error('Error creating history access:', error);
    throw error;
  }
}

export async function getSearchPhoiGoc(idTruong) {
  try {
    const response = await sendRequest(`PhoiGoc/GetSearch?IdTruong=${idTruong}`, 'POST');
    return response;
  } catch (error) {
    console.error('Error creating history access:', error);
    throw error;
  }
}
export async function getThongTinHocSinhInBang(idTruong, idDanhMucTotNghiep) {
  try {
    const response = await sendRequest(
      `HocSinhPhong/GetThongTinDanhSachHocSinhInBang?idTruong=${idTruong}&idDanhMucTotNghiep=${idDanhMucTotNghiep}`,
      'GET'
    );
    return response;
  } catch (error) {
    console.error('Error creating history access:', error);
    throw error;
  }
}

export async function TongHocSinhChoDuyet(idTruong, idDanhMucTotNghiep) {
  try {
    const response = await sendRequest(
      `HocSinhPhong/TongHocSinhChoDuyet?idTruong=${idTruong}&idDanhMucTotNghiep=${idDanhMucTotNghiep}`,
      'GET'
    );
    return response;
  } catch (error) {
    console.error('Error creating history access:', error);
    throw error;
  }
}
export async function TongHocSinhTraLai(idTruong, idDanhMucTotNghiep) {
  try {
    const response = await sendRequest(
      `HocSinhPhong/TongSoHocSinhTraLai?idTruong=${idTruong}&idDanhMucTotNghiep=${idDanhMucTotNghiep}`,
      'GET'
    );
    return response;
  } catch (error) {
    console.error('Error creating history access:', error);
    throw error;
  }
}

export async function getHocSinhXepLoaiTotNghiep(donvi, DMTN) {
  try {
    const response = await sendRequest(`HocSinhPhong/GetHocSinhXepLoaiTotNghiep?idTruong=${donvi}&idDanhMucTotNghiep=${DMTN}`, 'GET');
    return response;
  } catch (error) {
    console.error('Error creating hoc sinh:', error);
    throw error;
  }
}

export async function getHocSinhXepLoaiTotNghiepTruong(donvi, DMTN) {
  try {
    const response = await sendRequest(`HocSinhTruong/GetHocSinhXepLoaiTotNghiep?idTruong=${donvi}&idDanhMucTotNghiep=${DMTN}`, 'GET');
    return response;
  } catch (error) {
    console.error('Error creating hoc sinh:', error);
    throw error;
  }
}

export async function getThongkeByPhong(donvi, DMTN) {
  try {
    const response = await sendRequest(`HocSinhPhong/ThongkeByPhong?idTruong=${donvi}&idDanhMucTotNghiep=${DMTN}`, 'GET');
    return response;
  } catch (error) {
    console.error('Error creating hoc sinh:', error);
    throw error;
  }
}

export async function arrangeHocSinh(hocSinhs) {
  try {
    store.dispatch(setLoading(true));
    const response = await sendRequest(`HocSinhPhong/UpdateSoThuTu`, 'POST', hocSinhs);
    store.dispatch(setLoading(false));
    return response;
  } catch (error) {
    console.error('Error arrange hoc sinh:', error);
    throw error;
  }
}
