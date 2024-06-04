"use client"

import { useAppContext } from "@/context/appContext";
import { firebaseAuth } from "@/utils/FirebaseConfig";
import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
export default function Logout() {

    const router = useRouter();
    const { socket, userInfo, setUserInfo } = useAppContext();

    useEffect(() => {
        socket?.emit("signout", userInfo?.id)
        setUserInfo(undefined);
        signOut(firebaseAuth);
        router.push("/login")
    }, [socket])
    return <div className="bg-conversation-panel-background">

    </div>
}