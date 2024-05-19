import { useEffect, useRef, useState } from "react";
import { FaMicrophone, FaPauseCircle, FaPlay, FaStop, FaTrash } from "react-icons/fa";
import { useAppContext } from "@/context/appContext";
import { MdSend } from "react-icons/md";
import WaveSurfer from "wavesurfer.js"
interface PropsInterface {
    props: {
        hideAudioRecorder: (value: boolean) => void;
    }
}
export default function CaptureAudio({ props: { hideAudioRecorder } }: PropsInterface) {
    const { socket, userInfo, currentChatUser } = useAppContext();

    const [isRecording, setIsRecording] = useState(false);
    const [recordedAudio, setRecordedAudio] = useState<HTMLAudioElement | undefined>();
    const [waveForm, setWaveForm] = useState<WaveSurfer | null>(null);
    const [recordingDuration, setRecordingDuratuin] = useState<number>(0);
    const [currentPlayBackTime, setCurrentPlayBackTime] = useState(0);
    const [totalDuration, setTotalDuration] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [renderAudio, setRenderAudio] = useState<File | null>(null);

    const audioRef = useRef<HTMLAudioElement>(null);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const waveFromRef = useRef<HTMLDivElement | null>(null);


    useEffect(() => {

        let interval: string | number | NodeJS.Timeout | undefined;
        if (isRecording) {
            interval = setInterval(() => {
                setRecordingDuratuin(prevDuration => {
                    setTotalDuration(prevDuration + 1);
                    return prevDuration + 1;
                });
            }, 1000)
        }
        return () => {
            clearInterval(interval)
        }
    }, [isRecording])


    useEffect(() => {
        const container = waveFromRef.current;
        if (!container) {
            // Handle the case where waveFromRef.current is null
            return;
        }

        const waveSurfer = WaveSurfer.create({
            container: container,
            waveColor: "#ccc",
            progressColor: "#4a9eff",
            cursorColor: "#7ae3c3",
            barWidth: 2,
            height: 30,

        });
        setWaveForm(waveSurfer);
        waveSurfer.on("finish", () => {
            setIsPlaying(false);
        });
        return () => {
            waveSurfer.destroy()
        }
    }, [])


    const handleStartRecording = () => {
        setRecordingDuratuin(0);
        setCurrentPlayBackTime(0);
        setTotalDuration(0);
        setIsRecording(true);

        // Check if getUserMedia is available
        // if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        //     console.error("getUserMedia is not supported in this browser.");
        //     return;
        // }

        // let stream: MediaStream | undefined;
        // try {
        //     if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        //         stream = await navigator.mediaDevices.getUserMedia({
        //             video: false,
        //             audio: true,
        //         });

        //         const mediaRecorder = new MediaRecorder(stream);
        //         mediaRecorderRef.current = mediaRecorder;
        //         // audioRef?.current.srcObject = stream;
        //         if (audioRef.current) {
        //             audioRef.current.srcObject = stream;
        //         } else {
        //             console.error("Audio element reference is null.");
        //         }



        //         const chunks: BlobPart[] = [];
        //         mediaRecorder.onstop = () => {
        //             const blob = new Blob(chunks, { type: "audio/ogg; codecs=opus" });
        //             const audioUrl = URL.createObjectURL(blob);
        //             const audio = new Audio(audioUrl);
        //             setRecordedAudio(audio);
        //             waveForm?.load(audioUrl);
        //         }
        //     } else {
        //         alert("Mic is not supported in this browser")
        //         // Provide fallback mechanism or inform users about browser compatibility
        //     }
        // } catch (error) {
        //     console.error('Error accessing media devices:', error);
        //     // Handle errors
        // }

        navigator.mediaDevices.getUserMedia({
            video: false,
            audio: true,
        }).then((stream: MediaStream) => {
            const mediaRecorder = new MediaRecorder(stream);
            mediaRecorderRef.current = mediaRecorder;
            // audioRef?.current.srcObject = stream;
            if (audioRef.current) {
                audioRef.current.srcObject = stream;
            } else {
                console.error("Audio element reference is null.");
            }



            const chunks: BlobPart[] = [];
            mediaRecorder.ondataavailable = (e) => chunks.push(e.data);

            mediaRecorder.onstop = () => {
                const blob = new Blob(chunks, { type: "audio/ogg; codecs=opus" });
                console.log("BLOB", blob);

                const audioUrl = URL.createObjectURL(blob);
                const audio = new Audio(audioUrl);
                setRecordedAudio(audio);
                waveForm?.load(audioUrl);
            }

            mediaRecorder.start();

        }).catch(error => {
            console.error('Error accessing microphone:', error)
        })
    }


    useEffect(() => {

        if (waveForm) handleStartRecording();
    }, [waveForm])



    useEffect(() => {
        if (recordedAudio) {
            const updatePlayBackTime = () => {
                setCurrentPlayBackTime(recordedAudio.currentTime);
                console.log("Record audio on useEffect", recordedAudio)
            };
            recordedAudio.addEventListener("timeupdate", updatePlayBackTime);
            return () => {
                recordedAudio.removeEventListener("timeupdate", updatePlayBackTime)
            }
        }
    }, [recordedAudio])


    const handleStopRecording = () => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
            waveForm?.stop();

            const audiochunks: any = [];
            mediaRecorderRef.current.addEventListener("dataavailable", (event) => {
                audiochunks.push(event.data);
            });
            mediaRecorderRef.current.addEventListener("stop", () => {
                const audioBlob = new Blob(audiochunks, { type: "audio/mp3" });
                const audioFile = new File([audioBlob], "recording.mp3");
                setRenderAudio(audioFile);
            })
        }
    }



    const handlePlayRecorded = () => {
        if (recordedAudio) {
            waveForm?.stop();
            waveForm?.play();
            recordedAudio?.play();
            setIsPlaying(true)
        }
    }
    const handlePauseRecording = () => {
        console.log("Handle Pause");

        waveForm?.stop();
        recordedAudio?.pause();
        setIsPlaying(false);
        // setIsRecording(false);
    }
    const sendRecording = async () => {

    }

    const formatTime = (time: any) => {
        if (isNaN(time)) return "00.00";
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
    }


    return (<div className="flex text-2xl  w-full justify-end items-center">
        <div className="pt-1">
            <FaTrash className="text-panel-header-icon" onClick={() => { hideAudioRecorder(false); setIsRecording(false) }} />
        </div>
        <div className="mx-4 py-2 px-4 text-white text-lg flex gap-3 items-center justify-center bg-search-input-container-background rounded-full drop-shadow-lg">
            {isRecording ? (<div className="text-red-500 animate-pulse 2-60 text-center">Recording <span>{recordingDuration}s</span> </div>) : (
                <div>{recordedAudio && (
                    <>
                        {!isPlaying ?
                            <FaPlay onClick={handlePlayRecorded} /> :
                            <FaStop onClick={handleStopRecording} />
                        }
                    </>)}
                </div>
            )}

            <div className="w-60 " ref={waveFromRef} hidden={isRecording} />

            {recordedAudio && isPlaying && (
                <span>{formatTime(currentPlayBackTime)}</span>
            )}

            {recordedAudio && !isPlaying && (
                <span> {formatTime(totalDuration)}</span>
            )}

            <audio ref={audioRef} hidden />
        </div>

        <div className="mr-4">
            {!isRecording ? (<FaMicrophone className="text-red-500" onClick={handleStartRecording} />) : (<FaPauseCircle className="text-red-500 cursor-pointer" onClick={handlePauseRecording} />
            )}
        </div>

        <div><MdSend className="text-panel-header-icon cursor-pointer mr-4" title="Send" onClick={sendRecording} />
        </div>

    </div>
    )
}