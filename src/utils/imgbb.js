export async function uploadToImgBB(file) {
  const apiKey = import.meta.env.VITE_IMGBB_UPLOAD_KEY;
  const formData = new FormData();
  formData.append("image", file);

  const response = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
    method: "POST",
    body: formData,
  });

  const data = await response.json();
  if (data.success) {
    return data.data.url;
  } else {
    throw new Error("ImgBB upload failed");
  }
}
