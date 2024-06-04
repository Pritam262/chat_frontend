import { FETCH_ALL_USER } from "@/utils/ApiRoutes"
import axios from "axios"
import { useEffect } from "react"
import { useState } from "react";
import { BiArrowBack, BiSearchAlt2 } from "react-icons/bi";
import { useAppContext } from "@/context/appContext";
import ChatListItem from "./ChatListItem";
import Avatar from "../Common/Avatar";
// interface Contacts {
//     users: {}
// }
// interface Contacts {

// }
interface Contacts {
    name: string; // Add properties to the Contacts interface
    // ... other properties
  }
  
  interface FilteredContacts {
    [key: string]: Contacts[]; // Key can be any string, value is an array of Contacts
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
    about: string,
    profilePicture: string,
}


export default function ContactList() {
    const [contacts, setContacts] = useState<FilteredContacts>({});
    const [searchTerm, setSearchTerm] = useState("");
    const [searchContacts, setSearchContacts] = useState<FilteredContacts>({});
    const { setIsContactPage, setCurrentChatUser, userInfo } = useAppContext();


    const handleContactClick = () => {
        setCurrentChatUser({ id: String(userInfo?.id), name: String(userInfo?.displayName), email: String(userInfo?.email), about: String(userInfo?.about), profilePicture: String(userInfo?.photoURL) });
        setIsContactPage(false);

    }
    useEffect(() => {

        const getData = async () => {
            try {

                const { data: { users } } = await axios.get(FETCH_ALL_USER);

                setContacts(users);
                setSearchContacts(users);

            } catch (error) {
                console.error(error)
            }
        };
        getData();
    }, [])


    useEffect(() => {
        if (searchTerm.length) {
            const filteredData: FilteredContacts = {};
            contacts && Object.keys(contacts).forEach((key: string) => {
              filteredData[key] = contacts[key].filter((obj: Contacts) => // Type obj as Contacts
                obj.name.toLocaleLowerCase().includes(searchTerm.toLocaleLowerCase())
              );
            });
            setSearchContacts(filteredData);
        } else {
            setSearchContacts(contacts)
        }
    }, [searchTerm])


    return <div className="h-full flex-col ">
        <div className="h-24 flex items-end px-3 py-4">
            <div className="flex items-center gap-12 text-white">
                <BiArrowBack className="cursor-pointer text-xl" onClick={() => setIsContactPage(false)} />
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
                        <input type="text" name="" id="" placeholder="Search Contacts" className="bg-transparent text-sm focus:outline-none text-white w-full" onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)} value={searchTerm} />
                    </div>
                </div>
            </div>

            <div className="min-w-fit h-16 px-5 py-3 pb-1 text-teal-light flex items-center"><span>CONTACTS ON WHATSAPP</span></div>

            {userInfo && <div className={`flex cursor-pointer items-center hover:bg-background-default-hover`} onClick={handleContactClick}>
                <div className="min-w-fit px-5 py-3 pb-1">
                    <Avatar props={{ type: "lg", image: userInfo?.photoURL, setImage: () => { } }} />
                </div>
                <div className="min-h-full flex flex-col justify-center mt-3 pr-2 w-full">
                    <div className="flex justify-between flex-col">
                        <div>
                            <span className="text-white">{userInfo?.displayName}</span>
                        </div>
                        <div>
                            {/* <span className="text-secondary line-clamb-1 text-sm ">{userInfo?.id === data?.id && "Self"}</span> */}
                        </div>
                    </div>
                    <div className="flex border-b border-conversation-border pb-2 pt-1 p3-2">
                        <div className="flex justify-between w-full">
                            <span className="text-secondary line-clamb-1 text-sm ">Message Yourself</span>
                        </div>
                    </div>
                </div>
            </div>}

            {contacts && Object.entries(searchContacts).map(([initialLetter, userList]) => {

                return <div key={Date.now() + initialLetter}>
                    {(userList as userInterface[]).length > 0 && <div className="text-teal-light pl-10 py-5">
                        {initialLetter}
                    </div>}

                    {/* to solve  this error "userList' is of type 'unknown'.ts(18046) (parameter) userList: unknown" */}
                    {(userList as userInterface[]).map((contact: userInterface) => {
                        return (
                            <ChatListItem props={{ data: contact, isContactPage: true }} key={contact.id} />
                        )
                    })}
                </div>
            })}
        </div>


        {/* {contacts && <p key={contacts?.users?.H?.[0]?.id}>{contacts?.users?.H?.[0]?.name}</p>} */}
    </div>
}