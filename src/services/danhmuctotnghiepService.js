import { sendRequest } from 'utils/apiUtils';
import { axiosClient } from './axiosClient';
import { setLoading } from 'store/actions';
import { store } from '../store/index';

export async function getSearchDanhmucTN(idnam, params) {
  try {
    const response = await sendRequest(`DanhMucTotNghiep/GetSearch?IdNamThi=${idnam}&${params}`, 'GET');
    return response;
  } catch (error) {
    console.error('Error creating Danhmuctotnghiep:', error);
    throw error;
  }
}

export async function getAllDanhmucTN() {
  try {
    const response = await axiosClient(`DanhMucTotNghiep/GetAll`, 'GET');
    return response;
  } catch (error) {
    console.error('Error creating DanhmucTN:', error);
    throw error;
  }
}
export async function getById(iddanhmuc) {
  try {
    store.dispatch(setLoading(true));
    const response = await sendRequest(`DanhMucTotNghiep/GetById/${iddanhmuc}`, 'GET');
    store.dispatch(setLoading(false));
    return response;
  } catch (error) {
    console.error('Error creating DanhmucTN:', error);
    throw error;
  }
}

export async function getByIdNamThi(idnam, maHtdt) {
  try {
    store.dispatch(setLoading(true));
    const response = await sendRequest(`DanhMucTotNghiep/GetByIdNamThi/${idnam}/${maHtdt}`, 'GET');
    store.dispatch(setLoading(false));
    return response;
  } catch (error) {
    console.error('Error creating DanhmucTN:', error);
    throw error;
  }
}

export async function createDanhmucTN(data) {
  try {
    store.dispatch(setLoading(true));
    const response = await axiosClient(`DanhMucTotNghiep/Create`, 'POST', data);
    store.dispatch(setLoading(false));
    return response;
  } catch (error) {
    console.error('Error creating DanhmucTN:', error);
    throw error;
  }
}

export async function editDanhmucTN(data) {
  try {
    store.dispatch(setLoading(true));
    const response = await axiosClient(`DanhMucTotNghiep/Update`, 'PUT', data);
    store.dispatch(setLoading(false));
    return response;
  } catch (error) {
    console.error('Error creating DanhmucTN:', error);
    throw error;
  }
}

export async function deleteDanhmucTN(iddanhmuc, useraction) {
  try {
    store.dispatch(setLoading(true));
    const response = await sendRequest(`DanhMucTotNghiep/Delete?idDanhmucTotNghiep=${iddanhmuc}&nguoiThucHien=${useraction}`, 'DELETE');
    store.dispatch(setLoading(false));
    return response;
  } catch (error) {
    console.error('Error creating DanhmucTN:', error);
    throw error;
  }
}

export async function lock(iddanhmuc, useraction) {
  try {
    store.dispatch(setLoading(true));
    const response = await sendRequest(`DanhMucTotNghiep/Lock?idDanhMucTotNghiep=${iddanhmuc}&nguoiThucHien=${useraction}`, 'POST');
    store.dispatch(setLoading(false));
    return response;
  } catch (error) {
    console.error('Error creating DanhmucTN:', error);
    throw error;
  }
}

export async function unlock(iddanhmuc, useraction) {
  try {
    store.dispatch(setLoading(true));
    const response = await sendRequest(`DanhMucTotNghiep/UnLock?idDanhMucTotNghiep=${iddanhmuc}&nguoiThucHien=${useraction}`, 'POST');
    store.dispatch(setLoading(false));
    return response;
  } catch (error) {
    console.error('Error creating DanhmucTN:', error);
    throw error;
  }
}

export async function GetTruongHasPermision(iddanhmuc, params) {
  try {
    store.dispatch(setLoading(true));
    const response = await sendRequest(`DanhMucTotNghiep/GetTruongHasPermision?idDanhMucTotNghiep=${iddanhmuc}&${params}`, 'GET');
    store.dispatch(setLoading(false));
    return response;
  } catch (error) {
    console.error('Error creating DanhmucTN:', error);
    throw error;
  }
}

export async function GuiThongBaoTungNguoi(noidung, data) {
  try {
    store.dispatch(setLoading(true));
    const response = await sendRequest(`DanhMucTotNghiep/GuiThongBaoNhieuTruong?noiDung=${noidung}`, 'POST', data);
    store.dispatch(setLoading(false));
    return response;
  } catch (error) {
    console.error('Error creating history access:', error);
    throw error;
  }
}
export async function GuiThongBaoAll(noidung, iddanhmuc) {
  try {
    store.dispatch(setLoading(true));
    const response = await sendRequest(
      `DanhMucTotNghiep/GuiThongBaoTatCaCacTruong?noiDung=${noidung}&idDanhMucTotNghiep=${iddanhmuc}`,
      'POST'
    );
    store.dispatch(setLoading(false));
    return response;
  } catch (error) {
    console.error('Error creating history access:', error);
    throw error;
  }
}
