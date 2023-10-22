import { sendRequest } from 'utils/apiUtils';
import { axiosClient } from './axiosClient';
import { setLoading } from 'store/actions';
import { store } from '../store/index';

export async function getAllHocSinhDuaVaoSoGoc(idTruong, idDanhMucTotNghiep) {
  try {
    const response = await sendRequest(
      `CapBangBanChinh/GetDanhSachHocSinhDaDuaVaoSo?idTruong=${idTruong}&idDanhMucTotNghiep=${idDanhMucTotNghiep}`,
      'GET'
    );
    return response;
  } catch (error) {
    console.error('Error creating history access:', error);
    throw error;
  }
}
export async function getHocSinhCapBang(params) {
  try {
    const response = await sendRequest(`CapBangBanChinh/GetHocSinhCapBangSearch?${params}`, 'GET', null);
    return response;
  } catch (error) {
    console.error('Error creating User:', error);
    throw error;
  }
}

export async function getPreviewHocSinh(params) {
  try {
    const response = await sendRequest(`CapBangBanChinh/GetAllPreviewHocSinhVaoSoGoc?${params}`, 'GET', null);
    return response;
  } catch (error) {
    console.error('Error creating User:', error);
    throw error;
  }
}

export async function putIntoSoGoc(data) {
  try {
    store.dispatch(setLoading(true));
    const response = await axiosClient(`CapBangBanChinh/PutIntoSoGoc`, 'POST', data);
    store.dispatch(setLoading(false));
    return response;
  } catch (error) {
    console.error('Error creating Hocsinh:', error);
    throw error;
  }
}

export async function getHocSinhDuaVaoSoGoc(idTruong, idDanhMucTotNghiep, idHocSinh) {
  try {
    const response = await sendRequest(
      `CapBangBanChinh/GetHocSinhDaDuaVaoSoGocById?idTruong=${idTruong}&idDanhMucTotNghiep=${idDanhMucTotNghiep}&idHocSinh=${idHocSinh}`,
      'GET'
    );
    return response;
  } catch (error) {
    console.error('Error creating history access:', error);
    throw error;
  }
}

export async function getListHocSinhDuaVaoSoGoc(params, data) {
  try {
    store.dispatch(setLoading(true));
    const response = await sendRequest(`CapBangBanChinh/GetListHocSinhDaDuaVaoSo?${params}`, 'POST', data);
    store.dispatch(setLoading(false));
    return response;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}

export async function XacNhanInBangTatCa(idTruong, idDanhMucTotNghiep) {
  try {
    const response = await sendRequest(
      `CapBangBanChinh/XacNhanInBangTatCa?idTruong=${idTruong}&idDanhMucTotNghiep=${idDanhMucTotNghiep}`,
      'POST'
    );
    return response;
  } catch (error) {
    console.error('Error creating history access:', error);
    throw error;
  }
}

export async function XacNhanInBang(idTruong, idDanhMucTotNghiep, data) {
  try {
    const response = await sendRequest(
      `CapBangBanChinh/XacNhanInBang?idTruong=${idTruong}&idDanhMucTotNghiep=${idDanhMucTotNghiep}`,
      'POST',
      data
    );
    return response;
  } catch (error) {
    console.error('Error creating history access:', error);
    throw error;
  }
}

export async function CapBangTatCa(idTruong, idDanhMucTotNghiep) {
  try {
    const response = await sendRequest(
      `CapBangBanChinh/CapBangTatCa?idTruong=${idTruong}&idDanhMucTotNghiep=${idDanhMucTotNghiep}`,
      'POST'
    );
    return response;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}

export async function CapBang(params, data) {
  try {
    const response = await sendRequest(`CapBangBanChinh/CapBang?${params}`, 'POST', data);
    return response;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}
