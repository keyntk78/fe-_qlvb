import { sendRequest } from 'utils/apiUtils';
import { axiosClient } from './axiosClient';
import { store } from 'store';
import { setLoading } from 'store/actions';

export async function GetCauHinhImportDanhMuc() {
  try {
    const response = await sendRequest(`XuLyDuLieu/GetCauHinhImportDanhMuc`, 'GET', null);
    return response;
  } catch (error) {
    console.error('Error creating User:', error);
    throw error;
  }
}
export async function ImportDanhMuc(data) {
  try {
    store.dispatch(setLoading(true));
    const response = await axiosClient(`XuLyDuLieu/ImportDanhMuc`, 'POST', data);
    store.dispatch(setLoading(false));
    return response;
  } catch (error) {
    console.error('Error creating history access:', error);
    throw error;
  }
}
export async function getDanhSachDanhMucTmp(params) {
  try {
    const response = await sendRequest(`XuLyDuLieu/GetImportDanhMuc?${params}`, 'GET', null);
    return response;
  } catch (error) {
    console.error('Error creating User:', error);
    throw error;
  }
}
export async function DeleteImport(nguoiThucHien, key) {
  try {
    store.dispatch(setLoading(true));
    const response = await axiosClient(`XuLyDuLieu/HuyImportDanhMuc?nguoiThucHien=${nguoiThucHien}&key=${key}`, 'POST');
    store.dispatch(setLoading(false));
    return response;
  } catch (error) {
    console.error('Error delete Namthi:', error);
    throw error;
  }
}
export async function SaveImport(data) {
  try {
    const response = await axiosClient(`XuLyDuLieu/SaveImportDanhMuc`, 'POST', data);
    return response;
  } catch (error) {
    console.error('Error creating User:', error);
    throw error;
  }
}
