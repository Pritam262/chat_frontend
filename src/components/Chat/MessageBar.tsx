import { BsEmojiSmile } from "react-icons/bs";
import { FaMicrophone } from "react-icons/fa";
import { ImAttachment } from "react-icons/im";
import { MdSend } from "react-icons/md";
import { useAppContext } from "@/context/appContext";
import React, { useState } from "react";
import axios from "axios";
import { ADD_MESSAGES_ROUTE } from "@/utils/ApiRoutes";
// import { decrypt, encrypt } from "@/lib/encryptAndDecryptText";
// import encryptText from "@/lib/encryptText";
export default function MessageBar() {
    const { userInfo, currentChatUser, encryptText } = useAppContext();
    const [message, setMessage] = useState('');
    const sendMessage = async () => {
        try {
            console.log(userInfo?.id)
            const { data } = await axios.post(ADD_MESSAGES_ROUTE, {
                to: currentChatUser?.id,
                from: userInfo?.id,
                message: encryptText(message),
            })
            
            console.log(data);
            setMessage("");
            console.log(`User send ${message}e to ${currentChatUser?.name}`);
        } catch (error) {
            console.error(error)
        }
    }
    return <div className="bg-panel-header-background h-20 px-4 flex items-center gap-6 relative">
        <>
            <div className="flex gap-6">
                <BsEmojiSmile className="text-panel-header-icon cursor-pointer text-xl" title="Emoji" />
                <ImAttachment className="text-panel-header-icon cursor-pointer text-xl" title="Attach File" />
            </div>
            <div className="w-full rounded-lg h-10 flex items-center">
                <input type="text" placeholder="Type a message" className="bg-input-background text-sm focus:outline-none text-white h-10 rounded-lg pl-5 px-5 py-4 w-full" onChange={(e: React.ChangeEvent<HTMLInputElement>) => setMessage(e.target.value)} value={message} />
            </div>
            <div className="flex w-10 items-center justify-center">
                <button>
                    <MdSend className="text-panel-header-icon cursor-pointer text-xl" title="Send" onClick={sendMessage} />
                </button>
                <button>
                    <FaMicrophone className="text-panel-header-icon cursor-pointer text-xl" title="Mic" />
                </button>
            </div>
        </>
    </div>
}