const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000";

export async function uploadImage(
  file,
  folder = "test"
) {
  if (!file) {
    throw new Error("No image selected.");
  }

  const formData = new FormData();

  formData.append("file", file);
  formData.append("folder", folder);

  const response = await fetch(
    `${API_URL}/api/upload-test`,
    {
      method: "POST",
      body: formData
    }
  );

  const data = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(
      data.message ||
        "Failed to upload image."
    );
  }

  return data;
}

export async function getImageUrl(key) {
  if (!key) {
    return "";
  }

  const response = await fetch(
    `${API_URL}/api/image-url?key=${encodeURIComponent(
      key
    )}`
  );

  const data = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(
      data.message ||
        "Failed to get image URL."
    );
  }

  return data.url;
}