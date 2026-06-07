export async function uploadImagem(file) {

  const formData = new FormData();

  formData.append("file", file);

  formData.append(
    "upload_preset",
    "eventflix_upload"
  );

  const response = await fetch(
    "https://api.cloudinary.com/v1_1/eventflix_uploads/image/upload",
    {
      method: "POST",
      body: formData
    }
  );

  const data = await response.json();

  return data.secure_url;
}