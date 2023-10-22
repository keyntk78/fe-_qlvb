// import { sendRequest } from 'utils/apiUtils';
import { axiosClient } from './axiosClient';
import { setLoading } from 'store/actions';
import { store } from '../store/index';

export async function getHocSinhTheoSoCapPhatBang(params) {
  try {
    store.dispatch(setLoading(true));
    const response = await axiosClient(`SoCapPhatBang/GetHocSinhTheoSoCapPhatBang?${params}`, 'GET');
    store.dispatch(setLoading(false));
    return response;
  } catch (error) {
    console.error('Error creating Monthi:', error);
    throw error;
  }
}
