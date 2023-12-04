import { sendRequest } from 'utils/apiUtils';
import { setLoading } from 'store/actions';
import { store } from '../store/index';
import { axiosClient } from './axiosClient';

export async function backupData(nguoiThucHien) {
  try {
    store.dispatch(setLoading(true));
    const response = await sendRequest(`DataBackup/Backup?nguoiThucHien=${nguoiThucHien}`, 'POST');
    store.dispatch(setLoading(false));
    return response;
  } catch (error) {
    console.error('Error creating role:', error);
    throw error;
  }
}

export async function getBackupData() {
  try {
    store.dispatch(setLoading(true));
    const response = await sendRequest('DataBackup/GetHistoryBackup', 'GET');
    store.dispatch(setLoading(false));
    return response;
  } catch (error) {
    console.error('Error creating role:', error);
    throw error;
  }
}

export async function restoreData(data) {
  try {
    store.dispatch(setLoading(true));
    const response = await axiosClient('DataBackup/Restore', 'POST', data);
    store.dispatch(setLoading(false));
    return response;
  } catch (error) {
    console.error('Error creating role:', error);
    throw error;
  }
}

export async function DeleteDataBackup(id) {
  try {
    store.dispatch(setLoading(true));
    const response = await axiosClient(`DataBackup/DeleteHistory?id=${id}`, 'DELETE');
    store.dispatch(setLoading(false));
    return response;
  } catch (error) {
    console.error('Error creating role:', error);
    throw error;
  }
}

export async function SyncCollection(startDate, endDate) {
  try {
    store.dispatch(setLoading(true));
    const response = await sendRequest(`DongBo/SyncCollection?tuNgayDoTotNghiep=${startDate}&denNgayDoTotNghiep=${endDate}`, 'GET');
    store.dispatch(setLoading(false));
    return response;
  } catch (error) {
    console.error('Error creating role:', error);
    throw error;
  }
}
