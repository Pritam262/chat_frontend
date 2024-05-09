"use client"

import { CHECK_USER_ROUTE } from "@/utils/ApiRoutes"
import { firebaseAuth } from "@/utils/FirebaseConfig"
import axios from "axios"
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth"
import Image from "next/image"
import { useState } from "react"
import { FcGoogle } from "react-icons/fc"
import { useRouter } from "next/navigation";
import { useAppContext } from "@/context/appContext";

export default function LoginPage() {
    const router = useRouter();
    const { setUserInfo } = useAppContext();

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const handleLogin = async () => {

        // const provider = new GoogleAuthProvider();
        // const { user } = await signInWithPopup(firebaseAuth, provider);
        // console.log(user);

        const provider = new GoogleAuthProvider();
        const { user: { displayName: name, email, photoURL: profileImage } } = await signInWithPopup(firebaseAuth, provider);
        // const user = result.user;
        // Handle successful login (e.g., redirect to protected route)
        try {

            

            if (email) {
                const { data } = await axios.post(CHECK_USER_ROUTE, { email });

                console.log({ data });

                //Import security positio

                if (!data.status) {
                    setUserInfo({
                        displayName: String(name),
                        email:String(email),
                        photoURL: String(profileImage)
                    })
                    router.push('/onboarding');
                }

            }
        } catch (error) {
            console.error(error)
        }

    }
    return <div className="w-screen h-screen flex flex-col  items-center justify-center bg-panel-header-background gap-6">

        <div className="flex items-center justify-center gap-2 text-white">
            <Image src="/whatsapp.gif" width={300} height={300} alt="" priority />
            <span className="text-7xl">Whatsapp</span>
        </div>
        <button className="flex items-center justify-center gap-7 bg-search-input-container-background p-5 rounded-lg" onClick={handleLogin}>
            <FcGoogle className="text-4xl" />
            <span className="text-white text-2xl">Login with Google</span>
        </button>
    </div>

}