import { BiSearchAlt2 } from "react-icons/bi";
import { BsFilter } from "react-icons/bs";
import { useAppContext } from "@/context/appContext";
import React, { useState } from "react";
export default function SearchBar() {
    const {setFilterContacts, userContacts, setIsSearchChatActive,  } = useAppContext();
    const handleChangeFilterContacts = (e: React.ChangeEvent<HTMLInputElement>) => {


            if (e.target.value.length > 0) {
                setIsSearchChatActive(true);

                setFilterContacts(userContacts?.filter(contact => contact?.name.toLocaleLowerCase().includes(e.target.value.toLocaleLowerCase())));
            } else {
                setIsSearchChatActive(false);
            }
        
    }
    return <div className="bg-search-input-container-background flex py-3 pl-5 items-center gap-3 h-14 ">

        <div className="bg-panel-header-background flex items-center gap-5 px-3 py-1 rounded-lg flex-grow">
            <div>
                <BiSearchAlt2 className="text-panel-header-icon cursor-pointer text-1" />
            </div>
            <div>
                <input type="text" name="" id="" placeholder="Search or Start new Chat" className="bg-transparent text-sm focus:outline-none text-white w-full" onChange={handleChangeFilterContacts} />
            </div>
        </div>
        <div className="pr-5 pl-3">
            <BsFilter className="text-panel-header-icon cursor-pointer text-1" />
        </div>
    </div>
}