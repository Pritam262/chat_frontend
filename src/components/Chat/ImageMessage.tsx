interface propsInterface {
    props: {
        message: Message,
    }
}
import { useAppContext } from "@/context/appContext"
import { HOST } from "@/utils/ApiRoutes";
import { calculateTime } from "@/utils/CalculateTime";
import { Message } from "@/utils/types";
import Image from "next/image";
import MessageStatus from "../Common/MessageStatus";
export default function ImageMessage({ props: { message } }: propsInterface) {
    const { userInfo, currentChatUser } = useAppContext();
    
    return <div className={`p-1 rounded-lg ${message?.senderId === currentChatUser?.id ? 'bg-incoming-background' : 'bg-outgoing-background'}`}>

        <div className="relative">
            <Image src={`${HOST}/${message?.message}`} width={300} height={300} alt="" className="rounded-lg" />
            <div className="absolute bottom-1 right-1 flex items-end gap-1">
                <span className="text-bubble-meta text-[11px] pt-1 min-w-fit">{calculateTime(message?.createdAt)}</span>
                <span>{message?.senderId === userInfo?.id && <MessageStatus props={{ messageStatus: message?.messageStatus }} />}</span>
            </div>
        </div>
    </div>
}