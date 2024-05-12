'use client'
import { onAuthStateChanged } from "firebase/auth";
import ChatList from "./ChatList/ChatList";
import Empty from "./Empty";
import { firebaseAuth } from "@/utils/FirebaseConfig";
import { useEffect, useState } from "react";
import { useAppContext } from "@/context/appContext";
import axios from "axios";
import { CHECK_USER_ROUTE } from "@/utils/ApiRoutes";
import { useRouter } from "next/navigation";
import Chat from "./Chat/Chat";
export default function Main() {

    const router = useRouter();
    const { userInfo, setUserInfo, currentChatUser } = useAppContext();
    const [redirectLogin, setRedirectLogin] = useState(false)
    onAuthStateChanged(firebaseAuth, async (currentUser) => {
        if (!currentUser) setRedirectLogin(true);
        if (!userInfo && currentUser?.email) {
            const { data } = await axios.post(CHECK_USER_ROUTE, { email: currentUser?.email });
            // console.log("DATA", data)
            const { id, email, name, profilePicture } = data.data;
            setUserInfo({
                displayName: name,
                email,
                photoURL: profilePicture
            })

            if (!data.status) {
                router.push("/login");
            }
        }
    })


    useEffect(() => {
        if (redirectLogin) router.push("/login")
    }, [redirectLogin])
    return <>

        <div className="grid grid-cols-main h-screen w-screen max-h-screen max-w-full overflow-hidden">
            <ChatList />
            {currentChatUser ?
                <Chat /> : <Empty />}
        </div>
    </>
}