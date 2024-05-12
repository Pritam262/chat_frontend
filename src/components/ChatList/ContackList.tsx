import { FETCH_ALL_USER } from "@/utils/ApiRoutes"
import axios from "axios"
import { useEffect } from "react"
import { useState } from "react";
import { BiArrowBack, BiSearchAlt2 } from "react-icons/bi";
import { useAppContext } from "@/context/appContext";
import ChatListItem from "./ChatListItem";
interface Contacts {
    users: {}
}
interface UserList {
    id: string,
    name: string,
    email: string,
    profilePicture: string,
}[]
interface userInterface {
    id: string,
    name: string,
    email: string,
    about:string,
    profilePicture: string,
}


export default function ContactList() {
    const [contacts, setContacts] = useState<Contacts>();
    const { setContactPage } = useAppContext();
    useEffect(() => {

        const getData = async () => {
            try {

                const { data } = await axios.get(FETCH_ALL_USER);

                setContacts(data);
                contacts && console.log(contacts?.users)
            } catch (error) {
                console.error(error)
            }
        };
        getData();
    }, [])
    return <div className="h-full flex-col ">
        <div className="h-24 flex items-end px-3 py-4">
            <div className="flex items-center gap-12 text-white">
                <BiArrowBack className="cursor-pointer text-xl" onClick={() => setContactPage(false)} />
                <span className="">New Chat</span>
            </div>
        </div>

        <div className="bg-search-input-container-background  h-[90%] flex-auto overflow-auto custom-scrollbar ">

            <div className="flex py-3 items-center gap-3 h-14">

                <div className="bg-panel-header-background flex items-center gap-5 px-3 py-1 rounded-lg flex-grow mx-4">
                    <div>
                        <BiSearchAlt2 className="text-panel-header-icon cursor-pointer text-1" />
                    </div>
                    <div>
                        <input type="text" name="" id="" placeholder="Search Contacts" className="bg-transparent text-sm focus:outline-none text-white w-full" />
                    </div>
                </div>
            </div>
            {contacts && Object.entries(contacts.users).map(([initialLetter, userList]) => {
               
                return <div key={Date.now() + initialLetter}>
                    <div className="text-teal-light pl-10 py-5">
                        {initialLetter}
                    </div>
                  
                    {userList.map((contact: userInterface) => {
                        return (
                            <ChatListItem props={{ data: contact, isContactPage: true}} key={contact.id} />
                        )
                    })}
                </div>
            })}
        </div>


        {/* {contacts && <p key={contacts?.users?.H?.[0]?.id}>{contacts?.users?.H?.[0]?.name}</p>} */}
    </div>
}