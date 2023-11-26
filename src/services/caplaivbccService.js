import { sendRequest } from 'utils/apiUtils';
import { setLoading } from 'store/actions';
import { store } from '../store/index';
import { axiosClient } from './axiosClient';

export async function getSearchCapLaiVanBang(cccd, params) {
  try {
    store.dispatch(setLoading(true));
    const response = await sendRequest(`CapLaiVanBang/GetSearchLichSuCapLaiVanBang?cccd=${cccd}&${params}`, 'GET');
    store.dispatch(setLoading(false));
    return response;
  } catch (error) {
    console.error('Error creating history ChinhSuaVanBang:', error);
    throw error;
  }
}

export async function duyetCapLai(params) {
  try {
    store.dispatch(setLoading(true));
    const response = await axiosClient(`CapLaiVanBang/Approved?${params}`, 'GET');
    store.dispatch(setLoading(false));
    return response;
  } catch (error) {
    console.error('Error creating hocsinh:', error);
    throw error;
  }
}
