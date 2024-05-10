import React, { MouseEvent, useEffect } from 'react'; // Import MouseEvent type
import Image from "next/image"
import { useState } from "react";
import { FaCamera } from "react-icons/fa";
import ContextMenu from './ContextMenu';
import PhotoPicker from './PhotoPicker';
import PhotoLibrary from './PhotoLibrary';
import CapturePhoto from './CapturePhoto';


interface PropsInterface {
    props: {
        type: string,
        image: string,
        setImage: (value: string) => void
    }
}
export default function Avatar({ props: { type, image, setImage } }: PropsInterface) {

    const [hover, setHover] = useState(false);
    const [isContextMenuVisible, setIsContextMenuVisible] = useState(false);
    const [contextMenuCordinate, setContextMenuCordinates] = useState({ x: 0, y: 0 });

    const [grabPhoto, setGrabPhoto] = useState(false);
    const [showPhotoLibrary, setShowPhotoLibrary] = useState(false);
    const [showCapturePhoto, setShowCapturePhoto] = useState(false);

    const showContextMenu = (e: MouseEvent<HTMLElement>) => {
        setIsContextMenuVisible(true);
        setContextMenuCordinates({ x: e.pageX, y: e.pageY })
    }

    const contextMenuOption = [
        {
            name: "Take photo", callback: () => {
                console.log("Take photo");
                setShowCapturePhoto(true);
            }
        },
        { name: "Choose from library", callback: () => { console.log("Choose photo"); setShowPhotoLibrary(true) } },
        { name: "Upload photo", callback: () => { console.log("Upload photo"); setGrabPhoto(true) } },
        { name: "Remove photo", callback: () => { console.log("Remove photo"); setImage("/default_avatar.png") } }
    ];


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

    // const photoPickerChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    //     // alert("Hi");
    //     const file = e.target.files[0];
    //     console.log({file})

    //     const reader = new FileReader();
    //     const data = document.createElement("img");
    //     reader.onload = function (event) {
    //         data.src = event.target?.result;
    //         data.setAttribute("data-src", event.target.result);
    //         reader.readAsDataURL(file);
    //         setTimeout(() => {
    //             console.log("DATA", data.src);
    //             setImage(data.src)
    //         }, 100)
    //     }
    // }


    const photoPickerChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        // @ts-ignore
        const file = e.target.files[0];

        if (!file) {
            return; // Handle no file selected case (optional)
        }

        const reader = new FileReader();
        reader.onload = (event) => {
            if (event.target?.result) {
                // @ts-ignore
                setImage(event.target.result); // Update image src state
            }
        };
        reader.readAsDataURL(file);
    };


    return <>
        <div className="flex items-center justify-center">
            {
                type === "sm" &&
                <div className="relative w-10 h-10">
                    <Image src={image} alt="avatar" className="rounded-full" fill />
                </div>
            }
            {
                type === "lg" &&
                <div className="relative w-14 h-14">
                    <Image src={image} alt="avatar" className="rounded-full" fill sizes="center" />
                </div>
            }
            {
                type === "xl" &&
                <div className="relative cursor-pointer z-0">

                    <div className="flex items-center justify-center w-60 h-60 " onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>

                        <div className={`bg-photopicker-overlay-background w-60 h-60 absolute top-0 left-0 flex items-center justify-center rounded-full flex-col text-center gap-2 z-10 ${hover ? "visible" : "hidden"}`} onClick={showContextMenu} id="context-opener">
                            <FaCamera className="text-2xl" id="context-opener" />
                            <span id="context-opener">Change<br /> profile <br /> photo</span>
                        </div>
                        <Image src={image} alt="avatar" className="rounded-full" fill sizes="center" />
                    </div>
                </div>
            }
        </div>
        {isContextMenuVisible && <ContextMenu props={{ options: contextMenuOption, cordinates: contextMenuCordinate, contextMenu: isContextMenuVisible, setContextMenu: setIsContextMenuVisible }} />}


        {showCapturePhoto && <CapturePhoto props={{ setImage, hideCapturePhoto: setShowCapturePhoto }} />}

        {showPhotoLibrary && <PhotoLibrary props={{ setImage, hidePhotoLibrary: setShowPhotoLibrary }} />}
        {grabPhoto && <PhotoPicker props={{ onChange: photoPickerChange }} />}
    </>
}

