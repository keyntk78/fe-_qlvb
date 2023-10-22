import { sendRequest } from 'utils/apiUtils';
import { axiosClient } from './axiosClient';
import { setLoading } from 'store/actions';
import { store } from '../store/index';

export async function getSearchHocSinhCapPhatBang(idtruong, params) {
  try {
    const response = await sendRequest(`CapPhatBang/GetSearchHocSinhCapPhatBang/${idtruong}?${params}`, 'GET');
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