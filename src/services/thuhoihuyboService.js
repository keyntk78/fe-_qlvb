import { store } from '../store/index';
import { setLoading } from 'store/actions';
import { axiosClient } from './axiosClient';
import { sendRequest } from 'utils/apiUtils';

export async function ThuHoiHuyBo(data) {
  try {
    store.dispatch(setLoading(true));
    const response = await axiosClient(`HuyBoVanBang/Create`, 'POST', data);
    store.dispatch(setLoading(false));
    return response;
  } catch (error) {
    console.error('Error creating history access:', error);
    throw error;
  }
}
export async function getHistoryThuHoiHuyBo(params) {
  try {
    store.dispatch(setLoading(true));
    const response = await sendRequest(`HuyBoVanBang/GetSearchLichSuHuyBoVanBang?${params}`, 'GET');
    store.dispatch(setLoading(false));
    return response;
  } catch (error) {
    console.error('Error creating history access:', error);
    throw error;
  }
}
