import { BsFillChatLeftTextFill, BsThreeDotsVertical } from "react-icons/bs";
import Avatar from "../Common/Avatar";
import { useAppContext } from "@/context/appContext";
import { useState, MouseEvent } from "react";
import ContextMenu from "../Common/ContextMenu";
import { useRouter } from "next/navigation"
export default function ChatListHeader() {
    const { userInfo, setIsContactPage } = useAppContext();
    const router = useRouter();

    const [isContextMenuVisible, setIsContextMenuVisible] = useState(false);
    const [contextMenuCordinate, setContextMenuCordinates] = useState({ x: 0, y: 0 });


    const showContextMenu = (e: MouseEvent<HTMLElement>) => {
        setContextMenuCordinates({ x: e.pageX, y: e.pageY })
        setIsContextMenuVisible(true);
    }

    const contextMenuOption = [
        {
            name: "Logout", callback: () => {
                setIsContextMenuVisible(false);
                router.push("/logout")
            }
        },
    ]

    const handleAllContactPage = async () => {
        setIsContactPage((prev) => !prev);


    }
    return <div className="h-16 px-4 py-8 flex justify-between items-center">

        <div className="cursor-pointer">
            <Avatar props={{
                type: "sm",
                image: userInfo?.photoURL || "",
                setImage: () => ""
            }} />
        </div>
        <div className="flex gap-6">
            <BsFillChatLeftTextFill className="text-panel-header-icon cursor-pointer text-xl" title="New Chat" onClick={handleAllContactPage} />
            <div onClick={showContextMenu} id="context-opener">

                <BsThreeDotsVertical className="text-panel-header-icon cursor-pointer text-xl" title="Menu" />
            </div>

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

}