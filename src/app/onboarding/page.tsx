'use client'
import Image from "next/image";
import { useAppContext } from "@/context/appContext";
import Input from "@/components/Common/Input";
import { useEffect, useState } from "react";
import Avatar from "@/components/Common/Avatar";
import axios from "axios";
import { ONBOARD_USER_ROUTE } from "@/utils/ApiRoutes";
import { useRouter } from "next/navigation";
export default function OnboardingPage() {
    const router = useRouter();

    const { userInfo, setUserInfo, newUser, setNewUser } = useAppContext();
    const [name, setName] = useState(userInfo?.displayName || '');
    const [about, setAbout] = useState("");
    const [image, setImage] = useState("/default_avatar.png");

    useEffect(()=>{

        if(!newUser && !userInfo?.email) router.push('/login')
            else if(!newUser && userInfo?.email) router.push('/')

    },[newUser, userInfo, router])

    const onBoardUserHandler = async () => {
        if (validateDetails()) {
            const email = userInfo?.email;
            try {
                const { data } = await axios.post(ONBOARD_USER_ROUTE, {
                    name, email, about, image
                });
                if (data.status) {
                    setNewUser(false);
                    setUserInfo({
                        displayName: String(name),
                        email: String(email),
                        photoURL: image
                    });
                    router.push("/");
                }
            } catch (error) {
                console.error(error);
            }
        }
    }

    const validateDetails = () => {
        if (name.length < 3) {
            return false
        }
        return true;
    }
    return <div className="bg-panel-header-background h-screen w-screen text-white flex flex-col items-center justify-center">
        <div className="flex items-center justify-center gap-2">
            <Image src="/whatsapp.gif" width={200} height={200} alt="" priority />
            <span className="text-white text-7xl">Whatsapp</span>
        </div>
        <h2 className="text-7xl">Create your profile</h2>
        <div className="flex gap-6 mt-6">
            <div className="flex flex-col items-center justify-center mt-5 gap-6">
                {/* <Input name="Display Name" state={name} setState={setName} label={true} /> */}
                <Input props={{ name: "Display Name", state: name, setState: setName, label: true }} />
                {/* <Input name="About" state={about} setState={setAbout} label={true} /> */}
                <Input props={{ name: "About", state: about, setState: setAbout, label: true }} />

                <div className="flex items-center justify-center">

                    <button className="flex items-center justify-center gap-7 bg-search-input-container-background p-5 rounded-lg" onClick={onBoardUserHandler}>Create Profile</button>
                </div>
            </div>
            <div>

                <Avatar props={{ image, type: "xl", setImage }} />
            </div>
        </div>
    </div>
}