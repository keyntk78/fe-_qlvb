import { sendRequest } from 'utils/apiUtils';
import { axiosClient } from './axiosClient';
import { setLoading } from 'store/actions';
import { store } from '../store/index';

export async function getSearchTinTuc(params) {
  try {
    const response = await sendRequest(`TinTuc/GetSearch?${params}`, 'GET');
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function getAllTinTuc() {
  try {
    const response = await sendRequest(`TinTuc/GetAll`, 'GET');
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function getTinTucById(id) {
  try {
    store.dispatch(setLoading(true));
    const response = await sendRequest(`TinTuc/GetById${id}`, 'GET');
    store.dispatch(setLoading(false));
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function createTinTuc(data) {
  try {
    store.dispatch(setLoading(true));
    const response = await axiosClient(`TinTuc/Create`, 'POST', data);
    store.dispatch(setLoading(false));
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function editTinTuc(data) {
  try {
    store.dispatch(setLoading(true));
    const response = await axiosClient(`TinTuc/Update`, 'PUT', data);
    store.dispatch(setLoading(false));
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function showTinTuc(id) {
    try {
      store.dispatch(setLoading(true));
      const response = await axiosClient(`TinTuc/Show?idTinTuc=${id}`, 'DELETE');
      store.dispatch(setLoading(false));
      return response;
    } catch (error) {
      console.error(error);
      throw error;
    }
}
  
export async function hideTinTuc(id) {
    try {
      store.dispatch(setLoading(true));
      const response = await axiosClient(`TinTuc/Hide?idTinTuc=${id}`, 'DELETE');
      store.dispatch(setLoading(false));
      return response;
    } catch (error) {
      console.error(error);
      throw error;
    }
}

export async function deleteTinTuc(id, useraction) {
  try {
    store.dispatch(setLoading(true));
    const response = await axiosClient(`TinTuc/Delete?idTinTuc=${id}&nguoiThucHien=${useraction}`, 'DELETE');
    store.dispatch(setLoading(false));
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
