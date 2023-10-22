import { sendRequest } from 'utils/apiUtils';
import { setLoading } from 'store/actions';
import { store } from '../store/index';

export async function getRoles(params) {
  try {
    const response = await sendRequest(`Role/GetAllByParams?${params}`, 'GET');
    return response;
  } catch (error) {
    console.error('Error creating role:', error);
    throw error;
  }
}

export async function getRoleById(id) {
  try {
    store.dispatch(setLoading(true))
    const response = await sendRequest(`Role/${id}`, 'GET');
    store.dispatch(setLoading(false))
    return response;
  } catch (error) {
    console.error('Error creating role:', error);
    throw error;
  }
}

export async function getpermissionbyrole(idrole, params) {
  try {
    store.dispatch(setLoading(true))
    const response = await sendRequest(`Role/GetPermissionByRoleID/${idrole}?${params}`, 'GET');
    store.dispatch(setLoading(false))
    return response;
  } catch (error) {
    console.error('Error creating role:', error);
    throw error;
  }
}
export async function createRole(data) {
  try {
    store.dispatch(setLoading(true))
    const response = await sendRequest('Role/Create', 'POST', data);
    store.dispatch(setLoading(false))
    return response;
  } catch (error) {
    console.error('Error creating role:', error);
    throw error;
  }
}

export async function createPermissionbyRole(data) {
  try {
    store.dispatch(setLoading(true))
    const response = await sendRequest('Role/CreatePermission', 'POST', data);
    store.dispatch(setLoading(false))
    return response;
  } catch (error) {
    console.error('Error creating role:', error);
    throw error;
  }
}

export async function editRole(data) {
  try {
    store.dispatch(setLoading(true))
    const response = await sendRequest('Role/Update', 'PUT', data);
    store.dispatch(setLoading(false))
    return response;
  } catch (error) {
    console.error('Error creating role:', error);
    throw error;
  }
}

export async function deleteRole(roleId) {
  try {
    store.dispatch(setLoading(true))
    const response = await sendRequest(`Role/Delete?id=${roleId}`, 'DELETE');
    store.dispatch(setLoading(false))
    return response;
  } catch (error) {
    console.error('Error creating role:', error);
    throw error;
  }
}
