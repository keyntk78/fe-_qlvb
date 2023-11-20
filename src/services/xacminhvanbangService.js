import { sendRequest } from 'utils/apiUtils';
import { axiosClient } from './axiosClient';
import { store } from '../store/index';
import { setLoading } from 'store/actions';
export async function getHocSinhXacMinhVanBang(params) {
  try {
    const response = await sendRequest(`XacMinhVanBang/GetSearchHocSinhXacMinhVanBang?${params}`, 'GET', null);
    return response;
  } catch (error) {
    console.error('Error creating User:', error);
    throw error;
  }
}
export async function getHocSinhXacMinhByCCCD(cccd) {
  try {
    store.dispatch(setLoading(true));
    const response = await axiosClient(`XacMinhVanBang/GetByCccd?cccd=${cccd}`, 'GET', null);
    store.dispatch(setLoading(false));
    return response;
  } catch (error) {
    console.error('Error creating User:', error);
    throw error;
  }
}
export async function AddLichSuXacMinh(data) {
  try {
    store.dispatch(setLoading(true));
    const response = await axiosClient(`XacMinhVanBang/Create`, 'POST', data);
    store.dispatch(setLoading(false));
    return response;
  } catch (error) {
    console.error('Error creating history access:', error);
    throw error;
  }
}
export async function AddListLichSuXacMinh(data) {
  try {
    store.dispatch(setLoading(true));
    const response = await axiosClient(`XacMinhVanBang/CreateList`, 'POST', data);
    store.dispatch(setLoading(false));
    return response;
  } catch (error) {
    console.error('Error creating history access:', error);
    throw error;
  }
}
export async function getHistoryXacMinh(params) {
  try {
    store.dispatch(setLoading(true));
    const response = await sendRequest(`XacMinhVanBang/GetLichSuPhatMinhVanbang?${params}`, 'GET');
    store.dispatch(setLoading(false));
    return response;
  } catch (error) {
    console.error('Error creating history access:', error);
    throw error;
  }
}
export async function getCauHinhXacMinhVanBang(idDonVi) {
  try {
    store.dispatch(setLoading(true));
    const response = await axiosClient(`XacMinhVanBang/CauHinhXacMinhVB?idDonVi=${idDonVi}`, 'GET', null);
    store.dispatch(setLoading(false));
    return response;
  } catch (error) {
    console.error('Error creating User:', error);
    throw error;
  }
}
export async function getLichSuXacMinhVanBangByID(id) {
  try {
    store.dispatch(setLoading(true));
    const response = await axiosClient(`XacMinhVanBang/GetLichSuXacMinhById?id=${id}`, 'GET', null);
    store.dispatch(setLoading(false));
    return response;
  } catch (error) {
    console.error('Error creating User:', error);
    throw error;
  }
}
export async function ImportDanhSachVanBang(data) {
  try {
    store.dispatch(setLoading(true));
    const response = await axiosClient(`SoGoc/ImportHocSinh`, 'POST', data);
    store.dispatch(setLoading(false));
    return response;
  } catch (error) {
    console.error('Error creating history access:', error);
    throw error;
  }
}
export async function getDanhSachVanBangTmp(params) {
  try {
    const response = await sendRequest(`XacMinhVanBang/GetSearchHocSinhTmp?${params}`, 'GET', null);
    return response;
  } catch (error) {
    console.error('Error creating User:', error);
    throw error;
  }
}
export async function ThongKeDanhSachVanBangTmp(idtruong, nguoithuchien, iddanhmuc) {
  try {
    const response = await sendRequest(
      `XacMinhVanBang/GetThongKeHocSinhTmp?idTruong=${idtruong}&nguoiThucHien=${nguoithuchien}&idDanhMucTotNghiep=${iddanhmuc}`,
      'GET',
      null
    );
    return response;
  } catch (error) {
    console.error('Error creating User:', error);
    throw error;
  }
}
export async function SaveImport(idtruong, nguoithuchien, iddanhmuc) {
  try {
    const response = await sendRequest(
      `XacMinhVanBang/SaveImport?idTruong=${idtruong}&nguoiThucHien=${nguoithuchien}&idDanhMucTotNghiep=${iddanhmuc}`,
      'POST',
      null
    );
    return response;
  } catch (error) {
    console.error('Error creating User:', error);
    throw error;
  }
}
export async function DeleteImport(nguoiThucHien) {
  try {
    store.dispatch(setLoading(true));
    const response = await axiosClient(`XacMinhVanBang/DeleteImport?nguoiThucHien=${nguoiThucHien}`, 'POST');
    store.dispatch(setLoading(false));
    return response;
  } catch (error) {
    console.error('Error delete Namthi:', error);
    throw error;
  }
}
