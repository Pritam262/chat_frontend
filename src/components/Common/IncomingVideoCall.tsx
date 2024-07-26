import { useAppContext } from "@/context/appContext";
import { HOST } from "@/utils/ApiRoutes";
import Image from "next/image";
import PeerService from "../../service/peer";
export default function IncomingVideoCall() {

    const { incomingVideoCall, socket, endCall, setVideoCall, videoCall, setIncomingVideoCall } = useAppContext();

    const acceptCall = async () => {

        // Error ts
        console.log(incomingVideoCall);
        const ans = await PeerService.getAnswer(incomingVideoCall?.offer);
        
        incomingVideoCall && setVideoCall({ currentChatUser: incomingVideoCall?.from, callType: "video", type: "in-coming", roomId: incomingVideoCall?.roomId, });
        
        setIncomingVideoCall(undefined);


        socket?.emit("accept-incoming-call", { id: incomingVideoCall?.from?.id, ans });
    };
    const rejectCall = () => {
        socket?.emit("reject-video-call", incomingVideoCall);
        endCall();
    }

    // videoCall && console.log(videoCall, "Video call on Accept");

    return <div className="h-24 w-82 fixed bottom-8 mb-0 right-6 z-15 rounded-sm flex gap-5 items-center justify-start bg-conversation-panel-background text-white drop-shadow-2xl border-icon-green border-2 py-14 z-[50]">
        <div><Image src={String(incomingVideoCall?.from?.profilePicture)} width={70} height={70} alt="avatar" priority className="rounded-full" /></div>
        <div>
            <div>
                {incomingVideoCall?.from?.name}
                <div className="text-xs">Incoming Video Call</div>
                <div className="flex gap-2 mt-2 ">
                    <button className="bg-red-500 p-1 px-3 text-sm rounded-full" onClick={rejectCall}>Reject</button>

                    <button className="bg-green-500 p-1 px-3 text-sm rounded-full" onClick={acceptCall}>Accept</button>
                </div>
            </div>
        </div>
    </div>
}