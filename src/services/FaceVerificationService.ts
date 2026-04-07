import * as faceapi from 'face-api.js';

class FaceVerificationService {
  private modelsLoaded = false;
  private loadingPromise: Promise<void> | null = null;

  async loadModels() {
    if (this.modelsLoaded) return;
    if (this.loadingPromise) return this.loadingPromise;

    this.loadingPromise = (async () => {
      const MODEL_URL = '/models';
      try {
        // Since we flattened the directory, all manifest files are at /models/[net]_model-weights_manifest.json
        await Promise.all([
          faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL),
          faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
          faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
          faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL)
        ]);
        this.modelsLoaded = true;
      } catch (error) {
        console.error('CRITICAL: Failed to load biometric models from /models. Ensure weight manifests are flattened at the root.', error);
        throw error;
      }
    })();

    return this.loadingPromise;
  }

  async getFaceDescriptor(imageElement: HTMLImageElement | HTMLVideoElement | HTMLCanvasElement) {
    await this.loadModels();
    
    const detection = await faceapi
      .detectSingleFace(imageElement)
      .withFaceLandmarks()
      .withFaceDescriptor();

    return detection ? detection.descriptor : null;
  }

  async verifyFaces(referenceImage: HTMLImageElement, liveImage: HTMLImageElement | HTMLCanvasElement): Promise<{ success: boolean; distance: number; error?: 'NO_FACE_DETECTED' | 'MISMATCH' }> {
    await this.loadModels();

    const refDescriptor = await this.getFaceDescriptor(referenceImage);
    const liveDescriptor = await this.getFaceDescriptor(liveImage);

    if (!refDescriptor || !liveDescriptor) {
      console.warn("Face detection failed in verification cycle.");
      return { success: false, distance: 1.0, error: 'NO_FACE_DETECTED' };
    }

    const distance = faceapi.euclideanDistance(refDescriptor, liveDescriptor);
    // Threshold of 0.6 is common for face recognition
    const success = distance < 0.6;
    
    return { 
      success, 
      distance, 
      error: success ? undefined : 'MISMATCH' 
    };
  }

  /**
   * Simulated verification for demo/testing without a camera
   */
  async simulateVerification(isSuccess: boolean = true): Promise<{ success: boolean; distance: number }> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: isSuccess,
          distance: isSuccess ? 0.35 : 0.82
        });
      }, 2500);
    });
  }
}

export const faceVerificationService = new FaceVerificationService();
