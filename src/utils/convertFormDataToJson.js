export async function convertFormDataToJson(formData) {
  const jsonData = {};

  for (let [key, value] of formData.entries()) {
    if (value instanceof File) {
      continue; // Loại bỏ trường file
    }

    jsonData[key] = value;
  }

  return jsonData;
}
