import { useEffect, useRef } from "react";
import { useInternContext } from "../context/InternContext";

const Camera = () => {
  const { setPhoto } = useInternContext();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const takePicture = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (!video || !canvas) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const context = canvas.getContext("2d");

    if (!context) return;

    context.drawImage(
      video,
      0,
      0,
      canvas.width,
      canvas.height
    );

    canvas.toBlob((blob) => {
      if (!blob) return;
      const now = new Date();
      const fileName =
        `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`

      const file = new File(
        [blob],
        `${fileName}-${Date.now()}`,
        {
          type: "image/jpeg",
        }
      );

      setPhoto(prev => ({
        ...prev,
        data: file
      }));
    }, "image/jpeg", 0.8);

    const photo = canvas.toDataURL("image/png");

    setPhoto(prev => ({
      ...prev,
      url: photo
    }));
  };

  useEffect(() => {
    const videoElement = videoRef.current;

    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: false,
        });

        if (videoElement) {
          videoElement.srcObject = stream;
        }
      } catch (error) {
        console.error("Camera access denied:", error);
      }
    };

    startCamera();

    return () => {
      if (videoElement?.srcObject) {
        const stream = videoElement.srcObject as MediaStream;
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  return (
    <div
      onClick={takePicture}
    >
      <video
        ref={videoRef}
        autoPlay
        playsInline
        className="w-full max-w-md rounded-lg"
      />

      <canvas
        ref={canvasRef}
        className="hidden"
      />
    </div>
  );
};

export default Camera;