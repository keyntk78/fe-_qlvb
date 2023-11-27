import { sendRequest } from 'utils/apiUtils';
import { axiosClient } from './axiosClient';
import { setLoading } from 'store/actions';
import { store } from '../store/index';

export async function getSearchHocSinhCapPhatBang(params) {
  try {
    const response = await sendRequest(`CapPhatBang/GetSearchHocSinhCapPhatBang?${params}`, 'GET');
    return response;
  } catch (error) {
    console.error('Error creating history access:', error);
    throw error;
  }
}
export async function capPhatBang(data) {
  try {
    const response = await axiosClient(`CapPhatBang/CapPhatBang`, 'POST', data);
    return response;
  } catch (error) {
    console.error('Error creating User:', error);
    throw error;
  }
}
export async function getByCCCD(cccd) {
  try {
    store.dispatch(setLoading(true));
    const response = await axiosClient(`CapPhatBang/GetByCccd?cccd=${cccd}`, 'GET', null);
    store.dispatch(setLoading(false));
    return response;
  } catch (error) {
    console.error('Error creating User:', error);
    throw error;
  }
}

export async function HuyPhatBang(id, nguoiThucHien) {
  try {
    store.dispatch(setLoading(true));
    const response = await axiosClient(`CapPhatBang/HuyPhatBang?id=${id}&nguoiThucHien=${nguoiThucHien}`, 'PUT');
    store.dispatch(setLoading(false));
    return response;
  } catch (error) {
    console.error('Error CapPhatBang:', error);
    throw error;
  }
}
