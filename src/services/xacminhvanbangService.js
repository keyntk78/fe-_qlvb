import { sendRequest } from 'utils/apiUtils';
import { axiosClient } from './axiosClient';
import { store } from '../store/index';
import { setLoading } from 'store/actions';
export async function getHocSinhXacMinhVanBang(params) {
  try {
    const response = await sendRequest(`XacMinhVanBang/GetSearchHocSinhXacMinhVanBang?${params}`, 'GET', null);
    return response;
  } catch (error) {
    console.error('Error creating User:', error);
    throw error;
  }
}
export async function getHocSinhXacMinhByCCCD(cccd) {
  try {
    store.dispatch(setLoading(true));
    const response = await axiosClient(`XacMinhVanBang/GetByCccd?cccd=${cccd}`, 'GET', null);
    store.dispatch(setLoading(false));
    return response;
  } catch (error) {
    console.error('Error creating User:', error);
    throw error;
  }
}
export async function AddLichSuXacMinh(data) {
  try {
    store.dispatch(setLoading(true));
    const response = await axiosClient(`XacMinhVanBang/Create`, 'POST', data);
    store.dispatch(setLoading(false));
    return response;
  } catch (error) {
    console.error('Error creating history access:', error);
    throw error;
  }
}
export async function AddListLichSuXacMinh(data) {
  try {
    store.dispatch(setLoading(true));
    const response = await axiosClient(`XacMinhVanBang/CreateList`, 'POST', data);
    store.dispatch(setLoading(false));
    return response;
  } catch (error) {
    console.error('Error creating history access:', error);
    throw error;
  }
}
export async function getHistoryXacMinh(params) {
  try {
    store.dispatch(setLoading(true));
    const response = await sendRequest(`XacMinhVanBang/GetLichSuPhatMinhVanbang?${params}`, 'GET');
    store.dispatch(setLoading(false));
    return response;
  } catch (error) {
    console.error('Error creating history access:', error);
    throw error;
  }
}
export async function getCauHinhXacMinhVanBang(idDonVi) {
  try {
    store.dispatch(setLoading(true));
    const response = await axiosClient(`XacMinhVanBang/CauHinhXacMinhVB?idDonVi=${idDonVi}`, 'GET', null);
    store.dispatch(setLoading(false));
    return response;
  } catch (error) {
    console.error('Error creating User:', error);
    throw error;
  }
}
export async function getLichSuXacMinhVanBangByID(id) {
  try {
    store.dispatch(setLoading(true));
    const response = await axiosClient(`XacMinhVanBang/GetLichSuXacMinhById?id=${id}`, 'GET', null);
    store.dispatch(setLoading(false));
    return response;
  } catch (error) {
    console.error('Error creating User:', error);
    throw error;
  }
}
