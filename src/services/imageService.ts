/**
 * 📸 MATRIARCH IMAGE ENGINE (Cloudinary)
 * High-performance image management for community manifestos.
 * Using provided Sovereign Credentials for immediate sanctuary activation.
 */

const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_MANIFESTO_PRESET || 'ml_default'; 

export const ImageService = {
  /**
   * 📤 SOVEREIGN UPLOAD:
   * Transmits a visual asset to the Cloudinary vault.
   */
  uploadManifestoImage: async (file: File): Promise<string | null> => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', UPLOAD_PRESET);

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: 'POST',
          body: formData,
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error("CLOUDINARY_UPLOAD_ERROR:", errorData);
        // If 'ml_default' failed, it might be a missing preset issue.
        if (errorData.error?.message?.includes('Upload preset')) {
           alert(`CLOUDINARY_ERROR: Unsigned preset '${UPLOAD_PRESET}' not found. Please create an unsigned preset in Cloudinary settings.`);
        }
        return null;
      }

      const data = await response.json();
      return data.secure_url;
    } catch (err) {
      console.error("IMAGE_SERVICE_CRITICAL_FAULT:", err);
      return null;
    }
  }
};
