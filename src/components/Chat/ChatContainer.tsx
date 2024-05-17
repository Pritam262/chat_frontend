import { useAppContext } from "@/context/appContext"
import { calculateTime } from "@/utils/CalculateTime";
import MessageStatus from "../Common/MessageStatus";


export default function ChatContainer() {
    const { messages, currentChatUser, userInfo, decryptText, setMessages } = useAppContext();

    // console.log("messages on ChatContainer", messages)
    // decryptText(message?.message)
    return <div className=" h-full w-full relative flex-grow overflow-auto custom-scrollbar">
        <div className="bg-chat-background opacity-5 bg-fixed w-full h-full fixed"></div>
        <div className="mx-5 my-6 relative bottom-0  z-40 left-0 ">

            <div className="flex w-full">
                <div className="flex flex-col justify-end w-full gap-1 overflow-auto" >
                    {messages && messages?.map((message, index) => (

                        <div key={message?.id} className={`flex  ${message.senderId === currentChatUser?.id ? "justify-start" : "justify-end "}`}>
                            {message.type === "text" && (
                                <div className={`text-white px-2 py-[5px] text-sm rounded-md flex gap-2 items-end max-w-[45%] ${message.senderId === currentChatUser?.id ? "bg-incoming-background" : "bg-outgoing-background"}`}>
                                    <span className="break-all">{decryptText(message?.message)}</span>
                                    <div className="flex gap-1 items-end">
                                        <span className="text-bubble-meta text-[11px] pt-1 min-w-fit">{calculateTime(message?.createdAt)}</span>
                                        <span>{message?.senderId === userInfo?.id && <MessageStatus props={{ messageStatus: message?.messageStatus }} />}</span></div>
                                </div>
                            )}
                        </div>
                    )


                    )}
                </div>
            </div>

        </div>
    </div>
}