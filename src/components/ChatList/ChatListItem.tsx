import Image from "next/image"
import Avatar from "../Common/Avatar"
import { FaHeadphones, FaImage, FaVideo } from "react-icons/fa"
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
        totalUnreadMessages?: number,
        contact?: UserContact
    }
}

import { useAppContext } from "@/context/appContext";
import { UserContact } from "@/utils/types"
import { calculateTime } from "@/utils/CalculateTime"
import MessageStatus from "../Common/MessageStatus"



export default function ChatListItem({ props: { data, totalUnreadMessages, contact } }: PropsInterface) {

    const { currentChatUser, setCurrentChatUser, setIsContactPage, userInfo, isContactPage, decryptText, } = useAppContext();


    const handleContactClick = () => {
        if (currentChatUser?.id === data?.id) {
            setCurrentChatUser(data);
            setIsContactPage(false);
        } else {
            setCurrentChatUser(data);
            setIsContactPage(false);
        }

    }
    return <>
        {userInfo?.id !== data?.id && <div className={`flex cursor-pointer items-center hover:bg-background-default-hover`} onClick={handleContactClick}>
            <div className="min-w-fit px-5 py-3 pb-1">
                <Avatar props={{ type: "lg", image: data?.profilePicture, setImage: () => { } }} />
            </div>
            <div className="min-h-full flex  justify-center mt-3 pr-2 w-full">
                <div className="w-full flex flex-col">

                    <div className="flex justify-between flex-col">
                        <div className="flex justify-between">
                            <span className="text-white flex justify-between items-center">{data?.name}</span>
                            <span className={` text-[12px] text-icon-green ${contact?.totalUnreadMessages !== 0 && 'mr-4'}`}>{!isContactPage && contact && calculateTime(contact?.createdAt)}</span>
                        </div>
                        {/* {!isContactPage && contact &&  <div><span className="text-secondary line-clamb-1 text-sm ">{decryptText(contact?.message)}</span> </div>} */}

                    </div>

                    {/* Right Side */}
                    {/* <div className="flex border-b border-conversation-border pb-2 pt-1 p3-2">
                        <div className="flex justify-between w-full">
                            <span className="text-secondary line-clamb-1 text-sm ">{!isContactPage && contact ? <div><span className="text-secondary line-clamb-1 text-sm flex items-center">{contact?.type === "audio" ? <><FaHeadphones className="mr-2" />Audio</> : contact?.type === "video" ? <><FaVideo className="mr-2" />Video</> : contact?.type === "image" ? <><FaImage className="mr-2" />Image</> : decryptText(contact?.message).length > 80 ? `${decryptText(contact?.message).slice(0, 55)}....` : decryptText(contact?.message)}</span> </div> : userInfo?.id !== data?.id ? data?.about || "\u00A0" : "Message Yourself"}</span>

                            {contact && contact?.senderId === userInfo?.id && <MessageStatus props={{ messageStatus: contact?.messageStatus }} />}
                        </div>
                    </div> */}
                    <div className="flex border-b border-conversation-border pb-2 pt-1 p3-2">
                        <div className="flex justify-between w-full">
                            <div className="text-secondary line-clamb-1 text-sm ">{isContactPage ? data?.about || "\u00A0" : <div className="flex items-center gap-1 max-w-[200px] sm:max-w-[250px] md:max-w-[300px] lg:max-w[200px] xl:max-w-[300px]">

                                {contact && contact?.type === "text" && <span className="truncate">{decryptText(contact?.message)}</span>}

                                {contact && contact?.type === "audio" && <span className="flex gap-1 items-center"><FaHeadphones /> Audio</span>}

                                {contact && contact?.type === "image" && <span className="flex gap-1  items-center"><FaImage /> Image</span>}

                                {contact && contact?.type === "video" && <span className="flex gap-1 items-center"><FaVideo /> Video</span>}

                                

                            </div>}
                            </div>
                            {contact && contact?.senderId === userInfo?.id && <MessageStatus props={{ messageStatus: contact?.messageStatus }} />}

                            {/* {contact && contact?.senderId === userInfo?.id && <MessageStatus props={{ messageStatus: contact?.messageStatus }} />} */}
                        </div>
                    </div>
                </div>
                {!isContactPage && totalUnreadMessages !== 0 && <div className="px-2 w-max h-max bg-icon-green rounded-full text-sm">
                    {totalUnreadMessages}
                </div>}
            </div>

        </div>}
    </>
}