import Image from "next/image"
import Avatar from "../Common/Avatar"

interface PropsInterface {
    props: {
        data: {
            id: string,
            name: string,
            email: string,
            profilePicture: string,
            about: string
        },
        isContactPage: boolean,
    }
}

import { useAppContext } from "@/context/appContext";

export default function ChatListItem({ props: { data } }: PropsInterface) {

    const { currentChatUser, setCurrentChatUser, setContactPage } = useAppContext();

    const handleContactClick = () => {
        if (currentChatUser?.id === data?.id) {
            setCurrentChatUser(data);
            setContactPage(false);
        }else{
            setCurrentChatUser(data);
            setContactPage(false);
        }
      
    }
    return <div className={`flex cursor-pointer items-center hover:bg-background-default-hover`} onClick={handleContactClick}>
        <div className="min-w-fit px-5 py-3 pb-1">
            <Avatar props={{ type: "lg", image: data?.profilePicture, setImage: () => { } }} />
        </div>
        <div className="min-h-full flex flex-col justify-center mt-3 pr-2 w-full">
            <div className="flex justify-between">
                <div>
                    <span className="text-white">{data?.name}</span>
                </div>
            </div>
            <div className="flex border-b border-conversation-border pb-2 pt-1 p3-2">
                <div className="flex justify-between w-full">
                    <span className="text-secondary line-clamb-1 text-sm ">{data?.about || "\u00A0"}</span>
                </div>
            </div>
        </div>
    </div>
}