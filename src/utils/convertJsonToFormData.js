export async function convertJsonToFormData(jsonData) {
  const formData = new FormData();

  Object.keys(jsonData).forEach((key) => {
    const capitalizedKey = key.charAt(0).toUpperCase() + key.slice(1);
    formData.append(capitalizedKey, jsonData[key]);
  });

  return formData;
}
