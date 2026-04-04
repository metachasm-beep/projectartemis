/**
 * Matriarch Cloudinary Utility
 * Handles media uploads without server-side signing.
 */

const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

export const uploadToCloudinary = async (file: File | Blob): Promise<string> => {
  if (!CLOUD_NAME || !UPLOAD_PRESET) {
    throw new Error("MATRIARCH_CLOUDINARY: Missing configuration in environment.");
  }

  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', UPLOAD_PRESET);
  formData.append('folder', 'profiles');

  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
      {
        method: 'POST',
        body: formData,
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || "Upload failed");
    }

    const data = await response.json();
    console.log("MATRIARCH_CLOUDINARY: Upload success", data.secure_url);
    return data.secure_url;
  } catch (err) {
    console.error("MATRIARCH_CLOUDINARY: Error", err);
    throw err;
  }
};
