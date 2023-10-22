import { sendRequest } from 'utils/apiUtils';
import { axiosClient } from './axiosClient';
import { setLoading } from 'store/actions';
import { store } from '../store/index';

export async function getHocSinhByTruong(MaTruong, params) {
  try {
    const response = await sendRequest(`HocSinhTruong/GetSearchByTruong/${MaTruong}?${params}`, 'GET');
    return response;
  } catch (error) {
    console.error('Error creating history access:', error);
    throw error;
  }
}

export async function getHocSinhByCCCD(cccd) {
  try {
    store.dispatch(setLoading(true));
    const response = await axiosClient(`HocSinhTruong/GetByCccd?cccd=${cccd}`, 'GET', null);
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
    const response = await axiosClient(`HocSinhTruong/Create`, 'POST', data);
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
    const response = await sendRequest(`HocSinhTruong/Update`, 'PUT', data);
    store.dispatch(setLoading(false));
    return response;
  } catch (error) {
    console.error('Error creating Hocsinh:', error);
    throw error;
  }
}

export async function comfirmHocSinhByTruong(idTruong, idDanhMuc, data) {
  try {
    store.dispatch(setLoading(true));
    const response = await sendRequest(`HocSinhTruong/Confirm?IdTruong=${idTruong}&idDanhMucTotNghiep=${idDanhMuc}`, 'POST', data);
    store.dispatch(setLoading(false));
    return response;
  } catch (error) {
    console.error('Error creating history access:', error);
    throw error;
  }
}

export async function comfirmAllHocSinhByTruong(idTruong, idDanhMuc, token) {
  try {
    store.dispatch(setLoading(true));
    const response = await sendRequest(
      `HocSinhTruong/ConfirmAll?idTruong=${idTruong}&idDanhMucTotNghiep=${idDanhMuc}&deviceToken=${token}`,
      'POST'
    );
    store.dispatch(setLoading(false));
    return response;
  } catch (error) {
    console.error('Error creating history access:', error);
    throw error;
  }
}

export async function deleteHocSinhByTruong(MaTruong, data) {
  try {
    store.dispatch(setLoading(true));
    const response = await sendRequest(`HocSinhTruong/Delete?IdTruong=${MaTruong}`, 'DELETE', data);
    store.dispatch(setLoading(false));
    return response;
  } catch (error) {
    console.error('Error creating history access:', error);
    throw error;
  }
}

export async function deleteAllHocSinhByTruong(MaTruong) {
  try {
    store.dispatch(setLoading(true));
    const response = await sendRequest(`HocSinhTruong/DeleteAll?IdTruong=${MaTruong}`, 'DELETE');
    store.dispatch(setLoading(false));
    return response;
  } catch (error) {
    console.error('Error creating history access:', error);
    throw error;
  }
}

export async function ImportHocSinh(data) {
  try {
    store.dispatch(setLoading(true));
    const response = await axiosClient(`HocSinhTruong/ImportHocSinh`, 'POST', data);
    store.dispatch(setLoading(false));
    return response;
  } catch (error) {
    console.error('Error creating history access:', error);
    throw error;
  }
}

export async function GetHocSinhById(cccd) {
  try {
    store.dispatch(setLoading(true));
    const response = await axiosClient(`HocSinhTruong/GetByCccd?cccd=${cccd}`, 'GET');
    store.dispatch(setLoading(false));
    return response;
  } catch (error) {
    console.error('Error creating history access:', error);
    throw error;
  }
}

export async function GetAllHocSinhDaDuyet(idTruong, idDanhMuc) {
  try {
    store.dispatch(setLoading(true));
    const response = await sendRequest(`HocSinhTruong/GetAllHocSinhDaDuyet?idTruong=${idTruong}&idDanhMucTotNghiep=${idDanhMuc}`, 'GET');
    store.dispatch(setLoading(false));
    return response;
  } catch (error) {
    console.error('Error creating history access:', error);
    throw error;
  }
}
export async function GetHocSinhDaDuyetByCCCD(idTruong, data) {
  try {
    store.dispatch(setLoading(true));
    const response = await axiosClient(`HocSinhTruong/GetHocSinhDaDuyetByCCCD?idTruong=${idTruong}`, 'POST', data);
    store.dispatch(setLoading(false));
    return response;
  } catch (error) {
    console.error('Error creating history access:', error);
    throw error;
  }
}

export async function TongHocSinhChuaXacNhan(idTruong, idDanhMucTotNghiep) {
  try {
    const response = await sendRequest(
      `HocSinhTruong/TongHocSinhChuaXacNhan?idTruong=${idTruong}&idDanhMucTotNghiep=${idDanhMucTotNghiep}`,
      'GET'
    );
    return response;
  } catch (error) {
    console.error('Error creating history access:', error);
    throw error;
  }
}

export async function TongHocSinhDaDuyet(idTruong, idDanhMucTotNghiep) {
  try {
    const response = await sendRequest(
      `HocSinhTruong/TongHocSinhDaDuyet?idTruong=${idTruong}&idDanhMucTotNghiep=${idDanhMucTotNghiep}`,
      'GET'
    );
    return response;
  } catch (error) {
    console.error('Error creating history access:', error);
    throw error;
  }
}
