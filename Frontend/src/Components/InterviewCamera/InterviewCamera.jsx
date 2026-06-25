import React, { useRef, useEffect, useState } from "react";
import * as faceapi from "@vladmandic/face-api";
import { AlertTriangle, Mic, MicOff, Camera, Clock, MessageSquare } from "lucide-react";
import toast from "react-hot-toast";
import { motion } from "framer-motion";

const InterviewCamera = ({ question, onComplete }) => {
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  const [hasFace, setHasFace] = useState(true);
  const [multipleFaces, setMultipleFaces] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [timeLeft, setTimeLeft] = useState(120);
  const [transcript, setTranscript] = useState("");
  const [modelsLoaded, setModelsLoaded] = useState(false);

  const recognitionRef = useRef(null);

  useEffect(() => {
    // Detect Tab switching
    const handleVisibilityChange = () => {
      if (document.hidden && isRecording) {
        toast.error(
          "Warning: Switching tabs during interview is not allowed!",
          { id: "tab-switch", duration: 4000 },
        );
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [isRecording]);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error(err);
      toast.error("Camera and Microphone access required to proceed.");
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
    }
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
  };

  useEffect(() => {
    let isMounted = true;
    const loadModelsAndStart = async () => {
      try {
        const MODEL_URL = "https://vladmandic.github.io/face-api/model/";
        await faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL);
        if (isMounted) setModelsLoaded(true);
      } catch (err) {
        console.warn(
          "Could not load face-api models. Falling back without face tracking.",
          err,
        );
      }
      if (isMounted) startCamera();
    };
    loadModelsAndStart();

    return () => {
      isMounted = false;
      stopCamera();
    };
  }, []);

  const handleVideoPlay = () => {
    if (!modelsLoaded) return;

    setInterval(async () => {
      if (
        videoRef.current &&
        !videoRef.current.paused &&
        !videoRef.current.ended
      ) {
        try {
          const detections = await faceapi.detectAllFaces(
            videoRef.current,
            new faceapi.SsdMobilenetv1Options({ minConfidence: 0.2 }),
          );
          if (detections.length === 0) {
            setHasFace(false);
            setMultipleFaces(false);
          } else if (detections.length > 1) {
            setHasFace(true);
            setMultipleFaces(true);
          } else {
            setHasFace(true);
            setMultipleFaces(false);
          }
        } catch (e) {
          console.error(e);
        }
      }
    }, 1000);
  };

  const startRecording = () => {
    setIsRecording(true);
    setTranscript("");
    setTimeLeft(120);

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = "en-US";

      recognition.onresult = (event) => {
        let currentTranscript = "";
        for (let i = 0; i < event.results.length; i++) {
          currentTranscript += event.results[i][0].transcript;
        }
        setTranscript(currentTranscript);
      };

      recognition.onerror = (event) => {
        console.warn("Speech recognition error", event.error);
      };

      recognition.start();
      recognitionRef.current = recognition;
    } else {
      toast.error(
        "Your browser doesn't support speech recognition API. Transcript will be empty.",
      );
    }
  };

  const stopRecording = () => {
    setIsRecording(false);
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    onComplete(transcript);
  };

  useEffect(() => {
    if (isRecording) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            stopRecording();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isRecording, transcript]);

  const timerColor =
    timeLeft <= 15
      ? "text-rose-600 bg-rose-50 border-rose-200"
      : timeLeft <= 30
      ? "text-amber-600 bg-amber-50 border-amber-200"
      : "text-blue-600 bg-blue-50 border-blue-200";

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col md:flex-row gap-5">
      {/* Video Section */}
      <div className="flex-1 relative bg-slate-900 rounded-xl overflow-hidden shadow-lg aspect-video flex-shrink-0">
        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          onPlay={handleVideoPlay}
          className="w-full h-full object-cover"
        />

        {/* Overlays */}
        <div className="absolute top-3 left-3 right-3 flex justify-between items-start pointer-events-none">
          <div className="flex items-center gap-2 bg-black/50 backdrop-blur-md px-3 py-1.5 rounded-full text-white text-xs font-bold">
            <Camera className="w-3.5 h-3.5 text-emerald-400" />
            <span>WebCam Active</span>
          </div>
          {isRecording && (
            <div className="flex items-center gap-2 bg-red-500/90 backdrop-blur-md px-3 py-1.5 rounded-full text-white text-xs font-bold animate-pulse">
              <div className="w-2 h-2 bg-white rounded-full"></div> REC
            </div>
          )}
        </div>

        {/* Timer Overlay */}
        {isRecording && (
          <div className="absolute bottom-3 left-3 pointer-events-none">
            <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold backdrop-blur-md border ${timerColor}`}>
              <Clock className="w-3.5 h-3.5" />
              {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, "0")}
            </div>
          </div>
        )}

        {/* Face Detection Warnings */}
        {(!hasFace || multipleFaces) && (
          <div className="absolute inset-0 bg-red-500/20 backdrop-blur-[2px] flex items-center justify-center pointer-events-none">
            <div className="bg-red-600 text-white px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3 font-bold border-2 border-red-400">
              <AlertTriangle className="w-6 h-6" />
              <span>
                {!hasFace
                  ? "No face detected in frame!"
                  : "Multiple faces detected!"}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Control Panel */}
      <div className="flex-[0.8] flex flex-col justify-between py-1 min-w-0">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <MessageSquare className="w-4 h-4 text-indigo-500" />
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">
              Interview Question
            </h3>
          </div>
          <p className="text-lg font-extrabold text-slate-900 leading-snug mb-5">
            {question}
          </p>

          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl mb-5">
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-[11px] font-bold text-slate-500 flex items-center gap-1.5 uppercase tracking-wider">
                <Mic className="w-3 h-3" /> Live Transcript
              </span>
              {isRecording && (
                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                  Listening...
                </span>
              )}
            </div>
            <div className="h-28 overflow-y-auto w-full pr-2 text-sm text-slate-700 font-medium leading-relaxed scrollbar-thin">
              {transcript || (
                <span className="text-slate-400 font-normal italic">
                  Your answer will appear here once you start recording...
                </span>
              )}
            </div>
          </div>
        </div>

        <div>
          {!isRecording ? (
            <motion.button
              whileHover={{ y: -2 }}
              whileTap={{ y: 0 }}
              onClick={startRecording}
              className="w-full bg-slate-900 text-white font-bold py-3.5 px-6 rounded-xl hover:bg-slate-800 transition-colors flex items-center justify-center gap-2 shadow-md"
            >
              <Mic className="w-5 h-5" /> Start Answering
            </motion.button>
          ) : (
            <motion.button
              whileHover={{ y: -2 }}
              whileTap={{ y: 0 }}
              onClick={stopRecording}
              className="w-full bg-rose-600 text-white font-bold py-3.5 px-6 rounded-xl hover:bg-rose-700 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-rose-500/20"
            >
              <MicOff className="w-5 h-5" /> Stop & Submit Answer
            </motion.button>
          )}
        </div>
      </div>
    </div>
  );
};

export default InterviewCamera;
