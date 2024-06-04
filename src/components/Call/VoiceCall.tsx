import { IoMdCloseCircle } from "react-icons/io";
import { useAppContext } from "@/context/appContext";
import Container from "./Container";
import { useEffect } from "react";
export default function VoiceCall() {

    const { endCall, voiceCall, socket, userInfo } = useAppContext()
    useEffect(() => {
        if (voiceCall?.type === "out-going") {
            socket?.emit("outgoing-voice-call", {
                to: voiceCall?.currentChatUser?.id,
                from: {
                    id: userInfo?.id,
                    profilePicture: userInfo?.photoURL,
                    name: userInfo?.displayName,
                },
                callType: voiceCall?.callType,
                roomId: voiceCall?.roomId,
            })
        }
    }, [voiceCall])
    return <Container props={{ data: voiceCall }} />
}