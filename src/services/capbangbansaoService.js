import { sendRequest } from 'utils/apiUtils';
import { axiosClient } from './axiosClient';
import { setLoading } from 'store/actions';
import { store } from '../store/index';

export async function getSearchbangBanSao(params) {
  try {
    const response = await sendRequest(`CapBangBanSao/GetSearch?${params}`, 'GET');
    return response;
  } catch (error) {
    console.error('Error creating Donyeucau:', error);
    throw error;
  }
}
export async function getSearchDonYeuCauDaDuyet(params) {
  try {
    const response = await sendRequest(`CapBangBanSao/GetSearchDonYeuCauDaDuyet?${params}`, 'GET');
    return response;
  } catch (error) {
    console.error('Error creating DonyeucauDaDuyet:', error);
    throw error;
  }
}

export async function GetSerachDonYeuCapBanSao(params) {
  try {
    const response = await sendRequest(`CapBangBanSao/GetSerachDonYeuCapBanSao?${params}`, 'GET');
    return response;
  } catch (error) {
    console.error('Error creating DonyeucauDaDuyet:', error);
    throw error;
  }
}

export async function getSearchDonYeuCau(params) {
  try {
    const response = await sendRequest(`CapBangBanSao/GetSearchDonYeuCau?${params}`, 'GET');
    return response;
  } catch (error) {
    console.error('Error creating Donyeucau:', error);
    throw error;
  }
}

export async function createDonyeucau(data) {
  try {
    store.dispatch(setLoading(true));
    const response = await axiosClient(`CapBangBanSao/CreateDonYeuCau`, 'POST', data);
    store.dispatch(setLoading(false));
    return response;
  } catch (error) {
    console.error('Error creating Donyeucau:', error);
    throw error;
  }
}

export async function getDonyeucauById(id) {
  try {
    store.dispatch(setLoading(true));
    const response = await axiosClient(`CapBangBanSao/GetById?id=${id}`, 'GET');
    store.dispatch(setLoading(false));
    return response;
  } catch (error) {
    console.error('Error creating Donyeucau:', error);
    throw error;
  }
}

export async function getHocSinhDaDuaVaoSobanSao(idHocSinh, idDonYeuCau, nguoiThucHien) {
  try {
    store.dispatch(setLoading(true));
    const response = await axiosClient(
      `CapBangBanSao/GetHocSinhDaDuaVaoSoBanSao?idHocSinh=${idHocSinh}&idDonYeuCau=${idDonYeuCau}&nguoiThucHien=${nguoiThucHien}`,
      'GET'
    );
    store.dispatch(setLoading(false));
    return response;
  } catch (error) {
    console.error('Error creating Donyeucau:', error);
    throw error;
  }
}

export async function DuyetDon(data) {
  try {
    store.dispatch(setLoading(true));
    const response = await axiosClient(`CapBangBanSao/DuyetDonYeuCau`, 'POST', data);
    store.dispatch(setLoading(false));
    return response;
  } catch (error) {
    console.error('Error creating Donyeucau:', error);
    throw error;
  }
}

export async function TuchoiDon(iddon, lydo, nguoithuchien) {
  try {
    store.dispatch(setLoading(true));
    const response = await axiosClient(
      `CapBangBanSao/TuChoiDoYeuCau?idDonYeuCauCapBanSao=${iddon}&lyDoTuChoi=${lydo}&nguoiThucHien=${nguoithuchien}`,
      'POST'
    );
    store.dispatch(setLoading(false));
    return response;
  } catch (error) {
    console.error('Error creating Donyeucau:', error);
    throw error;
  }
}
export async function XacNhanInBanSao(idDon, nguoiThucHien) {
  try {
    const response = await sendRequest(`CapBangBanSao/XacNhanIn?idDonYeuCauCapBanSao=${idDon}&nguoiThucHien=${nguoiThucHien}'`, 'POST');
    return response;
  } catch (error) {
    console.error('Error creating DonyeucauDaDuyet:', error);
    throw error;
  }
}
export async function XacNhanDaPhatBanSao(idDon) {
  try {
    const response = await sendRequest(`CapBangBanSao/XacNhanDaPhat?idDonYeuCauCapBanSao=${idDon}`, 'POST');
    return response;
  } catch (error) {
    console.error('Error creating DonyeucauDaPhat:', error);
    throw error;
  }
}
export async function GetSearchLichSuDonYeuCau(params) {
  try {
    const response = await sendRequest(`CapBangBanSao/GetSearchLichSuDonYeuCau?${params}`, 'GET');
    return response;
  } catch (error) {
    console.error('Error creating LichSU Donyeucau:', error);
    throw error;
  }
}
