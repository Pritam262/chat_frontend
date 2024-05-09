'use client'
import Image from "next/image";
import { useAppContext } from "@/context/appContext";
import Input from "@/components/Common/Input";
import { useState } from "react";
import Avatar from "@/components/Common/Avatar";

export default function OnboardingPage() {
    const { userInfo } = useAppContext();
    const [name, setName] = useState(userInfo?.displayName || '');
    const [about, setAbout] = useState("");
    const [image, setImage] = useState("/default_avatar.png");



    return <div className="bg-panel-header-background h-screen w-screen text-white flex flex-col items-center justify-center">
        <div className="flex items-center justify-center gap-2">
            <Image src="/whatsapp.gif" width={200} height={200} alt="" priority />
            <span className="text-white text-7xl">Whatsapp</span>
        </div>
        <h2 className="text-7xl">Create your profile</h2>
        <div className="flex gap-6 mt-6">
            <div className="flex flex-col items-center justify-center mt-5 gap-6">
                {/* <Input name="Display Name" state={name} setState={setName} label={true} /> */}
                <Input props={{name:"Display Name", state:name, setState:setName, label:true}}/>
                {/* <Input name="About" state={about} setState={setAbout} label={true} /> */}
                <Input props={{name:"About", state:about, setState:setAbout, label:true}}/>
            </div>
            <div>

            <Avatar  props={{image, type:"xl", setImage}}/>
            </div>
        </div>
            <button onClick={()=> console.log(name, about)}>Click</button>
    </div>
}