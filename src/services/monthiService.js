import { sendRequest } from 'utils/apiUtils';
import { axiosClient } from './axiosClient';
import { setLoading } from 'store/actions';
import { store } from '../store/index';

export async function getSearchMonthi(params) {
  try {
    const response = await sendRequest(`MonThi/GetSearch?${params}`, 'GET');
    return response;
  } catch (error) {
    console.error('Error creating Monthi:', error);
    throw error;
  }
}

export async function getAllMonthi() {
  try {
    const response = await sendRequest(`MonThi/GetAll`, 'GET');
    return response;
  } catch (error) {
    console.error('Error creating Monthi:', error);
    throw error;
  }
}

export async function getMonthiById(id) {
  try {
    store.dispatch(setLoading(true));
    const response = await sendRequest(`MonThi/GetById?Id=${id}`, 'GET');
    store.dispatch(setLoading(false));
    return response;
  } catch (error) {
    console.error('Error creating Monthi:', error);
    throw error;
  }
}

export async function createMonthi(data) {
  try {
    store.dispatch(setLoading(true));
    const response = await axiosClient(`MonThi/Create`, 'POST', data);
    store.dispatch(setLoading(false));
    return response;
  } catch (error) {
    console.error('Error creating Monthi:', error);
    throw error;
  }
}

export async function editMonthi(data) {
  try {
    store.dispatch(setLoading(true));
    const response = await axiosClient(`Monthi/Update`, 'PUT', data);
    store.dispatch(setLoading(false));
    return response;
  } catch (error) {
    console.error('Error creating monthi:', error);
    throw error;
  }
}

export async function deleteMonthi(id, useraction) {
  try {
    store.dispatch(setLoading(true));
    const response = await axiosClient(`Monthi/Delete?Id=${id}&nguoiThucHien=${useraction}`, 'DELETE');
    store.dispatch(setLoading(false));
    return response;
  } catch (error) {
    console.error('Error creating monthi:', error);
    throw error;
  }
}
