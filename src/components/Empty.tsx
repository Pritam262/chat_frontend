import Image from "next/image";

export default function Empty() {
    return <div className="w-full h-full flex flex-col items-center justify-center border border-conversation-border  bg-panel-header-background border-b-4 border-b-icon-green">
        <Image src="/whatsapp.gif" alt="" width={300} height={300} priority />
        <span className="text-xl">Whatsapp</span>
    </div>
}