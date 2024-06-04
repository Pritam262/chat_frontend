import { MdCall } from "react-icons/md";
import Avatar from "../Common/Avatar";
import { IoVideocam } from "react-icons/io5";
import { BiSearchAlt } from "react-icons/bi";
import { BsThreeDotsVertical } from "react-icons/bs";
import { useAppContext } from "@/context/appContext";
import { useState, MouseEvent } from "react";
import ContextMenu from "../Common/ContextMenu";

export default function ChatHeader() {
    const { currentChatUser, setMessagesSearch, onlineUsers, setVideoCall, setVoiceCall,  exitChat } = useAppContext();

    const [isContextMenuVisible, setIsContextMenuVisible] = useState(false);
    const [contextMenuCordinate, setContextMenuCordinates] = useState({ x: 0, y: 0 });


    const showContextMenu = (e: MouseEvent<HTMLElement>) => {
        setContextMenuCordinates({ x: e.pageX - 50, y: e.pageY + 20 })
        setIsContextMenuVisible(true);
    }

    const contextMenuOption = [
        {
            name: "Exit", callback: () => {
                exitChat();
            }
        },
    ]

    const handleVoiceCall = () => {
        currentChatUser && setVoiceCall({ currentChatUser, type: "out-going", callType: "voice", roomId: Date.now() });

        setVideoCall(undefined);
    };

    const handleVideoCall = () => {
        currentChatUser && setVideoCall({ currentChatUser, type: "out-going", callType: "video", roomId: Date.now() });

        setVoiceCall(undefined);
    };

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
                <MdCall className="text-panel-header-icon cursor-pointer text-xl" onClick={handleVoiceCall} />
                <IoVideocam className="text-panel-header-icon cursor-pointer text-xl" onClick={handleVideoCall} />
                <BiSearchAlt className="text-panel-header-icon cursor-pointer text-xl" onClick={() => setMessagesSearch(true)} />
                <div onClick={showContextMenu} id="context-opener" >

                    <BsThreeDotsVertical className="text-panel-header-icon cursor-pointer text-xl" />
                </div>

                {isContextMenuVisible && (
                    <ContextMenu props={
                        {
                            options: contextMenuOption,
                            cordinates: contextMenuCordinate,
                            contextMenu: isContextMenuVisible,
                            setContextMenu(value) {

                            },
                        }
                    } />
                )}
            </div>
        </>
        }
    </div>
}