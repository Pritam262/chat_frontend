import { useEffect, useRef } from "react";
import { IoClose } from "react-icons/io5";


interface PropsInterface {
    props: {
        setImage: (value: string) => void;
        hideCapturePhoto: (value: boolean) => void;
    }
}



export default function CapturePhoto({ props: { setImage, hideCapturePhoto } }: PropsInterface) {


    const videoRef = useRef(null);


    const capturePhoto = () => {
        const canvas = document.createElement('canvas');
        const videoElement = videoRef.current;
        if (videoElement) {
            canvas.getContext("2d")?.drawImage(videoElement, 0, 0, 300, 150);
            setImage(canvas.toDataURL("image/jpeg"));
            hideCapturePhoto(false);
        }

    }

    // useEffect(() => {
    //     let stream: MediaStream;
    //     const startCamera = async () => {
    //         stream = await navigator.mediaDevices.getUserMedia({
    //             video: true,
    //             audio: false,
    //         });

    //         videoRef.current.srcObject = stream;
    //         return () => {
    //             stream?.getTracks().forEach((track) => track.stop())
    //         }
    //     }
    //     startCamera();
    // }, [])


    useEffect(() => {
        let stream: MediaStream | undefined;

        const startCamera = async () => {
            try {
                if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
                    stream = await navigator.mediaDevices.getUserMedia({
                        video: true,
                        audio: false,
                    });

                    // @ts-ignore
                    videoRef.current.srcObject = stream;
                } else {
                    alert("camera is not supported in this browser")
                    // Provide fallback mechanism or inform users about browser compatibility
                }
            } catch (error) {
                console.error('Error accessing media devices:', error);
                // Handle errors
            }
        };

        startCamera();

        return () => {
            if (stream) {
                stream.getTracks().forEach((track) => track.stop());
            }
        };
    }, []);


    return <div className="absolute h-4/6 w-2/6 top-1/4 left-1/3 bg-gray-900 gap-3 rounded-lg pt-2 flex items-center justify-center">
        <div className="flex flex-col gap-4 w-full items-center justify-center">
            <div className="pt-2 pr-2 cursor-pointer flex items-end justify-end" onClick={() => { hideCapturePhoto(false); console.log("Hide photo library") }}>
                <IoClose className="h-10 w-10 cursor-pointer" />
            </div>

            <div className="flex justify-center">
                <video src="" id="video" width={400} autoPlay ref={videoRef}></video>
            </div>
            <button className="h-16 w-16 bg-white rounded-full cursor-pointer border-8 border-teal-light p-2" onClick={capturePhoto}></button>
        </div>
    </div>
}