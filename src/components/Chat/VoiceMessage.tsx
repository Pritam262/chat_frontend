import { Message } from "@/utils/types"
import { useEffect, useRef, useState } from "react";
import WaveSurfer from "wavesurfer.js"
import { useAppContext } from "@/context/appContext";
import { HOST } from "@/utils/ApiRoutes";
import Avatar from "../Common/Avatar";
import { FaPause, FaPlay, FaStop } from "react-icons/fa";
import { calculateTime } from "@/utils/CalculateTime";
import MessageStatus from "../Common/MessageStatus";
interface propsInterface {
    props: {
        message: Message
    }
}


export default function VoiceMessage({ props: { message } }: propsInterface) {

    const { currentChatUser, userInfo } = useAppContext();
    const [audioMessage, setAudioMessage] = useState<HTMLAudioElement | undefined>();
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentPlayBackTime, setCurrentPlayBackTime] = useState(0);
    const [totalDuration, setTotalDuration] = useState<number | undefined>(0);

    const waveFormRef = useRef<HTMLDivElement | null>(null);
    const waveForm = useRef<WaveSurfer | null>(null);

    useEffect(() => {
        if (waveForm.current === null) {

            const container = waveFormRef.current;
            if (!container) {
                // Handle the case where waveFromRef.current is null
                return;
            }

            waveForm.current = WaveSurfer.create({
                container: container,
                waveColor: "#ccc",
                progressColor: "#4a9eff",
                cursorColor: "#7ae3c3",
                barWidth: 2,
                height: 30,

            });
            waveForm.current?.on("finish", () => {
                setIsPlaying(false);
            });
        }
        return () => {
            // waveForm.current?.destroy()
        }
    }, [])

    useEffect(() => {

        const audioUrl = `${HOST}/${message.message}`;
        const audio = new Audio(audioUrl);
        setAudioMessage(audio);
        waveForm.current?.load(audioUrl);
        waveForm.current?.on("ready", () => {
            setTotalDuration(waveForm.current?.getDuration())
        })
    }, [message.message])

    useEffect(() => {
        if (audioMessage) {

            const updatePlayBackTime = () => {
                setCurrentPlayBackTime(audioMessage.currentTime);
            };
            audioMessage.addEventListener("timeupdate", updatePlayBackTime);
            return () => {
                audioMessage.removeEventListener("timeupdate", updatePlayBackTime)
            }
        }
    }, [audioMessage])


    const handlePlayAudio = () => {
        if (audioMessage) {
            waveForm.current?.stop();
            waveForm.current?.play();
            audioMessage?.play();
            setIsPlaying(true)
        }
    }

    const handlePauseAudio = () => {

        waveForm.current?.stop();
        audioMessage?.pause();
        setIsPlaying(false);
        // setCurrentPlayBackTime(0);
    }


    const formatTime = (time: any) => {
        if (isNaN(time)) return "00.00";
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
    }


    // console.log(message)
    return <div className={`flex items-center text-white px-4 pr-2 py-4 text-sm rounded-md ${message?.senderId === currentChatUser?.id ? 'bg-incoming-background' : 'bg-outgoing-background'}`}>

        <div>
            <Avatar props={{ image: currentChatUser?.profilePicture || "", type: "lg", setImage: () => { } }} />
        </div>

        <div className="cursor-pointer text-xl">
            {!isPlaying ? <FaPlay onClick={handlePlayAudio} /> : <FaStop onClick={handlePauseAudio} />}
        </div>

        <div className="relative">
            <div className="w-60" ref={waveFormRef} />
            <div className="text-bubble-meta text-[11px] pt-1 flex justify-between absolute bottom-[-22px] w-full">
                <span>{formatTime(isPlaying ? currentPlayBackTime : totalDuration)}</span>
                <div className="flex gap-1 ">
                    <span>{calculateTime(message?.createdAt)}</span>
                    { message?.senderId === userInfo?.id && <MessageStatus props={{messageStatus:message?.messageStatus}} /> }
                </div>
            </div>
        </div>
    </div>
}