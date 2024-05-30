import { BsFillChatLeftTextFill, BsThreeDotsVertical } from "react-icons/bs";
import Avatar from "../Common/Avatar";
import { useAppContext } from "@/context/appContext";


export default function ChatListHeader() {
    const { userInfo, setIsContactPage } = useAppContext();

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
            <BsThreeDotsVertical className="text-panel-header-icon cursor-pointer text-xl" title="Menu" />

        </div>
    </div>

}