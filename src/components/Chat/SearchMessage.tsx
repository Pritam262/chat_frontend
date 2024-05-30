import { IoClose } from "react-icons/io5"
import { useAppContext } from "@/context/appContext"
import { BiSearchAlt2 } from "react-icons/bi";
import React, { useEffect, useState } from "react";
import { Message } from "@/utils/types";
import { calculateTime } from "@/utils/CalculateTime";

interface propsInterface {
    props: {

    }
}
export default function SearchMessage({ props: { } }: propsInterface) {
    const { setMessagesSearch, currentChatUser, messages, decryptText } = useAppContext();
    const [searchTerm, setSearchTerm] = useState("");
    const [searchMessages, setSearchMessages] = useState<Message[] | undefined>([]);


    useEffect(() => {
        if (searchTerm) {
            setSearchMessages(messages?.filter(message => message?.type === "text" && decryptText(message?.message).toLowerCase().includes(searchTerm.toLowerCase())))

            console.log(messages?.filter(message => message?.type === "text" && decryptText(message?.message).toLowerCase().includes(searchTerm.toLowerCase())))
        } else {
            setSearchMessages([])
        }
    }, [searchTerm])
    return <div className="border-conversation-border border w-full bg-conversation-panel-background flex flex-col z-10 max-h-screen ">

        <div className="h-16 px-4 py-5 flex gap-10 items-center bg-panel-header-background text-primary-strong">
            <IoClose className="cursor-pointer text-icon-lighter text-2xl" onClickCapture={() => setMessagesSearch(false)} />
            <span>Search Messages</span>
        </div>
        <div className="overflow-auto custom-scrollbar h-full">
            <div className="flex items-center flex-col w-full">
                <div className="flex px-5 items-center gap-3 h-14 w-full">

                    <div className="bg-panel-header-background flex items-center gap-5 px-3 py-1 rounded-lg flex-grow">
                        <div>
                            <BiSearchAlt2 className="text-panel-header-icon cursor-pointer text-1" />
                        </div>
                        <div>
                            <input type="text" name="" id="" placeholder="Search Messages" className="bg-transparent text-sm focus:outline-none text-white w-full" value={searchTerm} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)} />
                        </div>
                    </div>
                </div>

                <span className="mt-10 text-secondary ">
                    {!searchTerm.length && `Search for messages with ${currentChatUser?.name}`}
                </span>
            </div>

            <div className="flex justify-center h-full flex-col">
                {searchTerm.length > 0 && !searchMessages?.length && <span className="text-secondary w-full flex justify-center ">
                    No messages found
                </span>}


                <div className="flex flex-col w-full h-full">
                    {searchMessages && searchMessages?.map(message => <div className="flex cursor-pointer flex-col justify-center hover:bg-background-default-hover w-full px-5 border-b-[0.1px] border-secondary py-5" key={message?.id}>
                        <div className="text-sm text-secondary ">{calculateTime(message?.createdAt)}</div>
                        <div className="text-icon-green">
                            {decryptText(message?.message)}
                        </div>
                    </div>)}
                </div>
            </div>
        </div>
    </div>
}