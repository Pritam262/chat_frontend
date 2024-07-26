import { IncomingVideoCall, IncomingVoiceCall, VideoCall, VoiceCall } from "@/utils/types"
import { useCallback, useEffect, useRef, useState } from "react"
import { useAppContext } from "@/context/appContext";
import Image from "next/image";
import { MdOutlineCallEnd } from "react-icons/md";
import axios from "axios";
import { GET_GENERATE_TOKEN } from "@/utils/ApiRoutes";
import { ZegoExpressEngine } from "zego-express-engine-webrtc";
import PeerService from "../../service/peer"
interface PropsInterface {
    props: {
        data?: VideoCall | VoiceCall
    }
}
export default function Container({ props: { data } }: PropsInterface) {
    const { endCall, socket, userInfo, isCallEnd, setIsCallEnd } = useAppContext();
    const [callAccepted, setCallAccepted] = useState(false);
    const [token, setToken] = useState<string | undefined>();

    const [zgVar, setZgVar] = useState<ZegoExpressEngine | undefined>();
    const [localStream, setLocalStream] = useState<MediaStream | undefined>();
    const [remoteStream, setRemoteStream] = useState<MediaStream | undefined>();
    const [isCancelCall, setIsCancelCall] = useState<boolean>(false)
    const videoRef = useRef(null);
    const [peerCallAccepted, setPeerCallAccepted] = useState(false);


    const handlePeerCall = async () => {
        try {
            if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {

                const stream = await navigator.mediaDevices.getUserMedia({
                    audio: true,
                    video: data?.callType === "video" ? true : false,
                });

                setLocalStream(stream);
                // console.log(stream);
                const localData = document.getElementById('local-video');
                // console.log("LOCAL DATA", localData)
                // const ans = await PeerService.getAnswer(data?.offer);
                if (localData && stream) {
                    const localElement = document.createElement(data?.callType === "video" ? "video" : "audio");
                    console.log("CREATE ELEMENT", localElement)
                    localElement.srcObject = stream;
                    localElement.id = Date.now().toString();
                    localElement.autoplay = true;
                    // vd.playsInline = true;
                    localElement.muted = false;
                    localData.appendChild(localElement);
                    // videoRef.current.srcObject = stream;
                }
                const offer = await PeerService?.getOffer();

                socket?.emit("peer:call", { to: data?.currentChatUser?.id, from: userInfo?.id, offer })
            } else {
                alert("media device is not supported in this browser")
                // Provide fallback mechanism or inform users about browser compatibility
            }
        } catch (error) {

            const stream = await navigator.mediaDevices.getDisplayMedia({
                audio: true,
                video: data?.callType === "video" ? true : false,
            });

            // const offer = await PeerService.getOffer();

            // socket?.emit("user:call", { from: userInfo?.id, to: data?.currentChatUser?.id, offer })

            setLocalStream(stream);

            const localData = document.getElementById('local-video');
            // console.log("LOCAL DATA", localData)
            if (localData && stream) {

                const localElement = document.createElement(data?.callType === "video" ? "video" : "audio");
                console.log("CREATE ELEMENT", localElement)
                localElement.srcObject = stream;
                localElement.id = Date.now().toString();
                localElement.autoplay = true;
                // vd.playsInline = true;
                localElement.muted = false;
                localData.appendChild(localElement);
                // videoRef.current.srcObject = stream;
            }

            const offer = await PeerService?.getOffer();

            socket?.emit("peer:call", { to: data?.currentChatUser?.id, from: userInfo?.id, offer })

            console.error('Error accessing media devices:', error);
            console.log(error)
            // Handle errors
        }
    }
    useEffect(() => {

        console.log(data?.type)
        if (data?.type === "out-going") {
            socket?.on("accept-call", (ans) => {
                // Call peer user

                handlePeerCall();
                setCallAccepted(true);
                setIsCallEnd(false)
            });
        }
        else {
            setTimeout(() => {
                setCallAccepted(true);
            }, 1000)
        }
    }, [data]);


    // Handle Peer incoming call

    const handleIncomingCall = async (data: any) => {
        try {
            if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {

                const stream = await navigator.mediaDevices.getUserMedia({
                    audio: true,
                    video: data?.callType === "video" ? true : false,
                });

                setLocalStream(stream);
                // console.log(stream);
                const localData = document.getElementById('local-video');
                // console.log("LOCAL DATA", localData)
                // const ans = await PeerService.getAnswer(data?.offer);
                if (localData && stream) {
                    const localElement = document.createElement(data?.callType === "video" ? "video" : "audio");
                    console.log("CREATE ELEMENT", localElement)
                    localElement.srcObject = stream;
                    localElement.id = Date.now().toString();
                    localElement.autoplay = true;
                    // vd.playsInline = true;
                    localElement.muted = false;
                    localData.appendChild(localElement);
                    // videoRef.current.srcObject = stream;
                }
                const ans = await PeerService?.getAnswer(data?.offer);

                console.log("PEER CALL ACCEPTED");

                socket?.emit("peer:call:accepted", { to: data?.currentChatUser?.id, from: userInfo?.id, ans })
            } else {
                alert("media device is not supported in this browser")
                // Provide fallback mechanism or inform users about browser compatibility
            }
        } catch (error) {

            const stream = await navigator.mediaDevices.getDisplayMedia({
                audio: true,
                video: data?.callType === "video" ? true : false,
            });

            // const offer = await PeerService.getOffer();

            // socket?.emit("user:call", { from: userInfo?.id, to: data?.currentChatUser?.id, offer })

            setLocalStream(stream);

            const localData = document.getElementById('local-video');
            // console.log("LOCAL DATA", localData)
            if (localData && stream) {

                const localElement = document.createElement(data?.callType === "video" ? "video" : "audio");
                console.log("CREATE ELEMENT", localElement)
                localElement.srcObject = stream;
                localElement.id = Date.now().toString();
                localElement.autoplay = true;
                // vd.playsInline = true;
                localElement.muted = false;
                localData.appendChild(localElement);
                // videoRef.current.srcObject = stream;
            }

            const offer = await PeerService?.getOffer();

            socket?.emit("peer:call", { to: data?.currentChatUser?.id, from: userInfo?.id, offer })

            console.error('Error accessing media devices:', error);
            console.log(error)
            // Handle errors
        }
    }

    socket?.on("peer:incoming:call", (data) => handleIncomingCall(data));
    socket?.on("", () => { })

    useEffect(() => {
        const getToken = async () => {
            try {
                const response = await axios.get(`${GET_GENERATE_TOKEN}${userInfo?.id}`);

                if (response.status === 200) {
                    // Request was successful
                    const { data: { token: returnToken } } = response;
                    // console.log("Token:", returnToken);
                    setToken(returnToken);

                    // Call peer after call accepted




                } else {
                    // Request failed
                    console.error("API request failed with status:", response.status);

                    if (data?.callType === "voice") {

                        socket?.emit("reject-voice-call", {
                            from: data?.currentChatUser?.id
                        });

                    } else {

                        // if (zgVar && localStream && publishStream) {
                        //     zgVar.destroyStream(localStream);
                        //     zgVar?.stopPublishingStream(publishStream);
                        //     zgVar?.logoutRoom(data?.roomId.toString())
                        // }


                        socket?.emit("reject-video-call", {
                            from: { id: data?.currentChatUser?.id }
                        })
                    };

                    endCall();
                }
            } catch (error) {
                console.error(error)
            }
        };
        getToken();
    }, [callAccepted])


    useEffect(() => {

        //        { 
        //         // const startCall = () => {
        //         //     import("zego-express-engine-webrtc").then(async ({ ZegoExpressEngine }) => {
        //         //         const zg = new ZegoExpressEngine(1521185691, "efce669f459de46a802600a0a29240dd");


        //         //         // console.log("ZG LOG", zg);
        //         //         setZgVar(zg);

        //         //         zg.on("roomStreamUpdate", async (roomId, updateType, streamList, extendedData) => {
        //         //             console.log("ZG RECEIVE ROOMID", roomId);
        //         //             console.log("ZG RECEIVE EXTENDED DATA", extendedData);
        //         //             console.log("ZG RECEIVE UPDATETYPE", updateType);

        //         //             if (updateType === "ADD") {
        //         //                 const rmVideo = document.getElementById("remote-video");
        //         //                 const vd = document.createElement(data?.callType === "video" ? "video" : "audio");
        //         //                 vd.id = streamList[0].streamID;
        //         //                 vd.autoplay = true;
        //         //                 // vd.playsInline = true;
        //         //                 vd.muted = false;
        //         //                 if (rmVideo) {
        //         //                     // rmVideo.appendChild(vd)
        //         //                     console.error("VD", vd);
        //         //                 }
        //         //                 zg.startPlayingStream(streamList[0].streamID, { audio: true, video: true }).then((stream) => vd.srcObject = stream);

        //         //             } else if (updateType === "DELETE" && zg && localStream && streamList[0].streamID) {
        //         //                 zg.destroyStream(localStream);
        //         //                 zg.stopPublishingStream(streamList[0].streamID);
        //         //                 zg.logoutRoom(data?.roomId.toString());
        //         //                 endCall();
        //         //             }
        //         //         });

        //         //     data && token && userInfo && userInfo?.id && await zg.loginRoom(data?.roomId.toString(), token, { userID: userInfo?.id, userName: userInfo?.displayName }, { userUpdate: true });

        //         //     const localStream = await zg.createStream({
        //         //         camera: {
        //         //             audio: true,
        //         //             video: data?.callType === "video" ? true : false,
        //         //         }
        //         //     });

        //         //     const localVideo = document.getElementById("local-video");
        //         //     const remoteVideo = document.getElementById("remote-video");
        //         //     const videoElement = document.createElement(data?.callType === "video" ? "video" : "audio");

        //         //     videoElement.id = "video-local-zego";
        //         //     videoElement.className = "h-20 w-32";
        //         //     videoElement.autoplay = true;
        //         //     videoElement.muted = false;
        //         //     // videoElement.playsInline = true;
        //         //     remoteVideo?.appendChild(videoElement);

        //         //     console.log("VIDEO ELEMENT", videoElement);

        //         //     const td = document.getElementById("video-local-zego") as HTMLVideoElement | HTMLAudioElement;


        //         //     // td?.srcObject = localStream ;
        //         //     if (td && localStream) {
        //         //         td.srcObject = localStream;
        //         //     }
        //         //     const streamId = "123" + Date.now();
        //         //     setPublishStream(streamId);
        //         //     setLocalStream(localStream);
        //         //     zg?.startPublishingStream(streamId, localStream);

        //         // })

        //         // }
        // }



        // if (callAccepted != true && isCancelCall != true) {
        //     // Create and play the audio element
        //     const callAudio = document.createElement("audio");
        //     callAudio.src = "/call-sound.mp3";
        //     callAudio.id = "call-audio";
        //     callAudio.loop = true;
        //     callAudio.autoplay = true;
        //     // Add the audio element to the DOM (optional, depending on your structure)
        //     // document.body.appendChild(callAudio);
        // } else {
        //     // Stop any existing audio element
        //     const existingAudio = document.getElementById("call-audio") as HTMLAudioElement; // Assuming you kept the unique ID
        //     console.log(existingAudio);
        //     if (existingAudio) {
        //         existingAudio.pause(); // Pauses playback
        //         existingAudio.remove(); // Removes the element from the DOM (optional)
        //     }
        // }



        const startCall = async () => {

            try {
                if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {

                    const stream = await navigator.mediaDevices.getUserMedia({
                        audio: true,
                        video: data?.callType === "video" ? true : false,
                    });

                    setLocalStream(stream);
                    // console.log(stream);
                    const localData = document.getElementById('local-video');
                    // console.log("LOCAL DATA", localData)
                    // const ans = await PeerService.getAnswer(data?.offer);
                    if (localData && stream) {
                        const localElement = document.createElement(data?.callType === "video" ? "video" : "audio");
                        console.log("CREATE ELEMENT", localElement)
                        localElement.srcObject = stream;
                        localElement.id = Date.now().toString();
                        localElement.autoplay = true;
                        // vd.playsInline = true;
                        localElement.muted = false;
                        localData.appendChild(localElement);
                        // videoRef.current.srcObject = stream;
                    }
                } else {
                    alert("media device is not supported in this browser")
                    // Provide fallback mechanism or inform users about browser compatibility
                }
            } catch (error) {

                const stream = await navigator.mediaDevices.getDisplayMedia({
                    audio: true,
                    video: data?.callType === "video" ? true : false,
                });

                // const offer = await PeerService.getOffer();

                // socket?.emit("user:call", { from: userInfo?.id, to: data?.currentChatUser?.id, offer })

                setLocalStream(stream);

                const localData = document.getElementById('local-video');
                // console.log("LOCAL DATA", localData)
                if (localData && stream) {

                    const localElement = document.createElement(data?.callType === "video" ? "video" : "audio");
                    console.log("CREATE ELEMENT", localElement)
                    localElement.srcObject = stream;
                    localElement.id = Date.now().toString();
                    localElement.autoplay = true;
                    // vd.playsInline = true;
                    localElement.muted = false;
                    localData.appendChild(localElement);
                    // videoRef.current.srcObject = stream;
                }


                console.error('Error accessing media devices:', error);
                console.log(error)
                // Handle errors
            }



        }
        if (token) {
            // console.log("GET TOKEN", token);
            // console.log(data);
            // startCall();
        }
    }, [token])




    const cancelCall = () => {
        // socket?.emit("cancel-outgoing-call", {
        //     to: data?.currentChatUser?.id,
        //     from: {
        //         id: userInfo?.id,
        //         profilePicture: userInfo?.photoURL,
        //         name: userInfo?.displayName,
        //     },
        //     callType: data?.callType,
        //     roomId: data?.roomId,
        // })
        // console.log("END CALL")
        // if (zgVar && localStream && publishStream) {
        //     console.log("LOCALSTREAM", localStream);

        //     zgVar.destroyStream(localStream);
        //     zgVar?.stopPublishingStream(publishStream);
        //     zgVar?.logoutRoom(data?.roomId.toString())
        // }

        if (data?.callType === "voice") {

            socket?.emit("reject-voice-call", {
                from: data?.currentChatUser?.id
            });

        } else {

            // if (zgVar && localStream && publishStream) {
            //     zgVar.destroyStream(localStream);
            //     zgVar?.stopPublishingStream(publishStream);
            //     zgVar?.logoutRoom(data?.roomId.toString())
            // }


            socket?.emit("reject-video-call", {
                from: { id: data?.currentChatUser?.id }
            })
        };

        endCall();
        setIsCancelCall(true);
        setCallAccepted(false)
    }

    const handleCallEnd = () => {
        // console.log("END CALL")
        // if (zgVar && localStream && publishStream) {
        // console.log("ONCALL END", zgVar, localStream, publishStream);

        // localStream && zgVar?.destroyStream(localStream);
        // zgVar?.stopPublishingStream(publishStream);
        // zgVar?.logoutRoom(data?.roomId.toString());
        // zgVar?.destroyEngine();
        // zgVar?.logoutRoom(data?.roomId.toString())
        // }
        endCall();
        setIsCancelCall(true);
        setCallAccepted(false);

        if (data?.callType === "voice") {

            socket?.emit("reject-voice-call", {
                from: data?.currentChatUser?.id
            });

        } else {
            socket?.emit("reject-video-call", {
                from: { id: data?.currentChatUser?.id }
            })
        };


    }


    return <div className="border-conversation-border border w-full bg-conversation-panel-background flex flex-col h-screen items-center justify-center text-white ">
        <div className="flex flex-col gap-3 items-center ">
            <span className="text-5xl">{data?.currentChatUser?.name}</span>
            <span className="text-lg">
                {callAccepted && data?.callType !== "video" ? "On going call" : "Calling"}
            </span>
        </div>

        {data?.currentChatUser && (!callAccepted || data?.callType === "audio") && <div className="my-24 ">

            <Image src={data?.currentChatUser?.profilePicture} width={300} height={300} alt="avatar" priority className="rounded-full" />
        </div>}


        {/* <div className="my-5 relative border w-[500px] h-[350px]" id="remote-video">
            <div className="absolute bottom-5 right-5 border w-[250px] h-[150px]" id="local-audio"></div>
        </div> */}

        {callAccepted && <>     <div>Local Video <div className="my-5 border sm:w-[250px] sm:h-[150px] md:w-[350px] md:h-[250px] flex items-center justify-center" id="local-video">{data?.callType === "voice" && userInfo && <Image src={userInfo?.photoURL} width={50} height={50} alt="User photo" />}</div></div>

            <div>Remote Stream
                <div className="my-5 border sm:w-[250px] sm:h-[150px] md:w-[350px] md:h-[250px] flex items-center justify-center" id="remote-video">{data?.callType === "voice" && <Image src={data?.currentChatUser?.profilePicture} width={50} height={50} alt="User photo" />}</div></div> </>}
        {callAccepted === false ? <div className="h-16 w-16 bg-red-600 flex items-center justify-center rounded-full cursor-pointer" onClick={cancelCall}>
            <MdOutlineCallEnd className="text-3xl" />
        </div> :
            <div className="h-16 w-16 bg-red-400 flex items-center justify-center rounded-full cursor-pointer" onClick={handleCallEnd}>
                <MdOutlineCallEnd className="text-3xl" />
            </div>}

    </div>
}