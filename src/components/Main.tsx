'use client'
import { onAuthStateChanged } from "firebase/auth";
import ChatList from "./ChatList/ChatList";
import Empty from "./Empty";
import { firebaseAuth } from "@/utils/FirebaseConfig";
import { useEffect, useRef, useState } from "react";
import { useAppContext } from "@/context/appContext";
import axios from "axios";
import { CHECK_USER_ROUTE, GET_MESSAGES_ROUTE, HOST } from "@/utils/ApiRoutes";
import { useRouter } from "next/navigation";
import Chat from "./Chat/Chat";
import { io } from "socket.io-client"
import { Message, MessagesInterface } from "@/utils/types";

export default function Main() {
    const socket = io(HOST)
    // const socket = useRef();


    const router = useRouter();
    const { userInfo, setUserInfo, currentChatUser, setMessages, messages, setSocket } = useAppContext();
    const [redirectLogin, setRedirectLogin] = useState(false);

    onAuthStateChanged(firebaseAuth, async (currentUser) => {
        if (!currentUser) setRedirectLogin(true);
        if (!userInfo && currentUser?.email) {
            const { data } = await axios.post(CHECK_USER_ROUTE, { email: currentUser?.email });
            // console.log("DATA", data)
            const { id, email, name, profilePicture } = data.data;
            setUserInfo({
                id: id,
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


    useEffect(() => {
        if (userInfo) {

            //@ts-ignore
            // socket.current = io(HOST);

            //@ts-ignore
            // socket.current.emit("add-user", userInfo?.id)
            // socket.on("connect", () => {
            //     console.log("User connect", socket.id);

            // });
            socket.on("connect", () => {
                setSocket(socket)

                socket.emit("add-user", userInfo?.id);
                console.log("Connected", socket.id)
            })
        }
    }, [userInfo])

    useEffect(() => {
        socket.on("msg-recieve", (data: Message) => {
            // console.log("Recieve Message", data);

            setMessages((prevMessages) => {
                // Ensure prevMessages is an array before spreading
                if (!prevMessages) {
                    return [data]; // Return an array with just the new message if prevMessages is undefined
                }
                return [...prevMessages, data]; // Spread the existing messages and add the new data
            });

        })
    }, [socket])


    useEffect(() => {
        const getMessages = async () => {
            try {

                const { data } = await axios.get(`${GET_MESSAGES_ROUTE}/${userInfo?.id}/${currentChatUser?.id}`);
                // console.log(data)
                setMessages(data.data);

            } catch (error) {
                console.error(error)
            }
        }
        if (currentChatUser?.id != undefined) {

            getMessages();
        }

    }, [currentChatUser])




    return <>

        <div className="grid grid-cols-main h-screen w-screen max-h-screen max-w-full overflow-hidden">
            <ChatList />
            {currentChatUser ?
                <Chat /> : <Empty />}
        </div>
    </>
}