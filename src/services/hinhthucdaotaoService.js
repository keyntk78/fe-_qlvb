import { sendRequest } from 'utils/apiUtils';
import { axiosClient } from './axiosClient';
import { setLoading } from 'store/actions';
import { store } from '../store/index';

export async function getSearchHinhthucdaotao(params) {
  try {
    const response = await sendRequest(`HinhThucDaoTao/GetSearch?${params}`, 'GET');
    return response;
  } catch (error) {
    console.error('Error creating HTDT:', error);
    throw error;
  }
}

export async function getAllHinhthucdaotao() {
  try {
    const response = await sendRequest(`HinhThucDaoTao/GetAll`, 'GET');
    return response;
  } catch (error) {
    console.error('Error creating HTDT:', error);
    throw error;
  }
}

export async function getHinhthucdaotaoById(id) {
  try {
    store.dispatch(setLoading(true))
    const response = await sendRequest(`HinhThucDaoTao/GetById?id=${id}`, 'GET');
    store.dispatch(setLoading(false))
    return response;
  } catch (error) {
    console.error('Error creating HTDT:', error);
    throw error;
  }
}

export async function createHinhthucdaotao(data) {
  try {
    store.dispatch(setLoading(true))
    const response = await axiosClient(`HinhThucDaoTao/Create`, 'POST', data);
    store.dispatch(setLoading(false))
    return response;
  } catch (error) {
    console.error('Error creating HTDT:', error);
    throw error;
  }
}

export async function editHinhthucdaotao(data) {
  try {
    store.dispatch(setLoading(true))
    const response = await axiosClient(`HinhThucDaoTao/Update`, 'PUT', data);
    store.dispatch(setLoading(false))
    return response;
  } catch (error) {
    console.error('Error creating HTDT:', error);
    throw error;
  }
}

export async function deleteHinhthucdaotao(id, useraction) {
  try {
    store.dispatch(setLoading(true))
    const response = await axiosClient(`HinhThucDaoTao/Delete?id=${id}&nguoiThucHien=${useraction}`, 'DELETE');
    store.dispatch(setLoading(false))
    return response;
  } catch (error) {
    console.error('Error creating HTDT:', error);
    throw error;
  }
}
