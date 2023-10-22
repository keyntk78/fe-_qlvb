import { sendRequest } from 'utils/apiUtils';
import { axiosClient } from './axiosClient';
import { setLoading } from 'store/actions';
import { store } from '../store/index';

export async function getSearchPhoisao(params) {
  try {
    const response = await sendRequest(`PhoiBanSao/GetSearch?${params}`, 'GET');
    return response;
  } catch (error) {
    console.error('Error creating Phoisao:', error);
    throw error;
  }
}

export async function getPhoisaoById(idphoi) {
  try {
    store.dispatch(setLoading(true));
    const response = await sendRequest(`PhoiBanSao/GetById${idphoi}`, 'GET');
    store.dispatch(setLoading(false));
    return response;
  } catch (error) {
    console.error('Error creating Phoisao:', error);
    throw error;
  }
}

export async function getConfigById(idphoi, idconfig) {
  try {
    store.dispatch(setLoading(true));
    const response = await sendRequest(`PhoiBanSao/GetCauHinhPhoiBanSaoById?idPhoiBanSao=${idphoi}&idCauHinhPhoi=${idconfig}`, 'GET');
    store.dispatch(setLoading(false));
    return response;
  } catch (error) {
    console.error('Error creating Phoisao:', error);
    throw error;
  }
}

export async function createPhoisao(data) {
  try {
    store.dispatch(setLoading(true));
    const response = await axiosClient(`PhoiBanSao/Create`, 'POST', data);
    store.dispatch(setLoading(false));
    return response;
  } catch (error) {
    console.error('Error creating Phoisao:', error);
    throw error;
  }
}

export async function createConfigPhoi(idphoi, nguoithuchien, data) {
  try {
    store.dispatch(setLoading(true));
    const response = await axiosClient(`PhoiBanSao/Setting?idPhoiBanSao=${idphoi}&nguoiThucHien=${nguoithuchien}`, 'POST', data);
    store.dispatch(setLoading(false));
    return response;
  } catch (error) {
    console.error('Error creating Phoisao:', error);
    throw error;
  }
}

export async function editPhoisao(lydo, data) {
  try {
    store.dispatch(setLoading(true));
    const response = await axiosClient(`PhoiBanSao/Update?lyDo=${lydo}`, 'PUT', data);
    store.dispatch(setLoading(false));
    return response;
  } catch (error) {
    console.error('Error creating Phoisao:', error);
    throw error;
  }
}

export async function editConfigPhoi(idPhoisao, data) {
  try {
    store.dispatch(setLoading(true));
    const response = await axiosClient(`PhoiBanSao/ModifyCauHinhBanSao?idPhoiBanSao=${idPhoisao}`, 'PUT', data);
    store.dispatch(setLoading(false));
    return response;
  } catch (error) {
    console.error('Error creating Phoisao:', error);
    throw error;
  }
}

export async function deletePhoisao(idphoi, useraction, lydo) {
  try {
    store.dispatch(setLoading(true));
    const response = await axiosClient(`PhoiBanSao/Delete?idPhoiGoc=${idphoi}&nguoiThucHien=${useraction}&lyDo=${lydo}`, 'DELETE');
    store.dispatch(setLoading(false));
    return response;
  } catch (error) {
    console.error('Error creating Phoisao:', error);
    throw error;
  }
}

export async function Destroy(data) {
  try {
    store.dispatch(setLoading(true));
    const response = await axiosClient(`PhoiBanSao/HuyPhoi`, 'POST', data);
    store.dispatch(setLoading(false));
    return response;
  } catch (error) {
    console.error('Error creating Phoisao:', error);
    throw error;
  }
}

export async function GetConfigPhoi(idphoi) {
  try {
    store.dispatch(setLoading(true));
    const response = await axiosClient(`PhoiBanSao/GetCauHinhBanSao?idPhoiBanSao=${idphoi}`, 'GET');
    store.dispatch(setLoading(false));
    return response;
  } catch (error) {
    console.error('Error creating Phoisao:', error);
    throw error;
  }
}

export async function getPhoiBanSaoDangSuDung(idTruong) {
  try {
    store.dispatch(setLoading(true));
    const response = await sendRequest(`PhoiBanSao/GetPhoiDangSuDung?idTruong=${idTruong}`, 'GET');
    store.dispatch(setLoading(false));
    return response;
  } catch (error) {
    console.error('Error creating Phoisao:', error);
    throw error;
  }
}
