import { IoMdCloseCircle } from "react-icons/io";
import { useAppContext } from "@/context/appContext";
import Container from "./Container";
import { useEffect } from "react";

export default function VideoCall() {
    const {  videoCall, socket, userInfo, } = useAppContext();
    useEffect(() => {
    
        if (videoCall?.type === "out-going") {
            socket?.emit("outgoing-video-call", {
                to: videoCall?.currentChatUser?.id,
                from: {
                    id: userInfo?.id,
                    profilePicture: userInfo?.photoURL,
                    name: userInfo?.displayName,
                },
                callType: videoCall?.callType,
                roomId: videoCall?.roomId,
                offer:videoCall?.offer,
            })
        }
    }, [videoCall])

    return <Container props={{ data: videoCall }} />
}