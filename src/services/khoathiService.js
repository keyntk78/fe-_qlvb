import { axiosClient } from './axiosClient';
import { sendRequest } from 'utils/apiUtils';
import { setLoading } from 'store/actions';
import { store } from '../store/index';

export async function getKhoathi(params, idNamThi) {
  try {
    const response = await sendRequest(`KhoaThi/GetSearch?${params}&IdNamThi=${idNamThi}`, 'GET');
    return response;
  } catch (error) {
    console.error('Error creating KhoaThi:', error);
    throw error;
  }
}

export async function getAllKhoathi() {
  try {
    const response = await sendRequest(`KhoaThi/GetAll`, 'GET');
    return response;
  } catch (error) {
    console.error('Error creating HTDT:', error);
  }
}

export async function getKhoathiByNamThi(idNamThi) {
  try {
    const response = await sendRequest(`KhoaThi/GetAllByNamThiId?idNamThi=${idNamThi}`, 'GET');
    return response;
  } catch (error) {
    console.error('Error creating KhoaThi:', error);
    throw error;
  }
}

export async function getKhoathiById(idNamThi, idKhoaThi) {
  try {
    store.dispatch(setLoading(true));
    const response = await sendRequest(`KhoaThi/GetById?idNamThi=${idNamThi}&idKhoaThi=${idKhoaThi}`, 'GET');
    store.dispatch(setLoading(false));
    return response;
  } catch (error) {
    console.error('Error creating KhoaThi:', error);
    throw error;
  }
}

export async function getAllKhoathiByDMTN(idDanhMuc) {
  try {
    store.dispatch(setLoading(true));
    const response = await sendRequest(`KhoaThi/GetAllByIdDanhMucTotNghiep?idDanhMucTotNghiep=${idDanhMuc}`, 'GET');
    store.dispatch(setLoading(false));
    return response;
  } catch (error) {
    console.error('Error creating KhoaThi:', error);
    throw error;
  }
}

export async function createKhoathi(idNamThi, data) {
  try {
    store.dispatch(setLoading(true));
    const response = await axiosClient(`KhoaThi/Create?idNamThi=${idNamThi}`, 'POST', data);
    store.dispatch(setLoading(false));
    return response;
  } catch (error) {
    console.error('Error creating KhoaThi:', error);
    throw error;
  }
}
export async function editKhoathi(idNamThi, data) {
  try {
    store.dispatch(setLoading(true));
    const response = await axiosClient(`KhoaThi/Update?idNamThi=${idNamThi}`, 'POST', data);
    store.dispatch(setLoading(false));
    return response;
  } catch (error) {
    console.error('Error edit KhoaThi:', error);
    throw error;
  }
}
export async function deleteKhoathi(idNamThi, idKhoaThi, UserAction) {
  try {
    store.dispatch(setLoading(true));
    const response = await axiosClient(`KhoaThi/Delete?idNamThi=${idNamThi}&IdKhoaThi=${idKhoaThi}&UserAction=${UserAction}`, 'POST');
    store.dispatch(setLoading(false));
    return response;
  } catch (error) {
    console.error('Error edit function:', error);
    throw error;
  }
}


