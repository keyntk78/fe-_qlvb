import { sendRequest } from 'utils/apiUtils';
import { axiosClient } from './axiosClient';
import { setLoading } from 'store/actions';
import { store } from '../store/index';

export async function getSearchLoaiTinTuc(params) {
  try {
    const response = await sendRequest(`LoaiTinTuc/GetSearch?${params}`, 'GET');
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function getAllLoaiTinTuc() {
  try {
    const response = await sendRequest(`LoaiTinTuc/GetAll`, 'GET');
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function getLoaiTinTucById(id) {
  try {
    store.dispatch(setLoading(true));
    const response = await sendRequest(`LoaiTinTuc/GetById${id}`, 'GET');
    store.dispatch(setLoading(false));
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function createLoaiTinTuc(data) {
  try {
    store.dispatch(setLoading(true));
    const response = await axiosClient(`LoaiTinTuc/Create`, 'POST', data);
    store.dispatch(setLoading(false));
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function editLoaiTinTuc(data) {
  try {
    store.dispatch(setLoading(true));
    const response = await axiosClient(`LoaiTinTuc/Update`, 'PUT', data);
    store.dispatch(setLoading(false));
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function deleteLoaiTinTuc(id, useraction) {
  try {
    store.dispatch(setLoading(true));
    const response = await axiosClient(`LoaiTinTuc/Delete?idLoaiTinTuc=${id}&nguoiThucHien=${useraction}`, 'DELETE');
    store.dispatch(setLoading(false));
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
