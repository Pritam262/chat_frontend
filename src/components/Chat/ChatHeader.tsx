import { MdCall } from "react-icons/md";
import Avatar from "../Common/Avatar";
import { IoVideocam } from "react-icons/io5";
import { BiSearchAlt } from "react-icons/bi";
import { BsThreeDotsVertical } from "react-icons/bs";
import { useAppContext } from "@/context/appContext";

export default function ChatHeader() {
    const { currentChatUser, setMessagesSearch, onlineUsers } = useAppContext();
    return <div className="h-16 px-4 py-3 flex justify-between items-center bg-panel-header-background z-100">
        {currentChatUser && <>
            <div className="flex items-center-justify-center gap-6">
                <Avatar props={{ type: "sm", image: currentChatUser?.profilePicture, setImage: () => "" }} />
                <div className="flex flex-col">
                    <span className="text-primary-strong">{currentChatUser?.name}</span>
                    <span className="text-secondary text-sm">{onlineUsers?.includes(currentChatUser?.id) ? "Online" : "Ofline"}</span>
                </div>
            </div>
            <div className="flex gap-6">
                <MdCall className="text-panel-header-icon cursor-pointer text-xl" />
                <IoVideocam className="text-panel-header-icon cursor-pointer text-xl" />
                <BiSearchAlt className="text-panel-header-icon cursor-pointer text-xl" onClick={() => setMessagesSearch(true)} />
                <BsThreeDotsVertical className="text-panel-header-icon cursor-pointer text-xl" />
            </div>
        </>
        }
    </div>
}