import { sendRequest } from 'utils/apiUtils';
import { axiosClient } from './axiosClient';
import { setLoading } from 'store/actions';
import { store } from '../store/index';

export async function getSearchLichSuChinhSuaVanBang(cccd, params) {
  try {
    const response = await sendRequest(`ChinhSuaVanBang/GetSearchLichSuChinhSuaVanBang?cccd=${cccd}&${params}`, 'GET');
    return response;
  } catch (error) {
    console.error('Error creating history ChinhSuaVanBang:', error);
    throw error;
  }
}

export async function getByIdHistory(cccd, id) {
  try {
    store.dispatch(setLoading(true));
    const response = await sendRequest(`ChinhSuaVanBang/GetChinhSuaVanBangById?cccd=${cccd}&idPhuLuc=${id}`, 'GET');
    store.dispatch(setLoading(false));
    return response;
  } catch (error) {
    console.error('Error creating ChinhSuaVanBang:', error);
    throw error;
  }
}

export async function updateVBCC(data) {
  try {
    store.dispatch(setLoading(true));
    const response = await axiosClient(`ChinhSuaVanBang/Create`, 'POST', data);
    store.dispatch(setLoading(false));
    return response;
  } catch (error) {
    console.error('Error creating ChinhSuaVanBang:', error);
    throw error;
  }
}

export async function getByCCCD(cccd) {
  try {
    store.dispatch(setLoading(true));
    const response = await axiosClient(`ChinhSuaVanBang/GetHocSinhByCccd?cccd=${cccd}`, 'GET');
    store.dispatch(setLoading(false));
    return response;
  } catch (error) {
    console.error('Error creating hocsinh:', error);
    throw error;
  }
}

export async function duyetChinhSuaVBCC(params) {
  try {
    store.dispatch(setLoading(true));
    const response = await axiosClient(`ChinhSuaVanBang/Approved?${params}`, 'GET');
    store.dispatch(setLoading(false));
    return response;
  } catch (error) {
    console.error('Error creating hocsinh:', error);
    throw error;
  }
}
