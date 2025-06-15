export async function uploadToImgBB(file) {
  const apiKey = '831ea051af91b7d434d321761d6c8277';
  const formData = new FormData();
  formData.append('image', file);

  const response = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
    method: 'POST',
    body: formData,
  });

  const data = await response.json();
  if (data.success) {
    return data.data.url; // Direct image URL
  } else {
    throw new Error('ImgBB upload failed');
  }
} 