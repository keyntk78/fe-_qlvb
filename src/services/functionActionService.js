import { sendRequest } from 'utils/apiUtils';

export async function getAllFunctionAction() {
  try {
    const response = await sendRequest(`FunctionAction/GetAll`, 'GET');
    return response;
  } catch (error) {
    console.error('Error creating function:', error);
    throw error;
  }
}
