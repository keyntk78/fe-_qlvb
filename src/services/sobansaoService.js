// import { sendRequest } from 'utils/apiUtils';
import { axiosClient } from './axiosClient';
import { setLoading } from 'store/actions';
import { store } from '../store/index';

export async function GetHocSinhTheoCapBanSao(idTruong, idDanhMucTotNghiep) {
  try {
    store.dispatch(setLoading(true));
    const response = await axiosClient(
      `SoCapBanSao/GetHocSinhTheoCapBanSao?idTruong=${idTruong}&idDanhMucTotNghiep=${idDanhMucTotNghiep}`,
      'GET'
    );
    store.dispatch(setLoading(false));
    return response;
  } catch (error) {
    console.error('Error creating Sobansao:', error);
    throw error;
  }
}
export async function GetHocSinhTheoSoBanSao(params) {
  try {
    store.dispatch(setLoading(true));
    const response = await axiosClient(`SoCapBanSao/GetHocSinhCapBanSao?${params}`, 'GET');
    store.dispatch(setLoading(false));
    return response;
  } catch (error) {
    console.error('Error creating Monthi:', error);
    throw error;
  }
}
