import { useState, useRef, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Upload, Video, Info, X, Circle, Square, RotateCcw, Check, Camera, Image as ImageIcon } from "lucide-react";
import { addSubmission } from "@/services/submissionService";
import { getChallengeById } from "@/services/challengeService";
import { motion } from "framer-motion";
import { AuthenticatedLayout } from "@/components/AuthenticatedLayout";

export default function UploadChallenge() {
    const navigate = useNavigate();
    const fileInputRef = useRef(null);
    const videoRef = useRef(null);
    const mediaRecorderRef = useRef(null);
    const [chunks, setChunks] = useState([]);
    const [isRecording, setIsRecording] = useState(false);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [mode, setMode] = useState("select"); // 'select', 'record', 'preview'
    const [selectedFile, setSelectedFile] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");
    const [fileWarning, setFileWarning] = useState("");
    const [selectedTags, setSelectedTags] = useState([]);

    const { challengeId } = useParams();
    const [challenge, setChallenge] = useState(null);

    useEffect(() => {
        const fetchChallenge = async () => {
            try {
                const response = await getChallengeById(challengeId);
                if (response.success) {
                    setChallenge(response.data);
                }
            } catch (error) {
                console.error("Error fetching challenge", error);
            }
        };
        if (challengeId) fetchChallenge();
    }, [challengeId]);

    const handleGalleryClick = () => {
        fileInputRef.current?.click();
    };

    const takePhoto = () => {
        if (!videoRef.current) return;

        const canvas = document.createElement("canvas");
        canvas.width = videoRef.current.videoWidth;
        canvas.height = videoRef.current.videoHeight;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(videoRef.current, 0, 0);

        canvas.toBlob((blob) => {
            const file = new File([blob], "captured-photo.jpg", { type: "image/jpeg" });
            const url = URL.createObjectURL(blob);
            setPreviewUrl(url);
            setSelectedFile(file);
            setFileWarning("");
            setMode("preview");

            // Stop camera
            const stream = videoRef.current?.srcObject;
            stream?.getTracks().forEach(track => track.stop());
        }, "image/jpeg");
    };

    const handleCameraClick = () => {
        startCamera();
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const isPhoto = challenge?.type === 'PHOTO';
            if (isPhoto && !file.type.startsWith('image/')) {
                setFileWarning("! warning : Only images are allowed for this challenge.");
            } else if (!isPhoto && !file.type.startsWith('video/')) {
                setFileWarning("! warning : Only videos are allowed for this challenge.");
            } else {
                setFileWarning("");
            }
            const url = URL.createObjectURL(file);
            setPreviewUrl(url);
            setSelectedFile(file);
            setMode("preview");
        }
    };

    const isPhotoChallenge = challenge?.type === 'PHOTO';

    const startCamera = async () => {
        setMode("record");
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: !isPhotoChallenge });
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
            const file = new File([blob], "recorded-video.webm", { type: "video/webm" });
            const url = URL.createObjectURL(blob);
            setPreviewUrl(url);
            setSelectedFile(file);
            setFileWarning("");
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
        setSelectedFile(null);
        setMode("select");
        setIsRecording(false);
        setChunks([]);
        setFileWarning("");
        setSelectedTags([]);
        if (videoRef.current && videoRef.current.srcObject) {
            videoRef.current.srcObject.getTracks().forEach(track => track.stop());
        }
    };

    const handleUpload = async () => {
        if (!selectedFile || !challengeId || !challenge) return;

        setIsUploading(true);
        const formData = new FormData();
        formData.append("challenge", challengeId);
        formData.append("image", selectedFile);

        // Append all selected tags
        selectedTags.forEach(tag => {
            formData.append("tags", tag);
        });

        try {
            const response = await addSubmission(formData);
            if (response.success) {
                setShowSuccess(true);
                setTimeout(() => {
                    navigate('/upload/success', {
                        state: {
                            location: challenge.weekend?.location || "Unknown Location",
                            challengeName: challenge.name,
                            endTime: challenge.endAt
                        }
                    });
                }, 2000);
            } else {
                // Handle failure (e.g. duplicate submission)
                setErrorMsg(response.message || "Upload failed");
                setTimeout(() => {
                    navigate(-1); // Go back after 3 seconds
                }, 3000);
            }
        } catch (error) {
            console.error("Upload error:", error);
            setErrorMsg(error.message || "Upload failed. Please try again.");
            setTimeout(() => {
                navigate(-1);
            }, 3000);
        } finally {
            setIsUploading(false);
        }
    };

    const rulesList = challenge?.rules ? (Array.isArray(challenge.rules) ? challenge.rules : challenge.rules.split('\n').filter(r => r.trim())) : [];

    return (
        <AuthenticatedLayout>
            {/* Success Popup Modal */}
            {showSuccess && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-white dark:bg-[#2d2218] rounded-2xl p-8 flex flex-col items-center gap-4 shadow-xl border border-primary/20 max-w-sm w-full mx-4 animate-in zoom-in-95 duration-300">
                        <div className="size-16 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-2">
                            <Check size={32} strokeWidth={3} />
                        </div>
                        <h3 className="text-xl font-bold text-center">Uploaded Successfully!</h3>
                        <p className="text-center text-sm opacity-70">Redirecting to success page...</p>
                    </div>
                </div>
            )}

            {/* Error Popup Modal */}
            {errorMsg && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-white dark:bg-[#2d2218] rounded-2xl p-8 flex flex-col items-center gap-4 shadow-xl border border-red-500/20 max-w-sm w-full mx-4 animate-in zoom-in-95 duration-300">
                        <div className="size-16 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center text-red-500 mb-2">
                            <X size={32} strokeWidth={3} />
                        </div>
                        <h3 className="text-xl font-bold text-center text-red-600 dark:text-red-400">Upload Failed</h3>
                        <p className="text-center text-sm opacity-70 px-4">{errorMsg}</p>
                        <p className="text-xs text-center opacity-50 mt-2">Redirecting back...</p>
                    </div>
                </div>
            )}

            <main className="flex-1 flex flex-col items-center py-4 px-4 w-full">
                {/* Header Actions */}
                <div className="w-full max-w-[800px] flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold leading-tight tracking-tight">{challenge ? challenge.name : "Challenge Upload"}</h2>
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center justify-center rounded-xl h-10 w-10 bg-[#f4ede7] dark:bg-[#3d2e1f] text-[#1c140d] dark:text-white hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
                    >
                        <X size={24} />
                    </button>
                </div>

                <div className="max-w-[800px] w-full flex flex-col gap-8">

                    {/* Progress Bar */}
                    <div className="flex flex-col gap-3">
                        <div className="flex gap-6 justify-between items-end">
                            <p className="text-base font-medium leading-normal">
                                {mode === 'select' ? 'Choosing Format' : mode === 'record' ? 'Recording' : 'Review'}
                            </p>
                            <p className="text-sm font-normal leading-normal opacity-70">
                                {mode === 'select' ? 'Step 1 of 3' : mode === 'record' ? 'Step 2 of 3' : 'Step 3 of 3'}
                            </p>
                        </div>
                        <div className="rounded-full bg-[#e8dbce] dark:bg-[#3d2e1f] h-2 w-full overflow-hidden">
                            <div className="h-full bg-primary transition-all duration-500" style={{ width: mode === 'select' ? "33%" : mode === 'record' ? "66%" : "100%" }}></div>
                        </div>
                    </div>

                    {/* Headline & Intro Section */}
                    {mode === 'select' && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-center"
                        >
                            <h1 className="text-4xl md:text-5xl font-black leading-tight pb-4 pt-4 tracking-tight">{challenge ? challenge.name : "Loading..."}</h1>
                            <p className="text-lg font-medium opacity-70 mb-8 max-w-2xl mx-auto leading-relaxed">{challenge ? challenge.description : "Preparing challenge..."}</p>

                            {rulesList.length > 0 && (
                                <div className="bg-primary/5 dark:bg-primary/10 p-6 rounded-2xl text-left border-l-4 border-primary max-w-2xl mx-auto shadow-sm">
                                    <h3 className="font-bold text-sm uppercase tracking-widest text-primary mb-4 flex items-center gap-2">
                                        <Info size={18} />
                                        Rules & Instructions
                                    </h3>
                                    <ul className="flex flex-col gap-3">
                                        {rulesList.map((rule, index) => (
                                            <motion.li
                                                key={index}
                                                initial={{ opacity: 0, x: -10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: index * 0.15 }}
                                                className="flex items-start gap-3 text-sm font-bold opacity-90 text-[#1c140d] dark:text-gray-100"
                                            >
                                                <span className="mt-1.5 size-1.5 rounded-full bg-primary shrink-0" />
                                                {rule}
                                            </motion.li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </motion.div>
                    )}

                    {/* MODE: SELECT */}
                    {mode === 'select' && (
                        <>
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                                className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4"
                            >
                                {/* Camera / Record Button */}
                                <button
                                    onClick={handleCameraClick}
                                    className="group flex flex-col items-center gap-6 p-10 rounded-2xl border-2 border-dashed border-[#e8dbce] dark:border-[#3d2e1f] bg-white dark:bg-[#2d2218] hover:border-primary hover:bg-primary/5 transition-all text-center relative overflow-hidden"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                                    <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300 relative z-10">
                                        {isPhotoChallenge ? <Camera size={48} /> : <Video size={48} />}
                                    </div>
                                    <div className="relative z-10">
                                        <p className="text-xl font-bold leading-normal mb-2">
                                            {isPhotoChallenge ? "Take Photo" : "Record Video"}
                                        </p>
                                        <p className="text-[#9c7349] dark:text-[#c4a484] text-sm font-medium leading-relaxed">
                                            {isPhotoChallenge ? "Capture the moment now" : "Record a clip directly"}
                                        </p>
                                    </div>
                                </button>

                                {/* Upload Gallery Button */}
                                <button
                                    onClick={handleGalleryClick}
                                    className="group flex flex-col items-center gap-6 p-10 rounded-2xl border-2 border-dashed border-[#e8dbce] dark:border-[#3d2e1f] bg-white dark:bg-[#2d2218] hover:border-primary hover:bg-primary/5 transition-all text-center relative overflow-hidden"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                                    <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-300 relative z-10">
                                        {isPhotoChallenge ? <ImageIcon size={48} /> : <Upload size={48} />}
                                    </div>
                                    <div className="relative z-10">
                                        <p className="text-xl font-bold leading-normal mb-2">
                                            {isPhotoChallenge ? "Upload Photo" : "Upload Video"}
                                        </p>
                                        <p className="text-[#9c7349] dark:text-[#c4a484] text-sm font-medium leading-relaxed">
                                            Select from your gallery
                                        </p>
                                    </div>
                                </button>

                                {/* Hidden Inputs */}
                                <input
                                    type="file"
                                    accept={isPhotoChallenge ? "image/*" : "video/*"}
                                    ref={fileInputRef}
                                    onChange={handleFileChange}
                                    hidden
                                />
                            </motion.div>

                            {/* Bottom Note */}
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.5 }}
                                className="flex flex-col items-center gap-4 mt-8"
                            >
                                <div className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-white/5 rounded-full">
                                    <Info size={16} className="text-gray-500" />
                                    <p className="text-sm font-medium text-gray-500">
                                        {isPhotoChallenge ? "Photos can be PNG or JPG." : "Videos up to 45s."} Keep it fun!
                                    </p>
                                </div>
                            </motion.div>
                        </>
                    )}

                    {/* MODE: RECORD (Only for Video) */}
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
                                {isPhotoChallenge ? (
                                    <button
                                        onClick={takePhoto}
                                        className="size-20 rounded-full bg-white dark:bg-[#e8dbce] border-4 border-primary shadow-xl flex items-center justify-center hover:scale-105 transition-transform active:scale-95"
                                    >
                                        <div className="size-16 rounded-full bg-primary" />
                                    </button>
                                ) : (
                                    !isRecording ? (
                                        <button
                                            onClick={startRecording}
                                            className="size-20 rounded-full bg-red-600 border-4 border-white dark:border-[#2d2218] shadow-xl flex items-center justify-center hover:scale-105 transition-transform"
                                        >
                                            <Circle className="text-white fill-current" size={32} />
                                        </button>
                                    ) : (
                                        <button
                                            onClick={stopRecording}
                                            className="size-20 rounded-full bg-white dark:bg-[#e8dbce] border-4 border-red-600 shadow-xl flex items-center justify-center hover:scale-105 transition-transform"
                                        >
                                            <Square className="text-red-600 fill-current" size={32} />
                                        </button>
                                    )
                                )}
                            </div>
                            <button onClick={reset} className="text-[#9c7349] dark:text-[#c4a484] hover:underline text-sm font-bold tracking-wide uppercase">
                                Cancel & Return
                            </button>
                        </div>
                    )}

                    {/* MODE: PREVIEW */}
                    {mode === 'preview' && (
                        <div className="flex flex-col items-center gap-6">
                            {previewUrl && (
                                <div className="w-full aspect-[4/3] md:aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl border-2 border-[#f4ede7] dark:border-[#3d2e1f]">
                                    {selectedFile?.type.startsWith('video') ? (
                                        <video src={previewUrl} controls className="w-full h-full object-contain" />
                                    ) : (
                                        <img src={previewUrl} alt="Preview" className="w-full h-full object-contain" />
                                    )}
                                </div>
                            )}

                            {fileWarning && (
                                <div className="w-full max-w-md bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 border border-red-500/20 rounded-xl p-4 flex items-center justify-center gap-2 font-medium">
                                    {fileWarning}
                                </div>
                            )}

                            {/* Optional Tags Selection */}
                            {challenge?.tags && challenge.tags.length > 0 && (
                                <div className="w-full max-w-md mt-2">
                                    <p className="text-sm font-bold text-center mb-3">Select Optional Tags</p>
                                    <div className="flex flex-wrap items-center justify-center gap-2">
                                        {challenge.tags.map((tag, tIdx) => {
                                            const isSelected = selectedTags.includes(tag);
                                            return (
                                                <button
                                                    key={`tag-${tIdx}`}
                                                    onClick={() => {
                                                        if (isSelected) {
                                                            setSelectedTags(prev => prev.filter(t => t !== tag));
                                                        } else {
                                                            setSelectedTags(prev => [...prev, tag]);
                                                        }
                                                    }}
                                                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${isSelected
                                                            ? 'bg-primary text-white shadow-md shadow-primary/20 scale-105'
                                                            : 'bg-[#e8dbce] dark:bg-[#3d2e1f] text-[#1c140d] dark:text-gray-200 hover:bg-[#d6c7b5] dark:hover:bg-[#4d3c2b]'
                                                        }`}
                                                >
                                                    {tag}
                                                </button>
                                            )
                                        })}
                                    </div>
                                </div>
                            )}

                            <div className="flex gap-4 w-full max-w-md mt-4">
                                <button
                                    onClick={reset}
                                    disabled={isUploading}
                                    className="flex-1 flex items-center justify-center gap-2 py-4 px-6 rounded-xl border border-[#e8dbce] dark:border-[#3d2e1f] bg-white dark:bg-[#2d2218] font-bold text-[#1c140d] dark:text-white hover:bg-[#f4ede7] dark:hover:bg-[#3d2e21] transition-colors disabled:opacity-50"
                                >
                                    <RotateCcw size={20} />
                                    Retake
                                </button>
                                <button
                                    onClick={handleUpload}
                                    disabled={isUploading || !!fileWarning}
                                    className="flex-1 flex items-center justify-center gap-2 py-4 px-6 rounded-xl bg-primary text-white font-bold shadow-lg shadow-primary/25 hover:brightness-110 hover:translate-y-[-2px] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isUploading ? (
                                        <span>Uploading...</span>
                                    ) : (
                                        <>
                                            <Check size={20} />
                                            Confirm Upload
                                        </>
                                    )}
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
        </AuthenticatedLayout>
    );
}
