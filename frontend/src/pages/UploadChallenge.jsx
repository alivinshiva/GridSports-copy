import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Upload, Video, Info, X, Circle, Square, RotateCcw, Check } from "lucide-react";

export default function UploadChallenge() {
    const navigate = useNavigate();
    const fileInputRef = useRef(null);
    const videoRef = useRef(null);
    const mediaRecorderRef = useRef(null);
    const [chunks, setChunks] = useState([]);
    const [isRecording, setIsRecording] = useState(false);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [mode, setMode] = useState("select"); // 'select', 'record', 'preview'

    const handleGalleryClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const url = URL.createObjectURL(file);
            setPreviewUrl(url);
            setMode("preview");
        }
    };

    const startCamera = async () => {
        setMode("record");
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }
        } catch (err) {
            console.error("Error accessing camera:", err);
            alert("Could not access camera. Please allow permissions.");
            setMode("select");
        }
    };

    const startRecording = () => {
        const stream = videoRef.current?.srcObject;
        if (!stream) return;

        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;
        const localChunks = [];

        mediaRecorder.ondataavailable = (e) => {
            if (e.data.size > 0) {
                localChunks.push(e.data);
            }
        };

        mediaRecorder.onstop = () => {
            const blob = new Blob(localChunks, { type: "video/webm" });
            const url = URL.createObjectURL(blob);
            setPreviewUrl(url);
            setMode("preview");
            setChunks([]);

            // Stop all tracks to turn off camera
            stream.getTracks().forEach(track => track.stop());
        };

        mediaRecorder.start();
        setIsRecording(true);
    };

    const stopRecording = () => {
        mediaRecorderRef.current?.stop();
        setIsRecording(false);
    };

    const reset = () => {
        setPreviewUrl(null);
        setMode("select");
        setIsRecording(false);
        setChunks([]);
        if (videoRef.current && videoRef.current.srcObject) {
            videoRef.current.srcObject.getTracks().forEach(track => track.stop());
        }
    };

    return (
        <div className="bg-background-light dark:bg-background-dark min-h-screen text-[#1c140d] dark:text-white transition-colors duration-200 flex flex-col">
            {/* Top Navigation Bar */}
            <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-b-[#f4ede7] dark:border-b-[#3d2e1f] px-10 py-3 bg-background-light dark:bg-background-dark sticky top-0 z-50">
                <div className="flex items-center gap-4">
                    <div className="size-6 text-primary">
                        <svg fill="currentColor" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                            <path clipRule="evenodd" d="M24 4H42V17.3333V30.6667H24V44H6V30.6667V17.3333H24V4Z" fillRule="evenodd"></path>
                        </svg>
                    </div>
                    <h2 className="text-lg font-bold leading-tight tracking-[-0.015em]">Race Start Reaction</h2>
                </div>
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center justify-center rounded-xl h-10 w-10 bg-[#f4ede7] dark:bg-[#3d2e1f] text-[#1c140d] dark:text-white hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
                >
                    <X size={24} />
                </button>
            </header>

            <main className="flex-1 flex flex-col items-center py-10 px-4">
                <div className="max-w-[800px] w-full flex flex-col gap-8">

                    {/* Progress Bar - Only allow if not in preview (or keep consistent) */}
                    <div className="flex flex-col gap-3">
                        <div className="flex gap-6 justify-between items-end">
                            <p className="text-base font-medium leading-normal">
                                {mode === 'select' ? 'Choosing Format' : mode === 'record' ? 'Recording' : 'Review'}
                            </p>
                            <p className="text-sm font-normal leading-normal opacity-70">
                                {mode === 'select' ? 'Step 1 of 4' : mode === 'record' ? 'Step 2 of 4' : 'Step 3 of 4'}
                            </p>
                        </div>
                        <div className="rounded-full bg-[#e8dbce] dark:bg-[#3d2e1f] h-2 w-full overflow-hidden">
                            <div className="h-full bg-primary" style={{ width: mode === 'select' ? "25%" : mode === 'record' ? "50%" : "75%" }}></div>
                        </div>
                    </div>

                    {/* Headline & Intro Section */}
                    {mode === 'select' && (
                        <div className="text-center">
                            <h1 className="text-[32px] font-bold leading-tight pb-3 pt-6">Upload to Race Start Reaction</h1>
                            <p className="text-base font-normal leading-normal opacity-80">Record your face when the race starts!</p>
                        </div>
                    )}

                    {/* MODE: SELECT */}
                    {mode === 'select' && (
                        <>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
                                {/* Record Video Card */}
                                <button
                                    onClick={startCamera}
                                    className="group flex flex-col items-center gap-6 p-10 rounded-xl border-2 border-transparent bg-white dark:bg-[#2d2218] shadow-sm hover:border-primary hover:shadow-lg transition-all text-center"
                                >
                                    <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                                        <Video size={48} />
                                    </div>
                                    <div>
                                        <p className="text-xl font-bold leading-normal mb-2">Record Video</p>
                                        <p className="text-[#9c7349] dark:text-[#c4a484] text-sm font-normal leading-relaxed">
                                            Use your webcam to capture the moment live
                                        </p>
                                    </div>
                                </button>

                                {/* Upload Gallery Card */}
                                <button
                                    onClick={handleGalleryClick}
                                    className="group flex flex-col items-center gap-6 p-10 rounded-xl border-2 border-transparent bg-white dark:bg-[#2d2218] shadow-sm hover:border-primary hover:shadow-lg transition-all text-center"
                                >
                                    <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                                        <Upload size={48} />
                                    </div>
                                    <div>
                                        <p className="text-xl font-bold leading-normal mb-2">Upload from Gallery</p>
                                        <p className="text-[#9c7349] dark:text-[#c4a484] text-sm font-normal leading-relaxed">
                                            Select a pre-recorded video from your computer
                                        </p>
                                    </div>
                                </button>
                                <input
                                    type="file"
                                    accept="video/*"
                                    ref={fileInputRef}
                                    onChange={handleFileChange}
                                    hidden
                                />
                            </div>

                            {/* Bottom Constraint Note */}
                            <div className="flex flex-col items-center gap-4 mt-8">
                                <div className="flex items-center gap-2 px-4 py-2 bg-primary/5 rounded-full border border-primary/20">
                                    <Info size={16} className="text-primary" />
                                    <p className="text-sm font-medium text-[#1c140d] dark:text-white">
                                        Videos up to 45s. Keep it fun and authentic!
                                    </p>
                                </div>
                            </div>
                        </>
                    )}

                    {/* MODE: RECORD */}
                    {mode === 'record' && (
                        <div className="flex flex-col items-center gap-6">
                            <div className="relative w-full aspect-video bg-black rounded-2xl overflow-hidden shadow-lg border-2 border-[#f4ede7] dark:border-[#3d2e1f]">
                                <video ref={videoRef} autoPlay muted playsInline className="w-full h-full object-cover" />
                                {isRecording && (
                                    <div className="absolute top-4 right-4 flex items-center gap-2 bg-red-600 text-white px-3 py-1 rounded-full animate-pulse">
                                        <div className="size-2 bg-white rounded-full" />
                                        <span className="text-xs font-bold uppercase tracking-wider">REC</span>
                                    </div>
                                )}
                            </div>

                            <div className="flex gap-6 items-center">
                                {!isRecording ? (
                                    <button
                                        onClick={startRecording}
                                        className="size-16 rounded-full bg-red-600 border-4 border-white dark:border-[#2d2218] shadow-lg flex items-center justify-center hover:scale-105 transition-transform"
                                    >
                                        <Circle className="text-white fill-current" size={24} />
                                    </button>
                                ) : (
                                    <button
                                        onClick={stopRecording}
                                        className="size-16 rounded-full bg-white dark:bg-[#e8dbce] border-4 border-red-600 shadow-lg flex items-center justify-center hover:scale-105 transition-transform"
                                    >
                                        <Square className="text-red-600 fill-current" size={24} />
                                    </button>
                                )}
                            </div>
                            <button onClick={reset} className="text-[#9c7349] dark:text-[#c4a484] hover:underline text-sm font-medium">
                                Cancel & Return
                            </button>
                        </div>
                    )}

                    {/* MODE: PREVIEW */}
                    {mode === 'preview' && (
                        <div className="flex flex-col items-center gap-6">
                            <div className="w-full aspect-video bg-black rounded-2xl overflow-hidden shadow-lg border-2 border-[#f4ede7] dark:border-[#3d2e1f]">
                                <video src={previewUrl} controls className="w-full h-full object-contain" />
                            </div>

                            <div className="flex gap-4 w-full max-w-md">
                                <button
                                    onClick={reset}
                                    className="flex-1 flex items-center justify-center gap-2 py-3 px-6 rounded-xl border border-[#e8dbce] dark:border-[#3d2e1f] bg-white dark:bg-[#2d2218] font-bold text-[#1c140d] dark:text-white hover:bg-[#f4ede7] dark:hover:bg-[#3d2e21] transition-colors"
                                >
                                    <RotateCcw size={20} />
                                    Retake
                                </button>
                                <button
                                    onClick={() => navigate('/upload/success')}
                                    className="flex-1 flex items-center justify-center gap-2 py-3 px-6 rounded-xl bg-primary text-white font-bold shadow-sm hover:brightness-110 transition-all"
                                >
                                    <Check size={20} />
                                    Confirm Upload
                                </button>
                            </div>
                        </div>
                    )}

                </div>
            </main>

            {/* Footer */}
            <footer className="p-8 text-center text-xs opacity-50">
                © 2024 Race Start Reaction. Built for speed.
            </footer>
        </div>
    );
}
