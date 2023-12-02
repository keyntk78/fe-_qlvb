import { sendRequest } from 'utils/apiUtils';
import { axiosClient } from './axiosClient';
import { setLoading } from 'store/actions';
import { store } from '../store/index';

export async function getSearchSogoc(idtruong, params) {
  try {
    const response = await sendRequest(`SoGoc/GetSearch?=${idtruong}&${params}`, 'GET');
    return response;
  } catch (error) {
    console.error('Error creating Sogoc:', error);
    throw error;
  }
}

export async function getSogocById(idtruong, idsogoc) {
  try {
    store.dispatch(setLoading(true));
    const response = await sendRequest(`SoGoc/GetById?idTruong=${idtruong}&idSoGoc=${idsogoc}`, 'GET');
    store.dispatch(setLoading(false));
    return response;
  } catch (error) {
    console.error('Error creating Sogoc:', error);
    throw error;
  }
}

export async function createSogoc(data) {
  try {
    store.dispatch(setLoading(true));
    const response = await axiosClient(`SoGoc/Create`, 'POST', data);
    store.dispatch(setLoading(false));
    return response;
  } catch (error) {
    console.error('Error creating Sogoc:', error);
    throw error;
  }
}

export async function editSogoc(data) {
  try {
    store.dispatch(setLoading(true));
    const response = await axiosClient(`SoGoc/Update`, 'PUT', data);
    store.dispatch(setLoading(false));
    return response;
  } catch (error) {
    console.error('Error creating Sogoc:', error);
    throw error;
  }
}

export async function deleteSogoc(idtruong, idsogoc, useraction) {
  try {
    store.dispatch(setLoading(true));
    const response = await axiosClient(`SoGoc/Delete?idTruong=${idtruong}&idSoGoc=${idsogoc}&nguoiThucHien=${useraction}`, 'DELETE');
    store.dispatch(setLoading(false));
    return response;
  } catch (error) {
    console.error('Error creating Sogoc:', error);
    throw error;
  }
}

export async function Destroy(data) {
  try {
    store.dispatch(setLoading(true));
    const response = await axiosClient(`PhoiGoc/Destroy`, 'POST', data);
    store.dispatch(setLoading(false));
    return response;
  } catch (error) {
    console.error('Error creating Phoigoc:', error);
    throw error;
  }
}

export async function getAllSogoc(idtruong) {
  try {
    const response = await sendRequest(`SoGoc/GetAll?idTruong=${idtruong}`, 'GET');
    return response;
  } catch (error) {
    console.error('Error creating Monthi:', error);
    throw error;
  }
}

export async function getHocSinhTheoSoGoc(params) {
  try {
    store.dispatch(setLoading(true));
    const response = await axiosClient(`SoGoc/GetHocSinhTheoSoGoc?${params}`, 'GET');
    store.dispatch(setLoading(false));
    return response;
  } catch (error) {
    console.error('Error creating Monthi:', error);
    throw error;
  }
}

export async function getHocSinhBySoGoc(params) {
  try {
    store.dispatch(setLoading(true));
    const response = await axiosClient(`SoGoc/GetHocSinhBySoGoc?${params}`, 'GET');
    store.dispatch(setLoading(false));
    return response;
  } catch (error) {
    console.error('Error creating Monthi:', error);
    throw error;
  }
}

export async function getAllTruongSoGoc(idDM, idKT) {
  try {
    store.dispatch(setLoading(true));
    const response = await axiosClient(`SoGoc/ExportAllSoGoc?IdDanhMucTotNghiep=${idDM}&IdKhoaThi=${idKT}`, 'GET');
    store.dispatch(setLoading(false));
    return response;
  } catch (error) {
    console.error('Error creating Monthi:', error);
    throw error;
  }
}

export async function chuyenDoiSoGoc(params) {
  try {
    store.dispatch(setLoading(true));
    const response = await axiosClient(`SoGoc/ChuyenDoiSoGoc?${params}`, 'POST');
    store.dispatch(setLoading(false));
    return response;
  } catch (error) {
    console.error('Error creating Monthi:', error);
    throw error;
  }
}

export async function getLichSuChuyenDoiSoGoc(params) {
  try {
    const response = await sendRequest(`SoGoc/GetLichSuChuyenDoiSoGoc?${params}`, 'GET');
    return response;
  } catch (error) {
    console.error('Error creating history access:', error);
    throw error;
  }
}

export async function upLoadAnhSoGoc(data) {
  try {
    store.dispatch(setLoading(true));
    const response = await axiosClient(`SoGoc/UpLoadAnhSoGoc`, 'POST', data);
    store.dispatch(setLoading(false));
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function getAnhSoGoc(params) {
  try {
    const response = await sendRequest(`SoGoc/GetAnhSoGoc?${params}`, 'GET');
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function deleteAnhSoGoc(id) {
  try {
    store.dispatch(setLoading(true));
    const response = await axiosClient(`SoGoc/DeleteAnhSoGoc?idAnhSoGoc=${id}`, 'DELETE');
    store.dispatch(setLoading(false));
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function getHocSinhBySoGocCuChuaDuyet(params) {
  try {
    const response = await sendRequest(`SoGoc/GetHocSinhBySoGocCuChuaDuyet?${params}`, 'GET');
    return response;
  } catch (error) {
    console.error('Error creating Sogoc:', error);
    throw error;
  }
}

export async function khoaSoGocCu(nguoiThucHien, data) {
  try {
    store.dispatch(setLoading(true));
    const response = await axiosClient(`SoGoc/KhoaSoGocCu?NguoiThucHien=${nguoiThucHien}`, 'PUT', data);
    store.dispatch(setLoading(false));
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function moKhoaSo(nguoiThucHien, data) {
  try {
    store.dispatch(setLoading(true));
    const response = await axiosClient(`SoGoc/MoKhoaSo?NguoiThucHien=${nguoiThucHien}`, 'PUT', data);
    store.dispatch(setLoading(false));
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function duyetSoGocCu(nguoiThucHien, data) {
  try {
    store.dispatch(setLoading(true));
    const response = await axiosClient(`SoGoc/DuyetSoGocCu?NguoiThucHien=${nguoiThucHien}`, 'PUT', data);
    store.dispatch(setLoading(false));
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
