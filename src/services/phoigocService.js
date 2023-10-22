import { sendRequest } from 'utils/apiUtils';
import { axiosClient } from './axiosClient';
import { setLoading } from 'store/actions';
import { store } from '../store/index';

export async function getSearchPhoigoc(params) {
  try {
    const response = await sendRequest(`PhoiGoc/GetSearch?${params}`, 'GET');
    return response;
  } catch (error) {
    console.error('Error creating Phoigoc:', error);
    throw error;
  }
}

export async function getSearchPhoiDaHuy(params) {
  try {
    const response = await sendRequest(`PhoiGoc/GetSearchPhoiDaHuy?${params}`, 'GET');
    return response;
  } catch (error) {
    console.error('Error creating PhoiDaHuy:', error);
    throw error;
  }
}

export async function getPhoigocById(idphoi) {
  try {
    store.dispatch(setLoading(true));
    const response = await sendRequest(`PhoiGoc/GetById${idphoi}`, 'GET');
    store.dispatch(setLoading(false));
    return response;
  } catch (error) {
    console.error('Error creating Phoigoc:', error);
    throw error;
  }
}

export async function getPhoiDangSuDung(idTruong) {
  try {
    store.dispatch(setLoading(true));
    const response = await sendRequest(`PhoiGoc/GetPhoiDangSuDung?idTruong=${idTruong}`, 'GET');
    store.dispatch(setLoading(false));
    return response;
  } catch (error) {
    console.error('Error creating Phoigoc:', error);
    throw error;
  }
}
export async function getConfigById(idphoi, idconfig) {
  try {
    store.dispatch(setLoading(true));
    const response = await sendRequest(`PhoiGoc/GetCauHinhPhoiGocById?idPhoiGoc=${idphoi}&idCauHinhPhoi=${idconfig}`, 'GET');
    store.dispatch(setLoading(false));
    return response;
  } catch (error) {
    console.error('Error creating Phoigoc:', error);
    throw error;
  }
}

export async function createPhoigoc(data) {
  try {
    store.dispatch(setLoading(true));
    const response = await axiosClient(`PhoiGoc/Create`, 'POST', data);
    store.dispatch(setLoading(false));
    return response;
  } catch (error) {
    console.error('Error creating Phoigoc:', error);
    throw error;
  }
}

export async function createConfigPhoi(idphoi, nguoithuchien, data) {
  try {
    store.dispatch(setLoading(true));
    const response = await axiosClient(`PhoiGoc/Setting?idPhoiGoc=${idphoi}&nguoiThucHien=${nguoithuchien}`, 'POST', data);
    store.dispatch(setLoading(false));
    return response;
  } catch (error) {
    console.error('Error creating Phoigoc:', error);
    throw error;
  }
}

export async function editPhoigoc(lydo, data) {
  try {
    store.dispatch(setLoading(true));
    const response = await axiosClient(`PhoiGoc/Update?lyDo=${lydo}`, 'PUT', data);
    store.dispatch(setLoading(false));
    return response;
  } catch (error) {
    console.error('Error creating Phoigoc:', error);
    throw error;
  }
}

export async function editConfigPhoi(idphoigoc, data) {
  try {
    store.dispatch(setLoading(true));
    const response = await axiosClient(`PhoiGoc/ModifyCauHinhPhoiGoc?idPhoiGoc=${idphoigoc}`, 'PUT', data);
    store.dispatch(setLoading(false));
    return response;
  } catch (error) {
    console.error('Error creating Phoigoc:', error);
    throw error;
  }
}

export async function deletePhoigoc(idphoi, useraction, lydo) {
  try {
    store.dispatch(setLoading(true));
    const response = await axiosClient(`PhoiGoc/Delete?idPhoiGoc=${idphoi}&nguoiThucHien=${useraction}&lyDo=${lydo}`, 'DELETE');
    store.dispatch(setLoading(false));
    return response;
  } catch (error) {
    console.error('Error creating Phoigoc:', error);
    throw error;
  }
}

export async function Destroy(data) {
  try {
    store.dispatch(setLoading(true));
    const response = await axiosClient(`PhoiGoc/HuyPhoi`, 'POST', data);
    store.dispatch(setLoading(false));
    return response;
  } catch (error) {
    console.error('Error creating Phoigoc:', error);
    throw error;
  }
}

export async function GetConfigPhoi(idphoi) {
  try {
    store.dispatch(setLoading(true));
    const response = await axiosClient(`PhoiGoc/GetCauHinhPhoiGoc?idPhoiGoc=${idphoi}`, 'GET');
    store.dispatch(setLoading(false));
    return response;
  } catch (error) {
    console.error('Error creating Phoigoc:', error);
    throw error;
  }
}
