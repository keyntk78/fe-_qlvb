import { sendRequest } from 'utils/apiUtils';
import { axiosClient } from './axiosClient';
import { setLoading } from 'store/actions';
import { store } from '../store/index';

export async function getSearchDonvi(params) {
  try {
    const response = await sendRequest(`Truong/GetSearch?${params}`, 'GET');
    return response;
  } catch (error) {
    console.error('Error creating Donvi:', error);
    throw error;
  }
}
export async function getAllDonvi() {
  try {
    const response = await axiosClient(`Truong/GetAll`, 'GET');
    return response;
  } catch (error) {
    console.error('Error creating Donvi:', error);
    throw error;
  }
}

export async function getAllDonviHavePhong() {
  try {
    const response = await axiosClient(`Truong/getAllHavePhong`, 'GET');
    return response;
  } catch (error) {
    console.error('Error creating Donvi:', error);
    throw error;
  }
}

export async function getById(id) {
  try {
    store.dispatch(setLoading(true));
    const response = await sendRequest(`Truong/GetById?id=${id}`, 'GET');
    store.dispatch(setLoading(false));
    return response;
  } catch (error) {
    console.error('Error creating Donvi:', error);
    throw error;
  }
}

export async function getDonViByHeDaoTao(ma) {
  try {
    store.dispatch(setLoading(true));
    const response = await sendRequest(`Truong/GetByMaHeDaoTao?maHeDaoTao=${ma}`, 'GET');
    store.dispatch(setLoading(false));
    return response;
  } catch (error) {
    console.error('Error creating Donvi:', error);
    throw error;
  }
}

export async function createDonvi(data) {
  try {
    store.dispatch(setLoading(true));
    const response = await axiosClient(`Truong/Create`, 'POST', data);
    store.dispatch(setLoading(false));
    return response;
  } catch (error) {
    console.error('Error creating Donvi:', error);
    throw error;
  }
}

export async function editDonvi(data) {
  try {
    store.dispatch(setLoading(true));
    const response = await axiosClient(`Truong/Update`, 'PUT', data);
    store.dispatch(setLoading(false));
    return response;
  } catch (error) {
    console.error('Error creating Donvi:', error);
    throw error;
  }
}

export async function deleteDonvi(id, useraction) {
  try {
    store.dispatch(setLoading(true));
    const response = await axiosClient(`Truong/Delete?id=${id}&nguoiThucHien=${useraction}`, 'DELETE');
    store.dispatch(setLoading(false));
    return response;
  } catch (error) {
    console.error('Error creating Donvi:', error);
    throw error;
  }
}
