import { useAppContext } from "@/context/appContext";
import { HOST } from "@/utils/ApiRoutes";
import Image from "next/image";
import Avatar from "./Avatar";
import PeerService from "../../service/peer";
export default function IncomingVoiceCall() {
    const { incomingVoiceCall, socket, endCall, setVoiceCall, voiceCall, setIncomingVoiceCall } = useAppContext();
    const acceptCall = async () => {

        const ans = await PeerService.getAnswer(incomingVoiceCall?.offer)

        socket?.emit("accept-incoming-call", { id: incomingVoiceCall?.from?.id, ans });

        incomingVoiceCall && setVoiceCall({ currentChatUser: incomingVoiceCall?.from && incomingVoiceCall.from, callType: "voice", type: "in-coming", roomId: incomingVoiceCall?.roomId});
        setIncomingVoiceCall(undefined);

    };
    const rejectCall = () => {
        socket?.emit("reject-video-call", incomingVoiceCall);
        endCall();
    }


    return <div className="h-24 w-82 fixed bottom-8 mb-0 right-6 z-15 rounded-sm flex gap-5 items-center justify-start bg-conversation-panel-background text-white drop-shadow-2xl border-icon-green border-2 py-14 z-[50]">
        <div><Image src={String(incomingVoiceCall?.from?.profilePicture)} width={70} height={70} alt="avatar" priority className="rounded-full" /></div>
        <div>
            <div>
                {incomingVoiceCall?.from?.name}
                <div className="text-xs">Incoming Voice Call</div>
                <div className="flex gap-2 mt-2 ">
                    <button className="bg-red-500 p-1 px-3 text-sm rounded-full" onClick={rejectCall}>Reject</button>

                    <button className="bg-green-500 p-1 px-3 text-sm rounded-full" onClick={acceptCall}>Accept</button>
                </div>
            </div>
        </div>
    </div>
}