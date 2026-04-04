import React, { useRef, useState, useEffect } from 'react';
import { X, RefreshCw, Check } from 'lucide-react';
import { motion } from 'framer-motion';

interface CameraCaptureProps {
  onCapture: (file: File) => void;
  onClose: () => void;
}

export const CameraCapture: React.FC<CameraCaptureProps> = ({ onCapture, onClose }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const startCamera = async () => {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({ 
          video: { facingMode: 'user' }, 
          audio: false 
        });
        setStream(mediaStream);
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
      } catch (err) {
        console.error("Camera access error:", err);
        setError("Could not access camera. Please check permissions.");
      }
    };

    startCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const takePhoto = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.width > 0 ? canvas.getContext('2d') : null;
      if (ctx) {
        ctx.translate(canvas.width, 0);
        ctx.scale(-1, 1); // Mirror effect matching the preview
        ctx.drawImage(videoRef.current, 0, 0);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
        setCapturedImage(dataUrl);
      }
    }
  };

  const handleConfirm = () => {
    if (capturedImage) {
      // Convert dataUrl to File
      fetch(capturedImage)
        .then(res => res.blob())
        .then(blob => {
          const file = new File([blob], `capture_${Date.now()}.jpg`, { type: 'image/jpeg' });
          onCapture(file);
          onClose();
        });
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/90 flex flex-col items-center justify-center p-6 backdrop-blur-md">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-full max-w-md bg-mat-cream rounded-[3rem] overflow-hidden shadow-2xl border border-mat-rose/20"
      >
        <div className="p-8 flex justify-between items-center border-b border-mat-rose/10">
          <h3 className="text-xl font-bold text-mat-wine italic">Capturing Identity</h3>
          <button onClick={onClose} className="p-3 bg-mat-rose/5 rounded-full text-mat-rose hover:bg-mat-rose/20 transition-all">
            <X size={20} />
          </button>
        </div>

        <div className="relative aspect-[3/4] bg-black overflow-hidden relative">
          {error ? (
            <div className="absolute inset-0 flex items-center justify-center text-center p-12 text-white/40 text-[11px] font-bold uppercase tracking-widest leading-relaxed">
              {error}
            </div>
          ) : (
            <>
              {capturedImage ? (
                <img src={capturedImage} className="w-full h-full object-cover" alt="Captured" />
              ) : (
                <video 
                  ref={videoRef} 
                  autoPlay 
                  playsInline 
                  muted 
                  className="w-full h-full object-cover -scale-x-100"
                />
              )}
            </>
          )}
        </div>

        <div className="p-10 flex justify-center items-center gap-8 bg-mat-ivory">
          {capturedImage ? (
            <>
              <button 
                onClick={() => setCapturedImage(null)}
                className="w-16 h-16 bg-mat-rose/10 text-mat-rose rounded-full flex items-center justify-center hover:bg-mat-rose/20 transition-all shadow-sm"
              >
                <RefreshCw size={24} />
              </button>
              <button 
                onClick={handleConfirm}
                className="w-20 h-20 bg-mat-wine text-mat-cream rounded-full flex items-center justify-center hover:bg-mat-wine-soft transition-all shadow-mat-premium"
              >
                <Check size={32} strokeWidth={3} />
              </button>
            </>
          ) : (
            <button 
              onClick={takePhoto}
              disabled={!!error}
              className="w-24 h-24 bg-mat-wine text-mat-cream rounded-full flex items-center justify-center hover:bg-mat-wine-soft transition-all shadow-mat-premium disabled:opacity-20"
            >
              <div className="w-16 h-16 border-4 border-mat-cream/30 rounded-full flex items-center justify-center">
                <div className="w-12 h-12 bg-white rounded-full" />
              </div>
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
};
