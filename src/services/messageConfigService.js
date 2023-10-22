import { sendRequest } from 'utils/apiUtils';
import { axiosClient } from './axiosClient';
import { setLoading } from 'store/actions';
import { store } from '../store/index';

export async function getMessageConfigByParams(params) {
  try {
    const response = await sendRequest(`MessageConfig/GetAllByParams?${params}`, 'GET');
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function GetByActionName() {
  try {
    const response = await sendRequest(`MessageConfig/GetByActionName`, 'GET');
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function getMessageConfigById(id) {
  try {
    store.dispatch(setLoading(true));
    const response = await sendRequest(`MessageConfig/${id}`, 'GET');
    store.dispatch(setLoading(false));
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function createMessageConfig(data) {
  try {
    store.dispatch(setLoading(true));
    const response = await axiosClient(`MessageConfig/Create`, 'POST', data);
    store.dispatch(setLoading(false));
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function editMessageConfig(data) {
  try {
    store.dispatch(setLoading(true));
    const response = await axiosClient(`MessageConfig/Update`, 'PUT', data);
    store.dispatch(setLoading(false));
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function deleteMessageConfig(id, useraction) {
  try {
    store.dispatch(setLoading(true));
    const response = await axiosClient(`MessageConfig/Delete?id=${id}&nguoiThucHien=${useraction}`, 'DELETE');
    store.dispatch(setLoading(false));
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
