import { sendRequest } from 'utils/apiUtils';
import { axiosClient } from './axiosClient';
import { setLoading } from 'store/actions';
import { store } from '../store/index';

export async function login(data) {
  try {
    store.dispatch(setLoading(true));
    const response = await sendRequest(`Auth/login`, 'POST', data);
    store.dispatch(setLoading(false));
    return response;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error('Error creating role:', error);
    throw error;
  }
}

export async function changepass(data) {
  try {
    store.dispatch(setLoading(true));
    const response = await axiosClient(`AccountManager/ChangePassword`, 'POST', data);
    store.dispatch(setLoading(false));
    return response;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error('Error creating role:', error);
    throw error;
  }
}

export async function forgotpass(email) {
  try {
    store.dispatch(setLoading(true));
    const response = await axiosClient(`Auth/ForgotPassword?email=${email}`, 'POST');
    store.dispatch(setLoading(false));
    return response;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error('Error creating role:', error);
    throw error;
  }
}

export async function resetpass(data) {
  try {
    store.dispatch(setLoading(true));
    const response = await axiosClient(`Auth/ResetPassword`, 'POST', data);
    store.dispatch(setLoading(false));
    return response;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error('Error creating role:', error);
    throw error;
  }
}

export async function profile() {
  try {
    // store.dispatch(setLoading(true))
    const response = await axiosClient(`AccountManager/Profile`, 'GET');
    // store.dispatch(setLoading(false))
    return response;
  } catch (error) {
    console.error('Error creating role:', error);
    throw error;
  }
}

export async function updateProfile(data) {
  try {
    store.dispatch(setLoading(true));
    const response = await axiosClient(`AccountManager/UpdateProfile`, 'POST', data);
    store.dispatch(setLoading(false));
    return response;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error('Error creating role:', error);
    throw error;
  }
}

export async function logout(token) {
  try {
    store.dispatch(setLoading(true));
    const response = await axiosClient(`Auth/Logout`, 'POST', token);
    store.dispatch(setLoading(false));
    return response;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error('Error creating role:', error);
    throw error;
  }
}

export async function saveDeviceToken(data) {
  try {
    store.dispatch(setLoading(true));
    const response = await axiosClient(`Auth/SaveDeviceToken`, 'POST', data);
    store.dispatch(setLoading(false));
    return response;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error('Error creating role:', error);
    throw error;
  }
}
