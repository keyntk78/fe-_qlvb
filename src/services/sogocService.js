import { sendRequest } from 'utils/apiUtils';
import { axiosClient } from './axiosClient';
import { setLoading } from 'store/actions';
import { store } from '../store/index';

export async function getSearchSogoc(idtruong, params) {
  try {
    const response = await sendRequest(`SoGoc/GetSearch?idTruong=${idtruong}&${params}`, 'GET');
    return response;
  } catch (error) {
    console.error('Error creating Sogoc:', error);
    throw error;
  }
}

export async function getSogocById(idtruong, idsogoc) {
  try {
    store.dispatch(setLoading(true));
    const response = await sendRequest(`SoGoc/GetById?idTruong=${idtruong}&idSoGoc=${idsogoc}`, 'GET');
    store.dispatch(setLoading(false));
    return response;
  } catch (error) {
    console.error('Error creating Sogoc:', error);
    throw error;
  }
}

export async function createSogoc(data) {
  try {
    store.dispatch(setLoading(true));
    const response = await axiosClient(`SoGoc/Create`, 'POST', data);
    store.dispatch(setLoading(false));
    return response;
  } catch (error) {
    console.error('Error creating Sogoc:', error);
    throw error;
  }
}

export async function editSogoc(data) {
  try {
    store.dispatch(setLoading(true));
    const response = await axiosClient(`SoGoc/Update`, 'PUT', data);
    store.dispatch(setLoading(false));
    return response;
  } catch (error) {
    console.error('Error creating Sogoc:', error);
    throw error;
  }
}

export async function deleteSogoc(idtruong, idsogoc, useraction) {
  try {
    store.dispatch(setLoading(true));
    const response = await axiosClient(`SoGoc/Delete?idTruong=${idtruong}&idSoGoc=${idsogoc}&nguoiThucHien=${useraction}`, 'DELETE');
    store.dispatch(setLoading(false));
    return response;
  } catch (error) {
    console.error('Error creating Sogoc:', error);
    throw error;
  }
}

export async function Destroy(data) {
  try {
    store.dispatch(setLoading(true));
    const response = await axiosClient(`PhoiGoc/Destroy`, 'POST', data);
    store.dispatch(setLoading(false));
    return response;
  } catch (error) {
    console.error('Error creating Phoigoc:', error);
    throw error;
  }
}

export async function getAllSogoc(idtruong) {
  try {
    const response = await sendRequest(`SoGoc/GetAll?idTruong=${idtruong}`, 'GET');
    return response;
  } catch (error) {
    console.error('Error creating Monthi:', error);
    throw error;
  }
}

export async function getHocSinhTheoSoGoc(params) {
  try {
    store.dispatch(setLoading(true));
    const response = await axiosClient(`SoGoc/GetHocSinhTheoSoGoc?${params}`, 'GET');
    store.dispatch(setLoading(false));
    return response;
  } catch (error) {
    console.error('Error creating Monthi:', error);
    throw error;
  }
}
