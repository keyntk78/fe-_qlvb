import { sendRequest } from 'utils/apiUtils';
import { setLoading } from 'store/actions';
import { store } from '../store/index';

export async function getAllReportByParams(params) {
  try {
    const response = await sendRequest(`Report/GetAllByParams?${params}`, 'GET');
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function getAllReport() {
  try {
    const response = await sendRequest(`Report/GetAll`, 'GET');
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function getReportById(id) {
  try {
    store.dispatch(setLoading(true));
    const response = await sendRequest(`Report/${id}`, 'GET');
    store.dispatch(setLoading(false));
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

// export async function getpermissionbyrole(id, params) {
//   try {
//     store.dispatch(setLoading(true));
//     const response = await sendRequest(`Report/GetPermissionByRoleID/${id}?${params}`, 'GET');
//     store.dispatch(setLoading(false));
//     return response;
//   } catch (error) {
//     console.error(error);
//     throw error;
//   }
// }

export async function createReport(data) {
  try {
    store.dispatch(setLoading(true));
    const response = await sendRequest('Report/Create', 'POST', data);
    store.dispatch(setLoading(false));
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

// export async function createPermissionbyRole(data) {
//   try {
//     store.dispatch(setLoading(true));
//     const response = await sendRequest('Report/CreatePermission', 'POST', data);
//     store.dispatch(setLoading(false));
//     return response;
//   } catch (error) {
//     console.error('Error creating role:', error);
//     throw error;
//   }
// }

export async function editReport(data) {
  try {
    store.dispatch(setLoading(true));
    const response = await sendRequest('Report/Update', 'PUT', data);
    store.dispatch(setLoading(false));
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function deleteReport(id) {
  try {
    store.dispatch(setLoading(true));
    const response = await sendRequest(`Report/Delete?id=${id}`, 'DELETE');
    store.dispatch(setLoading(false));
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
