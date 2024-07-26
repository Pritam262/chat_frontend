'use client'
import { onAuthStateChanged } from "firebase/auth";
import ChatList from "./ChatList/ChatList";
import Empty from "./Empty";
import { firebaseAuth } from "@/utils/FirebaseConfig";
import { useEffect, useMemo, useRef, useState } from "react";
import { useAppContext } from "@/context/appContext";
import axios from "axios";
import { CHECK_USER_ROUTE, GET_MESSAGES_ROUTE, HOST } from "@/utils/ApiRoutes";
import { useRouter } from "next/navigation";
import Chat from "./Chat/Chat";
import { io } from "socket.io-client"
import { Message } from "@/utils/types";
import SearchMessage from "./Chat/SearchMessage";
import VideoCall from "./Call/VideoCall";
import VoiceCall from "./Call/VoiceCall";
import IncomingVideoCall from "./Common/IncomingVideoCall";
import IncomingVoiceCall from "./Common/IncomingVoiceCall";

export default function Main() {
    const socket = io(HOST)

    // const socket = useRef();


    const router = useRouter();
    const { userInfo, setUserInfo, currentChatUser, setMessages, messages, setSocket, messagesSearch, videoCall, voiceCall, incomingVideoCall, incomingVoiceCall, setIncomingVoiceCall, setIncomingVideoCall, endCall, setOnlineUsers, setIsCallEnd } = useAppContext();
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
            
            socket.on("connect", () => {
                setSocket(socket)

                socket.emit("add-user", userInfo?.id);
                // console.log("Connected", socket.id)
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

        });



        socket.on("incoming-voice-call", ({ from, roomId, callType, offer }) => {
            // console.log({ from, roomId, callType, offer });
            setIncomingVoiceCall({ from, roomId, callType, offer });
        })


        socket.on("incoming-video-call", ({ from, roomId, callType, offer }) => {
            // console.log({ from, roomId, callType, offer });
            setIncomingVideoCall({ from, roomId, callType, offer });
        })


        socket.on("voice-call-rejected", () => {
            // console.log("Voice call rejected");
            endCall();
            setIsCallEnd(true);
        })



        socket.on("video-call-rejected", () => {
            // console.log("Video call rejected from backend");
            endCall();
            setIsCallEnd(true);
        })


        // GET ONLINE USER

        socket?.on("online-user", ({ onlineUsers }) => {
            setOnlineUsers(onlineUsers);
            // console.log(onlineUsers);
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
        {incomingVideoCall && <IncomingVideoCall />}
        {incomingVoiceCall && <IncomingVoiceCall />}


        {videoCall && <div className="h-screen w-full max-h-full overflow-hidden">
            <VideoCall />
        </div>}

        {voiceCall && <div className="h-screen w-full max-h-full overflow-hidden">
            <VoiceCall />
        </div>}
        {!videoCall && !voiceCall &&
            <div className="grid grid-cols-main h-screen w-screen max-h-screen max-w-full overflow-hidden">
                <ChatList />
                {currentChatUser ?
                    <div className={messagesSearch ? "grid grid-cols-2" : "grid-cols-2 "}>

                        <Chat />
                        {messagesSearch && <SearchMessage props={{}} />}
                    </div>
                    : <Empty />}
            </div>}
    </>
}