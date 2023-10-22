import { axiosClient } from './axiosClient';
import { sendRequest } from 'utils/apiUtils';
import { setLoading } from 'store/actions';
import { store } from '../store/index';

export async function getNamthi(params) {
  try {
    const response = await sendRequest(`NamThi/GetSearch?${params}`, 'GET');
    return response;
  } catch (error) {
    console.error('Error creating Namthi:', error);
    throw error;
  }
}

export async function getNamthiById(id) {
  try {
    store.dispatch(setLoading(true));
    const response = await sendRequest(`NamThi/GetById?Id=${id}`, 'GET');
    store.dispatch(setLoading(false));
    return response;
  } catch (error) {
    console.error('Error creating Namthi:', error);
    throw error;
  }
}

export async function getAllNamthi() {
  try {
    const response = await axiosClient(`NamThi/GetAll`, 'GET');
    return response;
  } catch (error) {
    console.error('Error creating Namthi:', error);
    throw error;
  }
}

export async function createNamthi(data) {
  try {
    store.dispatch(setLoading(true));
    const response = await axiosClient(`NamThi/Create`, 'POST', data);
    store.dispatch(setLoading(false));
    return response;
  } catch (error) {
    console.error('Error creating Namthi:', error);
    throw error;
  }
}
export async function editNamthi(data) {
  try {
    store.dispatch(setLoading(true));
    const response = await axiosClient(`NamThi/Update`, 'PUT', data);
    store.dispatch(setLoading(false));

    return response;
  } catch (error) {
    console.error('Error edit Namthi:', error);
    throw error;
  }
}
export async function deleteNamthi(Id, UserAction) {
  try {
    store.dispatch(setLoading(true));
    const response = await axiosClient(`NamThi/Detete?id=${Id}&nguoiThucHien=${UserAction}`, 'DELETE');
    store.dispatch(setLoading(false));

    return response;
  } catch (error) {
    console.error('Error delete Namthi:', error);
    throw error;
  }
}
