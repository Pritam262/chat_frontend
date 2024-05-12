import { useEffect, useState } from "react";
import ChatListHeader from "./ChatListHeader";
import List from "./List";
import SearchBar from "./SearchBar";
import { useAppContext } from "@/context/appContext";
import ContactList from "./ContackList";
export default function ChatList() {
    const { contactPage } = useAppContext();
    const [pageType, setPageType] = useState("default");
    useEffect(() => {
        if (contactPage) {
            setPageType("all-contacts")
        } else {
            setPageType("default")
        }
    }, [contactPage])
    return <div className="bg-panel-header-background flex flex-col max-h-screen z-20">
        {pageType === "default" &&

            <>
                <ChatListHeader />
                <SearchBar />
                <List />
            </>}
        {
            pageType === "all-contacts" && <ContactList />
        }
    </div>
}