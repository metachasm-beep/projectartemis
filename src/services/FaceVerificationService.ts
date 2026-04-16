// 🛡️ DYNAMIC: face-api.js is heavy (ML models). Load only when verification starts.
let faceapi: any = null;

class FaceVerificationService {
  private modelsLoaded = false;
  private loadingPromise: Promise<void> | null = null;

  private async getFaceApi() {
    if (!faceapi) {
      faceapi = await import('face-api.js');
    }
    return faceapi;
  }

  async loadModels() {
    if (this.modelsLoaded) return;
    if (this.loadingPromise) return this.loadingPromise;

    this.loadingPromise = (async () => {
      const api = await this.getFaceApi();
      const MODEL_URL = '/models';
      try {
        await Promise.all([
          api.nets.ssdMobilenetv1.loadFromUri(MODEL_URL),
          api.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
          api.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
          api.nets.tinyFaceDetector.loadFromUri(MODEL_URL)
        ]);
        this.modelsLoaded = true;
      } catch (error) {
        console.error('CRITICAL: Failed to load biometric models from /models.', error);
        throw error;
      }
    })();

    return this.loadingPromise;
  }

  async getFaceDescriptor(imageElement: HTMLImageElement | HTMLVideoElement | HTMLCanvasElement) {
    const api = await this.getFaceApi();
    await this.loadModels();
    
    const detection = await api
      .detectSingleFace(imageElement)
      .withFaceLandmarks()
      .withFaceDescriptor();

    return detection ? detection.descriptor : null;
  }

  async verifyFaces(referenceImage: HTMLImageElement, liveImage: HTMLImageElement | HTMLCanvasElement): Promise<{ success: boolean; distance: number; error?: 'NO_FACE_DETECTED' | 'MISMATCH' }> {
    const api = await this.getFaceApi();
    await this.loadModels();

    const refDescriptor = await this.getFaceDescriptor(referenceImage);
    const liveDescriptor = await this.getFaceDescriptor(liveImage);

    if (!refDescriptor || !liveDescriptor) {
      return { success: false, distance: 1.0, error: 'NO_FACE_DETECTED' };
    }

    const distance = api.euclideanDistance(refDescriptor, liveDescriptor);
    const success = distance < 0.6;
    
    return { success, distance, error: success ? undefined : 'MISMATCH' };
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
