import { useAppContext } from "@/context/appContext"
import { GET_INITIAL_CONTACTS_ROUTE } from "@/utils/ApiRoutes";
import axios from "axios";
import { useEffect } from "react";
import ChatListItem from "./ChatListItem";
export default function List() {
    const { userInfo, setUserContacts, setOnlineUsers, userContacts, isSearchChatActive, filterContacts } = useAppContext();
    useEffect(() => {
        const getContacts = async () => {
            try {
                const { data: { users, onlineUsers } } = await axios.get(`${GET_INITIAL_CONTACTS_ROUTE}/${userInfo?.id}`)
                // console.log("Users", users);
                // console.log("OnlineUsers", onlineUsers);
                setUserContacts(users);
                setOnlineUsers(onlineUsers);
            } catch (error) {
                console.error(error)
            }
        };
        if (userInfo?.id) getContacts();
    }, [userInfo])
    return <div className="bg-search-input-container-background flex-auto overflow-auto max-h-full custom-scrollbar">
        {isSearchChatActive ? filterContacts?.map((contact, index) => <ChatListItem props={{ data: contact, isContactPage: false, totalUnreadMessages: contact?.totalUnreadMessages, contact: contact }} key={index} />) : userContacts?.map((contact, index) => <ChatListItem props={{ data: contact, isContactPage: false, totalUnreadMessages: contact?.totalUnreadMessages, contact: contact }} key={index} />)}
    </div>
}