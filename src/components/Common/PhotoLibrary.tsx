
import { IoClose } from "react-icons/io5";
import Image from "next/image";
interface PropsInterface {
    props: {
        setImage: (value: string) => void;
        hidePhotoLibrary: (value: boolean) => void;
    }
}
export default function PhotoLibrary({ props: { setImage, hidePhotoLibrary } }: PropsInterface) {

    const images = [
        "/avatars/1.png",
        "/avatars/2.png",
        "/avatars/3.png",
        "/avatars/4.png",
        "/avatars/5.png",
        "/avatars/6.png",
        "/avatars/7.png",
        "/avatars/8.png",
        "/avatars/9.png"
    ];

    const handleClick = (e: React.MouseEvent<HTMLImageElement>) => {
        const id = Number((e.currentTarget as HTMLImageElement).id);
        setImage(images[id]);
        hidePhotoLibrary(false);
    }
    return <div className="fixed top-0 left-0 max-h-screen max-w-screen h-full w-full flex justify-center items-center">

        <div className="h-max w-max bg-gray-900 gap-6 rounded-lg p-4 ">
            <div className="pt-2 pe-2 cursor-pointer flex items-end justify-end" onClick={() => { hidePhotoLibrary(false); console.log("Hide photo library") }}>
                <IoClose className="h-10 w-10 cursor-pointer" />
            </div>
            <div className="grid grid-cols-3 justify-center items-center gap-16 p-20 w-full">
                {images.map((image, index) => (
                    <Image key={index} id={String(index)} src={image} width={100} height={100} alt="" priority className="rounded-full" onClick={() => { setImage(images[index]); hidePhotoLibrary(false) }} />))}

            </div>
        </div>
    </div>
}