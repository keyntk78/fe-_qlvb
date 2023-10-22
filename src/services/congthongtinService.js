// import { sendRequest } from 'utils/apiUtils';
import { setLoading } from 'store/actions';
import { store } from '../store/index';
import { axiosClient } from './axiosClient';
export async function createDonyeucau(data) {
  try {
    store.dispatch(setLoading(true));
    const response = await axiosClient('CongThongTin/CreateDonYeuCau', 'POST', data);
    store.dispatch(setLoading(false));
    return response;
  } catch (error) {
    console.error('Error creating Donyeucau:', error);
    throw error;
  }
}

export async function getAllNam() {
  try {
    const response = await axiosClient(`CongThongTin/GetAllNamThi`, 'GET');
    return response;
  } catch (error) {
    console.error('Error creating nam:', error);
    throw error;
  }
}

export async function getAllTruong() {
  try {
    const response = await axiosClient(`CongThongTin/GetAllTruong`, 'GET');
    return response;
  } catch (error) {
    console.error('Error creating truong:', error);
    throw error;
  }
}

export async function getAllDanToc() {
  try {
    const response = await axiosClient(`CongThongTin/GetAllDanToc`, 'GET');
    return response;
  } catch (error) {
    console.error('Error creating truong:', error);
    throw error;
  }
}

export async function getTinTucById(idTinTuc) {
  try {
    const response = await axiosClient(`CongThongTin/GetTinTucById?idTinTuc=${idTinTuc}`, 'GET');
    return response;
  } catch (error) {
    console.error('Error creating Tintuc:', error);
    throw error;
  }
}

export async function getLatest4News() {
  try {
    const response = await axiosClient(`CongThongTin/GetLatest4News`, 'GET');
    return response;
  } catch (error) {
    console.error('Error creating Tintuc:', error);
    throw error;
  }
}

export async function getAllTinTuc() {
  try {
    const response = await axiosClient(`CongThongTin/GetAllTinTuc`, 'GET');
    return response;
  } catch (error) {
    console.error('Error creating Tintuc:', error);
    throw error;
  }
}

export async function getSearchTinTuc(params) {
  try {
    const response = await axiosClient(`CongThongTin/GetSearchTinTuc?${params}`, 'GET');
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function getSearchVBCC(idnam, param) {
  try {
    const response = await axiosClient(`CongThongTin/GetSearchVBCC?IdNamThi=${idnam}&${param}`, 'GET');
    return response;
  } catch (error) {
    console.error('Error creating Tintuc:', error);
    throw error;
  }
}

export async function getSearchDonYeuCau(idnam, param) {
  try {
    const response = await axiosClient(`CongThongTin/GetSearchDonYeuCau?IdNamThi=${idnam}&${param}`, 'GET');
    return response;
  } catch (error) {
    console.error('Error creating Tintuc:', error);
    throw error;
  }
}

export async function GetPhoiGocById(id) {
  try {
    const response = await axiosClient(`CongThongTin/GetPhoiGocById?idPhoiGoc=${id}`, 'GET');
    return response;
  } catch (error) {
    console.error('Error creating Tintuc:', error);
    throw error;
  }
}
export async function getHocSinhByCCC(cccd) {
  try {
    const response = await axiosClient(`CongThongTin/GetHocSinhByCCCD?cccd=${cccd}`, 'GET');
    return response;
  } catch (error) {
    console.error('Error creating Tintuc:', error);
    throw error;
  }
}

export async function getAllConfig() {
  try {
    const response = await axiosClient(`CongThongTin/GetAllConfig`, 'GET');
    return response;
  } catch (error) {
    console.error('Error creating Tintuc:', error);
    throw error;
  }
}

export async function getAllLoaiTinTuc() {
  try {
    const response = await axiosClient(`CongThongTin/GetAllLoaiTinTuc`, 'GET');
    return response;
  } catch (error) {
    console.error('Error creating Tintuc:', error);
    throw error;
  }
}

export async function getPhong() {
  try {
    const response = await axiosClient(`CongThongTin/GetPhong`, 'GET');
    return response;
  } catch (error) {
    console.error('Error creating Tintuc:', error);
    throw error;
  }
}

export async function getSearchTinTucByIdLoaiTin(param, id) {
  try {
    const response = await axiosClient(`CongThongTin/GetSearchTinTucByIdLoaiTin?${param}&idLoaiTin=${id}`, 'GET');
    return response;
  } catch (error) {
    console.error('Error creating Tintuc:', error);
    throw error;
  }
}
