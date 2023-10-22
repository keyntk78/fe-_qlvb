import { sendRequest } from 'utils/apiUtils';
import { axiosClient } from './axiosClient';
import { setLoading } from 'store/actions';
import { store } from '../store/index';

export async function getConfigByTruongId(idTruong) {
  try {
    const response = await sendRequest(`CauHinhTruong/GetByTruongId?idTruong=${idTruong}`, 'GET');
    return response;
  } catch (error) {
    console.error('Error creating ConfigDonvi:', error);
    throw error;
  }
}

export async function editConfigDonvi(id, data) {
  try {
    store.dispatch(setLoading(true));
    const response = await axiosClient(`CauHinhTruong/UpdateTruong?idTruong=${id}`, 'POST', data);
    store.dispatch(setLoading(false));
    return response;
  } catch (error) {
    console.error('Error edit ConfigDonvi:', error);
    throw error;
  }
}
export async function editConfigDonviQuanLy(id, data) {
  try {
    store.dispatch(setLoading(true));
    const response = await axiosClient(`CauHinhTruong/UpdateDonViQuanLy?idTruong=${id}`, 'POST', data);
    store.dispatch(setLoading(false));
    return response;
  } catch (error) {
    console.error('Error edit ConfigDonvi:', error);
    throw error;
  }
}
