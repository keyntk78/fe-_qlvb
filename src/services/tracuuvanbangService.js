import { sendRequest } from 'utils/apiUtils';
import { axiosClient } from './axiosClient';
import { store } from '../store/index';
import { setLoading } from 'store/actions';

export async function getHocSinhXacMinhVanBang(params) {
  try {
    const response = await sendRequest(`TraCuuVanBang/GetSearchHocSinhXacMinhVanBang?${params}`, 'GET', null);
    return response;
  } catch (error) {
    console.error('Error creating User:', error);
    throw error;
  }
}
export async function getHocSinhXacMinhByCCCD(cccd) {
  try {
    store.dispatch(setLoading(true));
    const response = await axiosClient(`TraCuuVanBang/GetByCccd?cccd=${cccd}`, 'GET', null);
    store.dispatch(setLoading(false));
    return response;
  } catch (error) {
    console.error('Error creating User:', error);
    throw error;
  }
}