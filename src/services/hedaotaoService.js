import { axiosClient } from './axiosClient';
import { sendRequest } from 'utils/apiUtils';
import { setLoading } from 'store/actions';
import { store } from '../store/index';

export async function getHedaotao(params) {
  try {
    const response = await sendRequest(`HeDaoTao/GetSearch?${params}`, 'GET');
    return response;
  } catch (error) {
    console.error('Error creating function:', error);
    throw error;
  }
}
export async function getAllHedaotao() {
  try {
    const response = await axiosClient(`HeDaoTao/GetAll`, 'GET');
    return response;
  } catch (error) {
    console.error('Error creating HTDT:', error);
    throw error;
  }
}

export async function getHedaotaoById(id) {
  try {
    store.dispatch(setLoading(true));
    const response = await sendRequest(`HeDaoTao/GetById?id=${id}`, 'GET');
    store.dispatch(setLoading(false));
    return response;
  } catch (error) {
    console.error('Error creating HTDT:', error);
    throw error;
  }
}

export async function createHedaotao(data) {
  try {
    store.dispatch(setLoading(true));
    const response = await axiosClient(`HeDaoTao/Create`, 'POST', data);
    store.dispatch(setLoading(false));
    return response;
  } catch (error) {
    console.error('Error creating role:', error);
    throw error;
  }
}
export async function editHedaotao(data) {
  try {
    store.dispatch(setLoading(true));
    const response = await axiosClient(`HeDaoTao/Update`, 'PUT', data);
    store.dispatch(setLoading(false));
    return response;
  } catch (error) {
    console.error('Error edit function:', error);
    throw error;
  }
}
export async function deleteHedaotao(Id, UserAction) {
  try {
    store.dispatch(setLoading(true));
    const response = await axiosClient(`HeDaoTao/Delete?id=${Id}&nguoiThucHien=${UserAction}`, 'DELETE');
    store.dispatch(setLoading(false));
    return response;
  } catch (error) {
    console.error('Error edit function:', error);
    throw error;
  }
}
