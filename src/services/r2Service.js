export async function uploadImage(file, folder = "test") {
  if (!file) {
    throw new Error("No image selected.");
  }

  const formData = new FormData();

  formData.append("file", file);
  formData.append("folder", folder);

  const response = await fetch(
    "http://localhost:5000/api/upload-test",
    {
      method: "POST",
      body: formData
    }
  );

  const data = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(
      data.message || "Failed to upload image."
    );
  }

  return data;
}

export async function getImageUrl(key) {
  if (!key) {
    return "";
  }

  const response = await fetch(
    `http://localhost:5000/api/image-url?key=${encodeURIComponent(key)}`
  );

  const data = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(
      data.message || "Failed to get image URL."
    );
  }

  return data.url;
}