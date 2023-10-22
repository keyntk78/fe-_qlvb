import { axiosClient } from './axiosClient';
import { sendRequest } from 'utils/apiUtils';
import { setLoading } from 'store/actions';
import { store } from '../store/index';

export async function getDanToc(params) {
  try {
    const response = await sendRequest(`DanToc/GetSearch?${params}`, 'GET');
    return response;
  } catch (error) {
    console.error('Error creating Dantoc:', error);
    throw error;
  }
}

export async function getDanTocById(id) {
  try {
    store.dispatch(setLoading(true));
    const response = await sendRequest(`DanToc/GetById?Id=${id}`, 'GET');
    store.dispatch(setLoading(false));
    return response;
  } catch (error) {
    console.error('Error creating Dantoc:', error);
    throw error;
  }
}

export async function getAllDanToc() {
  try {
    const response = await sendRequest(`DanToc/GetAll`, 'GET');
    return response;
  } catch (error) {
    console.error('Error creating Dantoc:', error);
    throw error;
  }
}

export async function createDanToc(data) {
  try {
    store.dispatch(setLoading(true));
    const response = await axiosClient(`DanToc/Create`, 'POST', data);
    store.dispatch(setLoading(false));
    return response;
  } catch (error) {
    console.error('Error creating Dantoc:', error);
    throw error;
  }
}
export async function editDanToc(data) {
  try {
    store.dispatch(setLoading(true));
    const response = await axiosClient(`DanToc/Update`, 'PUT', data);
    store.dispatch(setLoading(false));

    return response;
  } catch (error) {
    console.error('Error edit Dantoc:', error);
    throw error;
  }
}
export async function deleteDanToc(Id, UserAction) {
  try {
    store.dispatch(setLoading(true));
    const response = await axiosClient(`DanToc/Delete?id=${Id}&nguoiThucHien=${UserAction}`, 'DELETE');
    store.dispatch(setLoading(false));

    return response;
  } catch (error) {
    console.error('Error delete Dantoc:', error);
    throw error;
  }
}
