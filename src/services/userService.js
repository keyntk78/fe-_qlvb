import { sendRequest } from 'utils/apiUtils';
import { axiosClient } from './axiosClient';
import { setLoading } from 'store/actions';
import { store } from '../store/index';

export async function getUsers(params) {
  try {
    const response = await sendRequest(`User/GetAllByParams?${params}`, 'GET', null);
    return response;
  } catch (error) {
    console.error('Error creating User:', error);
    throw error;
  }
}

export async function getUserById(id) {
  try {
    store.dispatch(setLoading(true));
    const response = await sendRequest(`User/${id}`, 'GET');
    store.dispatch(setLoading(false));
    return response;
  } catch (error) {
    console.error('Error creating User:', error);
    throw error;
  }
}

export async function createUser(data) {
  try {
    store.dispatch(setLoading(true));
    const response = await axiosClient('User/Create', 'POST', data);
    store.dispatch(setLoading(false));
    return response;
  } catch (error) {
    console.error('Error creating User:', error);
    throw error;
  }
}

export async function updateUser(data) {
  try {
    store.dispatch(setLoading(true));
    const response = await axiosClient('User/Update', 'PUT', data);
    store.dispatch(setLoading(false));
    return response;
  } catch (error) {
    console.error('Error creating User:', error);
    throw error;
  }
}

export async function deleteUser(userId) {
  try {
    store.dispatch(setLoading(true));
    const response = await axiosClient(`User/Delete?id=${userId}`, 'DELETE');
    store.dispatch(setLoading(false));
    return response;
  } catch (error) {
    console.error('Error creating User:', error);
    throw error;
  }
}

export async function deActiveUser(userId) {
  try {
    store.dispatch(setLoading(true));
    const response = await axiosClient(`User/DeActive?id=${userId}`, 'GET');
    store.dispatch(setLoading(false));
    return response;
  } catch (error) {
    console.error('Error creating User:', error);
    throw error;
  }
}

export async function activeUser(userId) {
  try {
    store.dispatch(setLoading(true));
    const response = await axiosClient(`User/Active?id=${userId}`, 'GET');
    store.dispatch(setLoading(false));
    return response;
  } catch (error) {
    console.error('Error creating User:', error);
    throw error;
  }
}

export async function resetPasswordUser(userId) {
  try {
    store.dispatch(setLoading(true));
    const response = await axiosClient(`User/ResetPassword?id=${userId}`, 'POST');
    store.dispatch(setLoading(false));
    return response;
  } catch (error) {
    console.error('Error creating role:', error);
    throw error;
  }
}

export async function getRolesViaUser(id, params) {
  try {
    store.dispatch(setLoading(true));
    const response = await sendRequest(`User/GetRolesViaUser/${id}?${params}`, 'GET', null);
    store.dispatch(setLoading(false));
    return response;
  } catch (error) {
    console.error('Error creating User:', error);
    throw error;
  }
}

export async function saveUserRole(data) {
  try {
    store.dispatch(setLoading(true));
    const response = await axiosClient('User/SaveUserRole', 'POST', data);
    store.dispatch(setLoading(false));
    return response;
  } catch (error) {
    console.error('Error creating User:', error);
    throw error;
  }
}

export async function getReportsViaUser(id, params) {
  try {
    store.dispatch(setLoading(true));
    const response = await axiosClient(`User/GetReportsViaUser/${id}?${params}`, 'GET', null);
    store.dispatch(setLoading(false));
    return response;
  } catch (error) {
    console.error('Error creating User:', error);
    throw error;
  }
}

export async function getReportsViaUserManagerment(user_id_managerment, user_id) {
  try {
    store.dispatch(setLoading(true));
    const response = await axiosClient(
      `User/GetReportsViaUserManagerment?user_id_managerment=${user_id_managerment}&user_id=${user_id}`,
      'GET',
      null
    );
    store.dispatch(setLoading(false));
    return response;
  } catch (error) {
    console.error('Error creating User:', error);
    throw error;
  }
}

export async function saveUserReport(data) {
  try {
    store.dispatch(setLoading(true));
    const response = await axiosClient('User/SaveUserReport', 'POST', data);
    store.dispatch(setLoading(false));
    return response;
  } catch (error) {
    console.error('Error creating User:', error);
    throw error;
  }
}
