import { BsEmojiSmile } from "react-icons/bs";
import { FaMicrophone } from "react-icons/fa";
import { ImAttachment } from "react-icons/im";
import { MdSend } from "react-icons/md";
import { useAppContext } from "@/context/appContext";
import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { ADD_MESSAGES_ROUTE, SEND_IMAGE_ROUTE } from "@/utils/ApiRoutes";
import EmojiPicker, { EmojiClickData, Theme } from "emoji-picker-react";
import PhotoPicker from "../Common/PhotoPicker";
import CaptureAudio from "../Common/CaptureAudio";
// import dynamic from "next/dynamic";
// const CaptureAudio = dynamic(() => import("../Common/CaptureAudio"), { ssr: false });
// import { decrypt, encrypt } from "@/lib/encryptAndDecryptText";
// import encryptText from "@/lib/encryptText";
export default function MessageBar() {
    const { userInfo, currentChatUser, encryptText, socket, setMessages } = useAppContext();
    const [message, setMessage] = useState('');
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [grabPhoto, setGrabPhoto] = useState(false);
    const [showAudioRecorder, setShowAudioRecorder] = useState(false);

    const sendMessage = async () => {
        try {
            const { data } = await axios.post(ADD_MESSAGES_ROUTE, {
                to: currentChatUser?.id,
                from: userInfo?.id,
                message: encryptText(message),
            })

            socket?.emit("send-msg", {
                id: Date.now().toString(),
                senderId: userInfo?.id,
                receverId: currentChatUser?.id,
                type: "text",
                message: encryptText(message),
                messageStatus: "deliverd",
                createdAt: Date.now()
            })

            // @ts-ignore
            setMessages((prevMessages) => {
                // Ensure prevMessages is an array before spreading
                if (!prevMessages) {
                    return [{
                        id: Date.now().toString(),
                        senderId: userInfo?.id,
                        receverId: currentChatUser?.id,
                        type: "text",
                        message: encryptText(message),
                        messageStatus: "deliverd",
                        createdAt: Date.now(),
                        formSelf: true,
                    }]; // Return an array with just the new message if prevMessages is undefined
                }
                return [...prevMessages, {
                    id: Date.now().toString(),
                    senderId: userInfo?.id,
                    receverId: currentChatUser?.id,
                    type: "text",
                    message: encryptText(message),
                    messageStatus: "deliverd",
                    createdAt: Date.now(),
                    formSelf: true,
                }]; // Spread the existing messages and add the new data
            });


            // console.log(data);

            setMessage("");
            // console.log(`User send ${message} to ${currentChatUser?.name}`);
        } catch (error) {
            console.error(error)
        }
    }


    const emojiPickerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {

        const handleOutSideClick = (e: MouseEvent) => {
            const target = e.target as HTMLElement; // Type assertion to HTMLElement
            if (target.id !== "emoji-open") {
                if (emojiPickerRef.current && !emojiPickerRef.current.contains(target)) {
                    console.log("Handle OutSide Click")
                    setShowEmojiPicker(false)
                }
            }
        }

        document.addEventListener("click", handleOutSideClick);
        return () => {
            document.removeEventListener('click', handleOutSideClick)
        }
    }, [])

    const handleEmojiModel = () => {
        setShowEmojiPicker(!showEmojiPicker)
    }

    const handleEmojiClick = (emoji: EmojiClickData) => {
        setMessage(prevMessage => prevMessage += emoji.emoji);
    }


    const photoPickerChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        // console.log(e.target.files && e.target.files[0]);
        try {

            const file = e.target.files && e.target.files[0];
            if (file) {

                const fromData = new FormData();
                fromData.append("image", file);

                const response = await axios.post(SEND_IMAGE_ROUTE, fromData, {
                    headers: {
                        "Content-Type": "multipart/form-data"
                    },
                    params: {
                        from: userInfo?.id,
                        to: currentChatUser?.id
                    }
                });


                if (response.status === 200) {

                    const data = await response.data;
                    console.log(data);


                    socket?.emit("send-msg", {
                        id: Date.now().toString(),
                        senderId: userInfo?.id,
                        receverId: currentChatUser?.id,
                        type: "image",
                        message: data.data.message,
                        messageStatus: "delivered",
                        createdAt: Date.now()
                    })

                    //@ts-ignore
                    setMessages((prevMessages) => {
                        // Ensure prevMessages is an array before spreading
                        if (!prevMessages) {
                            return [{
                                id: Date.now().toString(),
                                senderId: userInfo?.id,
                                receverId: currentChatUser?.id,
                                type: "image",
                                message: data.data.message,
                                messageStatus: "delivered",
                                createdAt: Date.now(),
                                formSelf: true,
                            }]; // Return an array with just the new message if prevMessages is undefined
                        } else {

                            return [...prevMessages, {
                                id: Date.now().toString(),
                                senderId: userInfo?.id,
                                receverId: currentChatUser?.id,
                                type: "image",
                                message: data.data.message,
                                messageStatus: "delivered",
                                createdAt: Date.now(),
                                formSelf: true,
                            }]; // Spread the existing messages and add the new data
                        }
                    });
                }


            } else {
                console.error("Image is not defined")
            }
        } catch (error) {
            console.error(error)
        }
    };

    useEffect(() => {
        if (grabPhoto) {
            const data = document.getElementById('photo-picker');
            data?.click();
            document.body.onfocus = (e) => {

                setTimeout(() => {
                    setGrabPhoto(false)

                }, 1000)
            }
        }
    }, [grabPhoto]);

    return <div className="bg-panel-header-background h-20 px-4 flex items-center gap-6 relative">
        {!showAudioRecorder &&
            <>
                <div className="flex gap-6">
                    <BsEmojiSmile className="text-panel-header-icon cursor-pointer text-xl" title="Emoji" id="emoji-open" onClick={handleEmojiModel} />
                    {showEmojiPicker && <div className="absolute bottom-24 left-16 z-40 " ref={emojiPickerRef}>
                        <EmojiPicker onEmojiClick={handleEmojiClick} theme={Theme.DARK} /></div>}
                    <ImAttachment className="text-panel-header-icon cursor-pointer text-xl" title="Attach File" onClick={() => setGrabPhoto(true)} />
                </div>
                <div className="w-full rounded-lg h-10 flex items-center">
                    <input type="text" placeholder="Type a message" className="bg-input-background text-sm focus:outline-none text-white h-10 rounded-lg pl-5 px-5 py-4 w-full" onChange={(e: React.ChangeEvent<HTMLInputElement>) => setMessage(e.target.value)} value={message} />
                </div>
                <div className="flex w-10 items-center justify-center">

                    <button>
                        {message.length ?
                            <MdSend className="text-panel-header-icon cursor-pointer text-xl" title="Send" onClick={sendMessage} /> :

                            <FaMicrophone className="text-panel-header-icon cursor-pointer text-xl" title="Mic" onClick={() => setShowAudioRecorder(true)} />
                        }
                    </button>
                </div>
            </>
        }
        {grabPhoto && <PhotoPicker props={{ onChange: photoPickerChange }} />}
        {showAudioRecorder && <CaptureAudio props={{ hideAudioRecorder: setShowAudioRecorder }} />}
    </div>
}